const { test, expect } = require('../../fixtures/baseTest');
const { readJson } = require('../../utils/commonUtils');
const { buildEmployee } = require('../../utils/dataGenerator');

const data = readJson('test-data/employees.json');
const UNKNOWN_EMPLOYEE_ID = '9999999';

test.describe('PIM - Employee List', () => {
  test('TC_PIM_101 - employee list page is displayed @smoke', async ({ pimPage }) => {
    await pimPage.open();
    await expect(pimPage.employeeListHeading).toBeVisible();
    await expect(pimPage.searchButton).toBeVisible();
    await expect(pimPage.resetButton).toBeVisible();
    await expect(pimPage.addButton).toBeVisible();
  });

  test('TC_PIM_102 - add button opens the add employee form @regression', async ({ pimPage, addEmployeePage }) => {
    await pimPage.open();
    await pimPage.clickAdd();
    await expect(addEmployeePage.addEmployeeHeading).toBeVisible();
  });

  test('TC_PIM_103 - search employee by id @smoke', async ({ pimPage, employee }) => {
    await pimPage.open();
    await pimPage.searchByEmployeeId(employee.employeeId);

    const row = pimPage.rowByEmployeeId(employee.employeeId);
    await expect(row).toHaveCount(1);
    await expect(row).toContainText(employee.firstName);
    await expect(row).toContainText(employee.lastName);
    await expect(pimPage.recordInfo.first()).toContainText('(1) Record Found');
  });

  test('TC_PIM_104 - search employee by name @regression', async ({ pimPage, employee }) => {
    await pimPage.open();
    await pimPage.searchByName(employee.lastName);
    await expect(pimPage.rowByEmployeeId(employee.employeeId)).toBeVisible();
  });

  test('TC_PIM_105 - search with unknown employee id shows no records @regression', async ({ pimPage }) => {
    await pimPage.open();
    await pimPage.searchByEmployeeId(UNKNOWN_EMPLOYEE_ID);
    await expect(pimPage.recordInfo.first()).toHaveText(data.messages.noRecords);
  });

  test('TC_PIM_106 - reset clears the search criteria @regression', async ({ pimPage }) => {
    await pimPage.open();
    await pimPage.employeeIdInput.fill('12345');
    await pimPage.reset();
    await expect(pimPage.employeeIdInput).toHaveValue('');
  });

  test('TC_PIM_107 - delete employee removes it from the list @smoke', async ({ pimPage, addEmployeePage }) => {
    const employee = buildEmployee();
    await addEmployeePage.open();
    await addEmployeePage.addEmployee(employee);

    await pimPage.deleteEmployeeById(employee.employeeId);

    await pimPage.open();
    await pimPage.searchByEmployeeId(employee.employeeId);
    await expect(pimPage.recordInfo.first()).toHaveText(data.messages.noRecords);
  });
});
