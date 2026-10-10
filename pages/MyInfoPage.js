const BasePage = require('./BasePage');

/** My Info > Personal Details of the logged in user. */
class MyInfoPage extends BasePage {
  constructor(page) {
    super(page);
    this.path = '/web/index.php/pim/viewMyDetails';

    this.personalDetailsHeading = page.getByRole('heading', { name: 'Personal Details' });
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.middleNameInput = page.locator('input[name="middleName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.employeeFullName = page.locator('.orangehrm-edit-employee-name h6');
    this.tabs = page.locator('.orangehrm-tabs-item');
    this.personalDetailsSave = page.getByRole('button', { name: 'Save' }).first();
  }

  async open() {
    await this.goto(this.path);
    await this.firstNameInput.waitFor({ state: 'visible' });
    // the form is populated asynchronously
    await this.page.waitForFunction(() => {
      const el = document.querySelector('input[name="firstName"]');
      return el && el.value.length > 0;
    });
  }

  async updateMiddleName(value) {
    await this.middleNameInput.fill(value);
    await this.personalDetailsSave.click();
  }

  tab(name) {
    return this.tabs.filter({ hasText: name });
  }
}

module.exports = MyInfoPage;
