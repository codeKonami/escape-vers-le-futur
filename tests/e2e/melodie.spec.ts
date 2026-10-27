import { expect, test, type Page } from '@playwright/test'
import { melody, messages, steps } from '../../src/config'
import { noteToMidi } from '../../src/game/pitch'
import { expectSuccess, indexOf, openAt, playNote, startListening } from './helpers'

const index = indexOf('melody')
const notes = melody.events.map((event) => event.note)
const step = steps[index]
const failText = step.kind === 'melody' ? step.fail : ''
const total = notes.length
const victories = (page: Page) => page.evaluate(() => window.__chrono!.victories)

test.beforeEach(async ({ page }) => {
  await page.clock.install()
  await openAt(page, index)
})

test('mélodie réussie', async ({ page }) => {
  await page.getByRole('button', { name: 'Écouter la mélodie' }).click()
  await expect.poll(() => page.evaluate(() => window.__chrono!.plays)).toBe(1)
  await page.clock.runFor(500) // fin de la lecture
  await startListening(page)
  await expect(page.getByText("J'écoute…")).toBeVisible()

  // Sur la première note, on peut tâtonner : trop bas, presque, puis juste.
  await playNote(page, noteToMidi(notes[0]) - 4)
  await expect(page.getByTestId('note').first()).toHaveAttribute('data-tone', 'red')
  await expect(page.getByText('Trop bas')).toBeVisible()
  await playNote(page, noteToMidi(notes[0]) + 1)
  await expect(page.getByText('Presque')).toBeVisible()
  await expect(page.getByText(failText)).toHaveCount(0)

  for (const [i, note] of notes.entries()) {
    await playNote(page, note)
    await expect(page.getByText(`Notes trouvées : ${i + 1} / ${total}`)).toBeVisible()
    if (i < total - 1) expect(await victories(page)).toBe(0)
  }
  await expect(page.getByTestId('note').and(page.locator('[data-tone="green"]'))).toHaveCount(total)
  await expect.poll(() => victories(page)).toBe(1) // musique de victoire
  await page.clock.runFor(1_000)
  await expectSuccess(page, index)
  expect(await victories(page)).toBe(1)
})

test('la musique de victoire est bien publiée avec le site', async ({ page }) => {
  const response = await page.request.get(melody.victorySound)
  expect(response.ok()).toBe(true)
  expect(response.headers()['content-type']).toContain('audio/mpeg')
})

test('mélodie ratée sur la 2e note : on recommence depuis la première', async ({ page }) => {
  await startListening(page)
  await playNote(page, notes[0])
  await expect(page.getByText(`Notes trouvées : 1 / ${total}`)).toBeVisible()
  await playNote(page, noteToMidi(notes[1]) + 1) // un demi-ton à côté
  await expect(page.getByTestId('note').nth(1)).toHaveAttribute('data-tone', 'orange')
  await expect(page.getByText(failText)).toBeVisible()

  await page.clock.runFor(1_500)
  await expect(page.getByText(`Notes trouvées : 0 / ${total}`)).toBeVisible()
  expect(await victories(page)).toBe(0)
  await expect(page.locator('[data-testid="note"][data-tone=""]')).toHaveCount(total)

  for (const note of notes) await playNote(page, note)
  await page.clock.runFor(1_000)
  await expectSuccess(page, index)
})

test('le micro est ignoré pendant que le téléphone joue la mélodie', async ({ page }) => {
  await startListening(page)
  await page.getByRole('button', { name: 'Écouter la mélodie' }).click()
  await expect.poll(() => page.evaluate(() => window.__chrono!.plays)).toBe(1)
  await playNote(page, notes[0])
  await expect(page.getByText(`Notes trouvées : 0 / ${total}`)).toBeVisible()
  await page.clock.runFor(500)
  await playNote(page, notes[0])
  await expect(page.getByText(`Notes trouvées : 1 / ${total}`)).toBeVisible()
})

test('micro refusé : message d’explication', async ({ page }) => {
  await page.evaluate(() => (window.__chrono!.denyMicrophone = true))
  await page.getByRole('button', { name: 'Le téléphone écoute le piano' }).click()
  await expect(page.getByRole('alert')).toHaveText(messages.micDenied)
  await expect(page.getByText('Jouer au piano')).toBeVisible()
})
