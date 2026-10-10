const { test: setup, expect } = require('@playwright/test');
const LoginPage = require('../../pages/LoginPage');
const DashboardPage = require('../../pages/DashboardPage');
const env = require('../../utils/envConfig');

setup('authenticate as admin and store the session', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  await loginPage.open();
  await loginPage.login(env.adminUsername, env.adminPassword);
  await expect(dashboardPage.dashboardHeading).toBeVisible();

  await page.context().storageState({ path: env.authFile });
});
