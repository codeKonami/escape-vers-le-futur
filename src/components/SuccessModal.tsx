import { messages, steps } from '../config'
import { digitAt, digitNumber, isLastDigit } from '../game/steps'
import { BoltIcon } from './art'

export function SuccessModal({ index, onContinue }: { index: number; onContinue: () => void }) {
  const step = steps[index]
  const digit = digitAt(index)
  return (
    <div className="overlay">
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="success-title">
        <BoltIcon />
        <h2 id="success-title">Étape réussie !</h2>
        {digit ? (
          <>
            <p>{messages.digitWon.replace('{n}', String(digitNumber(index)))}</p>
            <span className="big-digit" data-testid="digit">
              {digit}
            </span>
            <p className="small">{isLastDigit(index) ? messages.digitLast : messages.digitKeep}</p>
          </>
        ) : (
          'success' in step && <p>{step.success}</p>
        )}
        <button type="button" className="primary" onClick={onContinue} autoFocus>
          Continuer
        </button>
      </div>
    </div>
  )
}
