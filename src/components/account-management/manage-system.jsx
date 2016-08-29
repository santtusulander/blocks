import React from 'react'
import { Nav, NavItem } from 'react-bootstrap'

import PageHeader from '../layout/page-header'
import Brands from './system/brands'
import DNS from './system/dns'
import Roles from './system/roles'
import Users from './system/users'

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
        <Nav bsStyle="tabs"
          activeKey={this.state.activeTab} onSelect={this.changeTab}>
          <NavItem eventKey="users">Users</NavItem>
          <NavItem eventKey="brands">Brands</NavItem>
          <NavItem eventKey="dns">DNS</NavItem>
          <NavItem eventKey="roles">Roles</NavItem>
        </Nav>
        {this.state.activeTab === 'users' &&
          <Users/>
        }
        {this.state.activeTab === 'brands' &&
          <Brands {...this.props.brandsList} />
        }
        {this.state.activeTab === 'dns' &&
          <DNS {...this.props.dnsList}/>
        }
        {this.state.activeTab === 'roles' &&
          <Roles/>
        }
      </div>
    )
  }
}

AccountManagementManageSystem.displayName = 'AccountManagementManageSystem'
AccountManagementManageSystem.propTypes = {
  brandsList: React.PropTypes.object,
  dnsList: React.PropTypes.object
}

module.exports = AccountManagementManageSystem
