const { expect } = require('@playwright/test');
const { exactText } = require('../utils/commonUtils');

/**
 * Common locators and helpers shared by every page of OrangeHRM.
 * OrangeHRM 5 uses the "oxd" design system, so most form controls are
 * located through their visible label.
 */
class BasePage {
  constructor(page) {
    this.page = page;

    // Shared locators
    this.spinner = page.locator('.oxd-loading-spinner');
    this.toast = page.locator('.oxd-toast');
    this.breadcrumb = page.locator('.oxd-topbar-header-breadcrumb');
    this.fieldErrors = page.locator('.oxd-input-field-error-message');
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.resetButton = page.getByRole('button', { name: 'Reset' });
    this.addButton = page.getByRole('button', { name: 'Add' });
    this.confirmDeleteButton = page.getByRole('button', { name: 'Yes, Delete' });
    this.tableRows = page.locator('.oxd-table-body .oxd-table-card');
    this.recordInfo = page.locator('.orangehrm-horizontal-padding .oxd-text--span');
    this.selectOptions = page.locator('.oxd-select-dropdown .oxd-select-option');
    this.autocompleteOptions = page.locator('.oxd-autocomplete-dropdown .oxd-autocomplete-option');
  }

  // ---------- navigation ----------
  async goto(path) {
    await this.page.goto(path);
    await this.waitForLoaded();
  }

  async waitForLoaded() {
    await this.page.waitForLoadState('domcontentloaded');
    await expect(this.spinner).toHaveCount(0);
  }

  heading(name) {
    return this.page.getByRole('heading', { name });
  }

  // ---------- label based form helpers ----------
  groupByLabel(label) {
    return this.page
      .locator('.oxd-input-group')
      .filter({ has: this.page.locator('label', { hasText: exactText(label) }) });
  }

  inputByLabel(label) {
    return this.groupByLabel(label).locator('input');
  }

  async fillByLabel(label, value) {
    const input = this.inputByLabel(label);
    await input.fill('');
    await input.fill(String(value));
  }

  /** Select an option in an OrangeHRM custom dropdown. */
  async selectDropdown(label, option) {
    await this.groupByLabel(label).locator('.oxd-select-text').click();
    await this.selectOptions.filter({ hasText: exactText(option) }).first().click();
  }

  /** Type in an autocomplete input and click the first matching suggestion. */
  async selectAutocomplete(label, text) {
    await this.inputByLabel(label).fill(text);
    const option = this.autocompleteOptions.filter({ hasText: text }).first();
    await option.waitFor({ state: 'visible' });
    await option.click();
  }

  // ---------- messages ----------
  async expectToast(message) {
    await expect(this.toast.first()).toContainText(message);
  }

  async expectFieldError(message, index = 0) {
    await expect(this.fieldErrors.nth(index)).toHaveText(message);
  }

  async expectFieldErrorCount(count) {
    await expect(this.fieldErrors).toHaveCount(count);
  }

  // ---------- tables ----------
  rowContaining(text) {
    return this.tableRows.filter({ hasText: text });
  }

  async deleteRow(row) {
    await row.locator('button:has(.bi-trash)').click();
    await this.confirmDeleteButton.click();
  }

  async getRecordInfoText() {
    return (await this.recordInfo.first().innerText()).trim();
  }
}

module.exports = BasePage;
