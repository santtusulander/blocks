import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as accountActionCreators from '../redux/modules/account'
import * as groupActionCreators from '../redux/modules/group'

import PageContainer from '../components/layout/page-container'
import Content from '../components/layout/content'
import AccountManagementSidebar from '../components/account-management/account-management-sidebar'
import ManageAccount from '../components/account-management/manage-account'
import ManageSystem from '../components/account-management/manage-system'
import AccountManagementFormContainer from '../components/account-management/form-container'
import NewAccountForm from '../components/account-management/new-account-form'

export class AccountManagement extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeAccount: props.params.account || null,
      showFormContainer: false,
      activeForm: {}
    }

    this.changeActiveAccount = this.changeActiveAccount.bind(this)
    this.showFormContainer   = this.showFormContainer.bind(this)
    this.hideFormContainer   = this.hideFormContainer.bind(this)
    this.setActiveForm       = this.setActiveForm.bind(this)
  }

  componentWillMount() {
    if(this.state.activeAccount) {
      this.props.fetchAccountData(this.state.activeAccount)
    }
  }

  showFormContainer() {
    this.setState({ showFormContainer: true })
  }

  hideFormContainer() {
    this.setState({
      showFormContainer: false,
      activeForm: {}
    })
  }

  setActiveForm(id) {
    let form = {};
    switch(id) {
      case 'new-account':
        form = {
          content: <NewAccountForm onCancel={this.hideFormContainer} />,
          title: 'New account',
          subtitle: 'Lorem ipsum dolor'
        }
        break;
    }
    this.setState({
      showFormContainer: true,
      activeForm: form
    })
  }

  changeActiveAccount(account) {
    this.setState({ activeAccount: account })
    this.props.fetchAccountData(account)
  }

  render() {
    const { account } = this.props.params
    const { accounts } = this.props
    const { showFormContainer, activeForm } = this.state
    const isAdmin = !account

    return (
      <PageContainer hasSidebar={isAdmin} className="account-management">
        {isAdmin && <div>
          <AccountManagementSidebar
            accounts={accounts}
            activate={this.changeActiveAccount}
            addAccount={() => this.setActiveForm('new-account')}
          />
          <Content>
            {this.state.activeAccount && <ManageAccount
              account={this.props.activeAccount}/>}
            {!this.state.activeAccount && <ManageSystem/>}
          </Content>
        </div>}
        {!isAdmin && <Content>
          <ManageAccount
            account={this.props.activeAccount}
            groups={this.props.groups}/>
        </Content>}

        <AccountManagementFormContainer
          show={showFormContainer}
          onCancel={this.hideFormContainer}
          title={activeForm.title}
          subtitle={activeForm.subtitle}>
          {activeForm.content}
        </AccountManagementFormContainer>

      </PageContainer>
    )
  }
}

AccountManagement.displayName = 'AccountManagement'
AccountManagement.propTypes   = {
  accounts: React.PropTypes.instanceOf(Immutable.List),
  activeAccount: React.PropTypes.instanceOf(Immutable.Map),
  fetchAccountData: React.PropTypes.func,
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
  const groupActions   = bindActionCreators(groupActionCreators, dispatch)

  function fetchAccountData(account) {
    accountActions.fetchAccount('udn', account)
    groupActions.fetchGroups('udn', account)
  }

  return {
    fetchAccountData: fetchAccountData
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountManagement)
