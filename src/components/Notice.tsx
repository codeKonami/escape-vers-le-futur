import { messages } from '../config'
import { ClockIcon } from './art'

// Bandeau affiché quand on scanne un QR code trop tôt ou déjà utilisé.
export function Notice({ kind, onClose }: { kind: 'early' | 'used'; onClose: () => void }) {
  return (
    <div className="notice" role="alert">
      <div className="notice-row">
        <ClockIcon />
        <p>{kind === 'early' ? messages.qrTooEarly : messages.qrAlreadyUsed}</p>
      </div>
      <button type="button" className="secondary" onClick={onClose}>
        Compris
      </button>
    </div>
  )
}
