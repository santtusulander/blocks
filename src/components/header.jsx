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
      <Navbar fixedTop={true}>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">Logo</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
          <li>
            <Dropdown id="dropdown-content">
              <Link to={`/`}>
                Content
              </Link>
              <Dropdown.Toggle className="pull-right"/>
              <Dropdown.Menu>
                <MenuItem eventKey="1" active={true}>Disney Interactive</MenuItem>
                <MenuItem eventKey="2">Disney Cruises</MenuItem>
                <MenuItem eventKey="3">Disney Entertainment</MenuItem>
              </Dropdown.Menu>
            </Dropdown>
          </li>
          <li>
            <Link to={`/`}>
              Security
            </Link>
          </li>
          <li>
            <Link to={`/`}>
              Services
            </Link>
          </li>
          <li>
            <Link to={`/`}>
              Purge
            </Link>
          </li>
        </Nav>
        <Nav pullRight={true}>
          <li>
            <form>
              <Input type="text" placeholder="Search" />
            </form>
          </li>
          <li>
            <Button>
              Alerts
            </Button>
          </li>
          <li>
            <Button>
              ?
            </Button>
          </li>
          <li>
            <DropdownButton title="user" id="dropdonw-1">
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
