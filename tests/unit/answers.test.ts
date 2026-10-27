import { describe, expect, it } from 'vitest'
import { steps, type QuestionStep } from '../../src/config'
import { isAccepted, normalize } from '../../src/game/answers'

const questions = steps.filter((step): step is QuestionStep => step.kind === 'question')

describe('normalisation des réponses', () => {
  it('ignore majuscules, accents, ponctuation et espaces', () => {
    expect(normalize('  Éinstéin ! ')).toBe('einstein')
    expect(normalize('88 MPH.')).toBe(normalize('88mph'))
    expect(normalize('Quatre-vingt-huit')).toBe(normalize('quatre vingt   huit'))
  })

  it('refuse une réponse vide', () => {
    expect(isAccepted('   ', ['88'])).toBe(false)
  })

  for (const question of questions) {
    describe(question.title, () => {
      it.each(question.answers)('accepte « %s » et ses variantes', (answer) => {
        expect(isAccepted(answer, question.answers)).toBe(true)
        expect(isAccepted(`  ${answer.toUpperCase()} !`, question.answers)).toBe(true)
      })

      it('refuse une mauvaise réponse', () => {
        expect(isAccepted('une réponse au hasard', question.answers)).toBe(false)
      })
    })
  }
})
