import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 360000,
  use: {
    headless: false,
    viewport: { width: 1440, height: 900 },
    // Slow down actions by 400ms so they look smooth on screen recording
    launchOptions: {
      slowMo: 400,
    },
  },
});
