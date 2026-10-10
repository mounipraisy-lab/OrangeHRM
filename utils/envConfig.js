const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const { readJson } = require('./commonUtils');

const users = readJson('test-data/users.json');

module.exports = {
  baseURL: process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com',
  adminUsername: process.env.ADMIN_USERNAME || users.admin.username,
  adminPassword: process.env.ADMIN_PASSWORD || users.admin.password,
  authFile: 'playwright/.auth/admin.json',
};
