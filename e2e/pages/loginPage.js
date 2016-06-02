const loginCommands = {
  login(user, pass) {
    return this
      .waitForElementVisible('@userInput')
      .setValue('@userInput', user)
      .setValue('@passInput', pass)
      .waitForElementVisible('@loginButton')
      .click('@loginButton')
  }
};

module.exports = {
  url: 'http://localhost:3000/login',
  commands: [loginCommands],
  elements: {
    userInput: {
      selector: '#username'
    },
    passInput: {
      selector: '#password'
    },
    loginButton: {
      selector: 'button[type=submit]'
    }
  }
};
