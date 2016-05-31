import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as accountActionCreators from '../redux/modules/account'
import * as groupActionCreators from '../redux/modules/group'
import * as dnsActionCreators from '../redux/modules/dns'

import PageContainer from '../components/layout/page-container'
import Content from '../components/layout/content'
import Sidebar from '../components/layout/sidebar'
import ManageAccount from '../components/account-management/manage-account'
import ManageSystem from '../components/account-management/manage-system'

export class AccountManagement extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeAccount: props.params.account || null,
      modalVisible: false
    }
    this.toggleModal = this.toggleModal.bind(this)
    this.editSOARecord = this.editSOARecord.bind(this)
    this.changeActiveAccount = this.changeActiveAccount.bind(this)
  }

  componentWillMount() {
    if(this.state.activeAccount) {
      this.props.fetchAccountData(this.state.activeAccount)
    }
  }

  editSOARecord() {
    const { SOAformData, dnsData, dnsActions } = this.props
    const activeDomain = dnsData.get('activeDomain')
    let data = {}
    for(const field in SOAformData) {
      if(SOAformData[field] instanceof Object) {
        data[field] = SOAformData[field].value
      }
    }
    dnsActions.editSOA({ id: activeDomain.get('id'), data })
    this.toggleModal()
  }

  toggleModal() {
    this.setState({ modalVisible: !this.state.modalVisible })
  }

  changeActiveAccount(account) {
    this.setState({activeAccount: account})
    this.props.fetchAccountData(account)
  }

  render() {
    const {
      params: { account },
      dnsData,
      dnsActions,
      activeRecordType
    } = this.props
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
            {!this.state.activeAccount &&
              <ManageSystem
                editSOA={this.editSOARecord}
                modalActive={this.state.modalVisible}
                hideModal={this.toggleModal}
                changeActiveDomain={dnsActions.changeActiveDomain}
                activeDomain={dnsData.get('activeDomain')}
                domains={dnsData.get('domains')}
                changeRecordType={dnsActions.changeActiveRecordType}
                activeRecordType={activeRecordType}
                />}
          </Content>
        </div>}
        {!isAdmin && <Content>
          <ManageAccount
            account={this.props.activeAccount}
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
  activeRecordType: React.PropTypes.string,
  dnsActions: React.PropTypes.object,
  dnsData: React.PropTypes.instanceOf(Immutable.Map),
  fetchAccountData: React.PropTypes.func,
  groups: React.PropTypes.instanceOf(Immutable.List),
  params: React.PropTypes.object

}

function mapStateToProps(state) {
  return {
    accounts: state.account.get('allAccounts'),
    activeAccount: state.account.get('activeAccount'),
    groups: state.group.get('allGroups'),
    SOAformData: state.form.addSOAForm,
    dnsData: state.dns,
    activeRecordType: state.dns.get('activeRecordType')
  };
}

function mapDispatchToProps(dispatch) {
  const dnsActions = bindActionCreators(dnsActionCreators, dispatch)
  const accountActions = bindActionCreators(accountActionCreators, dispatch)
  const groupActions = bindActionCreators(groupActionCreators, dispatch)

  function fetchAccountData(account) {
    accountActions.fetchAccount('udn', account)
    groupActions.fetchGroups('udn', account)
  }

  return {
    dnsActions: dnsActions,
    fetchAccountData: fetchAccountData
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountManagement)
