import React from 'react'
import Immutable from 'immutable'
import { Dropdown, MenuItem } from 'react-bootstrap'

import Select from '../select'

import { FormattedMessage } from 'react-intl' 

const UserMenu = ({open, onToggle, theme, handleThemeChange, logout, user}) => {
  return (
    <Dropdown id="user-menu" pullRight={true}
              open={open}
              onToggle={onToggle}>
      <Dropdown.Toggle className="btn-icon btn-round btn-user-menu"
                       noCaret={true} id="user-dropdown">
      </Dropdown.Toggle>
      <Dropdown.Menu className="dropdown-user-menu">
        <li className="dropdown-user-menu-container">
          <ul>
            <MenuItem header={true} className="dropdown-main-header">
              {user.size &&
                <div id="user-menu-username" className="user-menu-item menu-item-name">
                  {user.get('first_name') && user.get('last_name') ?
                    user.get('first_name') + ' ' + user.get('last_name')
                  : user.get('email')}
                </div>
              }
            </MenuItem>
            <li className="menu-item-theme">
              <div className="menuitem">
                <div className="user-menu-item">
                  <div className="helper-header helper-ui-theme">UI Theme</div>
                  <Select className="btn-block"
                          onSelect={handleThemeChange}
                          value={theme}
                          options={[
                            ['dark', <FormattedMessage id="portal.header.menu.theme.ericssonDark.text"/>],
                            ['light', <FormattedMessage id="portal.header.menu.theme.ericssonLight.text"/>]]}/>
                </div>
              </div>
            </li>
          </ul>
        </li>
        <li className="bottom-item" >
          <a id="log-out" href="#" onClick={logout}>
            <div className="user-menu-item"><FormattedMessage id="portal.header.menu.logout.text"/></div>
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
  theme: React.PropTypes.string,
  user: React.PropTypes.instanceOf(Immutable.Map)
}

export default UserMenu
