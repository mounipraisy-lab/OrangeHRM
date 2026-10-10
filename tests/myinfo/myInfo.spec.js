const { test, expect } = require('../../fixtures/baseTest');
const { readJson, randomString, capitalize } = require('../../utils/commonUtils');

const data = readJson('test-data/myinfo.json');

test.describe('My Info', () => {
  test.beforeEach(async ({ myInfoPage }) => {
    await myInfoPage.open();
  });

  test('TC_MYINFO_001 - personal details are displayed for the logged in user @smoke', async ({ myInfoPage }) => {
    await expect(myInfoPage.personalDetailsHeading).toBeVisible();
    await expect(myInfoPage.firstNameInput).not.toHaveValue('');
    await expect(myInfoPage.lastNameInput).not.toHaveValue('');
  });

  test('TC_MYINFO_002 - profile tabs are available @regression', async ({ myInfoPage }) => {
    for (const tab of ['Personal Details', 'Contact Details', 'Emergency Contacts', 'Job', 'Salary']) {
      await expect(myInfoPage.tab(tab)).toBeVisible();
    }
  });

  test('TC_MYINFO_003 - update middle name and restore it @regression', async ({ myInfoPage }) => {
    const original = await myInfoPage.middleNameInput.inputValue();
    const updated = capitalize(randomString(6));

    await myInfoPage.updateMiddleName(updated);
    await myInfoPage.expectToast(data.updatedMessage);

    await myInfoPage.open(); // reload and verify persistence
    await expect(myInfoPage.middleNameInput).toHaveValue(updated);

    // restore the original value so the shared demo data is unchanged
    await myInfoPage.updateMiddleName(original);
    await myInfoPage.expectToast(data.updatedMessage);
  });

  test('TC_MYINFO_004 - first name is mandatory @regression', async ({ myInfoPage }) => {
    await myInfoPage.firstNameInput.fill('');
    await myInfoPage.personalDetailsSave.click();
    await myInfoPage.expectFieldError('Required');
  });
});
