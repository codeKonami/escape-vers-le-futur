import { expect, test } from '@playwright/test'
import { messages, steps, type ScanStep } from '../../src/config'
import { scanUrl } from '../../src/game/tokens'
import { expectSuccess, indexOf, openAt, scan } from './helpers'

const firstScan = indexOf('scan', 0)
const secondScan = indexOf('scan', 1)
const tokenOf = (index: number) => (steps[index] as ScanStep).token

test('QR scanné trop tôt avec l’appareil photo du téléphone', async ({ page }) => {
  await openAt(page, firstScan - 1)
  await page.goto(`#/scan/${tokenOf(firstScan)}`)
  await expect(page.getByRole('alert')).toHaveText(new RegExp(messages.qrTooEarly))
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(steps[firstScan - 1].title)
  await expect(page).toHaveURL(/#\/$/)
  await page.getByRole('button', { name: 'Compris' }).click()
  await expect(page.getByRole('alert')).toHaveCount(0)
})

test('QR scanné trop tôt avec le scanner de l’appli', async ({ page }) => {
  await openAt(page, firstScan)
  await scan(page, scanUrl(tokenOf(secondScan)))
  await expect(page.getByText(messages.qrTooEarly)).toBeVisible()
  await expect(page.getByRole('dialog')).toHaveCount(0)
})

test('QR de l’étape en cours ouvert avec l’appareil photo : étape validée', async ({ page }) => {
  await openAt(page, firstScan)
  await page.goto(`#/scan/${tokenOf(firstScan)}`)
  await expectSuccess(page, firstScan)
})

test('QR déjà utilisé, QR inconnu ignoré', async ({ page }) => {
  await openAt(page, secondScan)
  await scan(page, scanUrl(tokenOf(firstScan)))
  await expect(page.getByText(messages.qrAlreadyUsed)).toBeVisible()
  await page.getByRole('button', { name: 'Compris' }).click()
  await scan(page, 'https://example.com/un-autre-qr')
  await scan(page, scanUrl('INCONNU'))
  await expect(page.getByRole('alert')).toHaveCount(0)
  await expect(page.getByRole('dialog')).toHaveCount(0)
})

test('caméra refusée : message d’explication', async ({ page }) => {
  await openAt(page, firstScan - 1)
  await page.evaluate(() => (window.__chrono!.denyCamera = true))
  await page.evaluate((index) => localStorage.setItem('chrono-mission:progress', JSON.stringify({ step: index, solved: false })), firstScan)
  await page.evaluate(() => window.dispatchEvent(new StorageEvent('storage', { key: 'chrono-mission:progress' })))
  await expect(page.getByRole('alert')).toHaveText(messages.cameraDenied)
})
