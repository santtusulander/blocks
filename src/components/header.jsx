import React from 'react'
import Immutable from 'immutable'
import { Link } from 'react-router'

import { getRoute } from '../routes.jsx'
import Select from '../components/select'
import IconAlerts from '../components/icons/icon-alerts.jsx'
import IconEricsson from './icons/icon-ericsson.jsx'
import { Breadcrumbs } from '../components/breadcrumbs/breadcrumbs.jsx'
import AccountSelector from '../containers/global-account-selector.jsx'
import { getAnalyticsUrl, getContentUrl } from '../util/helpers.js'


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
    const activeGroup = this.props.activeGroup ? this.props.activeGroup.get('id').toString() : null,
      params = this.props.params;

    if (params.group === activeGroup) {
      links.push({
        url: urlMethod('group', params.group, params),
        label:  params.group === activeGroup ? this.props.activeGroup.get('name') : 'GROUP'
      })
    }
  }

  addPropertyLink(links, urlMethod, isLastLink) {
    const activeProperty = this.props.params.property,
      params = this.props.params,
      { history } = this.context;

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
      { history } = this.context,
      params = this.props.params,
      activeAccount = this.props.activeAccount ? this.props.activeAccount.get('id').toString() : null

    if (history.isActive(getRoute('content'))) {
      const buildContentUrl = (routeName) => {
        const baseUrl = getRoute('content'),
          route = getRoute(routeName)
            .replace(':brand', params.brand)
            .replace(':account', params.account)
            .replace(':group', params.group)
            .replace(':property', params.property)


        return `${baseUrl}/${route}`
      }

      let propertyLinkIsLast = true
      if (history.isActive(buildContentUrl('contentPropertyAnalytics'))) {
        links.push({
          label:  'Analytics'
        })

        propertyLinkIsLast = false
      }

      if (history.isActive(buildContentUrl('contentPropertyConfiguration'))) {
        links.push({
          label:  'Configuration'
        })

        propertyLinkIsLast = false
      }

      this.addPropertyLink(links, getContentUrl, propertyLinkIsLast)
      this.addGroupLink(links, getContentUrl)

      links.push({
        label:  'Content',
        url: activeAccount && links.length > 0 ? `/content/groups/udn/${params.account}` : null
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

  renderBreadcrumb() {
    return (
      <li>
        <Breadcrumbs links={this.getBreadcrumbLinks()}/>
      </li>
    );
  }

  render() {
    const { history, params } = this.props
    let className = 'header'
    if(this.props.className) {
      className = className + ' ' + this.props.className
    }

    return (
      <Navbar className={className} fixedTop={true} fluid={true}>
        <div ref="gradient"
          className={this.state.animatingGradient ?
            'header-gradient animated' :
            'header-gradient'}>
        </div>

        <Nav className='breadcrumb-nav'>
          {/* TODO: the logo should link to the level where they select accounts,
           for CPs it should link to where they select groups.*/}
          <li className='logo'>
            <Link to={getRoute('content', { brand: 'udn' })}>
              <IconEricsson />
            </Link>
          </li>
          <AccountSelector
            params={{brand: 'udn'}}
            topBarTexts={{ brand: 'UDN Admin', account: 'UDN Admin' }}
            topBarAction={() => history.pushState(null, getContentUrl('brand', 'udn', {}))}
            onSelect={(...params) => history.pushState(null, getContentUrl(...params))}
            drillable={false}>
            <Dropdown.Toggle bsStyle="link" className="header-toggle">
                <p>{"UDN Admin"}</p>
            </Dropdown.Toggle>
          </AccountSelector>

        { /*this.props.isUDNAdmin && !contentActive && !analyticsActive &&
          <li>
            <UdnAdminToolbar
              accounts={this.props.accounts}
              activeAccount={this.props.activeAccount}
              toggleAccountManagementModal={this.props.toggleAccountManagementModal}
              fetchAccountData={this.props.fetchAccountData}
              location={this.props.location}
              history={this.props.history}
              routes={this.props.routes}
            />
          </li>
        */}

        {this.renderBreadcrumb()}

        </Nav>
          <Nav pullRight={true}>
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
                              onSelect={this.handleThemeChange}
                              value={this.props.theme}
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
                          onClick={this.toggleUserMenu}>
                          <div className="user-menu-item">
                            Account Management
                          </div>
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className="bottom-item" eventKey="5">
                    <a id="log-out" href="#" onClick={this.props.logOut}>
                      <div className="user-menu-item">Log Out</div>
                    </a>
                  </li>
                </Dropdown.Menu>
              </Dropdown>
            </li>
          </Nav>
      </Navbar>
    );
  }
}

Header.displayName = 'Header'

Header.defaultProps = {
  /* FOR TEST only */
  isUDNAdmin: true,
  breadcrumbs: null
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
  isAdmin:  React.PropTypes.bool,
  routes: React.PropTypes.array,
  location: React.PropTypes.object,
  logOut: React.PropTypes.func,
  params: React.PropTypes.object,
  pathname: React.PropTypes.string,
  theme: React.PropTypes.string,
  toggleAccountManagementModal: React.PropTypes.func
}

Header.contextTypes = {
  history: React.PropTypes.object.isRequired
}

module.exports = Header;
