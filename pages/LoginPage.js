const BasePage = require('./BasePage');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.path = '/web/index.php/auth/login';

    this.loginTitle = page.getByRole('heading', { name: 'Login' });
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorAlert = page.locator('.oxd-alert-content-text');
    this.forgotPasswordLink = page.locator('.orangehrm-login-forgot-header');
    this.brandingLogo = page.locator('.orangehrm-login-branding img');
    this.resetPasswordHeading = page.getByRole('heading', { name: 'Reset Password' });
  }

  async open() {
    await this.goto(this.path);
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async openForgotPassword() {
    await this.forgotPasswordLink.click();
    await this.page.waitForURL(/requestPasswordResetCode/);
  }
}

module.exports = LoginPage;
