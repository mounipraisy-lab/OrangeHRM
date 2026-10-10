const { test, expect } = require('../../fixtures/baseTest');
const { readJson } = require('../../utils/commonUtils');

const leave = readJson('test-data/leave.json');

test.describe('Leave', () => {
  test('TC_LEAVE_001 - leave list page shows its filters @smoke', async ({ leavePage }) => {
    await leavePage.openLeaveList();
    await expect(leavePage.leaveListHeading).toBeVisible();
    for (const label of leave.filterLabels) {
      await expect(leavePage.labelLocator(label)).toBeVisible();
    }
    await expect(leavePage.searchButton).toBeVisible();
    await expect(leavePage.resetButton).toBeVisible();
  });

  test('TC_LEAVE_002 - searching the leave list returns a result summary @regression', async ({ leavePage }) => {
    await leavePage.openLeaveList();
    await leavePage.filterByStatus(leave.statusToFilter);
    await leavePage.search();
    await expect(leavePage.recordInfo.first()).toHaveText(/Record(s)? Found|No Records Found/);
  });

  test('TC_LEAVE_003 - apply leave page opens @regression', async ({ leavePage }) => {
    await leavePage.openApplyLeave();
    await expect(leavePage.applyLeaveHeading).toBeVisible();
    // Either the form is shown or the account has no leave balance
    await expect(leavePage.applyButton.or(leavePage.noLeaveTypesMessage).first()).toBeVisible();
  });

  test('TC_LEAVE_004 - leave entitlements page opens @regression', async ({ leavePage }) => {
    await leavePage.openEntitlements();
    await expect(leavePage.entitlementsHeading).toBeVisible();
  });
});
