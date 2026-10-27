import { ChestSvg } from '../components/art'
import type { TreasureStep } from '../config'
import { vaultCode } from '../game/steps'

export function Treasure({ step }: { step: TreasureStep }) {
  return (
    <>
      <div className="treasure-intro">
        <ChestSvg />
        <h1 className="title">{step.title}</h1>
        <p className="lead">{step.text}</p>
      </div>
      <div className="vault">
        <span className="lcd-label">CODE DU COFFRE</span>
        <div className="vault-digits" role="status" aria-label={`Code du coffre : ${vaultCode}`} data-testid="vault">
          {Array.from(vaultCode, (digit, i) => (
            <span key={i} aria-hidden="true">
              {digit}
            </span>
          ))}
        </div>
      </div>
      <div className="panel" style={{ padding: '18px 20px', gap: 6 }}>
        <span className="panel-label cyan">DERNIER INDICE</span>
        <p className="question" style={{ lineHeight: 1.45 }}>
          {step.hint}
        </p>
      </div>
    </>
  )
}
