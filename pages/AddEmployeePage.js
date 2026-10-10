const BasePage = require('./BasePage');

/** PIM > Add Employee */
class AddEmployeePage extends BasePage {
  constructor(page) {
    super(page);
    this.path = '/web/index.php/pim/addEmployee';

    this.addEmployeeHeading = page.getByRole('heading', { name: 'Add Employee' });
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.middleNameInput = page.locator('input[name="middleName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.employeeIdInput = this.inputByLabel('Employee Id');
    this.createLoginSwitch = page.locator('.oxd-switch-input');
    this.usernameInput = this.inputByLabel('Username');
    this.passwordInput = this.inputByLabel('Password');
    this.confirmPasswordInput = this.inputByLabel('Confirm Password');
    this.enabledRadio = page.locator('.oxd-radio-wrapper', { hasText: 'Enabled' });
    this.disabledRadio = page.locator('.oxd-radio-wrapper', { hasText: 'Disabled' });
    this.personalDetailsHeading = page.getByRole('heading', { name: 'Personal Details' });
    this.employeeFullName = page.locator('.orangehrm-edit-employee-name h6');
  }

  async open() {
    await this.goto(this.path);
  }

  async fillEmployeeDetails({ firstName, middleName, lastName, employeeId }) {
    if (firstName !== undefined) await this.firstNameInput.fill(firstName);
    if (middleName !== undefined) await this.middleNameInput.fill(middleName);
    if (lastName !== undefined) await this.lastNameInput.fill(lastName);
    if (employeeId !== undefined) {
      await this.employeeIdInput.fill('');
      await this.employeeIdInput.fill(employeeId);
    }
  }

  async fillLoginDetails({ username, password, confirmPassword, status = 'Enabled' }) {
    if (!(await this.createLoginSwitch.isChecked())) {
      await this.page.locator('.oxd-switch-wrapper').click();
    }
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(confirmPassword ?? password);
    if (status === 'Disabled') await this.disabledRadio.click();
    else await this.enabledRadio.click();
  }

  async save() {
    await this.saveButton.click();
  }

  /** Fill the whole form (with optional login details), save and wait for the profile page. */
  async addEmployee(employee) {
    await this.fillEmployeeDetails(employee);
    if (employee.login) await this.fillLoginDetails(employee.login);
    await this.save();
    await this.page.waitForURL(/pim\/viewPersonalDetails/);
    await this.waitForLoaded();
  }
}

module.exports = AddEmployeePage;
