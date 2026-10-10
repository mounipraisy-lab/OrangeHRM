const BasePage = require('./BasePage');

/** Claim > Assign Claim form (URL: /claim/assignClaim) */
class AssignClaimPage extends BasePage {
  constructor(page) {
    super(page);
    this.path = '/web/index.php/claim/assignClaim';

    this.assignClaimHeading = page.getByRole('heading', { name: 'Create Claim Request' }).or(
      page.getByRole('heading', { name: 'Assign Claim' })
    );
    this.employeeNameInput = this.inputByLabel('Employee Name');
    this.remarksTextarea = this.groupByLabel('Remarks').locator('textarea');
    this.createButton = page.getByRole('button', { name: 'Create' });
  }

  async open() {
    await this.goto(this.path);
  }

  async assignClaim({ employeeName, event, currency, remarks }) {
    await this.selectAutocomplete('Employee Name', employeeName);
    await this.selectDropdown('Event', event);
    await this.selectDropdown('Currency', currency);
    if (remarks) await this.remarksTextarea.fill(remarks);
    await this.createButton.click();
  }
}

module.exports = AssignClaimPage;
