import React from 'react'

const UserMenu = (theme, handleThemeChange, logout, toggleUserMenu) => {
  return (
    <Dropdown.Menu className="dropdown-user-menu">
      <li className="dropdown-user-menu-container">
        <ul>
          <MenuItem header={true} className="dropdown-main-header">
            <div id="user-menu-username" className="user-menu-item">test</div>
          </MenuItem>
          <MenuItem eventKey="1">
            <div className="user-menu-item">
              <div className="helper-header">Company</div>
              Ericsson
            </div>
          </MenuItem>
          <MenuItem eventKey="2">
            <div className="user-menu-item">
              <div className="helper-header">Role</div>
              UDN Admin
            </div>
          </MenuItem>
          <li className="menu-item-theme">
            <div className="menuitem">
              <div className="user-menu-item">
                <div className="helper-header helper-ui-theme">UI Theme</div>
                <Select className="btn-block"
                        onSelect={handleThemeChange}
                        value={theme}
                        options={[
                          ['dark', 'Ericsson Dark Theme'],
                          ['light', 'Ericsson Light Theme']]}/>
              </div>
            </div>
          </li>
          <li>
            <Link
              id="account-management"
              to={`/account-management`} activeClassName="active"
              onClick={toggleUserMenu}>
              <div className="user-menu-item">
                Account Management
              </div>
            </Link>
          </li>
        </ul>
      </li>
      <li className="bottom-item" eventKey="5">
        <a id="log-out" href="#" onClick={logOut}>
          <div className="user-menu-item">Log Out</div>
        </a>
      </li>
    </Dropdown.Menu>
  );
}

export default UserMenu