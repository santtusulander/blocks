import React, {Component, PropTypes} from 'react'
import { List, Map, is, fromJS } from 'immutable'
import { Panel, PanelGroup, Table, Button, FormGroup, FormControl, Tooltip } from 'react-bootstrap'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'
import { change, Field, SubmissionError } from 'redux-form'
import { FormattedMessage, injectIntl } from 'react-intl'

import * as uiActionCreators from '../../../redux/modules/ui'

import { parseResponseError } from '../../../redux/util'

import roleNameActions from '../../../redux/modules/entities/role-names/actions'
import { getAll as getRoles } from '../../../redux/modules/entities/role-names/selectors'

import { getAllowedRolesById } from '../../../redux/modules/entities/roles/selectors'

import rolesActions from '../../../redux/modules/entities/roles/actions'
import {getAll as getAllPermissions} from '../../../redux/modules/entities/roles/selectors'

import serviceTitleActions from '../../../redux/modules/entities/serviceTitles/actions'
import {getById as getTitlesByID} from '../../../redux/modules/entities/serviceTitles/selectors'

import usersActions from '../../../redux/modules/entities/users/actions'
import { getByPage } from '../../../redux/modules/entities/users/selectors'
import { getPaginationMeta } from '../../../redux/modules/entity/selectors'

import groupsActions from '../../../redux/modules/entities/groups/actions'
import { getById as getAccountById } from '../../../redux/modules/entities/accounts/selectors'

import { getFetchingByTag } from '../../../redux/modules/fetching/selectors'
import { getCurrentUser } from '../../../redux/modules/user'

import PageContainer from '../../../components/shared/layout/page-container'
import SectionHeader from '../../../components/shared/layout/section-header'
//import SelectWrapper from '../../../components/shared/form-elements/select-wrapper'
import ActionButtons from '../../../components/shared/action-buttons'
import FieldFormGroup from '../../../components/shared/form-fields/field-form-group'
import FieldFormGroupSelect from '../../../components/shared/form-fields/field-form-group-select'
import InlineAdd from '../../../components/shared/page-elements/inline-add'
import IconAdd from '../../../components/shared/icons/icon-add'
import IconInfo from '../../../components/shared/icons/icon-info'
import TableSorter from '../../../components/shared/table-sorter'
import UserEditModal from '../../../components/account-management/user-edit/modal'
import ArrayCell from '../../../components/shared/page-elements/array-td'
import ModalWindow from '../../../components/shared/modal'

import LoadingSpinner from '../../../components/loading-spinner/loading-spinner'
import Paginator from '../../../components/shared/paginator/paginator'

// import { ROLES_MAPPING } from '../../../constants/account-management-options'

import { checkForErrors, roleIsEditableByCurrentUser, getRoleOptionsByProviderType } from '../../../util/helpers'

import IsAllowed from '../../../components/shared/permission-wrappers/is-allowed'
import { DELETE_USER, MODIFY_USER, CREATE_USER } from '../../../constants/permissions'
import { paginationChanged } from '../../../util/pagination'

const PAGE_SIZE = 20
const MAX_PAGINATION_ITEMS = 6

export class AccountManagementAccountUsers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sortBy: 'email',
      sortOrder: parseInt(props.location.query.sortOrder) || 1,
      search: props.location.query.filterValue || '',
      filteredGroups: 'all',
      filteredRoles: 'all',
      showEditModal: false,
      showPermissionsModal: false,
      addingNew: false,
      usersGroups: List()
    }

    this.notificationTimeout = null
    this.validateInlineAdd = this.validateInlineAdd.bind(this)
    this.changeSort = this.changeSort.bind(this)
    this.newUser = this.newUser.bind(this)
    this.editUser = this.editUser.bind(this)
    this.saveUser = this.saveUser.bind(this)
    this.cancelUserEdit = this.cancelUserEdit.bind(this)
    this.toggleInlineAdd = this.toggleInlineAdd.bind(this)
    this.togglePermissionModal = this.togglePermissionModal.bind(this)
    this.shouldLeave = this.shouldLeave.bind(this)
    this.onSearchChange = this.onSearchChange.bind(this)
    this.onSearchSubmit = this.onSearchSubmit.bind(this)
    this.isLeaving = false;

    this.onActivePageChange = this.onActivePageChange.bind(this)
  }

  componentWillMount() {
    document.addEventListener('click', this.cancelAdding, false)
    const {location, router, route, params: { brand, account }} = this.props

    const {sortBy, sortOrder, filterBy, filterValue} = location.query
    const page = location.query.page ? location.query.page : 1

    this.props.fetchUsers({brand, account, page, sortBy, sortOrder, filterBy, filterValue, forceReload: true})
    this.props.fetchRoleNames()
    this.props.fetchServiceTitle({id: 'UI'})

    router.setRouteLeaveHook(route, this.shouldLeave)
  }

  componentWillReceiveProps(nextProps) {
    const {brand, account} = nextProps.params
    const { sortBy, sortOrder, filterBy, filterValue} = nextProps.location.query
    const page = nextProps.location.query.page ? nextProps.location.query.page : 1
    //if brand, account or pagination/sort has changed -> refetch
    if (brand !== this.props.params.brand
      || account !== this.props.params.account
      || paginationChanged(this.props.location, nextProps.location)) {

      this.props.fetchUsers({brand, account, page, sortBy, sortOrder, filterBy, filterValue, forceReload: true})
    }

    if (is(this.props.roles, nextProps.roles)) {
      Promise.all(
         this.props.roles.map(roleName => {
           return this.props.fetchRolePermissions({id: roleName.get('id')})
         })
       )
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.cancelAdding, false)
  }

  /**
   * Pushes ?sort/page/filter -params to url for pagination
   */
  onActivePageChange(nextPage) {
    const pathname = this.props.location.pathname

    this.props.router.push({
      pathname,
      query: {
        page: nextPage,
        sortBy: this.state.sortBy,
        sortOrder: this.state.sortOrder,
        filterBy: 'email',
        filterValue: this.state.search
      }
    })
  }

  changeSort(column, direction) {
    this.setState({
      sortBy: column,
      sortOrder: direction
    }, () => this.onActivePageChange(1)
    )
  }

  newUser({ email, roles }) {
    const { createUser, params: { brand, account } } = this.props
    const requestBody = {
      email,
      roles: [roles],
      brand_id: brand,
      account_id: Number(account),
      group_id: this.state.usersGroups.toJS()
    }
    return createUser({payload: requestBody}).then(res => {
      if (res.error) {
        throw new SubmissionError({email: parseResponseError(res.payload)})
      } else {
        this.props.showNotification(<FormattedMessage id="portal.accountManagement.userCreated.text" />)
        this.toggleInlineAdd()
        //reload from server inorder to reset pagination
        const {location, params: { brand, account }} = this.props

        const {sortBy, sortOrder, filterBy, filterValue} = location.query
        const page = location.query.page ? location.query.page : 1

        this.props.fetchUsers({brand, account, page, sortBy, sortOrder, filterBy, filterValue, forceReload: true})
      }
    })
  }

  validateInlineAdd({ email = '', roles = '' }) {
    const conditions = {
      email: [
        {
          condition: !/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i.test(email),
          errorText: 'Invalid Email.'
        }
      ]
    }
    return checkForErrors({ email, roles }, conditions)
  }

  getRoleOptions({ account, roles, allowedRoles }) {
    return getRoleOptionsByProviderType(roles, account.get('provider_type'))
      .filter(role => roleIsEditableByCurrentUser(allowedRoles, role.get('id')))
      .map(role => [role.get('id'), role.get('name')]).toJS()
  }

  getInlineAddFields() {
    /**
     * Each sub-array contains elements per <td>. If no elements are needed for a <td>, insert empty array [].
     * The positionClass-field is meant for positioning the div that wraps the input element and it's tooltip.
     * To get values from input fields via redux form, the input elements' IDs must match the inline add component's
     * fields-prop's array items.
     *
     */
    const errorTooltip = ({ error, active }) =>
      !active &&
        <Tooltip placement="bottom" className="in" id="tooltip-bottom">
          {error}
        </Tooltip>

    const roleOptions = this.getRoleOptions(this.props)

    return [
      [
        {
          input: <Field
            name="email"
            ref="emails"
            ErrorComponent={errorTooltip}
            placeholder={this.props.intl.formatMessage({id: 'portal.user.form.email.placeholder'})}
            component={FieldFormGroup}/>
        }
      ],
      [
        {
          input: <Field
            name="roles"
            className="inline-add-dropdown"
            ErrorComponent={errorTooltip}
            options={roleOptions}
            component={FieldFormGroupSelect}/>,
          positionClass: 'row col-xs-7'
        },
        {
          input: <Button bsStyle="primary" className="btn-icon" onClick={this.togglePermissionModal}>
              <IconInfo/>
            </Button>,
          positionClass: 'col-xs-2'
        }
      ]
    ]
  }

  toggleInlineAdd() {
    this.setState({ addingNew: !this.state.addingNew, usersGroups: List() })
  }

  togglePermissionModal() {
    this.setState({ showPermissionsModal: !this.state.showPermissionsModal })
  }

  getGroupsForUser(/*user*/) {
    return []

    // TODO: UDNP-3529 - Removed until we have group id in users
    // const groups = user.get('group_id')
    //   .map(groupId => this.props.groups
    //     .find(group => group.get('id') === groupId, null, Map({ name: 'Loading' }))
    //     .get('name'))
    //   .toJS()
    // return groups.length > 0 ? groups : ['User has no groups']
  }

  getRolesForUser(user) {
    return this.props.roles.size ? user.get('roles').map(roleId => this.props.roles.find(role => role.get('id') === roleId).get('name')).toJS() : []
  }

  getEmailForUser(user) {
    return user.get('email') || user.get('username')
  }

  shouldLeave({ pathname }) {
    if (!this.isLeaving && this.state.addingNew) {
      this.props.uiActions.showInfoDialog({
        title: <FormattedMessage id="portal.common.error.warning.title" />,
        content: <FormattedMessage id="portal.account.leaving.warning.text" />,
        stayButton: true,
        continueButton: true,
        cancel: () => this.props.uiActions.hideInfoDialog(),
        onSubmit: () => {
          this.isLeaving = true
          this.props.router.push(pathname)
          this.props.uiActions.hideInfoDialog()
        }
      })
      return false;
    }
    return true
  }

  deleteUser(user) {
    if (user === this.props.currentUser.get('email')) {
      this.props.uiActions.showInfoDialog({
        title: <FormattedMessage id="portal.errorModal.error.text" />,
        content: <FormattedMessage id="portal.account.delete.current.user.warning" />,
        okButton: true,
        cancel: () => this.props.uiActions.hideInfoDialog()
      })
    } else {
      this.props.deleteUser(user)
    }
  }

  editUser(user) {
    this.setState({
      userToEdit: user,
      showEditModal: true
    })
  }

  cancelUserEdit() {
    this.setState({
      userToEdit: null,
      showEditModal: false
    })
  }

  saveUser(user) {
    return this.props.updateUser({id: this.state.userToEdit.get('email'), payload: user})
      .then((response) => {
        if (!response.error) {
          this.props.showNotification(<FormattedMessage id="portal.account.editUser.userIsUpdated.text" />)

          this.setState({
            userToEdit: null,
            showEditModal: false
          })
        }

        return response
      })
  }

  onSearchChange(e) {
    this.setState({
      search: e.target.value
    })
  }

  onSearchSubmit(e) {
    if (e.key === 'Enter') {
      this.onActivePageChange(1)
    }
  }

  render() {
    const {
      fetching,
      users,
      roles,
      permissions,
      allowedRoles,
      permissionServiceTitles,
      params: {account}
    } = this.props

    //Merge corresponding UIpermissions to role object inorder to display permission modal
    const rolesWithPermission = roles.map(role => {
      const roleID = String(role.get('id'))
      return role.merge(fromJS({permissions: permissions.get(roleID)}))
    })

    const totalCount = this.props.paginationMeta && this.props.paginationMeta.get('total') ? this.props.paginationMeta.get('total') : 0

    const paginationProps = {
      activePage: parseInt(this.props.location.query.page)|| 1,
      items: Math.ceil(totalCount / PAGE_SIZE),
      onSelect: this.onActivePageChange,
      maxButtons: MAX_PAGINATION_ITEMS,
      boundaryLinks: true,
      first: true,
      last: true,
      next: true,
      prev: true
    }

    const sorterProps = {
      activateSort: this.changeSort,
      activeColumn: this.state.sortBy,
      activeDirection: this.state.sortOrder
    }

    const finalUserText = <FormattedMessage id='portal.role.list.search.userCount.text' values={{userCount: totalCount}} />

    return (
      <PageContainer>
        <SectionHeader sectionHeaderTitle={finalUserText}>
          <FormGroup className="search-input-group inline">
            <FormControl
              className="search-input"
              placeholder={this.props.intl.formatMessage({id: 'portal.user.form.search.placeholder'})}
              value={this.state.search}
              onChange={this.onSearchChange}
              onKeyPress={this.onSearchSubmit}
            />
          </FormGroup>

          {/* TODO: UDNP-3529
            commented out until we can do server side filtering for roles / groups
          <FormGroup className="inline">
            <SelectWrapper
              id='filtered-roles'
              value={this.state.filteredRoles}
              onChange={value => {
                this.setState({ filteredRoles: value })
              }}
              options={roleOptions}/>
          </FormGroup>
          <div className="form-group inline">
            <SelectWrapper
              id='filtered-groups'
              value={this.state.filteredGroups}
              onChange={value => {
                this.setState({ filteredGroups: value })
              }}
              options={groupOptions}/>
          </div>
          */}
          { account &&
            <IsAllowed to={CREATE_USER}>
              <Button bsStyle="success" className="btn-icon"
                onClick={this.toggleInlineAdd}>
                <IconAdd />
              </Button>
            </IsAllowed>
          }

        </SectionHeader>

        { fetching
          ? <LoadingSpinner />
          : <div>
              <Table striped={true}>
                <thead>
                  <tr>
                    <TableSorter {...sorterProps} column="email" width="40%">
                      <FormattedMessage id="portal.user.list.email.text" />
                    </TableSorter>
                    <th width="19%"><FormattedMessage id="portal.user.list.role.text" /></th>
                    {/* TODO: UDNP-3529 - Removed until we have group_id in user
                      <th width="20%"><FormattedMessage id="portal.user.list.groups.text" /></th>
                    */}
                    <IsAllowed to={MODIFY_USER || DELETE_USER}>
                      <th width="1%"/>
                    </IsAllowed>
                  </tr>
                </thead>
                <tbody>
                  {this.state.addingNew && <InlineAdd
                    validate={this.validateInlineAdd}
                    inputs={this.getInlineAddFields()}
                    unmount={this.toggleInlineAdd}
                    save={this.newUser}/>}

                  {users && users.map((user, i) => {
                    const userIsEditable = roleIsEditableByCurrentUser(allowedRoles, user.getIn(['roles', 0]))

                    return (
                      <tr key={i}>
                        <td>
                          {this.getEmailForUser(user)}
                        </td>
                        <ArrayCell items={this.getRolesForUser(user)} maxItemsShown={4}/>
                        { /* TODO: UDNP-3529 removed until we have group data in user
                        <ArrayCell items={this.getGroupsForUser(user)} maxItemsShown={4}/>
                        */ }
                        <IsAllowed to={MODIFY_USER || DELETE_USER}>
                          <td className="nowrap-column">
                              <ActionButtons
                                editDisabled={!userIsEditable}
                                deleteDisabled={!userIsEditable}
                                permissions={{
                                  modify: MODIFY_USER,
                                  delete: DELETE_USER
                                }}
                                onEdit={() => {
                                  this.editUser(user)
                                }}
                                onDelete={() => this.deleteUser(user.get('email'))} />
                          </td>
                        </IsAllowed>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
              {
                // Show Pagination if more items than fit on PAGE_SIZE
                totalCount > PAGE_SIZE &&
                <Paginator {...paginationProps} />
              }
            </div>
        }

        {users && users.size === 0 &&
          <div className="text-center">
            {this.state.search.length > 0 ?
              <span><FormattedMessage id="portal.user.list.noUsersFoundWithTerm.text" values={{term: this.state.search}} /></span>
            :
              <span><FormattedMessage id="portal.user.list.noUsersFound.text" /></span>
            }
            {this.state.filteredRoles !== 'all' &&
              <span>
                {this.state.search.length > 0 ? <FormattedMessage id="portal.user.list.andWithSpace.text" /> : <FormattedMessage id="portal.user.list.withWithSpace.text" />}
                <FormattedMessage id="portal.user.list.aRoleOf.text" values={{name: this.props.roles.find(role => role.get('id') === this.state.filteredRoles).get('name')}} />
              </span>
            }
            {this.state.filteredGroups !== 'all' &&
              <span><FormattedMessage id="portal.user.list.aRoleOf.text" values={{name: this.props.groups.find(group => group.get('id') === this.state.filteredGroups).get('name')}} /></span>
            }
          </div>
        }

        {this.state.showEditModal &&
          <UserEditModal
            show={this.state.showEditModal}
            user={this.state.userToEdit}
            groups={this.props.groups}
            onCancel={this.cancelUserEdit}
            onSave={this.saveUser}
            roles={this.props.roles}
            allowedRoles={allowedRoles}
          />
        }

        { !!rolesWithPermission.size && !!this.props.permissions.size && this.state.showPermissionsModal &&
          <ModalWindow
            title="View Permissions"
            closeModal={true}
            closeButton={true}
            cancel={this.togglePermissionModal}>
              {rolesWithPermission.map((role, roleIndex) => {
                return role.getIn(['permissions', 'ui']) ?
                (<PanelGroup accordion={true} key={roleIndex} defaultActiveKey="">
                  <Panel header={role.get('name')} className="permission-panel" eventKey={roleIndex}>
                    <Table striped={true} key={roleIndex}>
                      <tbody>
                      {permissionServiceTitles.map((uiPermission, uiPermissionIndex) => {
                        const permissionTitle = uiPermission.get('title')
                        const permissionName = uiPermission.get('name')
                        return (
                          <tr key={uiPermissionIndex}>
                            <td className="no-border">{permissionTitle}</td>
                            <td>
                              <b>
                                {
                                  role.getIn(['permissions', 'ui']).get(permissionName)
                                  ? <FormattedMessage id="portal.button.yes" />
                                  : <FormattedMessage id="portal.button.no" />
                                }
                              </b>
                            </td>
                          </tr>
                        )
                      }
                      )}
                      </tbody>
                    </Table>
                  </Panel>
                </PanelGroup>) : null
              })}
          </ModalWindow>
        }
      </PageContainer>
    )
  }
}

AccountManagementAccountUsers.displayName = 'AccountManagementAccountUsers'
AccountManagementAccountUsers.propTypes = {
  account: PropTypes.instanceOf(Map),
  allowedRoles: PropTypes.instanceOf(List),
  createUser: PropTypes.func,
  currentUser: PropTypes.instanceOf(Map),
  deleteUser: PropTypes.func,
  fetchRoleNames: PropTypes.func,
  fetchRolePermissions: PropTypes.func,
  fetchServiceTitle: PropTypes.func,
  fetchUsers: PropTypes.func,
  fetching: PropTypes.bool,
  groups: PropTypes.instanceOf(List),
  intl: PropTypes.object,
  location: PropTypes.object,
  paginationMeta: PropTypes.instanceOf(Map),
  params: PropTypes.object,
  permissionServiceTitles: PropTypes.instanceOf(List),
  permissions: PropTypes.instanceOf(Map),
  roles: PropTypes.instanceOf(List),
  route: PropTypes.object,
  router: PropTypes.object,
  showNotification: PropTypes.func,
  uiActions: PropTypes.object,
  updateUser: PropTypes.func,
  users: PropTypes.instanceOf(List)
}

AccountManagementAccountUsers.defaultProps = {
  roles: List(),
  allowedRoles: List()
}

/* istanbul ignore next */
const mapStateToProps = (state, ownProps) => {
  const page = ownProps.location.query.page ? ownProps.location.query.page : 1
  const permissionTitles = getTitlesByID(state,'UI')
  const currentUser = getCurrentUser(state)
  const allowedRoles = getAllowedRolesById(state, currentUser.getIn(['roles', 0]))
  return {
    account: getAccountById(state, ownProps.params.account),
    form: state.form,
    fetching: getFetchingByTag(state, 'user'),
    roles: getRoles(state),
    users: getByPage(state, page),
    currentUser,
    allowedRoles,
    permissions: getAllPermissions(state),
    paginationMeta: getPaginationMeta(state, 'user'),
    permissionServiceTitles: permissionTitles ? permissionTitles.get('resources'): List()
  }
}

/* istanbul ignore next */
const mapDispatchToProps = (dispatch) => {
  return {
    uiActions: bindActionCreators(uiActionCreators, dispatch),

    resetRoles: () => dispatch(change('inlineAdd', 'roles', '')),

    fetchGroups: (params) => dispatch(groupsActions.fetchAll(params)),
    fetchRoleNames: () => dispatch(roleNameActions.fetchAll({})),
    fetchUsers: (params) => dispatch(usersActions.fetchAll({...params, offset: (params.page - 1) * PAGE_SIZE, limit: PAGE_SIZE})),

    createUser: (user) => dispatch(usersActions.create(user)),
    updateUser: (user) => dispatch(usersActions.update(user)),
    fetchRolePermissions: (params) => dispatch(rolesActions.fetchOne(params)),
    fetchServiceTitle: (params) => dispatch(serviceTitleActions.fetchOne(params))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(AccountManagementAccountUsers)))
