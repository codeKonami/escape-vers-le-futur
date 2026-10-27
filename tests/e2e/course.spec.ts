import { expect, test } from '@playwright/test'
import { race, steps } from '../../src/config'
import { expectSuccess, indexOf, jeepsInTheMiddle, jeepsOnTheSides, openAt } from './helpers'

const index = indexOf('race')
const step = steps[index]
const crashText = step.kind === 'race' ? step.crash : ''

test.beforeEach(async ({ page }) => {
  await page.clock.install()
  await openAt(page, index)
})

test('course gagnée : 88 mph, éclairs, puis réussite', async ({ page }) => {
  await expect(page.getByTestId('mph')).toHaveText('00')
  await expect(page.getByRole('button', { name: 'Aller à gauche' })).toBeDisabled()
  await jeepsOnTheSides(page)
  await page.getByRole('button', { name: 'Démarrer' }).click()

  await page.clock.runFor(race.durationMs / 2)
  await expect(page.getByTestId('mph')).toHaveText(String(Math.round(race.targetMph / 2)))
  await expect(page.locator('.jeep').first()).toBeVisible()

  await page.clock.runFor(race.durationMs / 2 + 200)
  await expect(page.getByTestId('mph')).toHaveText(String(race.targetMph))
  await expect(page.getByText('BRAVO !')).toBeVisible()
  await expect(page.locator('.lightning')).toBeVisible()
  await expect(page.getByRole('dialog')).toHaveCount(0)

  await page.clock.runFor(2_500)
  await expect(page.getByTestId('car')).toHaveClass(/fly/)
  const dialog = await expectSuccess(page, index)
  if (step.kind === 'race') await expect(dialog.getByText(step.success)).toBeVisible()
})

test('course perdue : explosion, puis on recommence une course complète', async ({ page }) => {
  await jeepsInTheMiddle(page)
  await page.getByRole('button', { name: 'Démarrer' }).click()
  await page.clock.runFor(3_000)
  await expect(page.getByRole('alert')).toContainText(crashText)
  await expect(page.locator('.explosion')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Aller à droite' })).toBeDisabled()

  // On recommence une course complète et, cette fois, on se met dans la voie de droite,
  // que les jeeps (milieu puis gauche, en alternance) n'empruntent jamais.
  await page.getByRole('button', { name: 'Recommencer' }).click()
  await expect(page.getByTestId('mph')).toHaveText('00')
  await expect(page.getByRole('alert')).toHaveCount(0)
  await page.getByRole('button', { name: 'Aller à droite' }).click()
  await expect(page.getByTestId('car')).toHaveAttribute('data-lane', '2')
  await page.clock.runFor(race.durationMs + 200)
  await expect(page.getByText('BRAVO !')).toBeVisible()
})
