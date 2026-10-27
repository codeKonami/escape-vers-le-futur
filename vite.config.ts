import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  // Le site est servi depuis https://codekonami.github.io/escape-vers-le-futur/
  base: '/escape-vers-le-futur/',
  plugins: [react()],
  build: { chunkSizeWarningLimit: 800 }, // Tone.js pèse lourd, c'est attendu
  test: { include: ['tests/unit/**/*.test.ts'] },
})
