module.exports = {

  before : (client) => {
    client.resizeWindow(1440, 900);
  },

  'Log in and navigate to page': (client) => {
    const loginPage = client.page.loginPage();
    const groupsPage = client.page.groupsPage();
    const accountsPage = client.page.accountsPage();

    loginPage
      .navigate()
      .login('test', 'test');

    accountsPage
      .waitForElementVisible('@pageHeader');

    groupsPage
      .navigate();
  },

  'Is Account Content Summary page for Viacom': (client) => {
    const groupsPage = client.page.groupsPage();

    groupsPage
      .expect.element('@pageHeader')
      .text.to.contain('ACCOUNT CONTENT SUMMARY');

    groupsPage
      .expect.element('@pageTitle')
      .text.to.contain('VIACOM');
  },

  'Click analytics icon': (client) => {
    const groupsPage = client.page.groupsPage();
    const analyticsPage = client.page.analyticsPage();

    groupsPage
      .click('@analyticsIcon');

    analyticsPage
      .expect.element('@pageHeader')
      .text.to.contain('ACCOUNT TRAFFIC OVERVIEW');

    groupsPage
      .navigate();
  },

  'Sort accounts Name A to Z': (client) => {
    const groupsPage = client.page.groupsPage();

    groupsPage
      .waitForElementVisible('@sortDropdown')
      .click('@sortDropdown')
      .expect.element('.btn-toolbar .dropdown-menu li:nth-of-type(3) a')
      .text.to.contain('Name A to Z');

    groupsPage
      .click('.btn-toolbar .dropdown-menu li:nth-of-type(3) a')
      .expect.element('@sortDropdown')
      .text.to.contain('Name A to Z');

    groupsPage
      .expect.element('@firstAmoebaTitle')
      .text.to.contain('Comedy Central');

    groupsPage
      .expect.element('@lastAmoebaTitle')
      .text.to.contain('Nickelodeon');
  },

  'Sort accounts Name Z to A': (client) => {
    const groupsPage = client.page.groupsPage();

    groupsPage
      .click('@sortDropdown')
      .expect.element('.btn-toolbar .dropdown-menu li:nth-of-type(4) a')
      .text.to.contain('Name Z to A');

    groupsPage
      .click('.btn-toolbar .dropdown-menu li:nth-of-type(4) a')
      .expect.element('@sortDropdown')
      .text.to.contain('Name Z to A');

    groupsPage
      .expect.element('@firstAmoebaTitle')
      .text.to.contain('Nickelodeon');

    groupsPage
      .expect.element('@lastAmoebaTitle')
      .text.to.contain('Comedy Central');
  },

  //todo: Figure out a way how to test this
  //'Sort accounts Traffic High to Low': (client) => {
  //},
  //'Sort accounts Traffic Low to High': (client) => {
  //},

  'Change to list view': (client) => {
    const groupsPage = client.page.groupsPage();

    groupsPage
      .click('.btn-toolbar button:nth-of-type(3)');

    groupsPage
      .expect.element('.main-container')
      .to.not.have.attribute('class')
      .which.contains('chart-view');
  },

  'Change to chart view': (client) => {
    const groupsPage = client.page.groupsPage();

    groupsPage
      .click('.btn-toolbar button:nth-of-type(2)')
      .expect.element('.main-container')
      .to.have.attribute('class')
      .which.contains('chart-view');
  },

  'Breadcrumbs exists': (client) => {
    const groupsPage = client.page.groupsPage();

    groupsPage
      .expect.element('.breadcrumb').to.be.present;

    groupsPage
      .expect.element('@firstBreadcrumbItem')
      .text.to.contain('VIACOM');

    groupsPage
      .expect.element('@firstBreadcrumbItem')
      .to.have.attribute('class')
      .which.contains('active');
  },

  'Hovering over an amoeba shows traffic tooltip': (client) => {
    const groupsPage = client.page.groupsPage();

    client.pause(500, function() {
      console.log('Waited for transitions to finish');
    });

    groupsPage
      .expect.element('.content-item-chart-tooltip').to.not.be.present;

    groupsPage
      .moveToElement('@nickelodeonAmoeba', 10, 10);

    groupsPage
      .expect.element('.content-item-chart-tooltip').to.be.present;
  },

  'Click on an amoeba': (client) => {
    const groupsPage = client.page.groupsPage();
    const hostsPage = client.page.hostsPage();

    groupsPage
      .click('@nickelodeonAmoeba');

    hostsPage
      .expect.element('@pageHeader')
      .text.to.contain('GROUP CONTENT SUMMARY');

    hostsPage
      .expect.element('@pageTitle')
      .text.to.contain('NICKELODEON');

    groupsPage
      .navigate();
  },

  'Click analytics icon on an amoeba': (client) => {
    const groupsPage = client.page.groupsPage();
    const analyticsPage = client.page.analyticsPage();

    groupsPage
      .waitForElementVisible('@nickelodeonAmoeba')
      .moveToElement('@nickelodeonAmoeba', 10, 10)
      .click('.content-item-toolbar .btn-toolbar a');

    analyticsPage
      .expect.element('@pageHeader')
      .text.to.contain('GROUP TRAFFIC OVERVIEW');
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
