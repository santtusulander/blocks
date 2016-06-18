module.exports = {

  before : (client) => {
    client.resizeWindow(1440, 900);
  },

  'Log in': (client) => {
    const loginPage = client.page.loginPage();

    loginPage
      .navigate()
      .login('test', 'test');
  },

  'Is Brand Content Summary page': (client) => {
    const accountsPage = client.page.accountsPage();

    accountsPage
      .waitForElementVisible('@pageHeader')
      .expect.element('@pageHeader')
      .text.to.contain('BRAND CONTENT SUMMARY');

    accountsPage
      .expect.element('@pageTitle')
      .text.to.contain('ACCOUNTS');
  },

  //todo: Figure out a way how to test this
  //'Sort accounts Traffic High to Low': (client) => {
  //},
  //'Sort accounts Traffic Low to High': (client) => {
  //},

  'Sort accounts Name A to Z': (client) => {
    const accountsPage = client.page.accountsPage();

    accountsPage
      .click('@sortDropdown')
      .expect.element('.btn-toolbar .dropdown-menu li:nth-of-type(3) a')
      .text.to.contain('Name A to Z');

    accountsPage
      .click('.btn-toolbar .dropdown-menu li:nth-of-type(3) a')
      .expect.element('@sortDropdown')
      .text.to.contain('Name A to Z');

    accountsPage
      .expect.element('@firstAmoebaTitle')
      .text.to.contain('Account1');

    accountsPage
      .expect.element('@lastAmoebaTitle')
      .text.to.contain('Viacom');
  },

  'Sort accounts Name Z to A': (client) => {
    const accountsPage = client.page.accountsPage();

    accountsPage
      .click('@sortDropdown')
      .expect.element('.btn-toolbar .dropdown-menu li:nth-of-type(4) a')
      .text.to.contain('Name Z to A');

    accountsPage
      .click('.btn-toolbar .dropdown-menu li:nth-of-type(4) a')
      .expect.element('@sortDropdown')
      .text.to.contain('Name Z to A');

    accountsPage
      .expect.element('@firstAmoebaTitle')
      .text.to.contain('Viacom');

    accountsPage
      .expect.element('@lastAmoebaTitle')
      .text.to.contain('Account1');
  },

  'Change to list view': (client) => {
    const accountsPage = client.page.accountsPage();

    accountsPage
      .click('.btn-toolbar button:nth-of-type(3)');

    accountsPage
      .expect.element('.main-container')
      .to.not.have.attribute('class')
      .which.contains('chart-view');
  },

  'Change to chart view': (client) => {
    const accountsPage = client.page.accountsPage();

    accountsPage
      .click('.btn-toolbar button:nth-of-type(2)')
      .expect.element('.main-container')
      .to.have.attribute('class')
      .which.contains('chart-view');
  },

  'Hovering over an amoeba shows traffic tooltip': (client) => {
    const accountsPage = client.page.accountsPage();

    client.pause(500, function() {
      console.log('Waited for transitions to finish');
    });

    accountsPage
      .expect.element('.content-item-chart-tooltip').to.not.be.present;

    accountsPage
      .moveToElement('@viacomAmoeba', 10, 10);

    accountsPage
      .expect.element('.content-item-chart-tooltip').to.be.present;
  },

  'Click on an amoeba': (client) => {
    const headerPage = client.page.headerPage();
    const accountsPage = client.page.accountsPage();
    const groupsPage = client.page.groupsPage();

    accountsPage
      .click('@viacomAmoeba');

    groupsPage
      .expect.element('@pageHeader')
      .text.to.contain('ACCOUNT CONTENT SUMMARY');

    groupsPage
      .expect.element('@pageTitle')
      .text.to.contain('VIACOM');

    headerPage
      .click('@content');
  },

  'Click analytics icon on an amoeba': (client) => {
    const accountsPage = client.page.accountsPage();
    const analyticsPage = client.page.analyticsPage();

    accountsPage
      .waitForElementVisible('@viacomAmoeba')
      .moveToElement('@viacomAmoeba', 10, 10)
      .click('.content-item-toolbar .btn-toolbar a');

    analyticsPage
      .expect.element('@pageHeader')
      .text.to.contain('ACCOUNT TRAFFIC OVERVIEW');
  },

  'Log out': (client) => {
    const headerPage = client.page.headerPage();
    const loginPage = client.page.loginPage();

    headerPage
      .click('@userMenu')
      .click('@logOut');

    loginPage
      .expect.element('.login-header')
      .text.to.contain('Log In');
  },

  after : (client) => {
    client.end();
  }
};
