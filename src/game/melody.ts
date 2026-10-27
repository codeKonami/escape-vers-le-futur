import { gauge, semitoneOffset, type Gauge } from './pitch'

// marks : la jauge affichée sous chaque note (null = pas encore jouée).
// current : index de la note attendue.
// failed : afficher « Raté ! On recommence… ».
// resetting : une fausse note vient d'être jouée, on attend la remise à zéro.
export type MelodyState = {
  marks: (Gauge | null)[]
  current: number
  failed: boolean
  resetting: boolean
  done: boolean
}

export function newMelody(length: number): MelodyState {
  return { marks: Array(length).fill(null), current: 0, failed: false, resetting: false, done: false }
}

export function hearNote(state: MelodyState, heardMidi: number, expected: number[], octaveMatters: boolean): MelodyState {
  if (state.done || state.resetting) return state
  const mark = gauge(semitoneOffset(heardMidi, expected[state.current], octaveMatters))
  const marks = state.marks.slice()
  marks[state.current] = mark
  if (mark.tone === 'green') {
    const current = state.current + 1
    return { ...state, marks, current, failed: false, done: current === expected.length }
  }
  // Sur la première note, on peut tâtonner librement.
  if (state.current === 0) return { ...state, marks, failed: false }
  return { ...state, marks, failed: true, resetting: true }
}

// Après une fausse note : tout revient à zéro, le message « Raté » reste affiché.
export function resetMelody(state: MelodyState): MelodyState {
  return { ...newMelody(state.marks.length), failed: state.failed }
}
