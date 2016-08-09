import React from 'react'
import { Dropdown, MenuItem } from 'react-bootstrap'

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
  handleThemeChange: React.PropTypes.func,
  logout: React.PropTypes.func,
  onToggle: React.PropTypes.func,
  open: React.PropTypes.bool,
  theme: React.PropTypes.string
}

export default UserMenu
