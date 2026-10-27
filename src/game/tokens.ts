import { productionUrl, steps, type Step } from '../config'
import type { Progress } from './progress'

export type TokenVerdict = 'valid' | 'early' | 'used' | 'unknown'

// Extrait le jeton d'une adresse du type https://…/#/scan/ROQUE.
export function tokenFromText(text: string): string | null {
  const match = /#\/scan\/([A-Za-z0-9_-]+)/.exec(text)
  return match ? match[1].toUpperCase() : null
}

export function judgeToken(token: string, progress: Progress, list: Step[] = steps): TokenVerdict {
  const index = list.findIndex((step) => step.kind === 'scan' && step.token.toUpperCase() === token.toUpperCase())
  if (index === -1) return 'unknown'
  if (index > progress.step) return 'early'
  if (index < progress.step || progress.solved) return 'used'
  return 'valid'
}

export function scanUrl(token: string): string {
  return `${productionUrl}#/scan/${token}`
}
