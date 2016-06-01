import React, { PropTypes, Component } from 'react'
import { List, Map, is } from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as accountActionCreators from '../redux/modules/account'
import * as groupActionCreators from '../redux/modules/group'
import * as dnsActionCreators from '../redux/modules/dns'
import * as uiActionCreators from '../redux/modules/ui'

import PageContainer from '../components/layout/page-container'
import Content from '../components/layout/content'
import Sidebar from '../components/layout/sidebar'
import ManageAccount from '../components/account-management/manage-account'
import ManageSystem from '../components/account-management/manage-system'

export class AccountManagement extends Component {
  constructor(props) {
    super(props)

    this.state = {
      activeAccount: props.params.account || null
    }

    this.editSOARecord = this.editSOARecord.bind(this)
    this.changeActiveAccount = this.changeActiveAccount.bind(this)
    this.dnsEditOnSave = this.dnsEditOnSave.bind(this)
  }

  componentWillMount() {
    if(this.state.activeAccount) {
      this.props.fetchAccountData(this.state.activeAccount)
    }
  }

  editSOARecord() {
    const {
      soaFormData,
      dnsData,
      dnsActions,
      toggleModal
    } = this.props
    const activeDomain = dnsData.get('activeDomain')
    let data = {}
    for(const field in soaFormData) {
      if(soaFormData[field] instanceof Object) {
        data[field] = soaFormData[field].value
      }
    }
    dnsActions.editSOA({ id: activeDomain.get('id'), data })
    toggleModal(null)
  }

  changeActiveAccount(account) {
    this.setState({activeAccount: account})
    this.props.fetchAccountData(account)
  }

  dnsEditOnSave(){
    console.log('dnsEditOnSave()');
  }

  render() {
    const {
      params: { account },
      dnsData,
      dnsActions,
      activeRecordType,
      accountManagementModal,
      toggleModal
    } = this.props
    const isAdmin = !account
    const activeDomain = dnsData.get('activeDomain')
    /* TODO: remove - TEST ONLY */
    const dnsInitialValues = {
      initialValues: {
        recordType: 'MX',
        recordName: 'mikkotest',
        targetValue: '11.22.33.44',
        ttl: '3600'
      }
    }
    const soaFormInitialValues = {
      initialValues:
        dnsData
          .get('domains')
          .find(domain => is(activeDomain.get('id'), domain.get('id')))
          .get('SOARecord').toJS()
    }

    const dnsListProps = {
      editSOA: this.editSOARecord,
      modalActive: this.state.modalVisible,
      hideModal: this.toggleModal,
      //changeActiveDomain: dnsActions.changeActiveDomain,
      activeDomain: activeDomain,
      domains: dnsData.get('domains'),
      changeRecordType: dnsActions.changeActiveRecordType,
      activeRecordType: activeRecordType,
      dnsEditOnSave: this.dnsEditOnSave,
      accountManagementModal: accountManagementModal,
      toggleModal: toggleModal,
      dnsInitialValues :  dnsInitialValues,
      soaInitialValues: soaFormInitialValues
    }
    return (
      <PageContainer hasSidebar={isAdmin} className="account-management">
        {isAdmin && <div>
          <Sidebar>
            Account list here
          </Sidebar>
          <Content>
            {this.state.activeAccount ?
              <ManageAccount account={this.props.activeAccount}/> :
              <ManageSystem dnsList={dnsListProps}/>}
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
  accountManagementModal: PropTypes.string,
  accounts: PropTypes.instanceOf(List),
  activeAccount: PropTypes.instanceOf(Map),
  activeRecordType: PropTypes.string,
  dnsActions: PropTypes.object,
  dnsData: PropTypes.instanceOf(Map),
  fetchAccountData: PropTypes.func,
  groups: PropTypes.instanceOf(List),
  params: PropTypes.object,
  soaFormData: PropTypes.object,
  toggleModal: PropTypes.func

}

function mapStateToProps(state) {
  return {
    accountManagementModal: state.ui.get('accountManagementModal'),
    accounts: state.account.get('allAccounts'),
    activeAccount: state.account.get('activeAccount'),
    activeRecordType: state.dns.get('activeRecordType'),
    dnsData: state.dns,
    groups: state.group.get('allGroups'),
    soaFormData: state.form.soaEditForm,
    toggleModal: state.ui.get('toggleModal')
  };
}

function mapDispatchToProps(dispatch) {
  const dnsActions = bindActionCreators(dnsActionCreators, dispatch)
  const accountActions = bindActionCreators(accountActionCreators, dispatch)
  const groupActions = bindActionCreators(groupActionCreators, dispatch)
  const uiActions = bindActionCreators(uiActionCreators, dispatch)
  function fetchAccountData(account) {
    accountActions.fetchAccount('udn', account)
    groupActions.fetchGroups('udn', account)
  }

  return {
    toggleModal: uiActions.toggleAccountManagementModal,
    dnsActions: dnsActions,
    fetchAccountData: fetchAccountData
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountManagement)
