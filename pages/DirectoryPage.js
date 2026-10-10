const BasePage = require('./BasePage');

/** Directory (URL: /directory/viewDirectory) - searchable employee cards */
class DirectoryPage extends BasePage {
  constructor(page) {
    super(page);
    this.path = '/web/index.php/directory/viewDirectory';

    this.directoryHeading = page.getByRole('heading', { name: 'Directory' });
    this.employeeNameInput = this.inputByLabel('Employee Name');
    this.recordSummary = page.getByText(/Records? Found|No Records Found/).first();

    // Employee cards
    this.cards = page.locator('.orangehrm-directory-card');
    this.cardNames = page.locator('.orangehrm-directory-card-header');
    this.cardJobTitles = page.locator('.orangehrm-directory-card-subtitle');
    this.cardImages = page.locator('.orangehrm-directory-card img');
    this.expandedCard = page.locator('.orangehrm-directory-card-expanded');
    this.expandedCardName = this.expandedCard.locator('.orangehrm-directory-card-header');
  }

  async open() {
    await this.goto(this.path);
  }

  cardByName(name) {
    return this.cards.filter({ hasText: name });
  }

  async searchByEmployeeName(name) {
    await this.selectAutocomplete('Employee Name', name);
    await this.searchButton.click();
  }

  async filterByJobTitle(title) {
    await this.selectDropdown('Job Title', title);
  }

  async filterByLocation(location) {
    await this.selectDropdown('Location', location);
  }

  /** Returns the visible options of a dropdown (including "-- Select --") and closes it again. */
  async getDropdownOptions(label) {
    await this.groupByLabel(label).locator('.oxd-select-text').click();
    await this.selectOptions.first().waitFor({ state: 'visible' });
    const options = (await this.selectOptions.allInnerTexts()).map((o) => o.trim());
    await this.page.keyboard.press('Escape');
    return options;
  }

  async openCard(name) {
    await this.cardByName(name).first().click();
  }
}

module.exports = DirectoryPage;
