import { race } from '../config'

// Géométrie de la route (px), reprise du design.
export const road = { height: 420, carTop: 310, jeepStartY: -90, dashPeriod: 40 }
export const lanes = 3

export type Jeep = { lane: number; y: number }
export type RaceStatus = 'playing' | 'crash' | 'win'
export type RaceState = {
  status: RaceStatus
  t: number // temps écoulé (ms)
  lane: number // voie de la voiture : 0, 1 ou 2
  scroll: number // décalage des pointillés de la route
  jeeps: Jeep[]
  spawnIn: number // ms avant la prochaine jeep
  lastLane: number
}

export function newRace(): RaceState {
  return { status: 'playing', t: 0, lane: 1, scroll: 0, jeeps: [], spawnIn: race.firstSpawnMs, lastLane: -1 }
}

const progressAt = (t: number) => Math.min(1, t / race.durationMs)
export const speedAt = (t: number) => race.speedStart + (race.speedEnd - race.speedStart) * progressAt(t)
export const spawnIntervalAt = (t: number) => race.spawnStartMs - (race.spawnStartMs - race.spawnEndMs) * progressAt(t)
export const mphAt = (t: number) => Math.round(race.targetMph * progressAt(t))

// Jamais deux jeeps de suite dans la même voie.
export function pickLane(lastLane: number, random: () => number): number {
  const lane = Math.floor(random() * lanes)
  if (lane !== lastLane) return lane
  return (lane + 1 + Math.floor(random() * (lanes - 1))) % lanes
}

// Boîtes de collision un peu plus petites que les dessins, pour rester juste.
export function hits(jeep: Jeep, carLane: number): boolean {
  return jeep.lane === carLane && jeep.y + 78 > road.carTop + 8 && jeep.y + 6 < road.carTop + 88
}

export function moveCar(state: RaceState, direction: -1 | 1): RaceState {
  if (state.status !== 'playing') return state
  return { ...state, lane: Math.max(0, Math.min(lanes - 1, state.lane + direction)) }
}

export function advance(state: RaceState, elapsed: number, random: () => number): RaceState {
  if (state.status !== 'playing') return state
  const dt = Math.min(50, elapsed) // évite un grand saut après une pause
  const t = state.t + dt
  const speed = speedAt(t)
  const jeeps = state.jeeps.map((jeep) => ({ ...jeep, y: jeep.y + speed * dt })).filter((jeep) => jeep.y < road.height)
  let { spawnIn, lastLane } = state
  spawnIn -= dt
  if (spawnIn <= 0 && t < race.durationMs - race.noSpawnLastMs) {
    lastLane = pickLane(lastLane, random)
    jeeps.push({ lane: lastLane, y: road.jeepStartY })
    spawnIn = spawnIntervalAt(t)
  }
  const status: RaceStatus = jeeps.some((jeep) => hits(jeep, state.lane)) ? 'crash' : t >= race.durationMs ? 'win' : 'playing'
  return { ...state, status, t, scroll: (state.scroll + speed * dt) % road.dashPeriod, jeeps, spawnIn, lastLane }
}
