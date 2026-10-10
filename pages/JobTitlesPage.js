const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');

/** Admin > Job > Job Titles */
class JobTitlesPage extends BasePage {
  constructor(page) {
    super(page);
    this.listPath = '/web/index.php/admin/viewJobTitleList';
    this.addPath = '/web/index.php/admin/saveJobTitle';

    this.jobTitlesHeading = page.getByRole('heading', { name: 'Job Titles' });
    this.addJobTitleHeading = page.getByRole('heading', { name: 'Add Job Title' });
    this.editJobTitleHeading = page.getByRole('heading', { name: 'Edit Job Title' });
    this.jobTitleInput = this.inputByLabel('Job Title');
    this.descriptionTextarea = page.getByPlaceholder('Type description here');
    this.noteTextarea = page.getByPlaceholder('Add note');
  }

  async openList() {
    await this.goto(this.listPath);
  }

  async openAddForm() {
    await this.goto(this.addPath);
  }

  rowByTitle(title) {
    return this.rowContaining(title);
  }

  async addJobTitle({ title, description, note }) {
    await this.openAddForm();
    await this.jobTitleInput.fill(title);
    if (description) await this.descriptionTextarea.fill(description);
    if (note) await this.noteTextarea.fill(note);
    await this.saveButton.click();
  }

  async editJobTitle(currentTitle, newTitle) {
    await this.rowByTitle(currentTitle).locator('button:has(.bi-pencil-fill)').click();
    await this.page.waitForURL(/admin\/saveJobTitle\/\d+/);
    await expect(this.jobTitleInput).toHaveValue(currentTitle);
    await this.jobTitleInput.fill(newTitle);
    await this.saveButton.click();
  }

  async deleteJobTitle(title) {
    await this.openList();
    const row = this.rowByTitle(title);
    await expect(row).toBeVisible();
    await this.deleteRow(row);
  }
}

module.exports = JobTitlesPage;
