import { stepCount } from './steps'

// step : index de l'étape en cours (0 = première étape).
// solved : l'étape en cours est réussie, la fenêtre « Étape réussie ! » est affichée.
export type Progress = { step: number; solved: boolean }

export const initialProgress: Progress = { step: 0, solved: false }

export const storageKey = 'chrono-mission:progress'

export function parseProgress(raw: string | null): Progress {
  try {
    const value = JSON.parse(raw ?? '')
    if (Number.isInteger(value.step) && value.step >= 0 && value.step < stepCount && typeof value.solved === 'boolean') {
      return { step: value.step, solved: value.solved }
    }
  } catch {
    // Valeur absente ou abîmée : on repart du début.
  }
  return initialProgress
}

export function loadProgress(): Progress {
  try {
    return parseProgress(localStorage.getItem(storageKey))
  } catch {
    return initialProgress
  }
}

export function saveProgress(progress: Progress) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(progress))
  } catch {
    // Stockage indisponible (navigation privée) : la partie continue sans sauvegarde.
  }
}
