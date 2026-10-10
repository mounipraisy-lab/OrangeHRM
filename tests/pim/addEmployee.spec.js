const { test, expect } = require('../../fixtures/baseTest');
const { readJson } = require('../../utils/commonUtils');
const { buildEmployee } = require('../../utils/dataGenerator');

const data = readJson('test-data/employees.json');

test.describe('PIM - Add Employee', () => {
  test.beforeEach(async ({ addEmployeePage }) => {
    await addEmployeePage.open();
  });

  test('TC_PIM_001 - add employee form is displayed with an auto generated id @smoke', async ({ addEmployeePage }) => {
    await expect(addEmployeePage.addEmployeeHeading).toBeVisible();
    await expect(addEmployeePage.firstNameInput).toBeVisible();
    await expect(addEmployeePage.lastNameInput).toBeVisible();
    await expect(addEmployeePage.employeeIdInput).not.toHaveValue('');
  });

  test('TC_PIM_002 - add employee with mandatory and optional details @smoke', async ({ addEmployeePage, pimPage }) => {
    const employee = buildEmployee();
    await addEmployeePage.addEmployee(employee);

    await addEmployeePage.expectToast(data.messages.saved);
    await expect(addEmployeePage.personalDetailsHeading).toBeVisible();
    await expect(addEmployeePage.employeeFullName).toContainText(`${employee.firstName} ${employee.lastName}`);

    await pimPage.deleteEmployeeById(employee.employeeId); // cleanup
  });

  test('TC_PIM_003 - add employee with login details @regression', async ({ addEmployeePage, pimPage }) => {
    const employee = buildEmployee({ withLogin: true });
    await addEmployeePage.addEmployee(employee);

    await addEmployeePage.expectToast(data.messages.saved);
    await expect(addEmployeePage.employeeFullName).toContainText(employee.lastName);

    await pimPage.deleteEmployeeById(employee.employeeId); // cleanup
  });

  test('TC_PIM_004 - first and last name are mandatory @regression', async ({ addEmployeePage }) => {
    await addEmployeePage.save();
    await addEmployeePage.expectFieldErrorCount(2);
    await addEmployeePage.expectFieldError(data.negative.requiredMessage, 0);
    await addEmployeePage.expectFieldError(data.negative.requiredMessage, 1);
  });

  test('TC_PIM_005 - last name is mandatory @regression', async ({ addEmployeePage }) => {
    await addEmployeePage.fillEmployeeDetails({ firstName: 'OnlyFirst' });
    await addEmployeePage.save();
    await addEmployeePage.expectFieldErrorCount(1);
    await addEmployeePage.expectFieldError(data.negative.requiredMessage);
  });

  test('TC_PIM_006 - password and confirm password must match @regression', async ({ addEmployeePage }) => {
    const employee = buildEmployee({ withLogin: true });
    await addEmployeePage.fillEmployeeDetails(employee);
    await addEmployeePage.fillLoginDetails({
      username: employee.login.username,
      password: data.negative.mismatchPassword.password,
      confirmPassword: data.negative.mismatchPassword.confirmPassword,
    });
    await addEmployeePage.save();
    await expect(
      addEmployeePage.fieldErrors.filter({ hasText: data.negative.mismatchPassword.message })
    ).toBeVisible();
  });

  test('TC_PIM_007 - weak password is rejected @regression', async ({ addEmployeePage }) => {
    const employee = buildEmployee({ withLogin: true });
    await addEmployeePage.fillEmployeeDetails(employee);
    await addEmployeePage.fillLoginDetails({
      username: employee.login.username,
      password: data.negative.shortPassword.password,
    });
    await addEmployeePage.save();
    await expect(
      addEmployeePage.fieldErrors.filter({ hasText: data.negative.shortPassword.message }).first()
    ).toBeVisible();
  });

  test('TC_PIM_008 - short username is rejected @regression', async ({ addEmployeePage }) => {
    const employee = buildEmployee({ withLogin: true });
    await addEmployeePage.fillEmployeeDetails(employee);
    await addEmployeePage.fillLoginDetails({
      username: data.negative.shortUsername.username,
      password: employee.login.password,
    });
    await addEmployeePage.save();
    await expect(
      addEmployeePage.fieldErrors.filter({ hasText: data.negative.shortUsername.message })
    ).toBeVisible();
  });

  test('TC_PIM_009 - cancel returns to the employee list @regression', async ({ addEmployeePage }) => {
    await addEmployeePage.cancelButton.click();
    await expect(addEmployeePage.page).toHaveURL(/pim\/viewEmployeeList/);
  });
});
