const { test, expect } = require('../../fixtures/baseTest');
const { readJson } = require('../../utils/commonUtils');
const env = require('../../utils/envConfig');

const users = readJson('test-data/users.json');

// Login tests must start unauthenticated
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test('TC_LOGIN_001 - login page elements are displayed @smoke', async ({ loginPage }) => {
    await expect(loginPage.loginTitle).toBeVisible();
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeEnabled();
    await expect(loginPage.forgotPasswordLink).toBeVisible();
    await expect(loginPage.brandingLogo).toBeVisible();
  });

  test('TC_LOGIN_002 - valid admin credentials open the dashboard @smoke', async ({ loginPage, dashboardPage }) => {
    await loginPage.login(env.adminUsername, env.adminPassword);
    await expect(loginPage.page).toHaveURL(/dashboard\/index/);
    await expect(dashboardPage.dashboardHeading).toBeVisible();
  });

  for (const data of users.invalidLogins) {
    test(`TC_LOGIN_003 - invalid login: ${data.title} @regression`, async ({ loginPage }) => {
      await loginPage.login(data.username, data.password);
      await expect(loginPage.errorAlert).toHaveText(data.error);
      await expect(loginPage.page).toHaveURL(/auth\/login/);
    });
  }

  test('TC_LOGIN_004 - empty username and password show required errors @regression', async ({ loginPage }) => {
    await loginPage.loginButton.click();
    await loginPage.expectFieldErrorCount(2);
    await loginPage.expectFieldError(users.requiredFieldMessage, 0);
    await loginPage.expectFieldError(users.requiredFieldMessage, 1);
  });

  test('TC_LOGIN_005 - empty password shows required error @regression', async ({ loginPage }) => {
    await loginPage.usernameInput.fill(env.adminUsername);
    await loginPage.loginButton.click();
    await loginPage.expectFieldErrorCount(1);
    await loginPage.expectFieldError(users.requiredFieldMessage);
  });

  test('TC_LOGIN_006 - empty username shows required error @regression', async ({ loginPage }) => {
    await loginPage.passwordInput.fill(env.adminPassword);
    await loginPage.loginButton.click();
    await loginPage.expectFieldErrorCount(1);
    await loginPage.expectFieldError(users.requiredFieldMessage);
  });

  test('TC_LOGIN_007 - password field masks the input @regression', async ({ loginPage }) => {
    await loginPage.passwordInput.fill('secret');
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });

  test('TC_LOGIN_008 - forgot password opens reset page and cancel returns @regression', async ({ loginPage }) => {
    await loginPage.openForgotPassword();
    await expect(loginPage.resetPasswordHeading).toBeVisible();
    await loginPage.cancelButton.click();
    await expect(loginPage.page).toHaveURL(/auth\/login/);
  });

  test('TC_LOGIN_009 - logout returns user to the login page @smoke', async ({ loginPage, dashboardPage }) => {
    await loginPage.login(env.adminUsername, env.adminPassword);
    await expect(dashboardPage.dashboardHeading).toBeVisible();
    await dashboardPage.logout();
    await expect(loginPage.loginTitle).toBeVisible();
  });

  test('TC_LOGIN_010 - protected page redirects to login when not authenticated @regression', async ({ page, loginPage }) => {
    await page.goto('/web/index.php/pim/viewEmployeeList');
    await expect(page).toHaveURL(/auth\/login/);
    await expect(loginPage.loginTitle).toBeVisible();
  });
});
