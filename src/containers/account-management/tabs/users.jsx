import React, {Component, PropTypes} from 'react'
import { List, Map, is } from 'immutable'
import { Panel, PanelGroup, Table, Button, FormGroup, FormControl, Tooltip } from 'react-bootstrap'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'
import { change, Field, SubmissionError } from 'redux-form'
import { FormattedMessage } from 'react-intl'

// import * as userActionCreators from '../../../redux/modules/user'
// import * as groupActionCreators from '../../../redux/modules/group'
import * as uiActionCreators from '../../../redux/modules/ui'

import { parseResponseError } from '../../../redux/util'

import roleNameActions from '../../../redux/modules/entities/role-names/actions'
import { getAll as getRoles } from '../../../redux/modules/entities/role-names/selectors'

import usersActions from '../../../redux/modules/entities/users/actions'
import { getByAccount } from '../../../redux/modules/entities/users/selectors'

import groupsActions from '../../../redux/modules/entities/groups/actions'
import { getByAccount as getGroupsByAccount } from '../../../redux/modules/entities/groups/selectors'

import { getFetchingByTag } from '../../../redux/modules/fetching/selectors'

import PageContainer from '../../../components/shared/layout/page-container'
import SectionHeader from '../../../components/shared/layout/section-header'
import SelectWrapper from '../../../components/shared/form-elements/select-wrapper'
// import FilterChecklistDropdown from '../../../components/shared/form-elements/filter-checklist-dropdown'
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

import { ROLES_MAPPING } from '../../../constants/account-management-options'

import { checkForErrors, getSortData } from '../../../util/helpers'

import IsAllowed from '../../../components/shared/permission-wrappers/is-allowed'
import { MODIFY_USER, CREATE_USER } from '../../../constants/permissions'

export class AccountManagementAccountUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortBy: 'email',
      sortDir: 1,
      search: '',
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
    this.changeSearch = this.changeSearch.bind(this)
    this.isLeaving = false;
  }

  componentWillMount() {
    document.addEventListener('click', this.cancelAdding, false)
    const {router, route, params: { brand, account }} = this.props

    this.props.fetchUsers({brand, account})
    this.props.fetchGroups({brand, account})
    this.props.fetchRoleNames()

//    if (!this.props.groups.toJS().length) {
//      this.props.groupActions.fetchGroups(brand, account);
//    }
//
    router.setRouteLeaveHook(route, this.shouldLeave)
  }

  componentWillReceiveProps(nextProps) {
    const {brand, account} = nextProps.params

    if (!is(this.props.account, nextProps.account)) {

      this.props.fetchUsers({brand, account})
      this.props.fetchGroups({brand, account})

      !this.state.usersGroups.isEmpty() && this.setState({ usersGroups: List() })
      this.props.resetRoles()

    }

  }

  componentWillUnmount() {
    document.removeEventListener('click', this.cancelAdding, false)
  }


  changeSort(column, direction) {
    this.setState({
      sortBy: column,
      sortDir: direction
    })
  }

  newUser({ email, roles }) {
    const { userActions: { create: createUser }, params: { brand, account } } = this.props
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

  getRoleOptions(roleMapping, props) {
    return roleMapping
      .filter(role => role.accountTypes.includes(props.account.get('provider_type')))
      .map(mapped_role => {
        const matchedRole = props.roles.find(role => role.get('id') === mapped_role.id)
        return matchedRole
              ? [ matchedRole.get('id'), matchedRole.get('name') ]
              : [mapped_role.id, <FormattedMessage id='portal.accountManagement.accountsType.unknown.text'/>]
      })
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

    const roleOptions = this.getRoleOptions(ROLES_MAPPING, this.props)
    return [
      [
        {
          input: <Field
            name="email"
            ref="emails"
            ErrorComponent={errorTooltip}
            placeholder=" Email"
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
          positionClass: 'row col-xs-10'
        },
        {
          input: <Button bsStyle="primary" className="btn-icon" onClick={this.togglePermissionModal}>
              <IconInfo/>
            </Button>,
          positionClass: 'col-xs-2 text-right'
        }
      ],
      [
        // Disable until API support allows listing groups for user with some assigned
        // {
        //   input: <FilterChecklistDropdown
        //     className="inline-add-dropdown"
        //     value={this.state.usersGroups}
        //     handleCheck={newValues => {
        //       this.setState({ usersGroups: newValues })
        //     }}
        //     options={this.props.groups.map(group => Map({ value: group.get('id'), label: group.get('name') }))}/>,
        //   positionClass: 'row col-xs-7'
        // }
      ]
    ]
  }

  toggleInlineAdd() {
    this.setState({ addingNew: !this.state.addingNew, usersGroups: List() })
  }

  togglePermissionModal() {
    this.setState({ showPermissionsModal: !this.state.showPermissionsModal })
  }

  getGroupsForUser(user) {
    const groups = user.get('group_id')
      .map(groupId => this.props.groups
        .find(group => group.get('id') === groupId, null, Map({ name: 'Loading' }))
        .get('name'))
      .toJS()
    return groups.length > 0 ? groups : ['User has no groups']
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
        title: 'Warning',
        content: 'You have made changes to the User(s), are you sure you want to exit without saving?',
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
    if (user === this.props.currentUser) {
      this.props.uiActions.showInfoDialog({
        title: 'Error',
        content: 'You cannot delete the account you are logged in with.',
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
    return this.props.userActions.update({id: this.state.userToEdit.get('email'), payload: user})
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

  changeSearch(e) {
    this.setState({
      search: e.target.value
    })
  }

  render() {
    const {fetching} = this.props

    if (fetching) {
      return <LoadingSpinner />
    }


    const users = this.props.users;
    const sorterProps = {
      activateSort: this.changeSort,
      activeColumn: this.state.sortBy,
      activeDirection: this.state.sortDir
    }
    const filteredUsersByRole = users.filter((user) => {
      if (this.state.filteredRoles === 'all') {
        return true
      } else {
        return user.get('roles').find(role => {
          return this.state.filteredRoles === role
        })
      }
    })
    const filteredUsersByGroup = filteredUsersByRole.filter((user) => {
      if (this.state.filteredGroups === 'all') {
        return true
      } else {
        return user.get('group_id').find(group => {
          return this.state.filteredGroups === group
        })
      }
    })
    const searchedUsers = filteredUsersByGroup.filter((user) => {
      return this.getEmailForUser(user).toLowerCase().includes(this.state.search.toLowerCase())
    })
    const sortedUsers = getSortData(searchedUsers, this.state.sortBy, this.state.sortDir)

    const roleOptions = this.getRoleOptions(ROLES_MAPPING, this.props)
    roleOptions.unshift(['all', 'All Roles'])

    const groupOptions = this.props.groups.map(group => [
      group.get('id'),
      group.get('name')
    ]).insert(0, ['all', 'All Groups']).toArray()
    const numHiddenUsers = users.size - sortedUsers.size;

    const usersSize = sortedUsers.size
    const usersText = ` User${sortedUsers.size === 1 ? '' : 's'}`
    const hiddenUserText = numHiddenUsers ? ` (${numHiddenUsers} hidden)` : ''
    const finalUserText = usersSize + usersText + hiddenUserText

    return (
      <PageContainer>
        <SectionHeader sectionHeaderTitle={finalUserText}>
          <FormGroup className="search-input-group inline">
            <FormControl
              className="search-input"
              placeholder="Search"
              value={this.state.search}
              onChange={this.changeSearch} />
          </FormGroup>
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
          <IsAllowed to={CREATE_USER}>
            <Button bsStyle="success" className="btn-icon"
              onClick={this.toggleInlineAdd}>
              <IconAdd />
            </Button>
          </IsAllowed>
        </SectionHeader>

        <Table striped={true}>
          <thead>
            <tr>
              <TableSorter {...sorterProps} column="email" width="40%">
                <FormattedMessage id="portal.user.list.email.text" />
              </TableSorter>
              <th width="19%"><FormattedMessage id="portal.user.list.role.text" /></th>
              <th width="20%"><FormattedMessage id="portal.user.list.groups.text" /></th>
              <th width="1%"/>
            </tr>
          </thead>
          <tbody>
            {this.state.addingNew && <InlineAdd
              validate={this.validateInlineAdd}
              inputs={this.getInlineAddFields()}
              unmount={this.toggleInlineAdd}
              save={this.newUser}/>}
            {sortedUsers.map((user, i) => {
              return (
                <tr key={i}>
                  <td>
                    {this.getEmailForUser(user)}
                  </td>
                  <ArrayCell items={this.getRolesForUser(user)} maxItemsShown={4}/>
                  <ArrayCell items={this.getGroupsForUser(user)} maxItemsShown={4}/>
                  <td className="nowrap-column">
                    <IsAllowed to={MODIFY_USER}>
                      <ActionButtons
                        onEdit={() => {
                          this.editUser(user)
                        }}
                        onDelete={() => this.deleteUser(user.get('email'))} />
                    </IsAllowed>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>

        {sortedUsers.size === 0 &&
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
            accountType={this.props.account.get('provider_type')}
            groups={this.props.groups}
            onCancel={this.cancelUserEdit}
            onSave={this.saveUser}
            roles={this.props.roles}
          />
        }

        { !!this.props.roles.size && !!this.props.permissions.size && this.state.showPermissionsModal &&
          <ModalWindow
            title="View Permissions"
            closeModal={true}
            closeButton={true}
            cancel={this.togglePermissionModal}>
              {this.props.roles.map((role, roleIndex) => {
                return role.getIn(['permissions', 'ui']) ?
                (<PanelGroup accordion={true} key={roleIndex} defaultActiveKey="">
                  <Panel header={role.get('name')} className="permission-panel" eventKey={roleIndex}>
                    <Table striped={true} key={roleIndex}>
                      <tbody>
                      {this.props.permissions.get('ui').map((uiPermission, uiPermissionIndex) => {
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
  currentUser: PropTypes.string,
  deleteUser: PropTypes.func,
  fetchGroups: PropTypes.func,
  fetchRoleNames: PropTypes.func,
  fetchUsers: PropTypes.func,
  fetching: PropTypes.bool,
  groups: PropTypes.instanceOf(List),
  params: PropTypes.object,
  permissions: PropTypes.instanceOf(Map),
  resetRoles: PropTypes.func,
  roles: PropTypes.instanceOf(List),
  route: PropTypes.object,
  router: PropTypes.object,
  showNotification: PropTypes.func,
  uiActions: PropTypes.object,
  userActions: PropTypes.object,
  users: PropTypes.instanceOf(List)
}

AccountManagementAccountUsers.defaultProps = {
  roles: List()
}

/* istanbul ignore next */
const mapStateToProps = (state, ownProps) => {
  const {account} = ownProps.params

  return {
    form: state.form,
    fetching: getFetchingByTag(state, 'user'),
    roles: getRoles(state),
    users: getByAccount(state, account),
    currentUser: state.user.get('currentUser').get('email'),
    permissions: state.permissions,
    groups: getGroupsByAccount(state, account)
  }
}

/* istanbul ignore next */
const mapDispatchToProps = (dispatch) => {
  return {
    uiActions: bindActionCreators(uiActionCreators, dispatch),

    resetRoles: () => dispatch(change('inlineAdd', 'roles', '')),

    fetchGroups: (params) => dispatch(groupsActions.fetchAll(params)),
    fetchRoleNames: () => dispatch(roleNameActions.fetchAll({})),
    fetchUsers: (params) => dispatch(usersActions.fetchAll(params)),
    userActions: bindActionCreators(usersActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AccountManagementAccountUsers))
