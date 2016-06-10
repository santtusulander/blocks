const headerCommands = {
  changeTheme() {
    return this
      .click('.menu-item-theme .dropdown-select > button')
      .click('.menu-item-theme .dropdown-menu > li:not(.hidden)');
  }
};

module.exports = {
  commands: [headerCommands],
  elements: {
    accountMenu: {
      selector: '#account-menu'
    },
    userMenu: {
      selector: '#user-menu'
    },
    username: {
      selector: '#user-menu-username'
    },
    accountManagement: {
      selector: '#account-management'
    },
    logOut: {
      selector: '#log-out'
    },
    //themeDropdown: {
    //  selector: '.menu-item-theme > button'
    //},
    content: {
      selector: '#content-link'
    },
    configurations: {
      selector: '#configurations-link'
    },
    security: {
      selector: '#security-link'
    },
    services: {
      selector: '#services-link'
    },
    purge: {
      selector: '#purge-link'
    }
  }
};
