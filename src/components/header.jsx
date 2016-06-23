import React from 'react'
import Immutable from 'immutable'
import { Link } from 'react-router'

import { getRoute } from '../routes.jsx'
import Select from '../components/select'
import IconAlerts from '../components/icons/icon-alerts.jsx'
import {Breadcrumbs} from '../components/breadcrumbs/breadcrumbs.jsx'
import UdnAdminToolbar from '../components/udn-admin-toolbar/udn-admin-toolbar.jsx'

import { Button, Dropdown, Input, MenuItem, Nav, Navbar, NavItem } from 'react-bootstrap'

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
  render() {
    let className = 'header'
    if(this.props.className) {
      className = className + ' ' + this.props.className;
    }
    const activeAccount = this.props.activeAccount ?
      this.props.activeAccount.get('id').toString()
      : null
    const activeGroup = this.props.activeGroup ?
      this.props.activeGroup.get('id').toString()
      : null
    const activeHost = this.props.location.query.name

    const contentActive = new RegExp( getRoute('content'), 'g' ).test(this.props.pathname)
    const analyticsActive = new RegExp( getRoute('analytics'), 'g' ).test(this.props.pathname)

    let breadcrumbsLinks = [];

    //create breadcrumbs for content -pages
    if (contentActive) {
      /* REFACTOR: isUDNAdmin - create static link to UDN -accounts */
      if ( this.props.isUDNAdmin ) breadcrumbsLinks.push( {url: `/content/accounts/udn`, label:  'UDN'})
      if (this.props.params.account === activeAccount) {
        breadcrumbsLinks.push( {url: `/content/groups/udn/${this.props.params.account}`, label:  this.props.params.account === activeAccount ? this.props.activeAccount.get('name') : 'ACCOUNT'})
      }

      if (this.props.params.group === activeGroup) {
        breadcrumbsLinks.push( {url: `/content/hosts/udn/${this.props.params.account}/${this.props.params.group}`, label:  this.props.params.group === activeGroup ? this.props.activeGroup.get('name') : 'GROUP'})
      }

      if (activeHost) {
        breadcrumbsLinks.push( {url: `/content/property/udn/${this.props.params.account}/${this.props.params.group}/property?name=${encodeURIComponent(activeHost).replace(/\./g, "%2e")}`, label:  activeHost})
      }
    }

    if ( /(\/account-management)/.test(this.props.pathname) ) breadcrumbsLinks.push( {url: '', label:  'ACCOUNT'} )
    if ( /(\/services)/.test(this.props.pathname) ) breadcrumbsLinks.push( {url: '', label:  'SERVICES'} )
    if ( /(\/security)/.test(this.props.pathname) ) breadcrumbsLinks.push( {url: '', label:  'SECURITY'} )
    if ( /(\/support)/.test(this.props.pathname) ) breadcrumbsLinks.push( {url: '', label:  'SUPPORT'} )

    return (
      <Navbar className={className} fixedTop={true} fluid={true}>
        <div ref="gradient"
          className={this.state.animatingGradient ?
            'header-gradient animated' :
            'header-gradient'}>
        </div>

        <Nav className='breadcrumb-nav'>

        { this.props.isUDNAdmin && !contentActive && !analyticsActive &&
          <li>
            <UdnAdminToolbar
              accounts={this.props.accounts}
              activeAccount={this.props.activeAccount}
              fetchAccountData={this.props.fetchAccountData}
            />
          </li>
        }

        { analyticsActive &&
          <li>
            <Breadcrumbs links={this.props.breadcrumbs} />
          </li>
        }

        { !analyticsActive &&
          <li>
            <Breadcrumbs links={breadcrumbsLinks} />
          </li>
        }

        { /* (showContentBreadcrumbs  && !analyticsActive) &&
          <ol role="navigation" aria-label="breadcrumbs" className="breadcrumb">
            <li className="breadcrumb-back">
              <Link to={`/content/accounts/udn`} />
            </li>
            <li>
              <Link to={`/content/groups/udn/${this.props.params.account}`}>
                {activeAccount ?
                  activeAccount == this.props.params.account ?
                    this.props.activeAccount.get('name')
                    : 'ACCOUNT'
                  : null}
              </Link>
            </li>
            <li>
              <Link to={`/content/hosts/udn/${this.props.params.account}/${this.props.params.group}`}>
                {this.props.activeGroup ?
                  this.props.activeGroup.get('name')
                  : 'GROUP'}
              </Link>
            </li>
            {/(\/content\/property\/)/.test(this.props.pathname) ? null :
              <li>
                <Link to={`/content/property/udn/${this.props.params.account}/${this.props.params.group}/property?name=${encodeURIComponent(activeHost).replace(/\./g, "%2e")}`}>
                  {activeHost}
                </Link>
              </li>
            }
            <li className="active">
              {/(\/content\/property\/)/.test(this.props.pathname) && activeHost}
              {/(\/content\/configuration\/)/.test(this.props.pathname) && 'Configuration'}
              {/(\/analytics\/property\/)/.test(this.props.pathname) && 'Analytics'}
            </li>
          </ol>
        */ }
        </Nav>

        { /* NOT NEEDED ANYMORE
          <Navbar.Header>
            <Navbar.Brand>
              <Link to={`/content/accounts/udn`}>Ericsson</Link>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav className="main-nav">
            <li className="main-nav-item">
              <Dropdown id="account-menu" ref="accountMenu"
                open={this.state.accountMenuOpen}
                onToggle={this.toggleAccountMenu}>
                <Link id="content-link" className={'main-nav-link' + contentActive}
                  to={`/content/accounts/udn`}
                  activeClassName="active">
                  Content
                </Link>
                <Dropdown.Toggle bsStyle='link'/>
                <Dropdown.Menu className="dropdown-account-menu">
                  {this.props.accounts ? this.props.accounts.map((account, i) => {
                    return (
                      <li key={i}
                        active={activeAccount === account.get('id')}>
                        <Link
                          to={`/content/groups/udn/${account.get('id')}`}
                          activeClassName="active"
                          onClick={this.toggleAccountMenu}>
                          {account.get('name')}
                        </Link>
                      </li>
                    )
                  }) : ''}
                </Dropdown.Menu>
              </Dropdown>
            </li>
            <li className="main-nav-item">
              {hideConfigurations ?
                <span id="configurations-link" className="main-nav-link inactive">Configurations</span>
              :
                <Link id="configurations-link" className="main-nav-link" to={`/configurations/udn`} activeClassName="active">
                  Configurations
                </Link>
              }
            </li>
            <li className="main-nav-item">
              <Link id="security-link" className="main-nav-link" to={`/security`} activeClassName="active">
                Security
              </Link>
            </li>
            <li className="main-nav-item">
              <Link id="services-link" className="main-nav-link" to={`/services`} activeClassName="active">
                Services
              </Link>
            </li>
            <li className="main-nav-item">
              {hidePurge ?
                <span className="main-nav-link inactive">Purge</span>
              :
                <a href="#" id="purge-link" className="main-nav-link"
                  onClick={this.activatePurge}>

                  Purge
                </a>
              }
            </li>
          </Nav>
          */ }

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
  isUDNAdmin: true
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
  location: React.PropTypes.object,
  logOut: React.PropTypes.func,
  params: React.PropTypes.object,
  pathname: React.PropTypes.string,
  theme: React.PropTypes.string
}

module.exports = Header;
