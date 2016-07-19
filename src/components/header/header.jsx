import React from 'react'
import Immutable from 'immutable'
import { Link } from 'react-router'

import { getRoute } from '../routes.jsx'
import Select from '../components/select'
import UserMenu from './user-menu'
import IconAlerts from '../components/icons/icon-alerts.jsx'
import IconEricsson from './icons/icon-ericsson.jsx'
import { Breadcrumbs } from '../components/breadcrumbs/breadcrumbs.jsx'
import AccountSelector from './global-account-selector/global-account-selector.jsx'
import { getAnalyticsUrl, getContentUrl, getUrl } from '../util/helpers.js'


import { Button, Dropdown, Input, MenuItem, Nav, Navbar } from 'react-bootstrap'

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.activatePurge = this.activatePurge.bind(this)
    this.resetGradientAnimation = this.resetGradientAnimation.bind(this)
    this.handleThemeChange = this.handleThemeChange.bind(this)
    this.toggleAccountMenu = this.toggleAccountMenu.bind(this)
    this.toggleUserMenu = this.toggleUserMenu.bind(this)

    this.state = {
      animatingGradient: false,
      accountMenuOpen: false,
      userMenuOpen: false
    }
  }

  componentDidMount() {
    this.refs.gradient.addEventListener('webkitAnimationEnd', this.resetGradientAnimation)
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.fetching) {
      this.setState({animatingGradient: true})
    }
  }

  resetGradientAnimation() {
    const gradient = this.refs.gradient
    gradient.classList.remove('animated')
    if(this.props.fetching) {
      gradient.offsetWidth // trigger reflow to restart animation
      gradient.classList.add('animated')
    }
    else {
      this.setState({animatingGradient: false})
    }
  }

  handleThemeChange(value) {
    this.props.handleThemeChange(value)
  }

  activatePurge(e) {
    e.preventDefault()
    this.props.activatePurge()
  }

  toggleAccountMenu() {
    this.setState({accountMenuOpen: !this.state.accountMenuOpen})
  }

  toggleUserMenu() {
    this.setState({userMenuOpen: !this.state.userMenuOpen})
  }

  addGroupLink(links, urlMethod) {
    const activeGroup = this.props.activeGroup.size ? this.props.activeGroup.get('id').toString() : null,
      params = this.props.params;

    if (params.group === activeGroup) {
      links.push({
        url: params.property ? urlMethod('group', params.group, params) : null,
        label:  params.group === activeGroup ? this.props.activeGroup.get('name') : 'GROUP'
      })
    }
  }

  addPropertyLink(links, urlMethod, isLastLink) {
    const activeProperty = this.props.params.property,
      params = this.props.params

    if (activeProperty) {
      links.push({
        url: !isLastLink ? urlMethod('property', activeProperty, params) :null,
        label:  activeProperty
      })
    }
  }

  getBreadcrumbLinks() {
    let links = [];

    const pathname = this.props.pathname,
      { history } = this.props,
      params = this.props.params

    if (history.isActive(getRoute('content'))) {
      let propertyLinkIsLast = true
      if (history.isActive(getRoute('contentPropertyAnalytics', params))) {
        links.push({
          label:  'Analytics'
        })

        propertyLinkIsLast = false
      }

      if (history.isActive(getRoute('contentPropertyConfiguration', params))) {
        links.push({
          label:  'Configuration'
        })

        propertyLinkIsLast = false
      }

      this.addPropertyLink(links, getContentUrl, propertyLinkIsLast)
      this.addGroupLink(links, getContentUrl)

      links.push({
        label:  'Content',
        url: params.account && links.length > 0 ? getContentUrl('account', params.account, params) : null
      })
    } else if (history.isActive(getRoute('analytics'))) {
      this.addPropertyLink(links, getAnalyticsUrl)
      this.addGroupLink(links, getAnalyticsUrl)

      links.push({
        label: 'Analytics',
        url: links.length > 0 ? getAnalyticsUrl('account', params.account, params) : null
      })
    } else if (new RegExp( getRoute('accountManagement'), 'g' ).test(pathname)) {
      links.push( {label:  'Account Management'} )
    } else if (new RegExp( getRoute('services'), 'g' ).test(pathname)) {
      links.push( {label:  'Services'} )
    } else if (new RegExp( getRoute('security'), 'g' ).test(pathname)) {
      links.push( {label:  'Security'} )
    } else if (new RegExp( getRoute('support'), 'g' ).test(pathname)) {
      links.push( {label:  'Support'} )
    } else if (new RegExp( getRoute('configuration'), 'g' ).test(pathname)) {
      links.push( {label:  'Configuration'} )
    }

    return links.reverse()
  }

  /**
   * Render method for breadcrumbs.
   */
  renderBreadcrumb() {
    return (
      <li className="header__breadcrumb">
        <Breadcrumbs links={this.getBreadcrumbLinks()}/>
      </li>
    );
  }

  render() {
    const { activeAccount, history, params: { account, brand } } = this.props
    let className = 'header'
    if(this.props.className) {
      className = className + ' ' + this.props.className
    }
    const itemSelectorFunc = (...params) => {
      if(history.isActive('/content')) {
        history.pushState(null, getContentUrl(...params))
      } else if(history.isActive('/analysis')) {
        history.pushState(null, getAnalyticsUrl(...params))
      } else if(history.isActive('/account-management')) {
        history.pushState(null, getUrl('/account-management', ...params))
      } else if(history.isActive('/security')) {
        history.pushState(null, getUrl('/security', ...params))
      }
    }
    return (
      <Navbar className={className} fixedTop={true} fluid={true}>
        <div ref="gradient"
          className={this.state.animatingGradient ?
            'header__gradient animated' :
            'header__gradient'}>
        </div>
        <div className="header__content">
          <Nav className="header__left">
            {/* TODO: the logo should link to the level where they select accounts,
             for CPs it should link to where they select groups.*/}
            <li className="header__logo">
              <Link to={getRoute('content', { brand: 'udn' })} className="logo">
                <IconEricsson />
              </Link>
            </li>
            <li className="header__account-selector">
              <AccountSelector
                params={{ brand, account }}
                topBarTexts={{ brand: 'UDN Admin', account: 'UDN Admin' }}
                topBarAction={() => itemSelectorFunc('brand', 'udn', {})}
                canGetEdited={activeAccount.get('name')}
                user={this.props.user}
                onSelect={(...params) => itemSelectorFunc(...params)}
                restrictedTo="account">
                <Dropdown.Toggle bsStyle="link" className="header-toggle">
                  {activeAccount && this.props.params.account ? activeAccount.get('name') : 'UDN Admin'}
                </Dropdown.Toggle>
              </AccountSelector>
            </li>
            {this.renderBreadcrumb()}
          </Nav>
          <Nav className="header__right" pullRight={true}>
            <li>
              <Button className="btn-header btn-tertiary btn-icon btn-round btn-alerts">
                <IconAlerts />
                <span className="btn-alerts-indicator" />
              </Button>
            </li>
            <li>
              <Button className="btn-header btn-tertiary btn-icon btn-round">?</Button>
            </li>
            <li>
              <Input className="header-search-input"
                type="text" placeholder="Search" />
            </li>
            <li>
              <Dropdown id="user-menu" pullRight={true}
                open={this.state.userMenuOpen}
                onToggle={this.toggleUserMenu}>
                <Dropdown.Toggle bsStyle="primary"
                  className="btn-icon btn-round btn-user-menu"
                  noCaret={true} id="user-dropdown">
                </Dropdown.Toggle>
                {this.renderUserMenu()}
                <UserMenu
                  theme={this.props.theme}
                  handleThemeChange={this.handleThemeChange}
                  toggleUserMenu={this.toggleUserMenu}
                  logout={this.props.logOut}
                />
              </Dropdown>
            </li>
          </Nav>
        </div>
      </Navbar>
    );
  }
}

Header.displayName = 'Header'

Header.defaultProps = {
  accounts: Immutable.List(),
  activeAccount: Immutable.Map(),
  activeGroup: Immutable.Map(),
  activeHost: Immutable.Map(),
  breadcrumbs: null,
  /* FOR TEST only */
  isUDNAdmin: true,
  user: Immutable.Map()
}

Header.propTypes = {
  accounts: React.PropTypes.instanceOf(Immutable.List),
  activatePurge: React.PropTypes.func,
  activeAccount: React.PropTypes.instanceOf(Immutable.Map),
  activeGroup: React.PropTypes.instanceOf(Immutable.Map),
  activeHost: React.PropTypes.instanceOf(Immutable.Map),
  className: React.PropTypes.string,
  fetching: React.PropTypes.bool,
  handleThemeChange: React.PropTypes.func,
  history: React.PropTypes.object,
  isAdmin:  React.PropTypes.bool,
  location: React.PropTypes.object,
  logOut: React.PropTypes.func,
  params: React.PropTypes.object,
  pathname: React.PropTypes.string,
  routes: React.PropTypes.array,
  theme: React.PropTypes.string,
  toggleAccountManagementModal: React.PropTypes.func,
  user: React.PropTypes.instanceOf(Immutable.Map)
}

module.exports = Header;
