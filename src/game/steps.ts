import { steps, type Step } from '../config'

export const stepCount = steps.length

function digitOf(step: Step): string | undefined {
  return 'digit' in step ? step.digit : undefined
}

const digitSteps = steps.flatMap((step, index) => (digitOf(step) ? [index] : []))

// Numéro (1, 2, 3…) du chiffre du coffre gagné à cette étape, ou null.
export function digitNumber(index: number): number | null {
  const position = digitSteps.indexOf(index)
  return position === -1 ? null : position + 1
}

export function isLastDigit(index: number): boolean {
  return digitSteps[digitSteps.length - 1] === index
}

export function digitAt(index: number): string | undefined {
  return digitOf(steps[index])
}

// Le code du coffre assemble les chiffres gagnés, dans l'ordre.
export const vaultCode = digitSteps.map((index) => digitOf(steps[index])).join('')
