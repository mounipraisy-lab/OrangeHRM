# OrangeHRM – Playwright (JavaScript) Automation Framework

UI automation for the OrangeHRM demo app (https://opensource-demo.orangehrmlive.com) using
**Playwright Test + JavaScript (CommonJS)** and the **Page Object Model**.

## Project structure

```
├── pages/                 # Page objects – ALL locators and page actions live here
│   ├── BasePage.js        # shared locators + label based form helpers, toast, table helpers
│   ├── LoginPage.js
│   ├── DashboardPage.js
│   ├── SidebarMenu.js
│   ├── PimPage.js         # Employee list / search / delete
│   ├── AddEmployeePage.js
│   ├── AdminPage.js       # System users
│   ├── JobTitlesPage.js
│   ├── LeavePage.js
│   └── MyInfoPage.js
├── test-data/             # ALL input data (JSON): users, employees, admin, leave, navigation...
├── utils/
│   ├── commonUtils.js     # readJson, randomString, randomNumber, exactText, retry, date helpers
│   ├── dataGenerator.js   # builds unique employees / job titles
│   └── envConfig.js       # BASE_URL + credentials (env overridable)
├── fixtures/baseTest.js   # page-object fixtures + auto create/cleanup employee fixtures
├── tests/
│   ├── setup/auth.setup.js        # logs in once, saves session
│   ├── login/ dashboard/ navigation/ pim/ admin/ leave/ myinfo/ e2e/
└── playwright.config.js
```

## Getting started

```bash
npm install
npx playwright install --with-deps chromium
cp .env.example .env        # optional
npm test                    # run everything
npm run test:smoke          # only @smoke tests
npm run test:regression     # only @regression tests
npm run test:ui             # Playwright UI mode
npm run report              # open the HTML report
```

## Design notes

- **Login once**: the `setup` project logs in and stores the session; all other specs reuse it.
  Specs that need a clean session (login, e2e) override `storageState`.
- **Self-cleaning data**: tests create uniquely named employees / job titles and delete them again.
  The `employee` and `employeeWithLogin` fixtures do this automatically.
- **Tags**: `@smoke`, `@regression` in test titles. Test IDs follow `TC_<MODULE>_<NNN>`.
- **Shared demo site**: the public demo is shared and reset periodically, so worker count is low
  and retries are enabled. Locators were written for OrangeHRM 5.x – if the vendor changes the UI,
  update them in `pages/` only.
