import { seededRandom } from '../game/random'
import { toneMelodyPlayer } from './melodyPlayer'
import { createMicrophone } from './microphone'
import { createQrScanner } from './qrScanner'
import { createTestDevices } from './testDevices'
import type { Devices } from './types'

const realDevices: Devices = {
  createQrSource: createQrScanner,
  createNoteSource: createMicrophone,
  melodyPlayer: toneMelodyPlayer,
  createRandom: () => seededRandom(Date.now()),
}

// Le mode « e2e » n'existe que pour les tests : le site publié utilise toujours les vrais appareils.
export const devices: Devices = import.meta.env.MODE === 'e2e' ? createTestDevices() : realDevices
