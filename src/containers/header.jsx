import React from 'react'
import Immutable from 'immutable'
import { withRouter } from 'react-router'
import { Navbar } from 'react-bootstrap' // Button, Input

import GlobalLoadingBar from '../components/header/global-loading-bar'
import LogoItem from '../components/header/logo-item'
import AccountSelector from '../components/global-account-selector/global-account-selector'
import BreadcrumbsItem from '../components/header/breadcrumbs-item'
import UserMenu from '../components/header/user-menu'

class Header extends React.Component {
  constructor(props) {
    super(props)

    this.handleThemeChange = this.handleThemeChange.bind(this)
    this.toggleUserMenu = this.toggleUserMenu.bind(this)

    this.state = {
      userMenuOpen: false
    }
  }

  handleThemeChange(value) {
    this.props.handleThemeChange(value)
  }

  toggleUserMenu() {
    this.setState({userMenuOpen: !this.state.userMenuOpen})
  }

  render() {
    const {
      activeAccount,
      activeGroup,
      fetching,
      pathname,
      roles,
      router,
      user,
      params,
      params: { account, brand }
    } = this.props

    let className = 'header'
    if(this.props.className) {
      className = className + ' ' + this.props.className
    }

    return (
      <Navbar className={className} fixedTop={true} fluid={true}>
        <GlobalLoadingBar fetching={fetching} />

        <div className="header__content">
          <ul className="header__left nav navbar-nav">
            <LogoItem user={this.props.user} />
            {/* <AccountSelector params={this.props.params}>
              asdsdasdsad
            </AccountSelector> */}
            <BreadcrumbsItem
              activeGroup={activeGroup}
              params={params}
              pathname={pathname}
              roles={roles}
              router={router}
              user={user}
            />
          </ul>
          <ul className="header__right nav navbar-nav navbar-right">
            {/* Hide in 1.0 UDNP-1409
            <li>
              <Button className="btn-header btn-icon btn-round btn-alerts">
                <IconAlerts />
                <span className="btn-alerts-indicator" />
              </Button>
            </li>
            <li>
              <Button className="btn-header btn-icon btn-round btn-help"><IconQuestionMark /></Button>
            </li>
            <li>
              <Input className="header-search-input"
                type="text" placeholder="Search" />
            </li>
            */}
            <li>
              <UserMenu
                handleThemeChange={this.handleThemeChange}
                logout={this.props.logOut}
                onToggle={this.toggleUserMenu}
                open={this.state.userMenuOpen}
                params={this.props.params}
                theme={this.props.theme}
                user={user}
              />
            </li>
          </ul>
        </div>
      </Navbar>
    );
  }
}

Header.displayName = 'Header'

Header.defaultProps = {
  activeAccount: Immutable.Map(),
  activeGroup: Immutable.Map(),
  user: Immutable.Map()
}

Header.propTypes = {
  activeAccount: React.PropTypes.instanceOf(Immutable.Map),
  activeGroup: React.PropTypes.instanceOf(Immutable.Map),
  className: React.PropTypes.string,
  fetching: React.PropTypes.bool,
  handleThemeChange: React.PropTypes.func,
  logOut: React.PropTypes.func,
  params: React.PropTypes.object,
  pathname: React.PropTypes.string,
  roles: React.PropTypes.instanceOf(Immutable.List),
  router: React.PropTypes.object,
  theme: React.PropTypes.string,
  user: React.PropTypes.instanceOf(Immutable.Map)
}

export default withRouter(Header)
