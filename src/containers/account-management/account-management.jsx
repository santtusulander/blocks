import React, { PropTypes, Component } from 'react'
import { List, Map } from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter, Link } from 'react-router'
import { FormattedMessage } from 'react-intl'
import { Button } from 'react-bootstrap'

import { getRoute } from '../../util/routes'

import {
  accountIsServiceProviderType,
  accountIsContentProviderType
} from '../../util/helpers'

import { getLocationPermissions } from '../../util/permissions'

import * as dnsActionCreators from '../../redux/modules/dns'
import * as hostActionCreators from '../../redux/modules/host'
import * as permissionsActionCreators from '../../redux/modules/permissions'
import * as rolesActionCreators from '../../redux/modules/roles'
import * as userActionCreators from '../../redux/modules/user'
import * as uiActionCreators from '../../redux/modules/ui'

import { parseResponseError } from '../../redux/util'

import accountActionCreators from '../../redux/modules/entities/accounts/actions'
import { getByBrand, getById as getAccountById} from '../../redux/modules/entities/accounts/selectors'
import groupActionCreators from '../../redux/modules/entities/groups/actions'
import usersActions from '../../redux/modules/entities/users/actions'

import Content from '../../components/shared/layout/content'
import PageHeader from '../../components/shared/layout/page-header'
import ModalWindow from '../../components/shared/modal'
import AccountSelector from '../../components/global-account-selector/account-selector-container'
import IsAllowed from '../../components/shared/permission-wrappers/is-allowed'
import TruncatedTitle from '../../components/shared/page-elements/truncated-title'
import IconCaretDown from '../../components/shared/icons/icon-caret-down'
import IconEdit from '../../components/shared/icons/icon-edit'
import MultilineTextFieldError from '../../components/shared/form-elements/multiline-text-field-error'

import EntityEdit from '../../components/account-management/entity-edit'

import Tabs from '../../components/shared/page-elements/tabs'

import { ACCOUNT_TYPES } from '../../constants/account-management-options'
import {
  ADD_ACCOUNT,
  ADD_GROUP,
  DELETE_ACCOUNT,
  DELETE_GROUP,
  EDIT_GROUP,
  DELETE_USER
} from '../../constants/account-management-modals.js'
import * as PERMISSIONS from '../../constants/permissions.js'

import { checkForErrors } from '../../util/helpers'
import { isValidTextField } from '../../util/validators'
import { getUrl, getAccountManagementUrlFromParams } from '../../util/routes'

export class AccountManagement extends Component {
  constructor(props) {
    super(props)
    this.userToDelete = ''

    this.state = {
      accountToDelete: null,
      accountToUpdate: null,
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
    this.showGroupModal = this.showGroupModal.bind(this)
    this.validateAccountDetails = this.validateAccountDetails.bind(this)
    this.deleteUser = this.deleteUser.bind(this)
    this.deleteAccount = this.deleteAccount.bind(this)
  }

  editSOARecord() {
    // TODO: to be deleted (or fixed) as part of UDNP-2204
    // const { soaFormData, dnsActions, dnsData, toggleModal } = this.props
    // const activeDomain = dnsData.get('activeDomain')
    // const data = getValues(soaFormData)
    // dnsActions.editSOA({ id: activeDomain.get('id'), data })
    // toggleModal(null)
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
    this.setState({ accountToDelete: account })
    this.props.toggleModal(DELETE_ACCOUNT);
  }

  deleteUser() {
    return this.props.deleteUser(this.userToDelete)
      .then(() => {
        this.props.toggleModal(null)
        this.showNotification(<FormattedMessage id="portal.accountManagement.userRemoved.text" />)
      })
  }

  deleteAccount(brandId, accountId, router) {
    return this.props.accountActions.remove({brand: brandId, id: accountId})
      .then(() => {
        this.props.toggleModal(null)
        router.replace(getUrl(getRoute('accountManagement'), 'brand', brandId, {}))
      })
      .then(() => this.showNotification(<FormattedMessage id="portal.accountManagement.accountDeleted.text"/>))
      .catch(response => {
        // Hide the delete modal.
        this.props.toggleModal(null)
        this.props.uiActions.showInfoDialog({
          title: <FormattedMessage id="portal.errorModal.error.text" />,
          content: response.data.message,
          okButton: true,
          cancel: () => this.props.uiActions.hideInfoDialog()
        })
      })
  }

  addGroupToActiveAccount({ data, usersToAdd }) {
    const {activeAccount, groupActions, hostActions, users, userActions, toggleModal } = this.props
    return groupActions.create({brand: 'udn', account: activeAccount.get('id'), payload: data})
      .then(({ payload }) => {
        hostActions.clearFetchedHosts()
        return Promise.all(usersToAdd.map(email => {
          const foundUser = users
            .find(user => user.get('email') === email)
          const newUser = {
            group_id: foundUser.get('group_id').push(payload.id).toJS()
          }
          return userActions.updateUser(email, newUser)
        }))
      })
      .then(() => {
        this.showNotification(<FormattedMessage id="portal.accountManagement.groups.created"/>)
        toggleModal()
      })
  }

  deleteGroupFromActiveAccount(group) {
    return this.props.groupActions.remove({
      brand: 'udn',
      account: this.props.activeAccount.get('id'),
      id: group.get('id')
    }).then(response => {
      this.props.toggleModal(null)
      if (response.error) {
        this.props.uiActions.showInfoDialog({
          title: 'Error',
          content: parseResponseError(response.payload),
          okButton: true,
          cancel: () => this.props.uiActions.hideInfoDialog()
        })
      } else {
        this.showNotification(<FormattedMessage id="portal.accountManagement.groups.delete"/>)
      }

    })
  }

  editGroupInActiveAccount({groupId, data, addUsers, deleteUsers}) {
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
      this.props.groupActions.update(
        {
          brand: 'udn',
          account: this.props.activeAccount.get('id'),
          id: groupId,
          payload: data
        }
      ),
      ...addUserActions,
      ...deleteUserActions
    ])
      .then(() => {
        this.props.toggleModal(null)
        this.showNotification(<FormattedMessage id="portal.accountManagement.groupUpdated.text"/>)
      })
  }

  showGroupModal(group) {
    const { toggleModal, groupActions, params: { account, brand } } = this.props
    if (!group) {
      toggleModal(ADD_GROUP)
    } else {
      groupActions.fetchOne({brand, account, id: group.get('id')}).then(() => {
        this.setState({ groupToUpdate: group })
        toggleModal(EDIT_GROUP)
      })
    }
  }

  hideGroupModal() {
    if (this.state.groupToUpdate) {
      this.setState({ groupToUpdate: null })
    }
    this.props.toggleModal()
  }

  editAccount(brandId, accountId, data) {
    if (accountId) {
      return this.props.accountActions.update({brand: brandId, id: accountId, payload: data})
        .then(() => {
          this.props.toggleModal(null)
          this.showNotification(<FormattedMessage id="portal.accountManagement.accountUpdated.text"/>)
        })
    } else {
      return this.props.accountActions.create({brand: brandId, payload: data})
        .then(() => {
          this.props.toggleModal(null)
          this.showNotification(<FormattedMessage id="portal.accountManagement.accountCreated.text"/>)
        })
    }
  }

  showAccountForm(account) {
    this.setState({ accountToUpdate: account })

    this.props.toggleModal(ADD_ACCOUNT)
  }

  addAccount(brand, data) {
    return this.props.accountActions.create({ brand: brand, payload: data}).then(
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
    } else if (router.isActive(`${baseUrl}/properties`)) {
      return 'properties';
    }

    return '';
  }

  validateAccountDetails({ accountName, services }) {
    let nameTaken = null
    if (this.props.activeAccount.get('name') !== accountName) {
      nameTaken = {
        condition: this.props.accounts.findIndex(account => account.get('name') === accountName) > -1,
        errorText: <FormattedMessage id="portal.accountManagement.accountNameAlreadyUsed.text"/>
      }
    }
    const conditions = {
      accountName: [
        {
          condition: !isValidTextField(accountName),
          errorText: <MultilineTextFieldError fieldLabel="portal.account.manage.accountName.title" />
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
    switch (accountManagementModal) {
      case DELETE_ACCOUNT:
        deleteModalProps = {
          title: <FormattedMessage id="portal.deleteModal.header.text" values={{itemToDelete: 'Account'}}/>,
          content: <FormattedMessage id="portal.accountManagement.deleteAccountConfirmation.text"/>,
          verifyDelete: true,
          deleteButton: true,
          cancelButton: true,
          cancel: () => toggleModal(null),
          onSubmit: () => {
            this.deleteAccount(brand, this.state.accountToDelete, router)
          }
        }
        break
      case DELETE_GROUP:
        deleteModalProps = {
          title: <FormattedMessage id="portal.deleteModal.header.text" values={{itemToDelete: this.state.groupToDelete.get('name')}}/>,
          content: <FormattedMessage id="portal.accountManagement.deleteGroupConfirmation.text"/>,
          verifyDelete: true,
          cancelButton: true,
          deleteButton: true,
          cancel: () => toggleModal(null),
          onSubmit: () => this.deleteGroupFromActiveAccount(this.state.groupToDelete)
        }
        break
    }

    const childProps = {
      addGroup: this.addGroupToActiveAccount,
      showNotification: this.showNotification,
      deleteGroup: this.showDeleteGroupModal,
      deleteAccount: this.showDeleteAccountModal,
      deleteUser: this.showDeleteUserModal,
      showGroupModal: this.showGroupModal,
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
      users: this.props.users,
      currentUser: this.props.currentUser
    }

    return (
      <Content>
        <PageHeader pageSubTitle={<FormattedMessage id="portal.account.manage.accountManagement.title"/>}>
          <IsAllowed to={PERMISSIONS.VIEW_CONTENT_ACCOUNTS}>
            <AccountSelector
              params={params}
              levels={[ 'brand', 'account' ]}
              onItemClick={(entity) => {

                const { nodeInfo, idKey = 'id' } = entity
                router.push(`${getUrl(getRoute('accountManagement'), nodeInfo.entityType, entity[idKey], nodeInfo.parents)}/${subPage}`)

              }}>
              <div className="btn btn-link dropdown-toggle header-toggle">
                <h1><TruncatedTitle content={activeAccount.get('name') ||  <FormattedMessage id="portal.accountManagement.noActiveAccount.text"/>}
                  tooltipPlacement="bottom" className="account-property-title"/></h1>
                <IconCaretDown />
              </div>
            </AccountSelector>
          </IsAllowed>
          <IsAllowed not={true} to={PERMISSIONS.VIEW_CONTENT_ACCOUNTS}>
            <h1>{activeAccount.get('name') || <FormattedMessage id="portal.accountManagement.noActiveAccount.text"/>}</h1>
          </IsAllowed>

          { /*
            Edit activeAccount -button
            */
            account &&
            <IsAllowed to={PERMISSIONS.MODIFY_ACCOUNTS}>
              <Button
                bsStyle="primary"
                className="btn-icon"
                onClick={() => this.showAccountForm(this.props.activeAccount)}
                >
                <IconEdit/>
              </Button>
            </IsAllowed>
          }
        </PageHeader>
        {account && <Tabs activeKey={this.props.children.props.route.path}>
          <li data-eventKey="details">
            <Link to={baseUrl + '/details'} activeClassName="active"><FormattedMessage id="portal.accountManagement.account.text"/></Link>
          </li>
          <li data-eventKey="groups">
            <Link to={baseUrl + '/groups'} activeClassName="active"><FormattedMessage id="portal.accountManagement.groups.text"/></Link>
          </li>
          <li data-eventKey="users">
            <Link to={baseUrl + '/users'} activeClassName="active"><FormattedMessage id="portal.accountManagement.users.text"/></Link>
          </li>
          {accountIsContentProviderType(activeAccount) &&
            <IsAllowed to={PERMISSIONS.LIST_PROPERTY}>
              <li data-eventKey="properties">
                <Link to={baseUrl + '/properties'} activeClassName="active"><FormattedMessage id="portal.account.properties.title"/></Link>
              </li>
            </IsAllowed>
          }
          {accountIsContentProviderType(activeAccount) &&
           <IsAllowed to={PERMISSIONS.LIST_STORAGE}>
             <li>
               <Link to={baseUrl + '/storage'} activeClassName="active"><FormattedMessage id="portal.accountManagement.storages.text"/></Link>
             </li>
           </IsAllowed>
          }
        </Tabs>}
        {!account && <Tabs activeKey={this.props.children.props.route.path}>
          <li data-eventKey="accounts">
            <Link to={baseUrl + '/accounts'} activeClassName="active"><FormattedMessage id="portal.accountManagement.accounts.text"/></Link>
          </li>
          <li data-eventKey="users">
            <Link to={baseUrl + '/users'} activeClassName="active"><FormattedMessage id="portal.accountManagement.users.text"/></Link>
          </li>
          {/*<li>
            <Link to={baseUrl + '/brands'} activeClassName="active">BRANDS</Link>
          </li>*/}
          <IsAllowed to={PERMISSIONS.VIEW_DNS} data-eventKey="dns">
           <li>
             <Link to={baseUrl + '/dns'} activeClassName="active"><FormattedMessage id="portal.accountManagement.dns.text"/></Link>
           </li>
          </IsAllowed>
          <li data-eventKey="roles">
            <Link to={baseUrl + '/roles'} activeClassName="active"><FormattedMessage id="portal.accountManagement.roles.text"/></Link>
          </li>
          {/*
           <li data-eventKey="details">
           <Link to={baseUrl + '/services'} activeClassName="active">SERVICES</Link>
           </li>
           */}
        </Tabs>}

        {/* RENDER TAB CONTENT */}
        {this.props.children && React.cloneElement(this.props.children, childProps)}

        {/* MODALS
          Add Account
        */}
        {accountManagementModal === ADD_ACCOUNT &&
          <EntityEdit
            type='account'
            entityToUpdate={this.state.accountToUpdate}
            currentUser={this.props.currentUser}
            onCancel={() => toggleModal(null)}
            onSave={this.editAccount}
          />
        }

        { /* Delete Modal */}
        {deleteModalProps && <ModalWindow {...deleteModalProps}/>}

        { /* Delete User */}
        {accountManagementModal === DELETE_USER &&
        <ModalWindow
          title="Delete User?"
          cancelButton={true}
          deleteButton={true}
          cancel={() => toggleModal(null)}
          onSubmit={() => this.deleteUser()}>
          <h3>
            {this.userToDelete}<br/>
          </h3>
          <p>
           <FormattedMessage id="portal.user.delete.disclaimer.text"/>
          </p>
        </ModalWindow>}

        { /* Edit Group */}
        {accountManagementModal === EDIT_GROUP && this.state.groupToUpdate &&
          <EntityEdit
            type='group'
            entityToUpdate={this.state.groupToUpdate}
            canSeeLocations={accountIsServiceProviderType(this.props.activeAccount)}
            disableDelete={String(this.state.groupToUpdate.get('id')) === String(this.props.params.group)}
            locationPermissions={getLocationPermissions(childProps.roles, childProps.currentUser)}
            currentUser={this.props.currentUser}
            params={this.props.params}
            onCancel={() => this.hideGroupModal()}
            onDelete={(group) => this.showDeleteGroupModal(group)}
            onSave={this.editGroupInActiveAccount}
          />
        }

        {accountManagementModal === ADD_GROUP &&
          <EntityEdit
            type='group'
            canSeeLocations={accountIsServiceProviderType(this.props.activeAccount)}
            locationPermissions={getLocationPermissions(childProps.roles, childProps.currentUser)}
            currentUser={this.props.currentUser}
            params={this.props.params}
            onCancel={() => this.hideGroupModal()}
            onSave={this.addGroupToActiveAccount}
          />
        }
      </Content>
    )
  }
}

AccountManagement.displayName = 'AccountManagement'
AccountManagement.propTypes = {
  accountActions: PropTypes.object,
  accountManagementModal: PropTypes.string,
  accounts: PropTypes.instanceOf(List),
  activeAccount: PropTypes.instanceOf(Map),
  // activeRecordType: PropTypes.string,
  changeNotification: PropTypes.func,
  children: PropTypes.node,
  currentUser: PropTypes.instanceOf(Map),
  // dnsActions: PropTypes.object,
  // dnsData: PropTypes.instanceOf(Map),
  //fetchAccountData: PropTypes.func,
  deleteUser: PropTypes.func,
  groupActions: PropTypes.object,
  hostActions: PropTypes.object,
  params: PropTypes.object,
  permissions: PropTypes.instanceOf(Map),
  roles: PropTypes.instanceOf(List),
  router: PropTypes.object,
  // soaFormData: PropTypes.object,
  toggleModal: PropTypes.func,
  uiActions: PropTypes.object,
  userActions: PropTypes.object,
  users: PropTypes.instanceOf(List)
}
AccountManagement.defaultProps = {
  activeAccount: Map(),
  dnsData: Map(),
  roles: List(),
  users: List()
}

function mapStateToProps(state, ownProps) {
  return {
    accountManagementModal: state.ui.get('accountManagementModal'),
    accounts: getByBrand(state, ownProps.params.brand),
    activeAccount: getAccountById(state, ownProps.params.account),
    // activeRecordType: state.dns.get('activeRecordType'),
    dnsData: state.dns,
    permissions: state.permissions,
    roles: state.roles.get('roles'),
    soaFormData: state.form.soaEditForm,
    users: state.user.get('allUsers'),
    currentUser: state.user.get('currentUser')
  };
}

function mapDispatchToProps(dispatch) {
  const accountActions = bindActionCreators(accountActionCreators, dispatch)
  const dnsActions = bindActionCreators(dnsActionCreators, dispatch)
  const groupActions = bindActionCreators(groupActionCreators, dispatch)
  const hostActions = bindActionCreators(hostActionCreators, dispatch)
  const permissionsActions = bindActionCreators(permissionsActionCreators, dispatch)
  const rolesActions = bindActionCreators(rolesActionCreators, dispatch)
  const uiActions = bindActionCreators(uiActionCreators, dispatch)
  const userActions = bindActionCreators(userActionCreators, dispatch)

  return {
    accountActions: accountActions,
    changeNotification: uiActions.changeNotification,
    toggleModal: uiActions.toggleAccountManagementModal,
    dnsActions: dnsActions,
    groupActions: groupActions,
    hostActions: hostActions,
    permissionsActions: permissionsActions,
    rolesActions: rolesActions,
    uiActions: uiActions,
    userActions: userActions,
    deleteUser: (id) => dispatch(usersActions.remove({id}))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AccountManagement))
