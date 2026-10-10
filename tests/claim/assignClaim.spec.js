const { test, expect } = require('../../fixtures/baseTest');
const { readJson } = require('../../utils/commonUtils');

const claim = readJson('test-data/claim.json');

test.describe('Claim - Assign Claim', () => {
  test.beforeEach(async ({ assignClaimPage }) => {
    await assignClaimPage.open();
  });

  test('TC_CLAIM_101 - assign claim form is displayed @smoke', async ({ assignClaimPage }) => {
    await expect(assignClaimPage.page).toHaveURL(/claim\/assignClaim/);
    await expect(assignClaimPage.assignClaimHeading).toBeVisible();
    await expect(assignClaimPage.employeeNameInput).toBeVisible();
    await expect(assignClaimPage.groupByLabel('Event')).toBeVisible();
    await expect(assignClaimPage.groupByLabel('Currency')).toBeVisible();
    await expect(assignClaimPage.remarksTextarea).toBeVisible();
    await expect(assignClaimPage.createButton).toBeVisible();
    await expect(assignClaimPage.cancelButton).toBeVisible();
  });

  test('TC_CLAIM_102 - employee, event and currency are mandatory @regression', async ({ assignClaimPage }) => {
    await assignClaimPage.createButton.click();
    await assignClaimPage.expectFieldErrorCount(3);
    for (let i = 0; i < 3; i += 1) {
      await assignClaimPage.expectFieldError(claim.messages.required, i);
    }
  });

  test('TC_CLAIM_103 - employee name must be picked from the suggestions @regression', async ({ assignClaimPage }) => {
    await assignClaimPage.employeeNameInput.fill('NoSuchEmployeeZzz');
    await assignClaimPage.selectDropdown('Event', claim.newClaim.event);
    await assignClaimPage.selectDropdown('Currency', claim.newClaim.currency);
    await assignClaimPage.createButton.click();
    await expect(assignClaimPage.fieldErrors.first()).toBeVisible();
    await expect(assignClaimPage.page).toHaveURL(/claim\/assignClaim$/);
  });

  test('TC_CLAIM_104 - cancel returns to the employee claims list @regression', async ({ assignClaimPage }) => {
    await assignClaimPage.cancelButton.click();
    await expect(assignClaimPage.page).toHaveURL(/claim\/viewAssignClaim/);
  });

});
