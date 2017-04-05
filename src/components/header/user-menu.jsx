import React from 'react'
import Immutable from 'immutable'
import { Dropdown, MenuItem } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router'

import { getUserUrlFromParams } from '../../util/routes'
import Select from '../shared/form-elements/select'
import IconUser from '../shared/icons/icon-user'
import IconArrowRight from '../shared/icons/icon-arrow-right'
import TruncatedTitle from '../truncated-title'

import { AVAILABLE_THEMES } from '../../constants/themes'

class UserMenu extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.open !== nextProps.open) {
      return true
    } else if (this.props.theme !== nextProps.theme) {
      return true
    } else if (!Immutable.is(this.props.user, nextProps.user)) {
      return true
    } else if (JSON.stringify(this.props.params) !== JSON.stringify(nextProps.params)) {
      return true
    }

    return false
  }

  render() {
    const {
      open,
      onToggle,
      theme,
      handleThemeChange,
      logout,
      user,
      params
    } = this.props

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
                  <div id="user-menu-username">
                    <TruncatedTitle
                      content={user.get('first_name') && user.get('last_name') ?
                        user.get('first_name') + ' ' + user.get('last_name')
                      : user.get('email')}
                      tooltipPlacement="bottom"/>
                  </div>
                }
              </MenuItem>

              <li>
                <Select
                  className="btn-block"
                  onSelect={handleThemeChange}
                  value={theme}
                  options={AVAILABLE_THEMES.map((singleTheme) =>
                    [singleTheme,
                      <div>
                        <span className="helper-header helper-ui-theme text-sm">
                          <FormattedMessage id="portal.header.menu.theme.title"/>
                        </span>
                        <span className="theme-title">
                          <FormattedMessage id="portal.header.menu.theme.ericssonTitle.text" values={{themeTitle: singleTheme}}/>
                        </span>
                      </div>
                    ])
                  }/>
              </li>

              <li className="no-helper-header" >
                <Link to={getUserUrlFromParams(params)} onClick={onToggle}>
                  <div className="user-menu-item">
                    <FormattedMessage id="portal.header.menu.editProfile.text"/>
                    <IconArrowRight />
                  </div>
                </Link>
              </li>

              <li className="bottom-item no-helper-header">
                <a id="log-out" onClick={logout}>
                  <FormattedMessage id="portal.header.menu.logout.text"/>
                  <IconArrowRight />
                </a>
              </li>
            </ul>
          </li>
        </Dropdown.Menu>
      </Dropdown>
    )
  }
}

UserMenu.displayName = "UserMenu"
UserMenu.propTypes = {
  handleThemeChange: React.PropTypes.func,
  logout: React.PropTypes.func,
  onToggle: React.PropTypes.func,
  open: React.PropTypes.bool,
  params: React.PropTypes.object,
  theme: React.PropTypes.string,
  user: React.PropTypes.instanceOf(Immutable.Map)
}

export default UserMenu
