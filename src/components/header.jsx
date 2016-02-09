import React from 'react'
import { Link } from 'react-router'

import IconAlerts from '../components/icons/icon-alerts.jsx'

import { Button, Dropdown, Input, MenuItem, Nav, Navbar } from 'react-bootstrap';

class Header extends React.Component {
  render() {
    return (
      <Navbar className="header" fixedTop={true} fluid={true}>
        <div className="header-gradient"></div>
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
                <span className="btn-alerts-count">9</span>
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
                <MenuItem header={true}>
                  <span className="dropdown-main-header">Username</span>
                </MenuItem>
                <MenuItem eventKey="1">
                  <span className="helper-header">Company</span>
                  Disney Studios
                </MenuItem>
                <MenuItem eventKey="2">UDN Admin</MenuItem>
                <MenuItem eventKey="3">Account Management</MenuItem>
                <MenuItem eventKey="4">Lights On</MenuItem>
                <MenuItem eventKey="5">Log Out</MenuItem>
              </Dropdown.Menu>
            </Dropdown>
          </li>
        </Nav>
      </Navbar>
    );
  }
}

Header.displayName = 'Header'
Header.propTypes = {}

module.exports = Header
