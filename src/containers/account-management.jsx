import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as accountActionCreators from '../redux/modules/account'
import * as groupActionCreators from '../redux/modules/group'

import PageContainer from '../components/layout/page-container'
import Content from '../components/layout/content'
import Sidebar from '../components/layout/sidebar'
import ManageAccount from '../components/account-management/manage-account'
import ManageSystem from '../components/account-management/manage-system'

export class AccountManagement extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeAccount: props.params.account || null
    }

    this.changeActiveAccount = this.changeActiveAccount.bind(this)
    this.addGroupToActiveAccount = this.addGroupToActiveAccount.bind(this)
    this.deleteGroupFromActiveAccount = this.deleteGroupFromActiveAccount.bind(this)
    this.editGroupInActiveAccount = this.editGroupInActiveAccount.bind(this)
  }

  componentWillMount() {
    if(this.state.activeAccount) {
      this.props.fetchAccountData(this.state.activeAccount)
    }
  }

  changeActiveAccount(account) {
    this.setState({activeAccount: account})
    this.props.fetchAccountData(account)
  }

  addGroupToActiveAccount(name) {
    return this.props.groupActions.createGroup(
      'udn',
      this.props.activeAccount.get('id'),
      name
    )
  }

  deleteGroupFromActiveAccount(groupId) {
    return this.props.groupActions.deleteGroup(
      'udn',
      this.props.activeAccount.get('id'),
      groupId
    )
  }

  editGroupInActiveAccount(groupId, name) {
    return this.props.groupActions.updateGroup(
      'udn',
      this.props.activeAccount.get('id'),
      {
        id: groupId,
        name: name
      }
    )
  }

  render() {
    const {account} = this.props.params
    const isAdmin = !account
    return (
      <PageContainer hasSidebar={isAdmin} className="account-management">
        {isAdmin && <div>
          <Sidebar>
            Account list here
          </Sidebar>
          <Content>
            {this.state.activeAccount && <ManageAccount
              account={this.props.activeAccount}
              addGroup={this.addGroupToActiveAccount}
              deleteGroup={this.deleteGroupFromActiveAccount}
              editGroup={this.editGroupInActiveAccount}
              groups={this.props.groups}/>}
            {!this.state.activeAccount && <ManageSystem/>}
          </Content>
        </div>}
        {!isAdmin && <Content>
          <ManageAccount
            account={this.props.activeAccount}
            addGroup={this.addGroupToActiveAccount}
            deleteGroup={this.deleteGroupFromActiveAccount}
            editGroup={this.editGroupInActiveAccount}
            groups={this.props.groups}/>
        </Content>}
      </PageContainer>
    )
  }
}

AccountManagement.displayName = 'AccountManagement'
AccountManagement.propTypes = {
  accounts: React.PropTypes.instanceOf(Immutable.List),
  activeAccount: React.PropTypes.instanceOf(Immutable.Map),
  fetchAccountData: React.PropTypes.func,
  groupActions: React.PropTypes.object,
  groups: React.PropTypes.instanceOf(Immutable.List),
  params: React.PropTypes.object
}

function mapStateToProps(state) {
  return {
    accounts: state.account.get('allAccounts'),
    activeAccount: state.account.get('activeAccount'),
    groups: state.group.get('allGroups')
  };
}

function mapDispatchToProps(dispatch) {
  const accountActions = bindActionCreators(accountActionCreators, dispatch)
  const groupActions = bindActionCreators(groupActionCreators, dispatch)

  function fetchAccountData(account) {
    accountActions.fetchAccount('udn', account)
    groupActions.fetchGroups('udn', account)
  }

  return {
    fetchAccountData: fetchAccountData,
    groupActions: groupActions
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountManagement)
