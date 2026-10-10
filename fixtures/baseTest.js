const base = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const DashboardPage = require('../pages/DashboardPage');
const SidebarMenu = require('../pages/SidebarMenu');
const PimPage = require('../pages/PimPage');
const AddEmployeePage = require('../pages/AddEmployeePage');
const AdminPage = require('../pages/AdminPage');
const JobTitlesPage = require('../pages/JobTitlesPage');
const LeavePage = require('../pages/LeavePage');
const MyInfoPage = require('../pages/MyInfoPage');
const ClaimPage = require('../pages/ClaimPage');
const AssignClaimPage = require('../pages/AssignClaimPage');
const DirectoryPage = require('../pages/DirectoryPage');
const { buildEmployee } = require('../utils/dataGenerator');

/**
 * Custom `test` object:
 *  - page objects are available as fixtures (no `new Page()` inside tests)
 *  - `employee` / `employeeWithLogin` create an employee through the UI before the test
 *    and delete it again afterwards, so the shared demo data stays clean.
 */
async function provideEmployee({ addEmployeePage, pimPage }, use, withLogin) {
  const employee = buildEmployee({ withLogin });
  await addEmployeePage.open();
  await addEmployeePage.addEmployee(employee);

  await use(employee);

  try {
    await pimPage.deleteEmployeeById(employee.employeeId);
  } catch (error) {
    console.warn(`Cleanup failed for employee ${employee.employeeId}: ${error.message}`);
  }
}

const test = base.test.extend({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  dashboardPage: async ({ page }, use) => use(new DashboardPage(page)),
  sidebar: async ({ page }, use) => use(new SidebarMenu(page)),
  pimPage: async ({ page }, use) => use(new PimPage(page)),
  addEmployeePage: async ({ page }, use) => use(new AddEmployeePage(page)),
  adminPage: async ({ page }, use) => use(new AdminPage(page)),
  jobTitlesPage: async ({ page }, use) => use(new JobTitlesPage(page)),
  leavePage: async ({ page }, use) => use(new LeavePage(page)),
  myInfoPage: async ({ page }, use) => use(new MyInfoPage(page)),
  claimPage: async ({ page }, use) => use(new ClaimPage(page)),
  assignClaimPage: async ({ page }, use) => use(new AssignClaimPage(page)),
  directoryPage: async ({ page }, use) => use(new DirectoryPage(page)),

  employee: async ({ addEmployeePage, pimPage }, use) =>
    provideEmployee({ addEmployeePage, pimPage }, use, false),
  employeeWithLogin: async ({ addEmployeePage, pimPage }, use) =>
    provideEmployee({ addEmployeePage, pimPage }, use, true),
});

module.exports = { test, expect: base.expect };
