import { describe, expect, it } from 'vitest'
import { race } from '../../src/config'
import { seededRandom } from '../../src/game/random'
import { advance, hits, mphAt, moveCar, newRace, pickLane, road, speedAt, spawnIntervalAt, type RaceState } from '../../src/game/race'

// Fait rouler la course image par image (16 ms) jusqu'à la victoire ou au choc.
function drive(state: RaceState, random: () => number) {
  while (state.status === 'playing') state = advance(state, 16, random)
  return { state }
}

// Une voiture hors de la route (voie -1) ne percute rien : on observe toute la course.
function driveThrough(random: () => number) {
  let state = newRace()
  const spawns: { t: number; lane: number }[] = []
  while (state.t < race.durationMs) {
    state = advance({ ...state, lane: -1 }, 16, random)
    const spawned = state.jeeps.find((jeep) => jeep.y === road.jeepStartY)
    if (spawned) spawns.push({ t: state.t, lane: spawned.lane })
  }
  return { state, spawns }
}

describe('course à 88', () => {
  it('accélère de 00 à 88 mph', () => {
    expect(mphAt(0)).toBe(0)
    expect(mphAt(race.durationMs)).toBe(race.targetMph)
    expect(speedAt(0)).toBeCloseTo(race.speedStart)
    expect(speedAt(race.durationMs)).toBeCloseTo(race.speedEnd)
    expect(spawnIntervalAt(0)).toBeCloseTo(race.spawnStartMs)
    expect(spawnIntervalAt(race.durationMs)).toBeCloseTo(race.spawnEndMs)
  })

  it('ne met jamais deux jeeps de suite dans la même voie', () => {
    const random = seededRandom(7)
    let last = -1
    for (let i = 0; i < 1000; i++) {
      const lane = pickLane(last, random)
      expect(lane).not.toBe(last)
      expect([0, 1, 2]).toContain(lane)
      last = lane
    }
  })

  it('fait apparaître les jeeps une par une, de plus en plus vite, et plus aucune à la fin', () => {
    const { spawns } = driveThrough(seededRandom(3))
    expect(spawns.length).toBeGreaterThan(10)
    expect(spawns[0].t).toBeGreaterThanOrEqual(race.firstSpawnMs)
    for (let i = 1; i < spawns.length; i++) {
      expect(spawns[i].lane).not.toBe(spawns[i - 1].lane)
      expect(spawns[i].t - spawns[i - 1].t).toBeGreaterThanOrEqual(race.spawnEndMs - 16)
    }
    const firstGap = spawns[1].t - spawns[0].t
    const lastGap = spawns[spawns.length - 1].t - spawns[spawns.length - 2].t
    expect(lastGap).toBeLessThan(firstGap)
    expect(spawns[spawns.length - 1].t).toBeLessThan(race.durationMs - race.noSpawnLastMs)
  })

  it('détecte la collision seulement dans la voie de la voiture', () => {
    expect(hits({ lane: 1, y: road.carTop }, 1)).toBe(true)
    expect(hits({ lane: 0, y: road.carTop }, 1)).toBe(false)
    expect(hits({ lane: 1, y: road.carTop - 100 }, 1)).toBe(false)
    expect(hits({ lane: 1, y: road.carTop + 100 }, 1)).toBe(false)
  })

  it('perd quand une jeep percute la voiture', () => {
    const { state } = drive(newRace(), () => 0.5) // toujours la voie du milieu en premier
    expect(state.status).toBe('crash')
  })

  it('gagne à 88 mph sans toucher de jeep', () => {
    let toggle = false
    const sides = () => ((toggle = !toggle) ? 0.1 : 0.9) // voies 0 et 2 en alternance
    const { state } = drive(newRace(), sides)
    expect(state.status).toBe('win')
    expect(mphAt(state.t)).toBe(race.targetMph)
  })

  it('change de voie sans sortir de la route', () => {
    let state = newRace()
    state = moveCar(moveCar(moveCar(state, -1), -1), -1)
    expect(state.lane).toBe(0)
    state = moveCar(moveCar(moveCar(state, 1), 1), 1)
    expect(state.lane).toBe(2)
    expect(moveCar({ ...state, status: 'crash' }, -1).lane).toBe(2)
  })
})
