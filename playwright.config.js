// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const env = require('./utils/envConfig');

const AUTH_FILE = env.authFile;

module.exports = defineConfig({
  testDir: './tests',
  timeout: 60 * 1000,
  expect: { timeout: 10 * 1000 },
  fullyParallel: false, // tests inside a file run in order; files run in parallel
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : 2, // the public demo is shared and slow; keep concurrency low
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],
  use: {
    baseURL: env.baseURL,
    headless: true,
    viewport: { width: 1440, height: 900 },
    actionTimeout: 15 * 1000,
    navigationTimeout: 30 * 1000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    // Logs in once and stores the session for all other tests
    { name: 'setup', testMatch: /.*\.setup\.js/ },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 }, storageState: AUTH_FILE },
      dependencies: ['setup'],
    },
    // Uncomment to run on more browsers
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'], storageState: AUTH_FILE },
    //   dependencies: ['setup'],
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'], storageState: AUTH_FILE },
    //   dependencies: ['setup'],
    // },
  ],
});
