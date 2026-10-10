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

  test('TC_PIM_002 - first and last name are mandatory @regression', async ({ addEmployeePage }) => {
    await addEmployeePage.save();
    await addEmployeePage.expectFieldErrorCount(2);
    await addEmployeePage.expectFieldError(data.negative.requiredMessage, 0);
    await addEmployeePage.expectFieldError(data.negative.requiredMessage, 1);
  });

  test('TC_PIM_003 - last name is mandatory @regression', async ({ addEmployeePage }) => {
    await addEmployeePage.fillEmployeeDetails({ firstName: 'OnlyFirst' });
    await addEmployeePage.save();
    await addEmployeePage.expectFieldErrorCount(1);
    await addEmployeePage.expectFieldError(data.negative.requiredMessage);
  });

  test('TC_PIM_004 - password and confirm password must match @regression', async ({ addEmployeePage }) => {
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

  test('TC_PIM_005 - weak password is rejected @regression', async ({ addEmployeePage }) => {
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

  test('TC_PIM_006 - short username is rejected @regression', async ({ addEmployeePage }) => {
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

  test('TC_PIM_007 - cancel returns to the employee list @regression', async ({ addEmployeePage }) => {
    await addEmployeePage.cancelButton.click();
    await expect(addEmployeePage.page).toHaveURL(/pim\/viewEmployeeList/);
  });
});
