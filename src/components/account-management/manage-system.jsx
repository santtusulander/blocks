import React from 'react'
import { Nav, NavItem } from 'react-bootstrap'

import PageHeader from '../layout/page-header'

class AccountManagementManageSystem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: 'users'
    }

    this.changeTab = this.changeTab.bind(this)
  }
  changeTab(newTab) {
    this.setState({activeTab: newTab})
  }
  render() {
    return (
      <div className="account-management-manage-system">
        <PageHeader>
          <h1>UDN Admin Account</h1>
        </PageHeader>
        <Nav bsStyle="tabs" className="system-nav"
          activeKey={this.state.activeTab} onSelect={this.changeTab}>
          <NavItem eventKey="users">Users</NavItem>
          <NavItem eventKey="brands">Brands</NavItem>
          <NavItem eventKey="dns">DNS</NavItem>
          <NavItem eventKey="roles">Roles</NavItem>
        </Nav>
      </div>
    )
  }
}

AccountManagementManageSystem.displayName = 'AccountManagementManageSystem'
AccountManagementManageSystem.propTypes = {}

module.exports = AccountManagementManageSystem
