const BasePage = require('./BasePage');
const { exactText } = require('../utils/commonUtils');

class DashboardPage extends BasePage {
  constructor(page) {
    super(page);
    this.path = '/web/index.php/dashboard/index';

    this.dashboardHeading = page.getByRole('heading', { name: 'Dashboard' });
    this.widgets = page.locator('.orangehrm-dashboard-widget');
    this.widgetTitles = page.locator('.orangehrm-dashboard-widget-name');
    this.userDropdown = page.locator('.oxd-userdropdown-tab');
    this.userName = page.locator('.oxd-userdropdown-name');
    this.logoutMenuItem = page.getByRole('menuitem', { name: 'Logout' });
    this.aboutMenuItem = page.getByRole('menuitem', { name: 'About' });
    this.changePasswordMenuItem = page.getByRole('menuitem', { name: 'Change Password' });
  }

  async open() {
    await this.goto(this.path);
  }

  widgetByTitle(title) {
    return this.widgetTitles.filter({ hasText: exactText(title) });
  }

  async logout() {
    await this.userDropdown.click();
    await this.logoutMenuItem.click();
    await this.page.waitForURL(/auth\/login/);
  }
}

module.exports = DashboardPage;
