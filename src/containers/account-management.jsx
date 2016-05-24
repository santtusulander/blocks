import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as accountActionCreators from '../redux/modules/account'

import PageContainer from '../components/layout/page-container'
import Content from '../components/layout/content'
import Sidebar from '../components/layout/sidebar'

export class AccountManagement extends React.Component {
  render() {
    return (
      <PageContainer hasSidebar={true}>
        <Sidebar>
          Account list here
        </Sidebar>
        <Content>
          <div className="container-fluid">
            <h1>Account management</h1>
          </div>
        </Content>
      </PageContainer>
    )
  }
}

AccountManagement.displayName = 'AccountManagement'
AccountManagement.propTypes = {
  accounts: React.PropTypes.instanceOf(Immutable.List),
  activeAccount: React.PropTypes.instanceOf(Immutable.Map)
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
