module.exports = {

  before : (client) => {
    client.resizeWindow(1440, 900);
  },

  'Log in and navigate to page': (client) => {
    const loginPage = client.page.loginPage();
    const hostsPage = client.page.hostsPage();
    const accountsPage = client.page.accountsPage();

    loginPage
      .navigate()
      .login('test', 'test');

    accountsPage
      .waitForElementVisible('@pageHeader');

    hostsPage
      .navigate();
  },

  'Is Group Content Summary page for Viacom': (client) => {
    const groupsPage = client.page.groupsPage();

    groupsPage
      .expect.element('@pageHeader')
      .text.to.contain('GROUP CONTENT SUMMARY');

    groupsPage
      .expect.element('@pageTitle')
      .text.to.contain('NICKELODEON');
  },

  'Click analytics icon': (client) => {
    const hostsPage = client.page.hostsPage();
    const analyticsPage = client.page.analyticsPage();

    hostsPage
      .click('@analyticsIcon');

    analyticsPage
      .expect.element('@pageHeader')
      .text.to.contain('GROUP TRAFFIC OVERVIEW');

    hostsPage
      .navigate();
  },

  'Open Add Property modal': (client) => {
    const hostsPage = client.page.hostsPage();
    const addPropertyModal = client.page.addPropertyModal();

    hostsPage
      .waitForElementVisible('@addPropertyIcon')
      .click('@addPropertyIcon');

    addPropertyModal
      .expect.element('@modalHeader')
      .text.to.contain('Add Property');

    addPropertyModal
      .expect.element('@modalTitle')
      .text.to.contain('Viacom / Nickelodeon');
  },

  'Close Add Property modal': (client) => {
    const hostsPage = client.page.hostsPage();
    const addPropertyModal = client.page.addPropertyModal();

    hostsPage
      .expect.element('body')
      .to.have.attribute('class')
      .which.contains('modal-open');

    addPropertyModal
      .click('@cancel');

    hostsPage
      .expect.element('body')
      .to.not.have.attribute('class')
      .which.contains('modal-open');
  },

  // Creating/Deleting a property is not supported/working
  /*
  'Create new trial property': (client) => {
    const hostsPage = client.page.hostsPage();
    const addPropertyModal = client.page.addPropertyModal();

    hostsPage
      .click('@addPropertyIcon');

    addPropertyModal
      .setValue('@hostname', 'testhost.com')
      .click('@save');
  },
  */


  /*
  'Create new production property': (client) => {
    const hostsPage = client.page.hostsPage();
    const addPropertyModal = client.page.addPropertyModal();

    hostsPage
      .click('@addPropertyIcon');

    addPropertyModal
      .setValue('@hostname', 'testhost.com')
      .click('@production');

    addPropertyModal
      .click('@save');
  },
  */

  //todo: Figure out a way how to test this
  //'Sort accounts Traffic High to Low': (client) => {
  //},
  //'Sort accounts Traffic Low to High': (client) => {
  //},

  'Sort accounts Name A to Z': (client) => {
    const hostsPage = client.page.hostsPage();

    hostsPage
      .click('@sortDropdown')
      .expect.element('.btn-toolbar .dropdown-menu li:nth-of-type(3) a')
      .text.to.contain('Name A to Z');

    hostsPage
      .click('.btn-toolbar .dropdown-menu li:nth-of-type(3) a')
      .expect.element('@sortDropdown')
      .text.to.contain('Name A to Z');

    hostsPage
      .expect.element('@firstAmoebaTitle')
      .text.to.contain('fooobarcom2.com');

    hostsPage
      .expect.element('@lastAmoebaTitle')
      .text.to.contain('www.spongebobsquarepants.com');
  },

  'Sort accounts Name Z to A': (client) => {
    const hostsPage = client.page.hostsPage();

    hostsPage
      .click('@sortDropdown')
      .expect.element('.btn-toolbar .dropdown-menu li:nth-of-type(4) a')
      .text.to.contain('Name Z to A');

    hostsPage
      .click('.btn-toolbar .dropdown-menu li:nth-of-type(4) a')
      .expect.element('@sortDropdown')
      .text.to.contain('Name Z to A');

    hostsPage
      .expect.element('@firstAmoebaTitle')
      .text.to.contain('www.spongebobsquarepants.com');

    hostsPage
      .expect.element('@lastAmoebaTitle')
      .text.to.contain('fooobarcom2.com');
  },

  'Change to list view': (client) => {
    const hostsPage = client.page.hostsPage();

    hostsPage
      .click('.btn-toolbar button:nth-of-type(3)');

    hostsPage
      .expect.element('.main-container')
      .to.not.have.attribute('class')
      .which.contains('chart-view');
  },

  'Change to chart view': (client) => {
    const hostsPage = client.page.hostsPage();

    hostsPage
      .click('.btn-toolbar button:nth-of-type(2)')
      .expect.element('.main-container')
      .to.have.attribute('class')
      .which.contains('chart-view');
  },

  'Breadcrumbs exists': (client) => {
    const hostsPage = client.page.hostsPage();

    hostsPage
      .expect.element('.breadcrumb').to.be.present;

    hostsPage
      .expect.element('@firstBreadcrumbItem')
      .text.to.contain('VIACOM');

    hostsPage
      .expect.element('@firstBreadcrumbItem')
      .to.not.have.attribute('class')
      .which.contains('active');
  },

  'Hovering over an amoeba shows traffic tooltip': (client) => {
    const hostsPage = client.page.hostsPage();

    hostsPage
      .expect.element('.content-item-chart-tooltip').to.not.be.present;

    hostsPage
      .moveToElement('@stimpyAmoeba', 10, 10);

    hostsPage
      .expect.element('.content-item-chart-tooltip').to.be.present;
  },

  'Click on an amoeba': (client) => {
    const hostsPage = client.page.hostsPage();
    const propertyPage = client.page.propertyPage();

    hostsPage
      .click('@stimpyAmoeba');

    propertyPage
      .expect.element('@pageHeader')
      .text.to.contain('PROPERTY SUMMARY');

    propertyPage
      .expect.element('@selectedProperty')
      .text.to.contain('WWW.RENANDSTIMPY.COM');

    hostsPage
      .navigate();
  },

  'Click analytics icon on an amoeba': (client) => {
    const hostsPage = client.page.hostsPage();
    const analyticsPage = client.page.analyticsPage();

    hostsPage
      .waitForElementVisible('@stimpyAmoeba')
      .moveToElement('@stimpyAmoeba', 10, 10);

    hostsPage
      .click('@amoebaAnalyticsIcon');

    analyticsPage
      .expect.element('@pageHeader')
      .text.to.contain('PROPERTY TRAFFIC OVERVIEW');

    hostsPage
      .navigate();
  },

  'Click configurations icon on an amoeba': (client) => {
    const hostsPage = client.page.hostsPage();
    const configurationsPage = client.page.configurationsPage();

    hostsPage
      .waitForElementVisible('@stimpyAmoeba')
      .moveToElement('@stimpyAmoeba', 10, 10);

    hostsPage
      .click('@amoebaConfigurationsIcon');

    configurationsPage
      .expect.element('@pageHeader')
      .text.to.contain('WWW.RENANDSTIMPY.COM');

    configurationsPage
      .expect.element('.breadcrumb > li:last-of-type')
      .to.have.attribute('class').which.contains('active');

    configurationsPage
      .expect.element('.breadcrumb > li:last-of-type')
      .text.to.contain('CONFIGURATION');

    hostsPage
      .navigate();
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
