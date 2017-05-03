import React from 'react'
import Immutable from 'immutable'
import { withRouter } from 'react-router'
import { Navbar } from 'react-bootstrap' // Button, Input

import GlobalLoadingBar from '../components/header/global-loading-bar'
import LogoItem from '../components/header/logo-item'
import AccountSelectorItem from '../components/header/account-selector-item'
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
      router,
      user,
      params
    } = this.props

    let className = 'header'
    if (this.props.className) {
      className = className + ' ' + this.props.className
    }

    return (
      <Navbar className={className} fixedTop={true} fluid={true}>
        <GlobalLoadingBar fetching={fetching} />

        <div className="header__content">
          <ul className="header__left nav navbar-nav">
            <LogoItem user={this.props.user} />
            <AccountSelectorItem params={params} activeAccount={activeAccount} router={router}/>
            <BreadcrumbsItem
              activeGroup={activeGroup}
              params={params}
              pathname={pathname}
              router={router}
              user={user}
            />
          </ul>
          <ul className="header__right nav navbar-nav navbar-right">
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
  router: React.PropTypes.object,
  theme: React.PropTypes.string,
  user: React.PropTypes.instanceOf(Immutable.Map)
}

export default withRouter(Header)
