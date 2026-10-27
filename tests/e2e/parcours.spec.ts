import { expect, test } from '@playwright/test'
import { messages, steps, type CodeStep } from '../../src/config'
import { stepCount, vaultCode } from '../../src/game/steps'
import { continueGame, expectSuccess, openAt, solveStep, typeCode } from './helpers'

test.beforeEach(async ({ page }) => {
  await page.clock.install()
})

test('partie complète jusqu’au trésor', async ({ page }) => {
  await openAt(page)
  for (let index = 0; index < stepCount - 1; index++) {
    await expect(page.locator('.stage')).toHaveText(`ÉTAPE ${index + 1} / ${stepCount}`)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(steps[index].title)
    await solveStep(page, index)
    await continueGame(page, index)
  }
  await expect(page.locator('.stage')).toHaveText('MISSION RÉUSSIE')
  await expect(page.getByTestId('vault')).toHaveAttribute('aria-label', `Code du coffre : ${vaultCode}`)
  await expect(page.getByTestId('vault')).toHaveText(vaultCode)
  const treasure = steps[stepCount - 1]
  if (treasure.kind === 'treasure') await expect(page.getByText(treasure.hint)).toBeVisible()
})

test('mauvais code : message d’erreur, puis on peut réessayer', async ({ page }) => {
  const step = steps[0] as CodeStep
  await openAt(page)
  const wrong = step.code === '0000' ? '1111' : '0000'
  await typeCode(page, wrong)
  await page.getByRole('button', { name: step.button }).click()
  await expect(page.getByRole('alert')).toHaveText(step.error)
  await expect(page.getByTestId('lcd')).toHaveText('8'.repeat(step.code.length))
  await typeCode(page, step.code)
  await expect(page.getByRole('alert')).toHaveCount(0)
  await page.getByRole('button', { name: step.button }).click()
  await expectSuccess(page, 0)
})

test('mauvaise réponse texte : message d’erreur, réessai sans limite', async ({ page }) => {
  const index = steps.findIndex((step) => step.kind === 'question')
  const step = steps[index]
  if (step.kind !== 'question') throw new Error('aucune question dans la config')
  await openAt(page, index)
  for (let attempt = 0; attempt < 3; attempt++) {
    await page.getByLabel('Votre réponse').fill(`faux ${attempt}`)
    await page.getByRole('button', { name: 'Valider la réponse' }).click()
    await expect(page.getByRole('alert')).toHaveText(step.error)
  }
  await page.getByLabel('Votre réponse').fill(`  ${step.answers[step.answers.length - 1].toUpperCase()} !`)
  await page.getByRole('button', { name: 'Valider la réponse' }).click()
  await expectSuccess(page, index)
})

test('reprise après rechargement', async ({ page }) => {
  await openAt(page)
  await solveStep(page, 0)
  await continueGame(page, 0)
  await solveStep(page, 1)
  await expectSuccess(page, 1)

  // Rechargement pendant la fenêtre de réussite : le chiffre n'est pas perdu.
  await page.reload()
  await continueGame(page, 1)
  await expect(page.locator('.stage')).toHaveText(`ÉTAPE 3 / ${stepCount}`)

  // Rechargement en cours d'étape : on reprend au même endroit.
  await page.reload()
  await expect(page.locator('.stage')).toHaveText(`ÉTAPE 3 / ${stepCount}`)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(steps[2].title)
  await expect(page.getByText(messages.qrTooEarly)).toHaveCount(0)
})
