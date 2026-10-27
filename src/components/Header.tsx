import { steps } from '../config'
import { stepCount } from '../game/steps'

export function Header({ index }: { index: number }) {
  const final = steps[index].kind === 'treasure'
  return (
    <>
      <div className="header">
        <span className="brand">CHRONO·MISSION</span>
        <span className={final ? 'stage final' : 'stage'}>{final ? 'MISSION RÉUSSIE' : `ÉTAPE ${index + 1} / ${stepCount}`}</span>
      </div>
      <div className="segments" aria-hidden="true">
        {steps.map((_, i) => (
          <span key={i} className={i <= index ? 'on' : undefined} />
        ))}
      </div>
    </>
  )
}
