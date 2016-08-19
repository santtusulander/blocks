import React, { PropTypes, Component } from 'react'
import { List, Map } from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getValues } from 'redux-form';
import { withRouter, Link } from 'react-router'
import { Nav, Button } from 'react-bootstrap'
import { getRoute } from '../../routes'
import { getUrl, getAccountManagementUrlFromParams } from '../../util/helpers'

import * as accountActionCreators from '../../redux/modules/account'
import * as dnsActionCreators from '../../redux/modules/dns'
import * as groupActionCreators from '../../redux/modules/group'
import * as hostActionCreators from '../../redux/modules/host'
import * as permissionsActionCreators from '../../redux/modules/permissions'
import * as rolesActionCreators from '../../redux/modules/roles'
import * as userActionCreators from '../../redux/modules/user'
import * as uiActionCreators from '../../redux/modules/ui'

import PageContainer from '../../components/layout/page-container'
import Content from '../../components/layout/content'
import PageHeader from '../../components/layout/page-header'
import DeleteModal from '../../components/delete-modal'
import DeleteUserModal from '../../components/account-management/delete-user-modal'
import AccountForm from '../../components/account-management/account-form'
import GroupForm from '../../components/account-management/group-form'
import AccountSelector from '../../components/global-account-selector/global-account-selector'
import IsAllowed from '../../components/is-allowed'
import TruncatedTitle from '../../components/truncated-title'

import { ACCOUNT_TYPES, NAME_VALIDATION_REGEXP } from '../../constants/account-management-options'
import {
  ADD_ACCOUNT,
  DELETE_ACCOUNT,
  DELETE_GROUP,
  EDIT_GROUP,
  DELETE_USER
} from '../../constants/account-management-modals.js'
import * as PERMISSIONS from '../../constants/permissions.js'

import { checkForErrors } from '../../util/helpers'

import {FormattedMessage} from 'react-intl'

export class AccountManagement extends Component {
  constructor(props) {
    super(props)
    this.userToDelete = ''
    this.accountToDelete = null
    this.accountToUpdate = null
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
    this.showAccountForm = this.showAccountForm.bind(this)
    this.showNotification = this.showNotification.bind(this)
    this.showDeleteAccountModal = this.showDeleteAccountModal.bind(this)
    this.showDeleteGroupModal = this.showDeleteGroupModal.bind(this)
    this.showDeleteUserModal = this.showDeleteUserModal.bind(this)
    this.showEditGroupModal = this.showEditGroupModal.bind(this)
    this.validateAccountDetails = this.validateAccountDetails.bind(this)
    this.deleteUser = this.deleteUser.bind(this)
  }

  componentWillMount() {
    const { brand, account } = this.props.params
    this.props.permissionsActions.fetchPermissions()
    this.props.rolesActions.fetchRoles()
    if(account) {
      this.props.userActions.fetchUsers(brand, account)
    }
    else if(this.props.accounts.size) {
      this.props.userActions.fetchUsersForMultipleAccounts(brand, this.props.accounts)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { brand, account } = nextProps.params
    if(nextProps.params.account && nextProps.params.account !== this.props.params.account) {
      this.props.userActions.fetchUsers(brand, account)
    }
    else if(!nextProps.params.account && !this.props.accounts.equals(nextProps.accounts)) {
      this.props.userActions.fetchUsersForMultipleAccounts(brand, nextProps.accounts)
    }
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

  dnsEditOnSave() {
    // eslint-disable-next-line no-console
    console.log('dnsEditOnSave()')
  }

  showDeleteGroupModal(group) {
    this.setState({ groupToDelete: group });

    this.props.toggleModal(DELETE_GROUP);
  }

  showDeleteUserModal(user) {
    this.userToDelete = user
    this.props.toggleModal(DELETE_USER);
  }

  showDeleteAccountModal(account) {
    this.accountToDelete = account
    this.props.toggleModal(DELETE_ACCOUNT);
  }

  deleteUser() {
    const { userActions: { deleteUser } } = this.props
    deleteUser(this.userToDelete)
      .then(() => this.props.toggleModal(null))
  }

  addGroupToActiveAccount(name) {
    return this.props.groupActions.createGroup('udn', this.props.activeAccount.get('id'), name)
      .then(action => {
        this.props.hostActions.clearFetchedHosts()
        return action.payload
      })
  }

  deleteGroupFromActiveAccount(group) {
    return this.props.groupActions.deleteGroup(
      'udn',
      this.props.activeAccount.get('id'),
      group.get('id')
    ).then(response => {
      this.props.toggleModal(null)
      response.error &&
        this.props.uiActions.showInfoDialog({
          title: 'Error',
          content: response.payload.data.message,
          buttons: <Button onClick={this.props.uiActions.hideInfoDialog} bsStyle="primary">OK</Button>
        })
    })
  }

  editGroupInActiveAccount(groupId, data, addUsers, deleteUsers) {
    const groupIdsByEmail = email => this.props.users
      .find(user => user.get('email') === email)
      .get('group_id')
    const addUserActions = addUsers.map(email => {
      return this.props.userActions.updateUser(email, {
        group_id: groupIdsByEmail(email).push(groupId).toJS()
      })
    })
    const deleteUserActions = deleteUsers.map(email => {
      return this.props.userActions.updateUser(email, {
        group_id: groupIdsByEmail(email).filter(id => id !== groupId).toJS()
      })
    })
    return Promise.all([
      this.props.groupActions.updateGroup(
        'udn',
        this.props.activeAccount.get('id'),
        groupId,
        data
      ),
      ...addUserActions,
      ...deleteUserActions
    ])
    .then(() => {
      this.props.toggleModal(null)
      this.showNotification('Group detail updates saved.')
    })
  }

  showEditGroupModal(group) {
    this.setState({ groupToUpdate: group })
    this.props.toggleModal(EDIT_GROUP)
  }

  editAccount(brandId, accountId, data) {
    return this.props.accountActions.updateAccount(brandId, accountId, data)
      .then(() => {
        this.props.toggleModal(null)
        this.showNotification('Account detail updates saved.')
      })
  }

  showAccountForm(account) {
    this.accountToUpdate = account
    this.props.toggleModal(ADD_ACCOUNT)
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

  validateAccountDetails({ accountName, services }) {
    let nameTaken = null
    if(this.props.activeAccount.get('name') !== accountName) {
      nameTaken = {
        condition: this.props.accounts.findIndex(account => account.get('name') === accountName) > -1,
        errorText: 'That account name is taken'
      }
    }
    const conditions = {
      accountName: [
        {
          condition: ! new RegExp( NAME_VALIDATION_REGEXP ).test(accountName),
          errorText: <div key={accountName}>{['Account name is invalid.', <div key={1}>
                                                                            <div style={{marginTop: '0.5em'}}>
                                                                              <FormattedMessage id="portal.account.manage.nameValidationRequirements.line1.text" />
                                                                              <ul>
                                                                                <li><FormattedMessage id="portal.account.manage.nameValidationRequirements.line2.text" /></li>
                                                                                <li><FormattedMessage id="portal.account.manage.nameValidationRequirements.line3.text" /></li>
                                                                              </ul>
                                                                            </div>
                                                                          </div>]}</div>
        }
      ]
    }
    nameTaken && conditions.accountName.push(nameTaken)
    return checkForErrors({ accountName, services }, conditions)
  }

  render() {
    const {
      params: { brand, account },
      params,
      accountManagementModal,
      toggleModal,
      onDelete,
      activeAccount,
      router
      //dnsData
    } = this.props

    const subPage = this.getTabName(),
      isAdmin = !account,
      baseUrl = getAccountManagementUrlFromParams(params),
      //activeDomain = dnsData && dnsData.get('activeDomain'),
      accountType = ACCOUNT_TYPES.find(type => activeAccount.get('provider_type') === type.value)

    let deleteModalProps = null
    switch(accountManagementModal) {
      case DELETE_ACCOUNT:
        deleteModalProps = {
          itemToDelete: 'Account',
          cancel: () => toggleModal(null),
          submit: () => onDelete(brand, account || this.accountToDelete, router)
        }
        break
      case DELETE_GROUP:
        deleteModalProps = {
          itemToDelete: this.state.groupToDelete.get('name'),
          description: 'Please confirm by writing "delete" below, and pressing the delete button. This group, and all properties it contains will be removed from UDN immediately.',
          cancel: () => toggleModal(null),
          submit: () => this.deleteGroupFromActiveAccount(this.state.groupToDelete)
        }
    }

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
      deleteAccount: this.showDeleteAccountModal,
      deleteUser: this.showDeleteUserModal,
      editGroup: this.showEditGroupModal,
      account: activeAccount,
      toggleModal,
      params,
      isAdmin,
      editAccount: this.showAccountForm,
      onSave: this.editAccount,
      uiActions: this.props.uiActions,
      validate: this.validateAccountDetails,
      initialValues: {
        accountName: activeAccount.get('name'),
        accountBrand: 'udn',
        brand: 'udn',
        services: activeAccount.get('services'),
        accountType: accountType && accountType.value
      },
      roles: this.props.roles,
      permissions: this.props.permissions,
      users: this.props.users
    }
    return (
      <PageContainer className="account-management">
        <Content>
          <div className="account-management-manage-account">
            <PageHeader>
              <p>ACCOUNT MANAGEMENT</p>
              <IsAllowed to={PERMISSIONS.VIEW_CONTENT_ACCOUNTS}>
                <AccountSelector
                  as="accountManagement"
                  params={{ brand, account }}
                  topBarTexts={{ brand: 'UDN Admin' }}
                  topBarAction={() => router.push(`${getRoute('accountManagement')}/${brand}`)}
                  onSelect={(...params) => router.push(`${getUrl(getRoute('accountManagement'), ...params)}/${subPage}`)}
                  restrictedTo="account">
                  <div className="btn btn-link dropdown-toggle header-toggle">
                    <h1><TruncatedTitle content={activeAccount.get('name') || 'No active account'}
                      tooltipPlacement="bottom" className="account-property-title"/></h1>
                    <span className="caret"></span>
                  </div>
                </AccountSelector>
              </IsAllowed>
              <IsAllowed not={true} to={PERMISSIONS.VIEW_CONTENT_ACCOUNTS}>
                <h1>{activeAccount.get('name') || 'No active account'}</h1>
              </IsAllowed>
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
              {/*
              <li className="navbar">
                <Link to={baseUrl + '/brands'} activeClassName="active">BRANDS</Link>
              </li>*/}
              <IsAllowed to={PERMISSIONS.VIEW_DNS}>
               <li className="navbar">
                 <Link to={baseUrl + '/dns'} activeClassName="active">DNS</Link>
               </li>
              </IsAllowed>
              <li className="navbar">
                <Link to={baseUrl + '/roles'} activeClassName="active">ROLES</Link>
              </li>
              {/*
               <li className="navbar">
               <Link to={baseUrl + '/services'} activeClassName="active">SERVICES</Link>
               </li>
               */}
            </Nav>}
            <Content className="tab-bodies">
              {this.props.children && React.cloneElement(this.props.children, childProps)}
            </Content>
          </div>
          {accountManagementModal === ADD_ACCOUNT &&
          <AccountForm
            id="account-form"
            onSave={this.editAccount}
            account={this.accountToUpdate}
            onCancel={() => toggleModal(null)}
            show={true}/>}
          {deleteModalProps && <DeleteModal {...deleteModalProps}/>}
          {accountManagementModal === DELETE_USER &&
          <DeleteUserModal
            itemToDelete={this.userToDelete}
            cancel={() => toggleModal(null)}
            submit={this.deleteUser}/>}
          {accountManagementModal === EDIT_GROUP && this.state.groupToUpdate &&
          <GroupForm
            id="group-form"
            group={this.state.groupToUpdate}
            account={activeAccount}
            onSave={(id, data, addUsers, deleteUsers) => this.editGroupInActiveAccount(id, data, addUsers, deleteUsers)}
            onCancel={() => toggleModal(null)}
            show={true}
            users={this.props.users}
          />}
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
  children: PropTypes.node,
  dnsActions: PropTypes.object,
  dnsData: PropTypes.instanceOf(Map),
  //fetchAccountData: PropTypes.func,
  groupActions: PropTypes.object,
  groups: PropTypes.instanceOf(List),
  history: PropTypes.object,
  hostActions: PropTypes.object,
  onDelete: PropTypes.func,
  params: PropTypes.object,
  permissions: PropTypes.instanceOf(Map),
  permissionsActions: PropTypes.object,
  roles: PropTypes.instanceOf(List),
  rolesActions: PropTypes.object,
  router: PropTypes.object,
  soaFormData: PropTypes.object,
  toggleModal: PropTypes.func,
  uiActions: PropTypes.object,
  userActions: PropTypes.object,
  users: PropTypes.instanceOf(List)
}
AccountManagement.defaultProps = {
  activeAccount: Map(),
  dnsData: Map(),
  groups: List(),
  roles: List(),
  users: List()
}

function mapStateToProps(state) {
  return {
    accountManagementModal: state.ui.get('accountManagementModal'),
    accounts: state.account.get('allAccounts'),
    activeAccount: state.account.get('activeAccount') || Map({}),
    activeRecordType: state.dns.get('activeRecordType'),
    dnsData: state.dns,
    groups: state.group.get('allGroups'),
    permissions: state.permissions,
    roles: state.roles.get('roles'),
    soaFormData: state.form.soaEditForm,
    users: state.user.get('allUsers')
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
  const userActions = bindActionCreators(userActionCreators, dispatch)
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
            buttons: <Button onClick={uiActions.hideInfoDialog} bsStyle="primary">OK</Button>
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
    userActions: userActions,
    onDelete
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AccountManagement))
