import { describe, expect, it } from 'vitest'
import { steps, type ScanStep } from '../../src/config'
import { initialProgress, parseProgress } from '../../src/game/progress'
import { digitNumber, isLastDigit, vaultCode } from '../../src/game/steps'
import { judgeToken, scanUrl, tokenFromText } from '../../src/game/tokens'

const scans = steps.map((step, index) => ({ step, index })).filter((s): s is { step: ScanStep; index: number } => s.step.kind === 'scan')

describe('progression', () => {
  it('relit une sauvegarde valide', () => {
    expect(parseProgress('{"step":3,"solved":true}')).toEqual({ step: 3, solved: true })
  })

  it('repart du début si la sauvegarde est absente ou abîmée', () => {
    expect(parseProgress(null)).toEqual(initialProgress)
    expect(parseProgress('pas du json')).toEqual(initialProgress)
    expect(parseProgress(`{"step":${steps.length},"solved":false}`)).toEqual(initialProgress)
  })
})

describe('chiffres du coffre', () => {
  it('assemble les chiffres dans l’ordre des étapes', () => {
    const digits = steps.flatMap((step) => ('digit' in step && step.digit ? [step.digit] : []))
    expect(vaultCode).toBe(digits.join(''))
  })

  it('numérote les chiffres et repère le dernier', () => {
    const indexes = steps.flatMap((step, index) => ('digit' in step && step.digit ? [index] : []))
    indexes.forEach((index, position) => expect(digitNumber(index)).toBe(position + 1))
    expect(isLastDigit(indexes[indexes.length - 1])).toBe(true)
    expect(isLastDigit(indexes[0])).toBe(false)
  })
})

describe('jetons des QR codes', () => {
  it('extrait le jeton de l’adresse imprimée', () => {
    for (const { step } of scans) expect(tokenFromText(scanUrl(step.token))).toBe(step.token.toUpperCase())
    expect(tokenFromText('https://example.com/')).toBeNull()
  })

  it.each(scans)('$step.token : valide, trop tôt ou déjà trouvé selon l’étape', ({ step, index }) => {
    expect(judgeToken(step.token, { step: index, solved: false })).toBe('valid')
    expect(judgeToken(step.token, { step: index - 1, solved: false })).toBe('early')
    expect(judgeToken(step.token, { step: index, solved: true })).toBe('used')
    expect(judgeToken(step.token, { step: index + 1, solved: false })).toBe('used')
  })

  it('ignore un jeton inconnu', () => {
    expect(judgeToken('INCONNU', initialProgress)).toBe('unknown')
  })
})
