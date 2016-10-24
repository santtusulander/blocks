import React from 'react'
import Immutable from 'immutable'
import { Link, withRouter } from 'react-router'
import { getRoute } from '../../routes.jsx'
import { Nav, Navbar } from 'react-bootstrap' // Button, Input
import { FormattedMessage } from 'react-intl'

import UserMenu from './user-menu'
import TruncatedTitle from '../truncated-title'
// import IconAlerts from '../icons/icon-alerts.jsx'
import IconEricsson from '../icons/icon-ericsson.jsx'
// import IconQuestionMark from '../icons/icon-question-mark.jsx'
import IsAllowed from '../is-allowed'
import { Breadcrumbs } from '../breadcrumbs/breadcrumbs.jsx'
import AccountSelector from '../global-account-selector/global-account-selector.jsx'
import * as PERMISSIONS from '../../constants/permissions.js'
import { getAccountManagementUrlFromParams, getAnalyticsUrl, getContentUrl, getUrl } from '../../util/routes.js'


import { userIsServiceProvider } from '../../util/helpers.js'

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.resetGradientAnimation = this.resetGradientAnimation.bind(this)
    this.handleThemeChange = this.handleThemeChange.bind(this)
    this.toggleAccountMenu = this.toggleAccountMenu.bind(this)
    this.toggleUserMenu = this.toggleUserMenu.bind(this)
    this.goToAccountManagement = this.goToAccountManagement.bind(this)

    this.state = {
      animatingGradient: props.fetching || false,
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

  goToAccountManagement(e) {
    e.preventDefault()
    this.props.router.push(getAccountManagementUrlFromParams(this.props.params))
    this.toggleUserMenu()
  }

  toggleAccountMenu() {
    this.setState({accountMenuOpen: !this.state.accountMenuOpen})
  }

  toggleUserMenu() {
    this.setState({userMenuOpen: !this.state.userMenuOpen})
  }

  addGroupLink(links, urlMethod) {
    const activeGroup = this.props.activeGroup && this.props.activeGroup.size ?
      this.props.activeGroup.get('id').toString() : null,
      params = this.props.params;

    if (params.group === activeGroup) {
      links.push({
        url: params.property ? urlMethod('group', params.group, params) : null,
        label:  params.group === activeGroup ? this.props.activeGroup.get('name') : <FormattedMessage id="portal.header.group.text"/>
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
    const { router, pathname } = this.props,
      params = this.props.params

    if (router.isActive(getRoute('content'))) {
      let propertyLinkIsLast = true
      if (router.isActive(getRoute('contentPropertyAnalytics', params))) {
        links.push({
          label:  <FormattedMessage id="portal.header.analytics.text"/>
        })

        propertyLinkIsLast = false
      }

      if (router.isActive(getRoute('contentPropertyConfiguration', params))) {
        links.push({
          label:  <FormattedMessage id="portal.header.configuration.text"/>
        })

        propertyLinkIsLast = false
      }

      this.addPropertyLink(links, getContentUrl, propertyLinkIsLast)
      this.addGroupLink(links, getContentUrl)

      links.push({
        label:  <FormattedMessage id="portal.header.content.text"/>,
        url: params.account && links.length > 0 ? getContentUrl('account', params.account, params) : null
      })
    } else if (router.isActive(getRoute('analytics'))) {
      this.addPropertyLink(links, getAnalyticsUrl)
      this.addGroupLink(links, getAnalyticsUrl)

      links.push({
        label: <FormattedMessage id="portal.header.analytics.text"/>,
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
    } else if (new RegExp( getRoute('network'), 'g' ).test(pathname)) {
      links.push( {label:  'Network'} )
    } else if (new RegExp( getRoute('dashboard'), 'g' ).test(pathname)) {
      links.push( {label:  'Dashboard'} )
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
    const { activeAccount, router, user, params: { account, brand } } = this.props
    const activeAccountName = activeAccount && this.props.params.account ?
      activeAccount.get('name') : 'UDN Admin'
    const activeAccountNameNoPlaceholder = activeAccount && this.props.params.account ?
      activeAccount.get('name') : ''
    let className = 'header'
    if(this.props.className) {
      className = className + ' ' + this.props.className
    }
    const itemSelectorFunc = (...params) => {
      if(router.isActive('/content')) {
        router.push(getContentUrl(...params))
      } else if(router.isActive('/analysis')) {
        router.push(getAnalyticsUrl(...params))
      } else if(router.isActive('/account-management')) {
        router.push(getUrl('/account-management', ...params))
      } else if(router.isActive('/security')) {
        router.push(getUrl('/security', ...params))
      } else if(router.isActive('/support')) {
        router.push(getUrl('/support', ...params))
      } else if(router.isActive('/network')) {
        router.push(getContentUrl(...params))
      } else if(router.isActive('/dashboard')) {
        router.push(getContentUrl(...params))
      }
    }
    const logoLink = userIsServiceProvider(user) ?
      `/network/udn/${this.props.activeAccount.get('id')}` :
      getRoute('contentAccount', {brand: 'udn', account: user.get('account_id')})
    return (
      <Navbar className={className} fixedTop={true} fluid={true}>
        <div ref="gradient"
          className={this.state.animatingGradient ?
            'header__gradient animated' :
            'header__gradient'}>
        </div>
        <div className="header__content">
          <Nav className="header__left">
            <li className="header__logo">
              <IsAllowed to={PERMISSIONS.VIEW_CONTENT_ACCOUNTS}>
                <Link to={getRoute('content', { brand: 'udn' })} className="logo">
                  <IconEricsson />
                </Link>
              </IsAllowed>
              <IsAllowed not={true} to={PERMISSIONS.VIEW_CONTENT_ACCOUNTS}>
                <Link to={logoLink} className="logo">
                  <IconEricsson />
                </Link>
              </IsAllowed>
            </li>
            <li className="header__account-selector">
              <IsAllowed to={PERMISSIONS.VIEW_CONTENT_ACCOUNTS}>
                <AccountSelector
                  as="header"
                  params={{ brand, account }}
                  topBarTexts={{ brand: 'UDN Admin', account: 'UDN Admin' }}
                  topBarAction={() => itemSelectorFunc('brand', 'udn', {})}
                  onSelect={itemSelectorFunc}
                  restrictedTo="account">
                  <div className="btn btn-link dropdown-toggle header-toggle">
                    <TruncatedTitle content={activeAccount && activeAccountName} tooltipPlacement="bottom" className="account-property-title"/>
                    <span className="caret"></span>
                  </div>
                </AccountSelector>
              </IsAllowed>
              <IsAllowed not={true} to={PERMISSIONS.VIEW_CONTENT_ACCOUNTS}>
                <div className="active-account-name">{activeAccountNameNoPlaceholder}</div>
              </IsAllowed>
            </li>
            {this.renderBreadcrumb()}
          </Nav>
          <Nav className="header__right" pullRight={true}>
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
                open={this.state.userMenuOpen}
                theme={this.props.theme}
                handleThemeChange={this.handleThemeChange}
                onToggle={this.toggleUserMenu}
                logout={this.props.logOut}
                user={user}
                params={this.props.params}
                goToAccountManagement={this.goToAccountManagement}
              />
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
  activeAccount: React.PropTypes.instanceOf(Immutable.Map),
  activeGroup: React.PropTypes.instanceOf(Immutable.Map),
  activeHost: React.PropTypes.instanceOf(Immutable.Map),
  className: React.PropTypes.string,
  fetching: React.PropTypes.bool,
  handleThemeChange: React.PropTypes.func,
  isAdmin:  React.PropTypes.bool,
  location: React.PropTypes.object,
  logOut: React.PropTypes.func,
  params: React.PropTypes.object,
  pathname: React.PropTypes.string,
  router: React.PropTypes.object,
  routes: React.PropTypes.array,
  theme: React.PropTypes.string,
  toggleAccountManagementModal: React.PropTypes.func,
  user: React.PropTypes.instanceOf(Immutable.Map)
}

export default withRouter(Header);
