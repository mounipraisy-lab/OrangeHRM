const { test, expect } = require('../../fixtures/baseTest');
const { readJson } = require('../../utils/commonUtils');

const dir = readJson('test-data/directory.json');
const summaryRegex = new RegExp(dir.recordSummaryPattern);

test.describe('Directory', () => {
  test.beforeEach(async ({ directoryPage }) => {
    await directoryPage.open();
  });

  test('TC_DIR_001 - directory page is displayed @smoke', async ({ directoryPage }) => {
    await expect(directoryPage.page).toHaveURL(/directory\/viewDirectory/);
    await expect(directoryPage.directoryHeading).toBeVisible();
    await expect(directoryPage.searchButton).toBeVisible();
    await expect(directoryPage.resetButton).toBeVisible();
  });

  test('TC_DIR_002 - all filters are displayed @regression', async ({ directoryPage }) => {
    for (const label of dir.filterLabels) {
      await expect(directoryPage.groupByLabel(label)).toBeVisible();
    }
  });

  test('TC_DIR_003 - record summary is shown on load @regression', async ({ directoryPage }) => {
    await expect(directoryPage.recordSummary).toHaveText(summaryRegex);
  });

  test('TC_DIR_004 - employee cards show name and picture @smoke', async ({ directoryPage }) => {
    await expect(directoryPage.cards.first()).toBeVisible();
    await expect(directoryPage.cardNames.first()).not.toBeEmpty();
    await expect(directoryPage.cardImages.first()).toBeVisible();
  });

  test('TC_DIR_005 - job title and location dropdowns list options @regression', async ({ directoryPage }) => {
    for (const label of ['Job Title', 'Location']) {
      const options = await directoryPage.getDropdownOptions(label);
      expect(options[0]).toBe('-- Select --');
      expect(options.length, `${label} should have options`).toBeGreaterThan(1);
    }
  });

  test('TC_DIR_006 - filter by a job title shows only that job title @smoke', async ({ directoryPage }) => {
    const options = await directoryPage.getDropdownOptions('Job Title');
    const jobTitle = options[1]; // first real option, so the test does not depend on demo data
    await directoryPage.filterByJobTitle(jobTitle);
    await directoryPage.searchButton.click();

    await expect(directoryPage.recordSummary).toHaveText(summaryRegex);
    if ((await directoryPage.recordSummary.innerText()).includes('No Records Found')) return;

    const subtitles = await directoryPage.cardJobTitles.allInnerTexts();
    expect(subtitles.length).toBeGreaterThan(0);
    for (const subtitle of subtitles) expect(subtitle.trim()).toBe(jobTitle);
  });

  test('TC_DIR_007 - filter by a location returns a result summary @regression', async ({ directoryPage }) => {
    const options = await directoryPage.getDropdownOptions('Location');
    await directoryPage.filterByLocation(options[1]);
    await directoryPage.searchButton.click();
    await expect(directoryPage.recordSummary).toHaveText(summaryRegex);
  });

  test('TC_DIR_008 - search by employee name finds the employee @smoke', async ({ directoryPage, employee }) => {
    await directoryPage.searchByEmployeeName(employee.lastName);

    await expect(directoryPage.recordSummary).toContainText(dir.singleRecordText);
    await expect(directoryPage.cards).toHaveCount(1);
    await expect(directoryPage.cardByName(employee.lastName)).toBeVisible();
  });

  test('TC_DIR_009 - typed name that is not picked from suggestions is invalid @regression', async ({ directoryPage }) => {
    await directoryPage.employeeNameInput.fill(dir.invalidNameText);
    await directoryPage.searchButton.click();
    await expect(directoryPage.fieldErrors.first()).toHaveText(dir.invalidMessage);
  });

  test('TC_DIR_010 - reset clears the filters @regression', async ({ directoryPage }) => {
    const options = await directoryPage.getDropdownOptions('Job Title');
    await directoryPage.filterByJobTitle(options[1]);
    await directoryPage.employeeNameInput.fill('abc');
    await directoryPage.reset();

    await expect(directoryPage.employeeNameInput).toHaveValue('');
    await expect(directoryPage.groupByLabel('Job Title').locator('.oxd-select-text-input')).toHaveText('-- Select --');
  });

  test('TC_DIR_011 - clicking a card shows the employee details @regression', async ({ directoryPage, employee }) => {
    await directoryPage.searchByEmployeeName(employee.lastName);
    await directoryPage.openCard(employee.lastName);

    await expect(directoryPage.expandedCard).toBeVisible();
    await expect(directoryPage.expandedCardName).toContainText(employee.lastName);
  });

  test('TC_DIR_012 - directory opens from the sidebar @smoke', async ({ dashboardPage, sidebar, directoryPage }) => {
    await dashboardPage.open();
    await sidebar.navigateTo('Directory');
    await expect(directoryPage.page).toHaveURL(/directory\/viewDirectory/);
    await expect(directoryPage.directoryHeading).toBeVisible();
  });
});
