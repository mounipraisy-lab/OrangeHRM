const BasePage = require('./BasePage');

/** Leave module: Leave List, Apply and Entitlements. */
class LeavePage extends BasePage {
  constructor(page) {
    super(page);
    this.leaveListPath = '/web/index.php/leave/viewLeaveList';
    this.applyPath = '/web/index.php/leave/applyLeave';
    this.entitlementsPath = '/web/index.php/leave/viewLeaveEntitlements';

    this.leaveListHeading = page.getByRole('heading', { name: 'Leave List' });
    this.applyLeaveHeading = page.getByRole('heading', { name: 'Apply Leave' });
    this.entitlementsHeading = page.getByRole('heading', { name: 'Leave Entitlements' });
    this.applyButton = page.getByRole('button', { name: 'Apply' });
    this.noLeaveTypesMessage = page.getByText('No Leave Types with Leave Balance');
    this.statusChips = page.locator('.oxd-chip');
    this.clearIcon = page.locator('//i[@class="oxd-icon bi-x --clear"]');
    this.tableHeader = page.locator('//div[@class="orangehrm-header-container"]');
  }

  async openLeaveList() {
    await this.goto(this.leaveListPath);
  }

  async openApplyLeave() {
    await this.goto(this.applyPath);
  }

  async openEntitlements() {
    await this.goto(this.entitlementsPath);
  }

  async filterByStatus(status) {
    await this.selectDropdown('Show Leave with Status', status);
  }

  async search() {
    await this.searchButton.click();
  }

  labelLocator(label) {
    return this.groupByLabel(label);
  }
}

module.exports = LeavePage;
