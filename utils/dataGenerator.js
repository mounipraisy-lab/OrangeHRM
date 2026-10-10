const { readJson, randomString, randomNumber, capitalize } = require('./commonUtils');

const employeeData = readJson('test-data/employees.json');
const adminData = readJson('test-data/admin.json');

/**
 * Build a unique employee so tests never collide on the shared demo site.
 * @param {{withLogin?: boolean, overrides?: object}} options
 */
function buildEmployee({ withLogin = false, overrides = {} } = {}) {
  const t = employeeData.template;
  const suffix = randomString(6);
  const employee = {
    firstName: t.firstName,
    middleName: t.middleName,
    lastName: `${t.lastNamePrefix}${capitalize(suffix)}`,
    employeeId: randomNumber(7),
    ...overrides,
  };
  if (withLogin) {
    employee.login = {
      username: `${t.usernamePrefix}${suffix}${randomNumber(2)}`,
      password: t.password,
      status: 'Enabled',
    };
  }
  return employee;
}

/** Unique job title payload. */
function buildJobTitle() {
  const j = adminData.jobTitle;
  return {
    title: `${j.namePrefix} ${randomString(5)}`,
    description: j.description,
    note: j.note,
  };
}

/** Full name as shown in the PIM table: "First Middle Last". */
function fullName(employee) {
  return [employee.firstName, employee.middleName, employee.lastName].filter(Boolean).join(' ');
}

module.exports = { buildEmployee, buildJobTitle, fullName };
