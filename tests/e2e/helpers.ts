import { expect, type Page } from '@playwright/test'
import { melody, steps } from '../../src/config'
import type {} from '../../src/devices/testDevices'
import { storageKey } from '../../src/game/progress'
import { digitAt } from '../../src/game/steps'
import { scanUrl } from '../../src/game/tokens'

export const indexOf = (kind: (typeof steps)[number]['kind'], nth = 0) =>
  steps.flatMap((step, index) => (step.kind === kind ? [index] : []))[nth]

// Ouvre le jeu sur une étape donnée (0 = première), progression neuve.
export async function openAt(page: Page, step = 0, solved = false) {
  await page.goto('#/')
  await page.evaluate(([key, value]) => localStorage.setItem(key, value), [storageKey, JSON.stringify({ step, solved })])
  await page.reload()
  await expect(page.locator('.stage')).toBeVisible()
}

export async function typeCode(page: Page, code: string) {
  for (const digit of code) await page.getByRole('button', { name: digit, exact: true }).click()
}

export async function scan(page: Page, text: string) {
  await page.waitForFunction(() => window.__chrono?.cameraOn)
  await page.evaluate((value) => window.__chrono!.scan(value), text)
}

export async function startListening(page: Page) {
  await page.getByRole('button', { name: 'Le téléphone écoute le piano' }).click()
  await page.waitForFunction(() => window.__chrono?.micOn)
}

export async function playNote(page: Page, note: string | number) {
  await page.evaluate((value) => window.__chrono!.note(value), note)
}

// Hasard imposé : les jeeps passent toujours sur les côtés, la voiture reste au milieu.
export async function jeepsOnTheSides(page: Page) {
  await page.evaluate(() => {
    let left = false
    window.__chrono!.random = () => ((left = !left) ? 0.1 : 0.9)
  })
}

export async function jeepsInTheMiddle(page: Page) {
  await page.evaluate(() => (window.__chrono!.random = () => 0.5))
}

// Joue la course (horloge du navigateur avancée artificiellement).
export async function winRace(page: Page) {
  await jeepsOnTheSides(page)
  await page.getByRole('button', { name: 'Démarrer' }).click()
  await page.clock.runFor(15_500)
  await expect(page.getByText('BRAVO !')).toBeVisible()
  await page.clock.runFor(2_500)
}

// Résout l'étape en cours comme le feraient les enfants, d'après la config.
export async function solveStep(page: Page, index: number) {
  const step = steps[index]
  switch (step.kind) {
    case 'code':
      await typeCode(page, step.code)
      await page.getByRole('button', { name: step.button }).click()
      break
    case 'question':
      await page.getByLabel('Votre réponse').fill(step.answers[0])
      await page.getByRole('button', { name: 'Valider la réponse' }).click()
      break
    case 'scan':
      await scan(page, scanUrl(step.token))
      break
    case 'melody':
      await startListening(page)
      for (const event of melody.events) await playNote(page, event.note)
      await page.clock.runFor(1_000)
      break
    case 'race':
      await winRace(page)
      break
    case 'treasure':
      return
  }
}

export async function expectSuccess(page: Page, index: number) {
  const dialog = page.getByRole('dialog', { name: 'Étape réussie !' })
  await expect(dialog).toBeVisible()
  const digit = digitAt(index)
  if (digit) await expect(dialog.getByTestId('digit')).toHaveText(digit)
  return dialog
}

export async function continueGame(page: Page, index: number) {
  const dialog = await expectSuccess(page, index)
  await dialog.getByRole('button', { name: 'Continuer' }).click()
}
