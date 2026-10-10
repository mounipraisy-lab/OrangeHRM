const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');

/** PIM > Employee List */
class PimPage extends BasePage {
  constructor(page) {
    super(page);
    this.path = '/web/index.php/pim/viewEmployeeList';

    this.employeeListHeading = page.getByRole('heading', { name: 'Employee Information' });
    this.employeeNameInput = this.inputByLabel('Employee Name');
    this.employeeIdInput = this.inputByLabel('Employee Id');
    this.noRecordsToast = page.getByText('No Records Found').first();
  }

  async open() {
    await this.goto(this.path);
  }

  async clickAdd() {
    await this.addButton.click();
    await this.page.waitForURL(/pim\/addEmployee/);
  }

  async searchByEmployeeId(employeeId) {
    await this.employeeIdInput.fill(employeeId);
    await this.searchButton.click();
  }

  async searchByName(name) {
    await this.employeeNameInput.fill(name);
    await this.searchButton.click();
  }

  async reset() {
    await this.resetButton.click();
  }

  /** Row whose "Id" column contains the employee id. */
  rowByEmployeeId(employeeId) {
    return this.rowContaining(employeeId);
  }

  async deleteEmployeeById(employeeId) {
    await this.open();
    await this.searchByEmployeeId(employeeId);
    const row = this.rowByEmployeeId(employeeId);
    await expect(row).toBeVisible();
    await this.deleteRow(row);
    await this.expectToast('Successfully Deleted');
  }
}

module.exports = PimPage;
