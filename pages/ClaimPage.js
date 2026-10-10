const BasePage = require('./BasePage');

/** Claim > Employee Claims (list/search page, URL: /claim/viewAssignClaim) */
class ClaimPage extends BasePage {
  constructor(page) {
    super(page);
    this.path = '/web/index.php/claim/viewAssignClaim';

    this.employeeClaimsHeading = page.getByRole('heading', { name: 'Employee Claims' });
    this.assignClaimButton = page.getByRole('button', { name: 'Assign Claim' });
    this.referenceIdInput = this.inputByLabel('Reference Id');
    this.fromDateInput = this.inputByLabel('From Date');
    this.toDateInput = this.inputByLabel('To Date');
    this.viewDetailsButtons = page.getByRole('button', { name: 'View Details' });
    this.columnHeaders = page.locator('.oxd-table-header .oxd-table-header-cell');
    this.includeValue = this.groupByLabel('Include').locator('.oxd-select-text-input');
  }

  async open() {
    await this.goto(this.path);
  }

  async searchByEmployee(name) {
    await this.selectAutocomplete('Employee Name', name);
    await this.searchButton.click();
  }

  async searchByReferenceId(referenceId) {
    await this.referenceIdInput.fill(referenceId);
    await this.searchButton.click();
  }

  async filterByEvent(event) {
    await this.selectDropdown('Event Name', event);
  }

  async filterByStatus(status) {
    await this.selectDropdown('Status', status);
  }

  async filterByInclude(option) {
    await this.selectDropdown('Include', option);
  }

  async openIncludeOptions() {
    await this.groupByLabel('Include').locator('.oxd-select-text').click();
  }

  async reset() {
    await this.resetButton.click();
  }

  async clickAssignClaim() {
    await this.assignClaimButton.click();
    await this.page.waitForURL(/claim\/assignClaim/);
  }
}

module.exports = ClaimPage;
