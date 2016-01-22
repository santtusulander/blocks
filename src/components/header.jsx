import React from 'react'
import { Link } from 'react-router'

// React-Bootstrap
// ===============

import {
  Button,
  Dropdown,
  DropdownButton,
  Input,
  MenuItem,
  Nav,
  Navbar
} from 'react-bootstrap';

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
              <Link className="main-nav-link" to={`/`}>
                Content
              </Link>
              <Dropdown.Toggle bsStyle='link' className="pull-right"/>
              <Dropdown.Menu>
                <MenuItem eventKey="1" active={true}><span>Disney Interactive</span></MenuItem>
                <MenuItem eventKey="2"><span>Disney Cruises</span></MenuItem>
                <MenuItem eventKey="3"><span>Lucas Arts</span></MenuItem>
                <MenuItem eventKey="4"><span>Star Wars</span></MenuItem>
                <MenuItem eventKey="5"><span>Ads</span></MenuItem>
                <MenuItem eventKey="6"><span>Marvel</span></MenuItem>
              </Dropdown.Menu>
            </Dropdown>
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
            <Link className="main-nav-link" to={`/`}>
              Purge
            </Link>
          </li>
        </Nav>
        <Nav pullRight={true}>
          <li>
            <Button bsStyle="primary" className="btn-icon">
              !
            </Button>
          </li>
          <li>
            <Button bsStyle="primary" className="btn-icon">
              ?
            </Button>
          </li>
          <li>
            <form>
              <Input type="text" placeholder="Search" />
            </form>
          </li>
          <li>
            <DropdownButton bsStyle="primary" title="user" id="dropdonw-1">
              <MenuItem header={true}>John Doe</MenuItem>
              <MenuItem eventKey="1">Disney</MenuItem>
              <MenuItem eventKey="2">UDN Admin</MenuItem>
              <MenuItem eventKey="3">Account Management</MenuItem>
              <MenuItem eventKey="4">Lights On</MenuItem>
              <MenuItem eventKey="5">Log Out</MenuItem>
            </DropdownButton>
          </li>
        </Nav>
      </Navbar>
    );
  }
}

Header.displayName = 'Header'
Header.propTypes = {}

module.exports = Header
