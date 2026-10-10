const { test, expect } = require('../../fixtures/baseTest');
const LoginPage = require('../../pages/LoginPage');
const DashboardPage = require('../../pages/DashboardPage');
const env = require('../../utils/envConfig');

test.describe('End to end', () => {
  test('TC_E2E_001 - employee created by admin can log in and log out @smoke', async ({ browser, employeeWithLogin }) => {
    // Fresh, unauthenticated browser context for the new employee
    const context = await browser.newContext({
      baseURL: env.baseURL,
      storageState: { cookies: [], origins: [] },
    });
    const page = await context.newPage();
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.open();
    await loginPage.login(employeeWithLogin.login.username, employeeWithLogin.login.password);

    await expect(dashboardPage.dashboardHeading).toBeVisible();
    await expect(dashboardPage.userName).toContainText(employeeWithLogin.firstName);

    await dashboardPage.logout();
    await expect(loginPage.loginTitle).toBeVisible();

    await context.close();
  });
});
