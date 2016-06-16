module.exports = {

  before : (client) => {
    client.resizeWindow(1440, 900);
  },

  'User Logs in': (client) => {
    const loginPage = client.page.loginPage();
    const accountsPage = client.page.accountsPage();

    loginPage
      .navigate()
      .login('test', 'test');

    accountsPage.expect.element('@pageHeader')
      .text.to.contain('BRAND CONTENT SUMMARY');
  },

  after : (client) => {
    client.end();
  }
};
