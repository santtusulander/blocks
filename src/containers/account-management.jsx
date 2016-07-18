import React, { PropTypes, Component } from 'react'
import { List, Map, is } from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getValues } from 'redux-form';
import { withRouter, Link } from 'react-router'
import { Dropdown, Nav } from 'react-bootstrap'
import UDNButton from '../components/button.js'

import * as accountActionCreators from '../redux/modules/account'
import * as groupActionCreators from '../redux/modules/group'
import * as hostActionCreators from '../redux/modules/host'
import * as dnsActionCreators from '../redux/modules/dns'
import * as uiActionCreators from '../redux/modules/ui'

import PageContainer from '../components/layout/page-container'
import Content from '../components/layout/content'
import IconAdd from '../components/icons/icon-add.jsx'
import IconTrash from '../components/icons/icon-trash.jsx'

import { getRoute } from '../routes'
import { getUrl, getTabName, getAccountManagementUrlFromParams } from '../util/helpers.js'
import DeleteModal from '../components/delete-modal'
import NewAccountForm from '../components/account-management/add-account-form.jsx'
import AccountSelector from '../components/global-account-selector/global-account-selector.jsx'
import PageHeader from '../components/layout/page-header'
import { ACCOUNT_TYPES } from '../constants/account-management-options'

import { ADD_ACCOUNT, DELETE_ACCOUNT } from '../constants/account-management-modals.js'

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
    ).then(() => {
      this.props.hostActions.clearFetchedHosts()
    })
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
        const { payload: { id } } = action, { brand } = data
        return this.props.accountActions.updateAccount(
          data.brand,
          id,
          { name: data.name }
          // TODO: should be "data" above but API does not support all fields
        ).then(() => {
          this.props.history.pushState(null, `/account-management/${brand}/${id}`)
          this.showNotification(`Account ${data.name} created.`)
          this.props.toggleModal(null)
        }).then(() => {
          this.props.groupActions.fetchGroups(data.brand, action.payload.id)
          this.props.hostActions.clearFetchedHosts()
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
      params: { brand, account },
      params,
      dnsData,
      dnsActions,
      activeRecordType,
      accountManagementModal,
      toggleModal,
      onDelete,
      history,
      activeAccount,
      router,
      route
    } = this.props

    const subPage = getTabName(this.props.location.pathname)
    const isAdmin = !activeAccount;
    const baseUrl = getAccountManagementUrlFromParams(params)
    const activeDomain = dnsData && dnsData.get('activeDomain')
    const accountType = ACCOUNT_TYPES.find(type => activeAccount.get('provider_type') === type.value)

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
    const childProps = {
      addGroup: this.addGroupToActiveAccount,
      deleteGroup: this.deleteGroupFromActiveAccount,
      editGroup: this.editGroupInActiveAccount,
      groups: this.props.groups,
      toggleModal,
      params,
      account: activeAccount,
      isAdmin,
      onSave: this.props.editAccount,
      initialValues: {
        accountName: activeAccount.get('name'),
        brand: 'udn',
        services: activeAccount.get('services'),
        accountType: accountType && accountType.value
      }
    }


    return (
      <PageContainer className="account-management">
        <Content>
          {/*<ManageAccount
            location={this.props.location}
            route={this.props.route}
            toggleModal={toggleModal}
            account={this.props.activeAccount}
            addGroup={this.addGroupToActiveAccount}
            deleteGroup={this.deleteGroupFromActiveAccount}
            editAccount={this.editAccount}
            editGroup={this.editGroupInActiveAccount}
            groups={this.props.groups}
            params={params}
          />*/}
          <div className="account-management-manage-account">
            <PageHeader>
              <AccountSelector
                params={{ brand: 'udn' }}
                restrictedTo="brand"
                topBarTexts={{ brand: 'UDN Admin' }}
                topBarAction={() => router.push(`${baseUrl}/${subPage}`)}
                onSelect={(...params) => router.push(`${getUrl(getRoute('accountManagement'), ...params)}/${subPage}`)}>
                <Dropdown.Toggle bsStyle="link" className="header-toggle">
                  <h1>{activeAccount.get('name') || 'No active account'}</h1>
                </Dropdown.Toggle>
              </AccountSelector>
              <div className="account-management-manage-account__actions">
                <UDNButton bsStyle="success"
                           pageHeaderBtn={true}
                           icon={true}
                           addNew={true}
                           onClick={() => toggleModal(ADD_ACCOUNT)}>
                  <IconAdd/>
                </UDNButton>
                <UDNButton bsStyle="secondary"
                           pageHeaderBtn={true}
                           icon={true}
                           addNew={true}
                           onClick={() => toggleModal(DELETE_ACCOUNT)}>
                  <IconTrash/>
                </UDNButton>
              </div>
            </PageHeader>
            <Nav bsStyle="tabs" className="system-nav">
              <li className="navbar">
                <Link to={baseUrl + '/details'} activeClassName="active">ACCOUNT</Link>
              </li>
              <li className="navbar">
                <Link to={baseUrl + '/groups'} activeClassName="active">GROUPS</Link>
              </li>
              <li className="navbar">
                <Link to={baseUrl + '/users'} activeClassName="active">USERS</Link>
              </li>
            </Nav>
            <Content className="tab-bodies">
              {this.props.children && React.cloneElement(this.props.children, childProps)}
            </Content>
          </div>

          {accountManagementModal === ADD_ACCOUNT &&
          <NewAccountForm
            id="add-account-form"
            onSave={this.addAccount}
            onCancel={() => toggleModal(null)}
            show={true}/>}
          {accountManagementModal === DELETE_ACCOUNT &&
          <DeleteModal
            itemToDelete={activeAccount.get('name')}
            description={'Please confirm by writing "delete" below, and pressing the delete button. This account, and all properties and groups it contains will be removed from UDN immediately.'}
            onCancel={() => toggleModal(null)}
            onDelete={() => onDelete(brand, account, history)}/>}
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
  hostActions: PropTypes.object,
  params: PropTypes.object,
  soaFormData: PropTypes.object,
  toggleModal: PropTypes.func,
  uiActions: PropTypes.object,
  onDelete: PropTypes.func
}

AccountManagement.defaultProps = {
  activeAccount: Map({})
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
  const hostActions = bindActionCreators(hostActionCreators, dispatch)
  const uiActions = bindActionCreators(uiActionCreators, dispatch)
  const toggleModal = uiActions.toggleAccountManagementModal

  function onDelete(brandId, accountId, history) {
    // Hide the delete modal.
    toggleModal(null)

    // Delete the account.
    accountActions.deleteAccount(brandId, accountId)
      .then(() => {
        // Clear active account and redirect user to brand level account management.
        accountActions.clearActiveAccount()
        history.replace(getUrl(getRoute('accountManagement'), 'brand', brandId, {}))
      })
  }

  return {
    accountActions: accountActions,
    toggleModal: uiActions.toggleAccountManagementModal,
    dnsActions: dnsActions,
    groupActions: groupActions,
    hostActions: hostActions,
    uiActions: uiActions,
    onDelete: onDelete
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AccountManagement))
