const BasePage = require('./BasePage');
const { exactText } = require('../utils/commonUtils');

/** Left hand side navigation present on every logged-in page. */
class SidebarMenu extends BasePage {
  constructor(page) {
    super(page);
    this.menuItems = page.locator('a.oxd-main-menu-item');
    this.searchInput = page.locator('.oxd-main-menu-search input');
    this.collapseButton = page.locator('.oxd-main-menu-button, .oxd-sidepanel-header button').first();
  }

  menuItem(name) {
    return this.menuItems.filter({ hasText: exactText(name) });
  }

  async navigateTo(name) {
    await this.menuItem(name).click();
    await this.waitForLoaded();
  }

  async search(term) {
    await this.searchInput.fill(term);
  }
}

module.exports = SidebarMenu;
