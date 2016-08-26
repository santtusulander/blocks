import React from 'react'
import { Nav, NavItem } from 'react-bootstrap'

import PageHeader from '../layout/page-header'
import Brands from './system/brands'
import DNS from './system/dns'
import Roles from './system/roles'
import Users from './system/users'

import {FormattedMessage} from 'react-intl'

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
          <NavItem eventKey="users"><FormattedMessage id="portal.manage.tabs.users.title"/></NavItem>
          <NavItem eventKey="brands"><FormattedMessage id="portal.manage.tabs.brands.title"/></NavItem>
          <NavItem eventKey="dns"><FormattedMessage id="portal.manage.tabs.dns.title"/></NavItem>
          <NavItem eventKey="roles"><FormattedMessage id="portal.manage.tabs.roles.title"/></NavItem>
        </Nav>
        <div className="tab-bodies">
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
