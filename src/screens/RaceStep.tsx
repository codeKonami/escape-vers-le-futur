import { useEffect, useRef, useState } from 'react'
import { ArrowIcon, CarSvg, ExplosionSvg, JeepSvg, LightningSvg } from '../components/art'
import { race, type RaceStep as Step } from '../config'
import { devices } from '../devices'
import { advance, lanes, mphAt, moveCar, newRace, road, type RaceState } from '../game/race'

// Position horizontale d'un véhicule de largeur `width` centré dans sa voie.
const laneLeft = (lane: number, width: number) => `calc(${((lane + 0.5) * 100) / lanes}% - ${width / 2}px)`

// La course à 88 (étape 8).
export function RaceStep({ step, onSolved }: { step: Step; onSolved: () => void }) {
  const [view, setView] = useState<RaceState | null>(null) // null : avant le départ
  const [flyUp, setFlyUp] = useState(false)
  const game = useRef<RaceState | null>(null)
  const frame = useRef(0)
  const timers = useRef<number[]>([])

  useEffect(
    () => () => {
      cancelAnimationFrame(frame.current)
      timers.current.forEach(clearTimeout)
    },
    [],
  )

  const start = () => {
    cancelAnimationFrame(frame.current)
    const random = devices.createRandom()
    game.current = newRace()
    setView(game.current)
    setFlyUp(false)
    let last = performance.now()

    const tick = (now: number) => {
      const state = advance(game.current!, Math.max(0, now - last), random)
      last = now
      game.current = state
      setView(state)
      if (state.status === 'playing') {
        frame.current = requestAnimationFrame(tick)
      } else if (state.status === 'crash') {
        navigator.vibrate?.(300)
      } else {
        // Victoire : éclairs, la voiture file vers le haut, puis la fenêtre de réussite.
        timers.current.push(window.setTimeout(() => setFlyUp(true), 600))
        timers.current.push(window.setTimeout(onSolved, 2200))
      }
    }
    frame.current = requestAnimationFrame(tick)
  }

  const move = (direction: -1 | 1) => {
    if (!game.current) return
    game.current = moveCar(game.current, direction)
    setView(game.current)
  }

  const status = view?.status ?? 'ready'
  const mph = status === 'win' ? race.targetMph : mphAt(view?.t ?? 0)
  const locked = status !== 'playing'

  return (
    <>
      <div className="intro" style={{ gap: 6 }}>
        <h1 className="title">{step.title}</h1>
        <p className="lead" style={{ lineHeight: 1.4 }}>
          {step.intro}
        </p>
      </div>

      <div className="speedometer">
        <div className="mph" role="status" aria-label={`Vitesse : ${mph} miles par heure`}>
          <span className="mph-value" aria-hidden="true" data-testid="mph">
            {String(mph).padStart(2, '0')}
          </span>
          <span className="mph-unit" aria-hidden="true">
            MPH
          </span>
        </div>
        <div className="gauge">
          <div className="gauge-labels">
            <span>VITESSE</span>
            <span>OBJECTIF {race.targetMph}</span>
          </div>
          <div className="gauge-track">
            <span className="gauge-fill" style={{ width: `${(mph / race.targetMph) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="road" role="group" aria-label="La route" data-testid="road" data-status={status}>
        {[1, 2].map((line) => (
          <span key={line} className="lane-line" aria-hidden="true" style={{ left: `calc(${(line * 100) / lanes}% - 2px)`, backgroundPositionY: `${view?.scroll ?? 0}px` }} />
        ))}
        {view?.jeeps.map((jeep, i) => (
          <div key={i} className="jeep" aria-hidden="true" data-lane={jeep.lane} style={{ left: laneLeft(jeep.lane, 52), top: jeep.y }}>
            <JeepSvg />
          </div>
        ))}
        <div className={flyUp ? 'car fly' : 'car'} aria-hidden="true" data-testid="car" data-lane={view?.lane ?? 1} style={{ left: laneLeft(view?.lane ?? 1, 56), top: flyUp ? -200 : road.carTop }}>
          <CarSvg dim={status === 'crash'} />
          {status === 'win' && <LightningSvg />}
          {status === 'crash' && <ExplosionSvg />}
        </div>
        {status === 'win' && <span className="bravo">BRAVO !</span>}
        {status === 'ready' && (
          <div className="road-panel">
            <p>{step.rules}</p>
            <button type="button" className="primary" onClick={start}>
              Démarrer
            </button>
          </div>
        )}
        {status === 'crash' && (
          <div className="road-panel crash" role="alert">
            <p>{step.crash}</p>
            <p>{step.crashHint}</p>
            <button type="button" className="primary" onClick={start}>
              Recommencer
            </button>
          </div>
        )}
      </div>

      <div className="arrows">
        <button type="button" className="arrow" aria-label="Aller à gauche" disabled={locked} onClick={() => move(-1)}>
          <ArrowIcon direction="left" />
        </button>
        <button type="button" className="arrow" aria-label="Aller à droite" disabled={locked} onClick={() => move(1)}>
          <ArrowIcon direction="right" />
        </button>
      </div>
    </>
  )
}
