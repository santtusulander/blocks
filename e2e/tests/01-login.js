module.exports = {

  'User Logs in': (client) => {
    const loginPage = client.page.loginPage();
    const brandPage = client.page.brandPage();

    loginPage
      .navigate()
      .login('test', 'test');

    brandPage.expect.element('@pageHeader').text
      .to.contain('BRAND CONTENT SUMMARY');

    client.end();
  }
};
