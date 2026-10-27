// Doublures utilisées uniquement par les tests de bout en bout (build « e2e »).
// Elles ne sont jamais incluses dans le site publié.
import { seededRandom } from '../game/random'
import { noteToMidi } from '../game/pitch'
import type { Devices } from './types'

export type TestHooks = {
  scan(text: string): void // simule un QR code devant la caméra
  note(note: string | number): void // simule une note jouée au piano ("G4" ou numéro MIDI)
  plays: number // nombre de lectures de la mélodie
  victories: number // nombre de lectures de la musique de victoire
  cameraOn: boolean
  micOn: boolean
  denyCamera: boolean
  denyMicrophone: boolean
  random: (() => number) | null // hasard imposé pour la course
}

declare global {
  interface Window {
    __chrono?: TestHooks
  }
}

export function createTestDevices(): Devices {
  let onText: ((text: string) => void) | null = null
  let onNote: ((midi: number) => void) | null = null
  const hooks: TestHooks = {
    scan: (text) => onText?.(text),
    note: (note) => onNote?.(typeof note === 'number' ? note : noteToMidi(note)),
    plays: 0,
    victories: 0,
    cameraOn: false,
    micOn: false,
    denyCamera: false,
    denyMicrophone: false,
    random: null,
  }
  window.__chrono = hooks
  const denied = () => new DOMException('Permission refusée', 'NotAllowedError')

  return {
    createQrSource: () => ({
      async start(_video, callback) {
        if (hooks.denyCamera) throw denied()
        onText = callback
        hooks.cameraOn = true
      },
      stop: () => {
        onText = null
        hooks.cameraOn = false
      },
    }),
    createNoteSource: () => ({
      async start(callback) {
        if (hooks.denyMicrophone) throw denied()
        onNote = callback
        hooks.micOn = true
      },
      stop: () => {
        onNote = null
        hooks.micOn = false
      },
    }),
    melodyPlayer: {
      async play() {
        hooks.plays++
        await new Promise((resolve) => setTimeout(resolve, 300))
      },
      playVictory: () => hooks.victories++,
    },
    createRandom: () => hooks.random ?? seededRandom(42),
  }
}
