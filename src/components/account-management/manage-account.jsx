import React from 'react'
import { Nav, NavItem, Dropdown } from 'react-bootstrap'
import Immutable from 'immutable'

import { getRoute } from '../../routes.jsx'
import PageHeader from '../layout/page-header'
import Account from './account/account'
import Groups from './account/groups'
import Users from './account/users'
import UDNButton from '../button.js'
import IconAdd from '../icons/icon-add.jsx'

import AccountSelector from '../global-account-selector/global-account-selector.jsx'

import { getUrl } from '../../util/helpers.js'
import { ACCOUNT_TYPES } from '../../constants/account-management-options'
import { ADD_ACCOUNT } from '../../constants/account-management-modals.js'

class AccountManagementManageAccount extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: 'account'
    }

    this.changeTab = this.changeTab.bind(this)
  }
  changeTab(newTab) {
    this.setState({activeTab: newTab})
  }
  renderTabs() {
    const params = this.props.params;

    if (!params.account) {
      return null
    }

    return (
      <Nav bsStyle="tabs" className="system-nav"
           activeKey={this.state.activeTab} onSelect={this.changeTab}>
        <NavItem eventKey="account">Account</NavItem>
        <NavItem eventKey="groups">Groups</NavItem>
        <NavItem eventKey="users">Users</NavItem>
      </Nav>
    )
  }
  render() {
    const { account, isAdmin, toggleModal, history } = this.props
    const accountType = ACCOUNT_TYPES.find(type => account.get('provider_type') === type.value)
    return (
      <div className="account-management-manage-account">
        <PageHeader>
          <AccountSelector
            params={{ brand: 'udn' }}
            restrictedTo="brand"
            topBarTexts={{ brand: 'UDN Admin' }}
            topBarAction={() => history.pushState(null, getUrl(getRoute('accountManagement'), 'brand', 'udn', {}))}
            onSelect={(...params) => history.pushState(null, getUrl(getRoute('accountManagement'), ...params))}>
            <Dropdown.Toggle bsStyle="link" className="header-toggle">
              <h1>{account.get('name') || 'No active account'}</h1>
            </Dropdown.Toggle>
        </AccountSelector>
        <UDNButton bsStyle="success"
                   pageHeaderBtn={true}
                   icon={true}
                   addNew={true}
                   onClick={() => toggleModal(ADD_ACCOUNT)}>
          <IconAdd/>
        </UDNButton>
        </PageHeader>
        {this.renderTabs()}
        <div className="tab-bodies">
          {account.isEmpty() && <p className='text-center'><br/>Please select an account.</p>}
          {this.state.activeTab === 'account' && !account.isEmpty() &&
            <Account
              toggleModal={toggleModal}
              account={account}
              isAdmin={isAdmin}
              initialValues={{
                accountName: account.get('name'),
                brand: 'udn',
                services: account.get('services'),
                accountType: accountType && accountType.value
              }}
              onSave={this.props.editAccount}/>
          }
          {this.state.activeTab === 'groups' && !account.isEmpty() &&
            <Groups
              addGroup={this.props.addGroup}
              deleteGroup={this.props.deleteGroup}
              editGroup={this.props.editGroup}
              groups={this.props.groups}/>
          }
          {this.state.activeTab === 'users' && !account.isEmpty() &&
            <Users
              account={account}
              isAdmin={isAdmin}/>
          }
        </div>
      </div>
    );
  }
}

AccountManagementManageAccount.displayName = 'AccountManagementManageAccount'
AccountManagementManageAccount.propTypes = {
  account: React.PropTypes.instanceOf(Immutable.Map),
  addGroup: React.PropTypes.func,
  deleteGroup: React.PropTypes.func,
  editAccount: React.PropTypes.func,
  editGroup: React.PropTypes.func,
  groups: React.PropTypes.instanceOf(Immutable.List),
  isAdmin: React.PropTypes.bool,
  toggleModal: React.PropTypes.func
}
AccountManagementManageAccount.defaultProps = {
  account: Immutable.Map({}),
  groups: Immutable.List([])
}

module.exports = AccountManagementManageAccount
