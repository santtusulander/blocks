import React from 'react'
import { Nav, NavItem } from 'react-bootstrap'
import Immutable from 'immutable'

import PageHeader from '../layout/page-header'
import Details from './account/details'
import Groups from './account/groups'
import Users from './account/users'

class AccountManagementManageAccount extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: 'details'
    }

    this.changeTab = this.changeTab.bind(this)
  }
  changeTab(newTab) {
    this.setState({activeTab: newTab})
  }
  render() {
    if(!this.props.account || !this.props.account.size) {
      return <div>Loading...</div>
    }
    return (
      <div className="account-management-manage-account">
        <PageHeader>
          <h1>{this.props.account.get('name')}</h1>
        </PageHeader>
        <Nav bsStyle="tabs" className="system-nav"
          activeKey={this.state.activeTab} onSelect={this.changeTab}>
          <NavItem eventKey="details">Details</NavItem>
          <NavItem eventKey="groups">Groups</NavItem>
          <NavItem eventKey="users">Users</NavItem>
        </Nav>
        <div className="tab-bodies">
          {this.state.activeTab === 'details' &&
            <Details
              account={this.props.account}
              isAdmin={this.props.isAdmin}/>
          }
          {this.state.activeTab === 'groups' &&
            <Groups
              account={this.props.account}
              isAdmin={this.props.isAdmin}/>
          }
          {this.state.activeTab === 'users' &&
            <Users
              account={this.props.account}
              isAdmin={this.props.isAdmin}/>
          }
        </div>
      </div>
    );
  }
}

AccountManagementManageAccount.displayName = 'AccountManagementManageAccount'
AccountManagementManageAccount.propTypes = {
  account: React.PropTypes.instanceOf(Immutable.Map),
  isAdmin: React.PropTypes.bool
}

module.exports = AccountManagementManageAccount
