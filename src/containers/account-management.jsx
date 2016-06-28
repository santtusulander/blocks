import React, { PropTypes, Component } from 'react'
import { List, Map, is, fromJS } from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getValues } from 'redux-form';

import * as accountActionCreators from '../redux/modules/account'
import * as groupActionCreators from '../redux/modules/group'
import * as dnsActionCreators from '../redux/modules/dns'
import * as uiActionCreators from '../redux/modules/ui'

import PageContainer from '../components/layout/page-container'
import Content from '../components/layout/content'
import AccountManagementSidebar from '../components/account-management/account-management-sidebar'
import ManageAccount from '../components/account-management/manage-account'
import ManageSystem from '../components/account-management/manage-system'

import NewAccountForm from '../components/account-management/add-account-form.jsx'
import { ADD_ACCOUNT } from '../constants/account-management-modals.js'

//import AccountManagementFormContainer from '../components/account-management/form-container'

export class AccountManagement extends Component {
  constructor(props) {
    super(props)

    this.state = {
      activeAccount: props.params.account || null
    }

    this.notificationTimeout = null

    this.editSOARecord = this.editSOARecord.bind(this)
    this.changeActiveAccount = this.changeActiveAccount.bind(this)

    this.dnsEditOnSave = this.dnsEditOnSave.bind(this)
    this.addGroupToActiveAccount = this.addGroupToActiveAccount.bind(this)
    this.deleteGroupFromActiveAccount = this.deleteGroupFromActiveAccount.bind(this)
    this.editGroupInActiveAccount = this.editGroupInActiveAccount.bind(this)
    this.editAccount = this.editAccount.bind(this)
    this.addAccount = this.addAccount.bind(this)
    this.showNotification = this.showNotification.bind(this)
  }

  componentWillMount() {
    const accountId = this.props.params.account
    if ( accountId && accountId !== 'null' && !this.props.activeAccount) this.props.accountActions.fetchAccount('udn', accountId)
  }

  editSOARecord() {
    const { soaFormData, dnsActions, dnsData, toggleModal } = this.props
    const activeDomain = dnsData.get('activeDomain')
    const data = getValues(soaFormData)
    dnsActions.editSOA({ id: activeDomain.get('id'), data })
    toggleModal(null)

  }

  changeActiveAccount(account) {
    this.setState({ activeAccount: account })
    //this.props.fetchAccountData(account)
  }

  dnsEditOnSave(){
    console.log('dnsEditOnSave()')
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
      groupId,
      {name: name}
    )
  }

  editAccount(accountId, data) {
    return this.props.accountActions.updateAccount(
      'udn',
      accountId,
      data
    ).then(() => this.showNotification('Account detail updates saved.'))
  }

  addAccount(data) {
    return this.props.accountActions.createAccount(data.brand, data.name).then(
      action => {
        return this.props.accountActions.updateAccount(
          data.brand,
          action.payload.id,
          { name: data.name }
          // TODO: should be "data" above but API does not support all fields
        ).then(() => {
          this.showNotification(`Account ${data.name} created.`)
          this.props.toggleModal(null)
        })
      }
    )
  }

  showNotification(message) {
    clearTimeout(this.notificationTimeout)
    this.props.uiActions.changeNotification(message)
    this.notificationTimeout = setTimeout(
      this.props.uiActions.changeNotification, 10000)
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
    const activeDomain = dnsData && dnsData.get('activeDomain')

    /* TODO: remove - TEST ONLY */
    const dnsInitialValues = {
      initialValues: {
        recordType: 'MX',
        recordName: 'mikkotest',
        targetValue: '11.22.33.44',
        ttl: '3600'
      }
    }

    const soaFormInitialValues = dnsData && {
      initialValues:
        dnsData
          .get('domains')
          .find(domain => is(activeDomain.get('id'), domain.get('id')))
          .get('SOARecord').toJS()
    }
    const dnsListProps = {
      soaEditOnSave: this.editSOARecord,
      modalActive: this.state.modalVisible,
      //changeActiveDomain: dnsActions.changeActiveDomain,
      activeDomain: activeDomain,
      domains: dnsData && dnsData.get('domains'),
      changeRecordType: dnsActions.changeActiveRecordType,
      activeRecordType: activeRecordType,
      dnsEditOnSave: this.dnsEditOnSave,
      accountManagementModal: accountManagementModal,
      toggleModal: toggleModal,
      dnsFormInitialValues: dnsInitialValues,
      soaFormInitialValues: soaFormInitialValues
    }

    console.log(accountManagementModal)

    return (
      <PageContainer className="account-management">
        <Content>
          <ManageAccount
            toggleModal={toggleModal}
            account={this.props.activeAccount}
            addGroup={this.addGroupToActiveAccount}
            deleteGroup={this.deleteGroupFromActiveAccount}
            editAccount={this.editAccount}
            editGroup={this.editGroupInActiveAccount}
            groups={this.props.groups}/>

            {/*
            <ManageSystem
              dnsList={dnsListProps}
              brandsList={{
                accountManagementModal: accountManagementModal,
                brands: [],
                toggleModal: toggleModal
              }}
            />
          */ }

            <NewAccountForm
                id="add-account-form"
                show={accountManagementModal === ADD_ACCOUNT}
                onSave={this.addAccount}
                onCancel={() => toggleModal(null)}/>
        </Content>
      </PageContainer>
    )
  }
}

AccountManagement.displayName = 'AccountManagement'

AccountManagement.propTypes = {
  accountActions: PropTypes.object,
  accountManagementModal: PropTypes.string,
  accounts: PropTypes.instanceOf(List),
  activeAccount: PropTypes.instanceOf(Map),
  activeRecordType: PropTypes.string,
  dnsActions: PropTypes.object,
  dnsData: PropTypes.instanceOf(Map),
  //fetchAccountData: PropTypes.func,
  groupActions: PropTypes.object,
  groups: PropTypes.instanceOf(List),
  params: PropTypes.object,
  soaFormData: PropTypes.object,
  toggleModal: PropTypes.func,
  uiActions: PropTypes.object
}

function mapStateToProps(state) {
  return {
    accountManagementModal: state.ui.get('accountManagementModal'),
    accounts: state.account.get('allAccounts'),
    activeAccount: state.account.get('activeAccount'),
    activeRecordType: state.dns.get('activeRecordType'),
    dnsData: state.dns,
    groups: state.group.get('allGroups'),
    soaFormData: state.form.soaEditForm
  };
}

function mapDispatchToProps(dispatch) {
  const dnsActions = bindActionCreators(dnsActionCreators, dispatch)
  const accountActions = bindActionCreators(accountActionCreators, dispatch)
  const groupActions = bindActionCreators(groupActionCreators, dispatch)
  const uiActions = bindActionCreators(uiActionCreators, dispatch)

  /* This is fetched by main - container as we should always have account
    function fetchAccountData(account, accounts) {
    if(accounts && accounts.isEmpty()) {
      accountActions.fetchAccounts('udn')
    }
    if(account) {
      accountActions.fetchAccount('udn', account)
      groupActions.fetchGroups('udn', account)
    }
  }*/

  return {
    accountActions: accountActions,
    toggleModal: uiActions.toggleAccountManagementModal,
    dnsActions: dnsActions,
    //fetchAccountData: fetchAccountData,
    groupActions: groupActions,
    uiActions: uiActions
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountManagement)
