const { test, expect } = require('../../fixtures/baseTest');
const { readJson } = require('../../utils/commonUtils');

const data = readJson('test-data/dashboard.json');

test.describe('Dashboard', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.open();
  });

  test('TC_DASH_001 - dashboard heading is displayed @smoke', async ({ dashboardPage }) => {
    await expect(dashboardPage.dashboardHeading).toBeVisible();
    await expect(dashboardPage.page).toHaveURL(/dashboard\/index/);
  });

  for (const widget of data.widgets) {
    test(`TC_DASH_002 - widget "${widget}" is displayed @regression`, async ({ dashboardPage }) => {
      await expect(dashboardPage.widgetByTitle(widget)).toBeVisible();
    });
  }

  test('TC_DASH_003 - logged in user name is shown in the header @smoke', async ({ dashboardPage }) => {
    await expect(dashboardPage.userName).not.toBeEmpty();
  });

  test('TC_DASH_004 - user dropdown lists About, Change Password and Logout @regression', async ({ dashboardPage }) => {
    await dashboardPage.userDropdown.click();
    await expect(dashboardPage.aboutMenuItem).toBeVisible();
    await expect(dashboardPage.changePasswordMenuItem).toBeVisible();
    await expect(dashboardPage.logoutMenuItem).toBeVisible();
  });

  test('TC_DASH_005 - sidebar search filters the menu @regression', async ({ sidebar }) => {
    await sidebar.search(data.sidebarSearch.term);
    await expect(sidebar.menuItems).toHaveCount(1);
    await expect(sidebar.menuItem(data.sidebarSearch.expectedItem)).toBeVisible();
  });
});
