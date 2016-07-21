import React, { PropTypes, Component } from 'react'
import { List, Map, is } from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getValues } from 'redux-form';
import { withRouter, Link } from 'react-router'
import { Dropdown, Nav, Button } from 'react-bootstrap'
import { getRoute } from '../../routes'
import { getUrl, getAccountManagementUrlFromParams } from '../../util/helpers'

import * as accountActionCreators from '../../redux/modules/account'
import * as dnsActionCreators from '../../redux/modules/dns'
import * as groupActionCreators from '../../redux/modules/group'
import * as hostActionCreators from '../../redux/modules/host'
import * as permissionsActionCreators from '../../redux/modules/permissions'
import * as rolesActionCreators from '../../redux/modules/roles'
import * as uiActionCreators from '../../redux/modules/ui'

import PageContainer from '../../components/layout/page-container'
import Content from '../../components/layout/content'
import IconAdd from '../../components/icons/icon-add'
import IconTrash from '../../components/icons/icon-trash'
import PageHeader from '../../components/layout/page-header'
import DeleteModal from '../../components/delete-modal'
import NewAccountForm from '../../components/account-management/add-account-form.jsx'
import GroupEditForm from '../../components/account-management/group-edit-form.jsx'
import UDNButton from '../../components/button.js'
import AccountSelector from '../../components/global-account-selector/global-account-selector'

import { ADD_ACCOUNT, DELETE_ACCOUNT, DELETE_GROUP, EDIT_GROUP } from '../../constants/account-management-modals.js'
import { ACCOUNT_TYPES } from '../../constants/account-management-options'

export class AccountManagement extends Component {
  constructor(props) {
    super(props)

    this.state = {
      groupToDelete: null,
      groupToUpdate: null
    }

    this.notificationTimeout = null

    this.editSOARecord = this.editSOARecord.bind(this)
    this.dnsEditOnSave = this.dnsEditOnSave.bind(this)
    this.addGroupToActiveAccount = this.addGroupToActiveAccount.bind(this)
    this.deleteGroupFromActiveAccount = this.deleteGroupFromActiveAccount.bind(this)
    this.editGroupInActiveAccount = this.editGroupInActiveAccount.bind(this)
    this.editAccount = this.editAccount.bind(this)
    this.addAccount = this.addAccount.bind(this)
    this.showNotification = this.showNotification.bind(this)
    this.showDeleteGroupModal = this.showDeleteGroupModal.bind(this)
    this.showEditGroupModal = this.showEditGroupModal.bind(this)
  }

  componentWillMount() {
    this.props.permissionsActions.fetchPermissions()
    this.props.rolesActions.fetchRoles()
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
    // eslint-disable-next-line no-console
    console.log('dnsEditOnSave()')
  }

  showDeleteGroupModal(group) {
    this.setState({ groupToDelete: group });

    this.props.toggleModal(DELETE_GROUP);
  }

  addGroupToActiveAccount(name) {
    return this.props.groupActions.createGroup('udn', this.props.activeAccount.get('id'), name)
      .then(() => {
        this.props.hostActions.clearFetchedHosts()
      })
  }

  deleteGroupFromActiveAccount(group) {
    return this.props.groupActions.deleteGroup(
      'udn',
      this.props.activeAccount.get('id'),
      group.get('id')
    ).then(() => {
      this.props.toggleModal(null)
    })
  }

  editGroupInActiveAccount(groupId, data) {
    return this.props.groupActions.updateGroup(
      'udn',
      this.props.activeAccount.get('id'),
      groupId,
      data
    ).then(() => {
      this.props.toggleModal(null)
      this.showNotification('Group detail updates saved.')
    })
  }

  showEditGroupModal(group) {
    this.setState({groupToUpdate: group})
    this.props.toggleModal(EDIT_GROUP)
  }

  editAccount(accountId, data) {
    return this.props.accountActions.updateAccount('udn', accountId, data)
      .then(() => {
        this.showNotification('Account detail updates saved.')
      })
  }

  addAccount(brand, data) {
    return this.props.accountActions.createAccount(brand, data).then(
      action => {
        this.props.router.push(`/account-management/${brand}/${action.payload.id}`)
        this.showNotification(`Account ${data.name} created.`)
        this.props.toggleModal(null)
        this.props.hostActions.clearFetchedHosts()
      })
  }

  showNotification(message) {
    clearTimeout(this.notificationTimeout)
    this.props.uiActions.changeNotification(message)
    this.notificationTimeout = setTimeout(this.props.uiActions.changeNotification, 10000)
  }

  getTabName() {
    const router = this.props.router,
      baseUrl = getAccountManagementUrlFromParams(this.props.params)
    if (router.isActive(`${baseUrl}/details`)) {
      return 'details';
    } else if (router.isActive(`${baseUrl}/groups`)) {
      return 'groups';
    } else if (router.isActive(`${baseUrl}/users`)) {
      return 'users';
    }

    return '';
  }

  render() {
    const {
      params: { brand, account },
      params,
      accountManagementModal,
      toggleModal,
      onDelete,
      activeAccount,
      router,
      dnsData
    } = this.props

    const subPage = this.getTabName(),
      isAdmin = !account,
      baseUrl = getAccountManagementUrlFromParams(params),
      activeDomain = dnsData && dnsData.get('activeDomain'),
      accountType = ACCOUNT_TYPES.find(type => activeAccount.get('provider_type') === type.value)

    /* TODO: remove - TEST ONLY */
    /*const dnsInitialValues = {
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
    }*/
    const childProps = {
      addGroup: this.addGroupToActiveAccount,
      deleteGroup: this.showDeleteGroupModal,
      editGroup: this.showEditGroupModal,
      account: activeAccount,
      toggleModal,
      params,
      isAdmin,
      onSave: this.editAccount,
      uiActions: this.props.uiActions,
      initialValues: {
        accountName: activeAccount.get('name'),
        brand: 'udn',
        services: activeAccount.get('services'),
        accountType: accountType && accountType.value
      },
      roles: this.props.roles,
      permissions: this.props.permissions
    }

    return (
      <PageContainer className="account-management">
        <Content>
          <div className="account-management-manage-account">
            <PageHeader>
              <AccountSelector
                params={{ brand: 'udn', account }}
                topBarTexts={{ brand: 'UDN Admin' }}
                topBarAction={() => router.push(`${getRoute('accountManagement')}/${brand}`)}
                onSelect={(...params) => router.push(`${getUrl(getRoute('accountManagement'), ...params)}/${subPage}`)}
                canGetEdited={activeAccount.get('name')}
                restrictedTo="account"
                user={this.props.user}>
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
            {account && <Nav bsStyle="tabs" className="system-nav">
              <li className="navbar">
                <Link to={baseUrl + '/details'} activeClassName="active">ACCOUNT</Link>
              </li>
              <li className="navbar">
                <Link to={baseUrl + '/groups'} activeClassName="active">GROUPS</Link>
              </li>
              <li className="navbar">
                <Link to={baseUrl + '/users'} activeClassName="active">USERS</Link>
              </li>
            </Nav>}
            {!account && <Nav bsStyle="tabs" className="system-nav">
              <li className="navbar">
                <Link to={baseUrl + '/accounts'} activeClassName="active">ACCOUNTS</Link>
              </li>
              <li className="navbar">
                <Link to={baseUrl + '/users'} activeClassName="active">USERS</Link>
              </li>
              <li className="navbar">
                <Link to={baseUrl + '/brands'} activeClassName="active">BRANDS</Link>
              </li>
              <li className="navbar">
                <Link to={baseUrl + '/dns'} activeClassName="active">DNS</Link>
              </li>
              <li className="navbar">
                <Link to={baseUrl + '/roles'} activeClassName="active">ROLES</Link>
              </li>
              <li className="navbar">
                <Link to={baseUrl + '/services'} activeClassName="active">SERVICES</Link>
              </li>
            </Nav>}
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
            onDelete={() => onDelete(brand, account, router)}/>}
          {(accountManagementModal === DELETE_GROUP && this.state.groupToDelete) &&
          <DeleteModal
            itemToDelete={this.state.groupToDelete.get('name')}
            description={'Please confirm by writing "delete" below, and pressing the delete button. This group, and all groups it contains will be removed from UDN immediately.'}
            onCancel={() => toggleModal(null)}
            onDelete={() => this.deleteGroupFromActiveAccount(this.state.groupToDelete)}/>}
          {accountManagementModal === EDIT_GROUP && this.state.groupToUpdate &&
          <GroupEditForm
            id="group-edit-form"
            onSave={(data) => this.editGroupInActiveAccount(this.state.groupToUpdate.get('id'), data)}
            onCancel={() => toggleModal(null)}
            show={true}
            // NEEDS_API users={}
            initialValues={
              this.state.groupToUpdate.toJS()
            }/>}
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
  history: PropTypes.object,
  hostActions: PropTypes.object,
  onDelete: PropTypes.func,
  params: PropTypes.object,
  permissions: PropTypes.instanceOf(List),
  permissionsActions: PropTypes.object,
  roles: PropTypes.instanceOf(List),
  rolesActions: PropTypes.object,
  soaFormData: PropTypes.object,
  toggleModal: PropTypes.func,
  uiActions: PropTypes.object
}
AccountManagement.defaultProps = {
  activeAccount: Map(),
  dnsData: Map(),
  groups: List(),
  roles: List()
}

function mapStateToProps(state) {
  return {
    accountManagementModal: state.ui.get('accountManagementModal'),
    accounts: state.account.get('allAccounts'),
    activeAccount: state.account.get('activeAccount') || Map({}),
    activeRecordType: state.dns.get('activeRecordType'),
    dnsData: state.dns,
    groups: state.group.get('allGroups'),
    permissions: state.permissions.get('permissions'),
    roles: state.roles.get('roles'),
    soaFormData: state.form.soaEditForm
  };
}

function mapDispatchToProps(dispatch) {
  const dnsActions = bindActionCreators(dnsActionCreators, dispatch)
  const accountActions = bindActionCreators(accountActionCreators, dispatch)
  const groupActions = bindActionCreators(groupActionCreators, dispatch)
  const hostActions = bindActionCreators(hostActionCreators, dispatch)
  const permissionsActions = bindActionCreators(permissionsActionCreators, dispatch)
  const rolesActions = bindActionCreators(rolesActionCreators, dispatch)
  const uiActions = bindActionCreators(uiActionCreators, dispatch)
  const toggleModal = uiActions.toggleAccountManagementModal

  function onDelete(brandId, accountId, router) {
    // Hide the delete modal.
    toggleModal(null)

    // Delete the account.
    accountActions.deleteAccount(brandId, accountId)
      .then((response) => {
        if (!response.error) {
          // Clear active account and redirect user to brand level account management.
          accountActions.clearActiveAccount()
          router.replace(getUrl(getRoute('accountManagement'), 'brand', brandId, {}))
        } else {
          uiActions.showInfoDialog({
            title: 'Error',
            content: response.payload.data.message,
            buttons:  <Button onClick={uiActions.hideInfoDialog} bsStyle="primary" >OK</Button>
          })
        }
      })
  }

  return {
    accountActions: accountActions,
    toggleModal: uiActions.toggleAccountManagementModal,
    dnsActions: dnsActions,
    groupActions: groupActions,
    hostActions: hostActions,
    permissionsActions: permissionsActions,
    rolesActions: rolesActions,
    uiActions: uiActions,
    onDelete: onDelete
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AccountManagement))
