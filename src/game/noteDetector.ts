import { frequencyToMidi } from './pitch'

// Une mesure du micro : heure (ms), volume (RMS), fréquence détectée par pitchy et sa netteté (0 à 1).
export type Frame = { time: number; rms: number; frequency: number; clarity: number }

export const detectorSettings = {
  stableMs: 100, // durée pendant laquelle la hauteur doit rester stable
  minRms: 0.01, // en dessous : silence
  minClarity: 0.9, // en dessous : son trop confus pour être une note
  onsetRatio: 1.6, // montée brusque du volume = nouvelle frappe
}

// Transforme le flux du micro en notes jouées : une note est émise quand la hauteur
// reste stable ~100 ms. La même note n'est acceptée à nouveau qu'après une nouvelle frappe.
export class NoteDetector {
  private level = 0
  private armed = false
  private candidate: number | null = null
  private since = 0
  private lastEmitted: number | null = null

  constructor(private onNote: (midi: number) => void) {}

  push(frame: Frame) {
    const { stableMs, minRms, minClarity, onsetRatio } = detectorSettings
    if (frame.rms > minRms && frame.rms > this.level * onsetRatio) {
      this.armed = true
      this.candidate = null
    }
    this.level = this.level * 0.7 + frame.rms * 0.3

    if (frame.rms < minRms || frame.clarity < minClarity || frame.frequency < 50 || frame.frequency > 2500) {
      this.candidate = null
      return
    }
    const midi = frequencyToMidi(frame.frequency)
    if (this.candidate === null || Math.abs(midi - this.candidate) >= 0.5) {
      this.candidate = midi
      this.since = frame.time
      return
    }
    if (frame.time - this.since < stableMs) return
    const rounded = Math.round(midi)
    if (this.armed || rounded !== this.lastEmitted) {
      this.armed = false
      this.lastEmitted = rounded
      this.onNote(midi)
    }
  }

  reset() {
    this.level = 0
    this.armed = false
    this.candidate = null
    this.lastEmitted = null
  }
}
