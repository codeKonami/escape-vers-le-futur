import { defineConfig, devices } from '@playwright/test'

// Les tests tournent sur le build « e2e » : identique au site publié, avec en plus
// des doublures pour la caméra, le micro, le son et le hasard (window.__chrono).
export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:4173/escape-vers-le-futur/',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'Pixel 7', use: { ...devices['Pixel 7'] } }],
  webServer: {
    command: 'npm run build:e2e && npx vite preview --outDir dist-e2e --port 4173 --strictPort',
    url: 'http://localhost:4173/escape-vers-le-futur/',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
