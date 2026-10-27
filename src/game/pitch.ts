const pitchClasses: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }
const frenchNames: Record<string, string> = { C: 'Do', D: 'Ré', E: 'Mi', F: 'Fa', G: 'Sol', A: 'La', B: 'Si' }

function parseNote(name: string) {
  const match = /^([A-G])(#|b)?(-?\d+)$/.exec(name)
  if (!match) throw new Error(`Note inconnue : ${name}`)
  const [, letter, accidental = '', octave] = match
  return { letter, accidental, octave: Number(octave) }
}

// « A4 » → 69 (numéro MIDI). Les altérations comptent : Bb4 = 70, B4 = 71.
export function noteToMidi(name: string): number {
  const { letter, accidental, octave } = parseNote(name)
  const shift = accidental === '#' ? 1 : accidental === 'b' ? -1 : 0
  return (octave + 1) * 12 + pitchClasses[letter] + shift
}

// « Bb4 » → « Si bémol ».
export function frenchNoteName(name: string): string {
  const { letter, accidental } = parseNote(name)
  const suffix = accidental === '#' ? ' dièse' : accidental === 'b' ? ' bémol' : ''
  return frenchNames[letter] + suffix
}

// Fréquence en Hz → numéro MIDI décimal (440 Hz = 69).
export function frequencyToMidi(frequency: number): number {
  return 69 + 12 * Math.log2(frequency / 440)
}

// Écart en demi-tons (arrondi) entre la note entendue et la note attendue.
// Négatif = trop bas. Sans octave, l'écart est ramené entre -6 et +5.
export function semitoneOffset(heardMidi: number, expectedMidi: number, octaveMatters: boolean): number {
  const offset = Math.round(heardMidi - expectedMidi)
  if (octaveMatters) return offset
  return ((((offset % 12) + 18) % 12) - 6) || 0
}

export type Tone = 'green' | 'orange' | 'red'
export type Gauge = { tone: Tone; level: number; label: string }

// Remplissage de la tête de note selon l'écart.
export function gauge(offset: number): Gauge {
  const distance = Math.abs(offset)
  if (distance === 0) return { tone: 'green', level: 1, label: 'Bravo' }
  if (distance <= 2) return { tone: 'orange', level: 0.7, label: 'Presque' }
  return { tone: 'red', level: 0.3, label: offset < 0 ? 'Trop bas' : 'Trop haut' }
}
