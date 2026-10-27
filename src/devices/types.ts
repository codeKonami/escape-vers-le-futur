// Petites interfaces derrière lesquelles se cachent la caméra, le micro, le son
// et le hasard. Le jeu utilise les vraies ; les tests de bout en bout les remplacent.

export interface QrSource {
  // Allume la caméra dans `video` et appelle `onText` à chaque QR code lu.
  start(video: HTMLVideoElement, onText: (text: string) => void): Promise<void>
  stop(): void
}

export interface NoteSource {
  // Écoute le micro et appelle `onNote` (numéro MIDI) à chaque note jouée.
  start(onNote: (midi: number) => void): Promise<void>
  stop(): void
}

export interface MelodyPlayer {
  // Joue la mélodie ; la promesse se termine quand le son s'est éteint.
  play(): Promise<void>
  // Joue la musique de victoire, quand la mélodie a été retrouvée au piano.
  playVictory(): void
}

export interface Devices {
  createQrSource(): QrSource
  createNoteSource(): NoteSource
  melodyPlayer: MelodyPlayer
  createRandom(): () => number
}
