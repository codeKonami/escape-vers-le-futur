import { describe, expect, it } from 'vitest'
import { melody } from '../../src/config'
import { hearNote, newMelody, resetMelody } from '../../src/game/melody'
import { NoteDetector, type Frame } from '../../src/game/noteDetector'
import { frenchNoteName, frequencyToMidi, gauge, noteToMidi, semitoneOffset } from '../../src/game/pitch'

const expected = melody.events.map((event) => noteToMidi(event.note))
const hz = (midi: number) => 440 * 2 ** ((midi - 69) / 12)

describe('notes et fréquences', () => {
  it('convertit les noms de notes', () => {
    expect(noteToMidi('A4')).toBe(69)
    expect(noteToMidi('C4')).toBe(60)
    expect(noteToMidi('Bb4')).toBe(70)
    expect(noteToMidi('F#3')).toBe(54)
    expect(frenchNoteName('Bb4')).toBe('Si bémol')
    expect(frenchNoteName('G4')).toBe('Sol')
  })

  it('convertit une fréquence en note', () => {
    expect(frequencyToMidi(440)).toBeCloseTo(69)
    expect(frequencyToMidi(261.63)).toBeCloseTo(60, 1)
    expect(Math.round(frequencyToMidi(hz(70)))).toBe(70)
  })

  it('calcule l’écart en demi-tons, octave ignorée ou non', () => {
    expect(semitoneOffset(70.3, 70, false)).toBe(0)
    expect(semitoneOffset(71, 70, false)).toBe(1) // un si n'est pas un si bémol
    expect(semitoneOffset(55, 67, false)).toBe(0) // sol à l'octave du dessous
    expect(semitoneOffset(55, 67, true)).toBe(-12)
    expect(semitoneOffset(64, 67, false)).toBe(-3)
  })

  it('remplit la jauge selon la proximité', () => {
    expect(gauge(0)).toMatchObject({ tone: 'green', label: 'Bravo' })
    expect(gauge(1)).toMatchObject({ tone: 'orange', label: 'Presque' })
    expect(gauge(-2)).toMatchObject({ tone: 'orange', label: 'Presque' })
    expect(gauge(-3)).toMatchObject({ tone: 'red', label: 'Trop bas' })
    expect(gauge(4)).toMatchObject({ tone: 'red', label: 'Trop haut' })
    expect(gauge(0).level).toBeGreaterThan(gauge(1).level)
    expect(gauge(1).level).toBeGreaterThan(gauge(3).level)
  })
})

describe('mélodie', () => {
  const play = (notes: number[]) => notes.reduce((state, note) => hearNote(state, note, expected, melody.octaveMatters), newMelody(expected.length))

  it('valide la mélodie complète', () => {
    const state = play(expected)
    expect(state.done).toBe(true)
    expect(state.marks.every((mark) => mark?.tone === 'green')).toBe(true)
  })

  it('laisse tâtonner sur la première note', () => {
    const state = play([expected[0] - 4, expected[0] + 1, expected[0]])
    expect(state.current).toBe(1)
    expect(state.failed).toBe(false)
  })

  it('recommence depuis le début après une fausse note', () => {
    const state = play([expected[0], expected[1] + 1])
    expect(state.failed).toBe(true)
    expect(state.marks[1]?.tone).toBe('orange')
    expect(hearNote(state, expected[1], expected, false)).toBe(state) // ignoré pendant la remise à zéro
    const reset = resetMelody(state)
    expect(reset.current).toBe(0)
    expect(reset.marks.every((mark) => mark === null)).toBe(true)
    expect(reset.failed).toBe(true)
  })
})

describe('détection des notes au micro', () => {
  function listen(frames: Frame[]) {
    const notes: number[] = []
    const detector = new NoteDetector((midi) => notes.push(Math.round(midi)))
    frames.forEach((frame) => detector.push(frame))
    return notes
  }
  // Une note tenue pendant `ms` à partir de `start`, une mesure toutes les 20 ms.
  const hold = (midi: number, start: number, ms: number, rms = 0.2): Frame[] =>
    Array.from({ length: ms / 20 }, (_, i) => ({ time: start + i * 20, rms: rms * (1 - i * 0.01), frequency: hz(midi), clarity: 0.97 }))
  const silence = (start: number, ms: number): Frame[] =>
    Array.from({ length: ms / 20 }, (_, i) => ({ time: start + i * 20, rms: 0.001, frequency: 0, clarity: 0 }))

  it('valide une note stable pendant 100 ms', () => {
    expect(listen(hold(67, 0, 200))).toEqual([67])
    expect(listen(hold(67, 0, 60))).toEqual([])
  })

  it('ne compte pas deux fois une note tenue', () => {
    expect(listen(hold(67, 0, 1000))).toEqual([67])
  })

  it('accepte deux fois la même note après une nouvelle frappe', () => {
    const decayed = hold(67, 0, 400, 0.05)
    expect(listen([...decayed, ...hold(67, 400, 300, 0.3)])).toEqual([67, 67])
  })

  it('enchaîne des notes différentes et ignore le silence', () => {
    expect(listen([...hold(67, 0, 300), ...silence(300, 200), ...hold(71, 500, 300)])).toEqual([67, 71])
  })
})
