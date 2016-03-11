import React from 'react'
import Immutable from 'immutable'
import { Link } from 'react-router'

import Select from '../components/select'
import IconAlerts from '../components/icons/icon-alerts.jsx'

import { Button, Dropdown, Input, MenuItem, Nav, Navbar } from 'react-bootstrap'

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.activatePurge = this.activatePurge.bind(this)
    this.resetGradientAnimation = this.resetGradientAnimation.bind(this)
    this.handleThemeChange = this.handleThemeChange.bind(this)
    this.toggleAccountMenu = this.toggleAccountMenu.bind(this)

    this.state = {
      showBreadcrumbs: false,
      animatingGradient: false,
      accountMenuOpen: false
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
  render() {
    let className = 'header'
    if(this.props.className) {
      className = className + ' ' + this.props.className;
    }
    const firstAccount = this.props.accounts && this.props.accounts.get(0) ?
      this.props.accounts.get(0).get('id')
      : 1
    const activeAccount = this.props.activeAccount ?
      this.props.activeAccount.get('id')
      : null
    // Show Configurations only for property levels
    let showConfigurations = /(\/content\/property\/)/.test(this.props.pathname) ||
      /(\/content\/configuration\/)/.test(this.props.pathname) ||
      /(\/configurations\/)/.test(this.props.pathname) ||
      /(\/analytics\/property\/)/.test(this.props.pathname)
    // Hide Purge for all levels higher than group summary / property levels
    let hidePurge = /(\/content\/accounts\/)/.test(this.props.pathname) ||
      /(\/content\/groups\/)/.test(this.props.pathname) ||
      /(\/analytics\/account\/)/.test(this.props.pathname) ||
      this.props.pathname === '/security' ||
      this.props.pathname === '/services'
    return (
      <Navbar className={className} fixedTop={true} fluid={true}>
        <div ref="gradient"
          className={this.state.animatingGradient ?
            'header-gradient animated' :
            'header-gradient'}></div>
        {this.state.showBreadcrumbs ?
          <ol role="navigation" aria-label="breadcrumbs" className="breadcrumb">
            <li className="breadcrumb-back" />
            <li>Content</li>
            <li>Group Name</li>
            <li className="active">Property Name</li>
          </ol> :
        <div>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#">Ericsson</a>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav className="main-nav">
            <li className="main-nav-item">
              <Dropdown id="account-menu" ref="accountMenu"
                open={this.state.accountMenuOpen}>
                <Link className="main-nav-link"
                  to={`/content/groups/udn/${firstAccount}`}
                  activeClassName="active">
                  Content
                </Link>
                <Dropdown.Toggle bsStyle='link' onClick={this.toggleAccountMenu}/>
                <Dropdown.Menu>
                  {this.props.accounts ? this.props.accounts.map((account, i) => {
                    return (
                      <li key={i}
                        active={activeAccount === account.get('id')}>
                        <Link className="main-nav-link"
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
            {showConfigurations ?
              <li className="main-nav-item">
                <Link className="main-nav-link" to={`/configurations/udn`} activeClassName="active">
                  Configurations
                </Link>
              </li>
              : ''
            }
            <li className="main-nav-item">
              <Link className="main-nav-link" to={`/security`} activeClassName="active">
                Security
              </Link>
            </li>
            <li className="main-nav-item">
              <Link className="main-nav-link" to={`/services`} activeClassName="active">
                Services
              </Link>
            </li>
            {hidePurge ? '' :
              <li className="main-nav-item">
                <a href="#" className="main-nav-link"
                  onClick={this.activatePurge}>
                  Purge
                </a>
              </li>
            }
          </Nav>
          <Nav pullRight={true}>
            <li>
              <Dropdown id="dropdown-content">
                <Dropdown.Toggle className="btn-header btn-tertiary btn-icon btn-round
                  btn-alerts" noCaret={true}>
                  <IconAlerts />
                  <span className="btn-alerts-indicator" />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <MenuItem eventKey="1">Alert 1</MenuItem>
                  <MenuItem eventKey="2">Alert 2</MenuItem>
                  <MenuItem eventKey="3">Alert 3</MenuItem>
                </Dropdown.Menu>
              </Dropdown>
            </li>
            <li>
              <Button className="btn-header btn-tertiary btn-icon
                btn-round">?</Button>
            </li>
            <li>
              <Input className="header-search-input"
                type="text" placeholder="Search" />
            </li>
            <li>
              <Dropdown id="dropdown-content" pullRight={true}>
                <Dropdown.Toggle bsStyle="primary"
                  className="btn-icon btn-round btn-user-menu"
                  noCaret={true} id="user-dropdown">
                  <img src="/assets/img/img-user.jpg"></img>
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-user-menu">
                  <MenuItem header={true} className="dropdown-main-header">
                    <div className="user-menu-item">Username</div>
                  </MenuItem>
                  <MenuItem eventKey="1">
                    <div className="user-menu-item">
                      <div className="helper-header">Company</div>
                      Disney Studios
                    </div>
                  </MenuItem>
                  <MenuItem eventKey="2">
                    <div className="user-menu-item">
                      <div className="helper-header">Role</div>
                      Admin
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
                  <MenuItem eventKey="4">
                    <div className="user-menu-item">Account Management</div>
                    </MenuItem>
                  <li className="bottom-item" eventKey="5">
                    <a href="#" onClick={this.props.logOut}>
                      <div className="user-menu-item">Log Out</div>
                    </a>
                  </li>
                </Dropdown.Menu>
              </Dropdown>
            </li>
          </Nav>
        </div>}
      </Navbar>
    );
  }
}

Header.displayName = 'Header'
Header.propTypes = {
  accounts: React.PropTypes.instanceOf(Immutable.List),
  activatePurge: React.PropTypes.func,
  activeAccount: React.PropTypes.instanceOf(Immutable.Map),
  className: React.PropTypes.string,
  fetching: React.PropTypes.bool,
  handleThemeChange: React.PropTypes.func,
  logOut: React.PropTypes.func,
  pathname: React.PropTypes.string,
  theme: React.PropTypes.string
}

module.exports = Header;
