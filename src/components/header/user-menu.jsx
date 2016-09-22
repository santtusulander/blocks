import React from 'react'
import Immutable from 'immutable'
import { Dropdown, MenuItem } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router'

import Select from '../select'

import IconUser from '../icons/icon-user.jsx'

const UserMenu = ({open, onToggle, theme, handleThemeChange, logout, user}) => {
  return (
    <Dropdown id="user-menu" pullRight={true}
              open={open}
              onToggle={onToggle}>
      <Dropdown.Toggle className="btn-icon btn-round btn-user-menu"
                       noCaret={true} id="user-dropdown">
        <IconUser/>
      </Dropdown.Toggle>
      <Dropdown.Menu className="dropdown-user-menu">
        <li>
          <ul>
            <MenuItem header={true}>
              {user.size &&
                <span id="user-menu-username">
                  {user.get('first_name') && user.get('last_name') ?
                    user.get('first_name') + ' ' + user.get('last_name')
                  : user.get('email')}
                </span>
              }
            </MenuItem>

            <li>
              <Select
                className="btn-block"
                onSelect={handleThemeChange}
                value={theme}
                options={[
                  ['dark',
                  <div>
                    <span className="helper-header helper-ui-theme text-sm">
                      <FormattedMessage id="portal.header.menu.theme.title"/>
                    </span>
                    <FormattedMessage id="portal.header.menu.theme.ericssonDark.text"/>
                  </div>],
                  ['light',
                  <div>
                    <span className="helper-header helper-ui-theme text-sm">
                      <FormattedMessage id="portal.header.menu.theme.title"/>
                    </span>
                    <FormattedMessage id="portal.header.menu.theme.ericssonLight.text"/>
                  </div>]
                ]}
              />
            </li>

            <li className="no-helper-header" >
              <Link to={'/user'} onClick={onToggle}>
                <div className="user-menu-item"><FormattedMessage id="portal.header.menu.editProfile.text"/></div>
              </Link>
            </li>

            <li className="bottom-item no-helper-header">
              <a id="log-out" href="#" onClick={logout}>
                <FormattedMessage id="portal.header.menu.logout.text"/>
              </a>
            </li>
          </ul>
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
