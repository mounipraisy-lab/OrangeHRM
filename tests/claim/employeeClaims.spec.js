const { test, expect } = require('../../fixtures/baseTest');
const { readJson } = require('../../utils/commonUtils');

const claim = readJson('test-data/claim.json');

test.describe('Claim - Employee Claims list', () => {
  test.beforeEach(async ({ claimPage }) => {
    await claimPage.open();
  });

  test('TC_CLAIM_001 - employee claims page is displayed @smoke', async ({ claimPage }) => {
    await expect(claimPage.page).toHaveURL(/claim\/viewAssignClaim/);
    await expect(claimPage.employeeClaimsHeading).toBeVisible();
    await expect(claimPage.searchButton).toBeVisible();
    await expect(claimPage.resetButton).toBeVisible();
    await expect(claimPage.assignClaimButton).toBeVisible();
  });

  test('TC_CLAIM_002 - all filter fields are displayed @regression', async ({ claimPage }) => {
    for (const label of claim.filterLabels) {
      await expect(claimPage.groupByLabel(label)).toBeVisible();
    }
  });

  test('TC_CLAIM_003 - include filter defaults to current employees only @regression', async ({ claimPage }) => {
    await expect(claimPage.includeValue).toHaveText(claim.defaultInclude);
  });

  test('TC_CLAIM_004 - include filter lists all options @regression', async ({ claimPage }) => {
    await claimPage.openIncludeOptions();
    for (const option of claim.includeOptions) {
      await expect(claimPage.selectOptions.filter({ hasText: option })).toBeVisible();
    }
  });

  test('TC_CLAIM_005 - status filter lists all claim statuses @regression', async ({ claimPage }) => {
    await claimPage.groupByLabel('Status').locator('.oxd-select-text').click();
    for (const status of claim.statuses) {
      await expect(claimPage.selectOptions.filter({ hasText: status })).toBeVisible();
    }
  });

  for (const status of claim.statuses) {
    test(`TC_CLAIM_006 - filter by status "${status}" returns a result summary @regression`, async ({ claimPage }) => {
      await claimPage.filterByStatus(status);
      await claimPage.searchButton.click();
      await expect(claimPage.recordInfo.first()).toHaveText(/Record(s)? Found|No Records Found/);
    });
  }

  test('TC_CLAIM_007 - unknown reference id shows no records @regression', async ({ claimPage }) => {
    await claimPage.searchByReferenceId(claim.unknownReferenceId);
    await expect(claimPage.recordInfo.first()).toHaveText(claim.messages.noRecords);
  });

  test('TC_CLAIM_008 - reset clears the filters @regression', async ({ claimPage }) => {
    await claimPage.referenceIdInput.fill('12345');
    await claimPage.filterByStatus('Submitted');
    await claimPage.resetBtn.click();
    await expect(claimPage.referenceIdInput).toHaveValue('');
    await expect(claimPage.groupByLabel('Status').locator('.oxd-select-text-input')).toHaveText('-- Select --');
  });

  test('TC_CLAIM_009 - result table shows the expected columns @regression', async ({ claimPage }) => {
    await claimPage.searchButton.click();
    test.skip(
      (await claimPage.getRecordInfoText()).includes('No Records Found'),
      'No claims exist on the demo right now'
    );
    for (const column of claim.tableColumns) {
      await expect(claimPage.columnHeaders.filter({ hasText: column })).toBeVisible();
    }
  });

  test('TC_CLAIM_010 - view details opens the claim @regression', async ({ claimPage }) => {
    await claimPage.searchButton.click();
    test.skip(
      (await claimPage.getRecordInfoText()).includes('No Records Found'),
      'No claims exist on the demo right now'
    );
    await claimPage.viewDetailsButtons.first().click();
    await expect(claimPage.page).toHaveURL(/claim\/.*\/id\/\d+/);
  });

  test('TC_CLAIM_011 - assign claim button opens the assign claim form @smoke', async ({ claimPage, assignClaimPage }) => {
    await claimPage.clickAssignClaim();
    await expect(assignClaimPage.assignClaimHeading).toBeVisible();
  });
});
