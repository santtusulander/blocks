module.exports = {

  'Log in': (client) => {
    const loginPage = client.page.loginPage();

    loginPage
      .navigate()
      .login('test', 'test');
  },

  'Open account menu dropdown and select first item': (client) => {
    const headerPage = client.page.headerPage();
    const brandPage = client.page.brandPage();

    client.pause(3500); // Wait for page to load

    headerPage
      .click('@accountMenu')
      .expect.element('.main-nav-item:nth-of-type(1) div').to.have.attribute('class').which.contains('open');

    client.expect.element('.dropdown-account-menu li:nth-of-type(1) a').text.to.contain('FooBar');

    headerPage
      .click('.dropdown-account-menu li:first-of-type');

    brandPage
      .expect.element('@pageTitle').text.to.contain('FooBar');
  },

  'Selected item should have active class in account menu dropdown': (client) => {
    const headerPage = client.page.headerPage();

    headerPage
      .expect.element('.dropdown-account-menu li:nth-of-type(1) a').to.have.attribute('class').which.contains('active');
  },

  'Navigate to Content': (client) => {
    const headerPage = client.page.headerPage();
    const brandPage = client.page.brandPage();

    headerPage
      .click('@content');

    brandPage
      .expect.element('@pageTitle').text.to.contain('Accounts');
  },

  /*
  'Earlier selected item should not have active class in account menu dropdown': (client) => {
    const headerPage = client.page.headerPage();

    headerPage
      .expect.element('.dropdown-account-menu li:nth-of-type(1) a').to.not.have.attribute('class').which.contains('active');
  },
  */

  'Navigate to security page': (client) => {
    const headerPage = client.page.headerPage();
    const securityPage = client.page.securityPage();

    headerPage
      .click('@security');

    securityPage
      .expect.element('@pageHeader').text.to.contain('Security');
  },

  'Navigate to services page': (client) => {
    const headerPage = client.page.headerPage();
    const servicesPage = client.page.servicesPage();

    headerPage
      .click('@services');

    servicesPage
      .expect.element('@pageHeader').text.to.contain('Services');
  },

  /*
  'Tests for alerts': (client) => {

  }
   */

    /*
   'Tests for help': (client) => {

   }
   */

  /*
   'Tests for search': (client) => {

   }
  */

  'Open user menu': (client) => {
    const headerPage = client.page.headerPage();

    headerPage
      .click('@userMenu')
      .expect.element('.navbar-right li:nth-of-type(4) div').to.have.attribute('class').which.contains('open');
  },

  'Check username': (client) => {
    const headerPage = client.page.headerPage();

    headerPage
      .expect.element('@username').text.to.contain('test');
  },

  'Change to light theme': (client) => {
    const headerPage = client.page.headerPage();

    headerPage
      .changeTheme()
      .expect.element('body').to.have.attribute('class').which.contains('light-theme');
  },

  'Change to dark theme': (client) => {
    const headerPage = client.page.headerPage();

    headerPage
      .changeTheme()
      .expect.element('body').to.have.attribute('class').which.contains('dark-theme');
  },

  'Go to account management': (client) => {
    const headerPage = client.page.headerPage();
    const accountManagementPage = client.page.accountManagementPage();

    headerPage
      .click('@accountManagement')
      .expect.element('@accountManagement').to.have.attribute('class').which.contains('active');

    accountManagementPage
      .expect.element('@pageHeader').text.to.contain('UDN Admin Account');

  },

  'Click Ericsson logo': (client) => {
    const headerPage = client.page.headerPage();
    const brandPage = client.page.brandPage();

    headerPage
      .click('.navbar-brand');

    brandPage
      .expect.element('@pageTitle').text.to.contain('Accounts');
  },

  'Log out': (client) => {
    const headerPage = client.page.headerPage();
    const loginPage = client.page.loginPage();

    headerPage
      .click('@userMenu')
      .click('@logOut');

    loginPage
      .expect.element('.login-header').text.to.contain('Log In');

    client.end();
  }
};
