const { test, expect } = require('../../fixtures/baseTest');
const { readJson, escapeRegExp } = require('../../utils/commonUtils');

const { menuItems } = readJson('test-data/navigation.json');

test.describe('Sidebar navigation', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.open();
  });

  test('TC_NAV_001 - all expected menu items are visible @smoke', async ({ sidebar }) => {
    for (const item of menuItems) {
      await expect(sidebar.menuItem(item.name)).toBeVisible();
    }
  });

  for (const item of menuItems) {
    test(`TC_NAV_002 - "${item.name}" menu opens the correct module @regression`, async ({ sidebar, page }) => {
      await sidebar.navigateTo(item.name);
      await expect(page).toHaveURL(new RegExp(escapeRegExp(item.urlPart)));
    });
  }
});
