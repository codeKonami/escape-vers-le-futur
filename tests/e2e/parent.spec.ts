import { expect, test } from '@playwright/test'
import { kids, melody, productionUrl, steps } from '../../src/config'
import { frenchNoteName } from '../../src/game/pitch'
import { vaultCode } from '../../src/game/steps'
import { scanUrl } from '../../src/game/tokens'

test('espace parent : cartes, solutions et outils de test', async ({ page }) => {
  await page.goto('#/parent')
  await expect(page.getByRole('heading', { name: 'Espace parent' })).toBeVisible()

  // Cartes : QR de départ, code secret, un QR par cachette — toujours avec l'adresse de production.
  const scanSteps = steps.flatMap((step) => (step.kind === 'scan' ? [step] : []))
  const firstCode = steps.find((step) => step.kind === 'code')!
  await expect(page.locator('.card')).toHaveCount(2 + scanSteps.length)
  await expect(page.getByText(`Sous l'oreiller de ${kids.first}`)).toBeVisible()
  await expect(page.getByText(`Sous l'oreiller de ${kids.second}`)).toBeVisible()
  if (firstCode.kind === 'code') await expect(page.locator('.card-code')).toHaveText(firstCode.code)
  await expect(page.locator(`img[data-url="${productionUrl}"]`)).toBeVisible()
  for (const step of scanSteps) await expect(page.locator(`img[data-url="${scanUrl(step.token)}"]`)).toBeVisible()

  // Solutions et code du coffre.
  for (const step of steps) await expect(page.locator('.solutions')).toContainText(step.title)
  for (const event of melody.events) await expect(page.locator('.solutions')).toContainText(`${frenchNoteName(event.note)} (${event.note})`)
  await expect(page.getByTestId('parent-vault')).toHaveText(vaultCode)

  // Aller directement à une étape.
  await page.getByLabel("Aller directement à l'étape").selectOption(String(4))
  await page.getByRole('button', { name: "Aller à l'étape" }).click()
  await expect(page.locator('.stage')).toHaveText(`ÉTAPE 5 / ${steps.length}`)

  // Recommencer la partie, avec confirmation.
  await page.goto('#/parent')
  page.once('dialog', (dialog) => dialog.dismiss())
  await page.getByRole('button', { name: 'Recommencer la partie' }).click()
  await expect(page.getByRole('heading', { name: 'Espace parent' })).toBeVisible()
  page.once('dialog', (dialog) => dialog.accept())
  await page.getByRole('button', { name: 'Recommencer la partie' }).click()
  await expect(page.locator('.stage')).toHaveText(`ÉTAPE 1 / ${steps.length}`)
})
