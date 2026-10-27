import QrScanner from 'qr-scanner'
import type { QrSource } from './types'

export function createQrScanner(): QrSource {
  let scanner: QrScanner | null = null
  return {
    async start(video, onText) {
      scanner = new QrScanner(video, (result) => onText(result.data), {
        preferredCamera: 'environment',
        returnDetailedScanResult: true,
        maxScansPerSecond: 8,
        onDecodeError: () => {}, // « aucun QR code dans l'image » : normal, on continue
        // Analyse tout le carré visible dans le cadre de visée (par défaut : seulement les 2/3 centraux).
        calculateScanRegion: ({ videoWidth, videoHeight }) => {
          const size = Math.min(videoWidth, videoHeight)
          return { x: (videoWidth - size) / 2, y: (videoHeight - size) / 2, width: size, height: size, downScaledWidth: 600, downScaledHeight: 600 }
        },
      })
      await scanner.start()
    },
    stop() {
      scanner?.destroy()
      scanner = null
    },
  }
}
