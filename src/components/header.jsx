import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as uiActionCreators from '../redux/modules/ui'
import Select from '../components/select'
import IconAlerts from '../components/icons/icon-alerts.jsx'

import { Button, Breadcrumb, BreadcrumbItem,Dropdown, Input, MenuItem, Nav,
  Navbar } from 'react-bootstrap';

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.resetGradientAnimation = this.resetGradientAnimation.bind(this)
    this.handleThemeChange = this.handleThemeChange.bind(this)

    this.state = {
      showBreadcrumbs: false,
      animatingGradient: false
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
  handleThemeChange() {
    return value => {
      this.props.uiActions.changeTheme(value),
      localStorage.EricssonUDNUiTheme = value
    }
  }
  render() {
    let className = 'header';
    if(this.props.className) {
      className = className + ' ' + this.props.className;
    }
    return (
      <Navbar className={className} fixedTop={true} fluid={true}>
        <div ref="gradient"
          className={this.state.animatingGradient ?
            'header-gradient animated' :
            'header-gradient'}></div>
        {this.state.showBreadcrumbs ?
          <Breadcrumb>
            <BreadcrumbItem className="breadcrumb-back" />
            <BreadcrumbItem>Content</BreadcrumbItem>
            <BreadcrumbItem>Group Name</BreadcrumbItem>
            <BreadcrumbItem active={true}>Property Name</BreadcrumbItem>
          </Breadcrumb> :
        <div>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#">Ericsson</a>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav className="main-nav">
            <li className="main-nav-item active">
              <Dropdown id="dropdown-content">
                <Link className="main-nav-link" to={`/content/accounts/udn`}>
                  Content
                </Link>
                <Dropdown.Toggle bsStyle='link'/>
                <Dropdown.Menu>
                  <MenuItem eventKey="1" active={true}><span>Disney Interactive</span></MenuItem>
                  <MenuItem eventKey="2">Disney Cruises</MenuItem>
                  <MenuItem eventKey="3">Lucas Arts</MenuItem>
                  <MenuItem eventKey="4">Star Wars</MenuItem>
                  <MenuItem eventKey="5">Ads</MenuItem>
                  <MenuItem eventKey="6">Marvel</MenuItem>
                </Dropdown.Menu>
              </Dropdown>
            </li>
            <li className="main-nav-item">
              <Link className="main-nav-link" to={`/configurations/udn`}>
                Configurations
              </Link>
            </li>
            <li className="main-nav-item">
              <Link className="main-nav-link" to={`/`}>
                Security
              </Link>
            </li>
            <li className="main-nav-item">
              <Link className="main-nav-link" to={`/`}>
                Services
              </Link>
            </li>
            <li className="main-nav-item">
              <Link className="main-nav-link" to={`/purge`}>
                Purge
              </Link>
            </li>
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
                  <img src="/src/assets/img/img-user.jpg"></img>
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
                          onSelect={this.handleThemeChange()}
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
                  <MenuItem className="bottom-item" eventKey="5">
                    <div className="user-menu-item">Log Out</div>
                  </MenuItem>
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
  className: React.PropTypes.string,
  fetching: React.PropTypes.bool,
  theme: React.PropTypes.string,
  uiActions: React.PropTypes.object
}

function mapStateToProps(state) {
  return {
    theme: state.ui.get('theme')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
