import React from 'react'
import { Dropdown, MenuItem } from 'react-bootstrap'
import { Link } from 'react-router'

import Select from '../select'

const UserMenu = ({open, onToggle, theme, handleThemeChange, logout}) => {
  return (
    <Dropdown id="user-menu" pullRight={true}
              open={open}
              onToggle={onToggle}>
      <Dropdown.Toggle bsStyle="primary"
                       className="btn-icon btn-round btn-user-menu"
                       noCaret={true} id="user-dropdown">
      </Dropdown.Toggle>
      <Dropdown.Menu className="dropdown-user-menu">
        <li className="dropdown-user-menu-container">
          <ul>
            <MenuItem header={true} className="dropdown-main-header">
              <div id="user-menu-username" className="user-menu-item">UDN Admin</div>
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
                Account Management
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
                onClick={onToggle}>
                <div className="user-menu-item">
                  Account Management
                </div>
              </Link>
            </li>
          </ul>
        </li>
        <li className="bottom-item" >
          <a id="log-out" href="#" onClick={logout}>
            <div className="user-menu-item">Log Out</div>
          </a>
        </li>
      </Dropdown.Menu>
    </Dropdown>
  );
}

UserMenu.propTypes = {
  open: React.PropTypes.bool,
  onToggle: React.PropTypes.func,
  theme: React.PropTypes.string,
  handleThemeChange: React.PropTypes.func,
  logout: React.PropTypes.func
}

export default UserMenu
