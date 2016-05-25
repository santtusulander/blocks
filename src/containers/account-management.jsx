import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as accountActionCreators from '../redux/modules/account'

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

  }

  componentWillMount() {
    if(this.state.activeAccount) {
      this.props.accountActions.fetchAccount('udn', this.state.activeAccount)
    }
  }

  changeActiveAccount(account) {
    this.setState({activeAccount: account})
    this.props.accountActions.fetchAccount('udn', account)
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
              account={this.props.activeAccount}/>}
            {!this.state.activeAccount && <ManageSystem/>}
          </Content>
        </div>}
        {!isAdmin && <Content>
          <ManageAccount account={this.props.activeAccount}/>
        </Content>}
      </PageContainer>
    )
  }
}

AccountManagement.displayName = 'AccountManagement'
AccountManagement.propTypes = {
  accountActions: React.PropTypes.object,
  accounts: React.PropTypes.instanceOf(Immutable.List),
  activeAccount: React.PropTypes.instanceOf(Immutable.Map),
  params: React.PropTypes.object
}

function mapStateToProps(state) {
  return {
    accounts: state.account.get('allAccounts'),
    activeAccount: state.account.get('activeAccount')
  };
}

function mapDispatchToProps(dispatch) {
  const accountActions = bindActionCreators(accountActionCreators, dispatch)

  return {
    accountActions: accountActions
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountManagement)
