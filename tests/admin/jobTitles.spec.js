const { test, expect } = require('../../fixtures/baseTest');
const { readJson } = require('../../utils/commonUtils');
const { buildJobTitle } = require('../../utils/dataGenerator');

const admin = readJson('test-data/admin.json');

test.describe('Admin - Job Titles', () => {
  test('TC_JOB_001 - job titles list is displayed @smoke', async ({ jobTitlesPage }) => {
    await jobTitlesPage.openList();
    await expect(jobTitlesPage.jobTitlesHeading).toBeVisible();
    await expect(jobTitlesPage.addButton).toBeVisible();
  });

  test('TC_JOB_002 - job title is mandatory @regression', async ({ jobTitlesPage }) => {
    await jobTitlesPage.openAddForm();
    await expect(jobTitlesPage.addJobTitleHeading).toBeVisible();
    await jobTitlesPage.saveButton.click();
    await jobTitlesPage.expectFieldErrorCount(1);
    await jobTitlesPage.expectFieldError(admin.messages.required);
  });

  test('TC_JOB_003 - create, edit and delete a job title @smoke', async ({ jobTitlesPage }) => {
    const job = buildJobTitle();
    const updatedTitle = `${job.title}${admin.jobTitle.updatedSuffix}`;

    // create
    await jobTitlesPage.addJobTitle(job);
    await jobTitlesPage.expectToast(admin.messages.saved);
    await expect(jobTitlesPage.page).toHaveURL(/admin\/viewJobTitleList/);
    await expect(jobTitlesPage.rowByTitle(job.title)).toBeVisible();

    // edit
    await jobTitlesPage.editJobTitle(job.title, updatedTitle);
    await jobTitlesPage.expectToast(admin.messages.updated);
    await expect(jobTitlesPage.rowByTitle(updatedTitle)).toBeVisible();

    // delete
    await jobTitlesPage.deleteJobTitle(updatedTitle);
    await jobTitlesPage.expectToast(admin.messages.deleted);
    await expect(jobTitlesPage.rowByTitle(updatedTitle)).toHaveCount(0);
  });

  test('TC_JOB_004 - duplicate job title is rejected @regression', async ({ jobTitlesPage }) => {
    const job = buildJobTitle();
    await jobTitlesPage.addJobTitle(job);
    await jobTitlesPage.expectToast(admin.messages.saved);

    await jobTitlesPage.openAddForm();
    await jobTitlesPage.jobTitleInput.fill(job.title);
    await expect(
      jobTitlesPage.fieldErrors.filter({ hasText: admin.messages.alreadyExists })
    ).toBeVisible();

    await jobTitlesPage.deleteJobTitle(job.title); // cleanup
  });
});
