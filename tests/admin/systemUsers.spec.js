const { test, expect } = require('../../fixtures/baseTest');
const { readJson, randomString, randomNumber } = require('../../utils/commonUtils');

const admin = readJson('test-data/admin.json');

test.describe('Admin - System Users', () => {
  test.beforeEach(async ({ adminPage }) => {
    await adminPage.open();
  });

  test('TC_ADMIN_001 - system users page is displayed @smoke', async ({ adminPage }) => {
    await expect(adminPage.systemUsersHeading).toBeVisible();
    await expect(adminPage.searchButton).toBeVisible();
    await expect(adminPage.addButton).toBeVisible();
  });

  test('TC_ADMIN_002 - search default admin user by username @smoke', async ({ adminPage }) => {
    await adminPage.searchByUsername(admin.defaultAdminUser.username);
    const row = adminPage.rowByUsername(admin.defaultAdminUser.username).first();
    await expect(row).toBeVisible();
    await expect(row).toContainText(admin.defaultAdminUser.role);
    await expect(row).toContainText(admin.defaultAdminUser.status);
  });

  test('TC_ADMIN_003 - search with unknown username shows no records @regression', async ({ adminPage }) => {
    await adminPage.searchByUsername(admin.searchNoMatch);
    await expect(adminPage.recordInfo.first()).toHaveText(admin.messages.noRecords);
  });

   test('TC_ADMIN_004 - reset clears the username filter @regression', async ({ adminPage }) => {
    await adminPage.searchUsernameInput.fill('abc');
    await adminPage.resetButton.click();
    await expect(adminPage.searchUsernameInput).toHaveValue('');
  });

  test('TC_ADMIN_005 - filter users by role Admin @regression', async ({ adminPage }) => {
    await adminPage.filterByRole('Admin');
    await adminPage.searchButton.click();
    await expect(adminPage.rowByUsername(admin.defaultAdminUser.username).first()).toBeVisible();
  });

  test('TC_ADMIN_006 - add user form validates mandatory fields @regression', async ({ adminPage }) => {
    await adminPage.clickAdd();
    await expect(adminPage.addUserHeading).toBeVisible();
    await adminPage.saveButton.click();
    await expect.poll(() => adminPage.fieldErrors.count()).toBeGreaterThanOrEqual(4);
  });

  test('TC_ADMIN_007 - employee created with login is listed with ESS role @regression', async ({ adminPage }) => {
    await adminPage.filterByRole('ESS');
    await adminPage.searchButton.click();
    await expect(adminPage.rowByUsername(admin.defaultESSUser.username).first()).toBeVisible();
    await expect(adminPage.rowByUsername(admin.defaultESSUser.role).first()).toContainText('ESS');
    await expect(adminPage.rowByUsername(admin.defaultESSUser.status).first()).toContainText('Enabled');
  });

});
