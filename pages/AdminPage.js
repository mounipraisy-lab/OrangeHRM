const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');

/** Admin > User Management > Users */
class AdminPage extends BasePage {
  constructor(page) {
    super(page);
    this.path = '/web/index.php/admin/viewSystemUsers';

    this.systemUsersHeading = page.getByRole('heading', { name: 'System Users' });
    this.addUserHeading = page.getByRole('heading', { name: 'Add User' });
    this.searchUsernameInput = this.inputByLabel('Username');
    this.noRecordsText = page.getByText('No Records Found').first();
  }

  async open() {
    await this.goto(this.path);
  }

  async searchByUsername(username) {
    await this.searchUsernameInput.fill(username);
    await this.searchButton.click();
  }

  async filterByRole(role) {
    await this.selectDropdown('User Role', role);
  }

  async filterByStatus(status) {
    await this.selectDropdown('Status', status);
  }

  rowByUsername(username) {
    return this.rowContaining(username);
  }

  async clickAdd() {
    await this.addButton.click();
    await this.page.waitForURL(/admin\/saveSystemUser/);
  }

  /** Add-user form. `employeeName` is typed into the autocomplete and the first hint is picked. */
  async addUser({ role, employeeName, status, username, password }) {
    await this.clickAdd();
    await this.selectDropdown('User Role', role);
    await this.selectAutocomplete('Employee Name', employeeName);
    await this.selectDropdown('Status', status);
    await this.fillByLabel('Username', username);
    await this.fillByLabel('Password', password);
    await this.fillByLabel('Confirm Password', password);
    await this.saveButton.click();
  }

  async deleteUser(username) {
    await this.open();
    await this.searchByUsername(username);
    const row = this.rowByUsername(username);
    await expect(row).toBeVisible();
    await this.deleteRow(row);
  }
}

module.exports = AdminPage;
