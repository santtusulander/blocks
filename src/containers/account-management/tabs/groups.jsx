import React from 'react'
import { Tooltip, FormControl, FormGroup, Table, Button } from 'react-bootstrap'
import { FormattedMessage, injectIntl } from 'react-intl'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'
import { Field } from 'redux-form'

import * as userActionCreators from '../../../redux/modules/user'
import * as groupActionCreators from '../../../redux/modules/group'
import * as uiActionCreators from '../../../redux/modules/ui'

import FieldFormGroup from '../../../components/form/field-form-group'
import PageContainer from '../../../components/layout/page-container'
import SectionHeader from '../../../components/layout/section-header'
import ActionButtons from '../../../components/action-buttons'
import IconAdd from '../../../components/icons/icon-add'
import TableSorter from '../../../components/table-sorter'
import InlineAdd from '../../../components/inline-add'
// import FilterChecklistDropdown from '../../../components/filter-checklist-dropdown/filter-checklist-dropdown'
import ArrayTd from '../../../components/array-td/array-td'
import IsAllowed from '../../../components/is-allowed'
import MultilineTextFieldError from '../../../components/shared/forms/multiline-text-field-error'

import { formatUnixTimestamp, checkForErrors, getSortData} from '../../../util/helpers'
import { isValidTextField } from '../../../util/validators'
import AsnLookup from '../../../components/form/field-form-group-asn-lookup'
import { MODIFY_GROUP, CREATE_GROUP } from '../../../constants/permissions'

class AccountManagementAccountGroups extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      adding: false,
      editing: null,
      newUsers: Immutable.List(),
      search: '',
      sortBy: 'name',
      sortDir: 1
    }

    this.addGroup        = this.addGroup.bind(this)
    this.changeSort      = this.changeSort.bind(this)
    this.deleteGroup     = this.deleteGroup.bind(this)
    this.editGroup       = this.editGroup.bind(this)
    this.saveEditedGroup = this.saveEditedGroup.bind(this)
    this.saveNewGroup    = this.saveNewGroup.bind(this)
    this.cancelAdding    = this.cancelAdding.bind(this)
    this.changeSearch    = this.changeSearch.bind(this)
    this.changeNewUsers  = this.changeNewUsers.bind(this)
    this.shouldLeave     = this.shouldLeave.bind(this)
    this.validateInlineAdd = this.validateInlineAdd.bind(this)
    this.isLeaving       = false;
  }
  componentWillMount() {
    const {router, route, params: { brand, account }} = this.props
    this.props.userActions.fetchUsers(brand, account)

    if (!this.props.groups.toJS().length) {
      this.props.groupActions.fetchGroups(brand, account);
    }
    router.setRouteLeaveHook(route, this.shouldLeave)
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.params.account !== this.props.params.account) {
      const { brand, account } = nextProps.params
      this.props.userActions.fetchUsers(brand, account)
    }
  }

  cancelAdding() {
    this.setState({
      adding: false,
      editing: null
    })
  }

  addGroup(e) {
    e.stopPropagation()
    this.setState({
      adding: true,
      newUsers: Immutable.List()
    })
  }

  changeSort(column, direction) {
    this.setState({
      sortBy: column,
      sortDir: direction
    })
  }

  // TODO: Now that this is a container, no need to pass this in
  deleteGroup(group) {
    return () => this.props.deleteGroup(group)
  }

  editGroup(group) {
    return (e) => {
      e.preventDefault()
      e.stopPropagation()
      this.setState({ editing: group })
    }
  }

  validateInlineAdd({name = ''}){
    const conditions = {
      name: [
        {
          condition: !isValidTextField(name),
          errorText: <MultilineTextFieldError fieldLabel="portal.account.groupForm.name.label" />
        }
      ]
    }
    return checkForErrors({ name }, conditions)
  }

  // TODO: Now that this is a container, no need to pass this in
  saveEditedGroup(group) {
    return name => this.props.editGroup(group, name).then(this.cancelAdding)
  }

  // TODO: Now that this is a container, no need to pass this in
  saveNewGroup(values) {
    this.props.addGroup(values)
      .then(newGroup => {
        return Promise.all(this.state.newUsers.map(email => {
          const foundUser = this.props.users
            .find(user => user.get('email') === email)
          const newUser = {
            group_id: foundUser.get('group_id').push(newGroup.id).toJS()
          }
          return this.props.userActions.updateUser(email, newUser)
        }))
      })
      .then(this.cancelAdding)
  }

  changeSearch(e) {
    this.setState({
      search: e.target.value
    })
  }

  changeNewUsers(val) {
    this.setState({newUsers: val})
  }

  shouldLeave({ pathname }) {
    if (!this.isLeaving && this.state.adding) {
      this.props.uiActions.showInfoDialog({
        title: <FormattedMessage id="portal.common.error.warning.title"/>,
        content: <FormattedMessage id="portal.account.groups.modal.unsaved.content"/>,
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

  filteredData( groupName ) {
    return this.props.groups.filter((group) => {
      return group.get('name').toLowerCase().includes(groupName)
    })
  }

  render() {
    const sorterProps  = {
      activateSort: this.changeSort,
      activeColumn: this.state.sortBy,
      activeDirection: this.state.sortDir
    }
    const filteredGroups = this.filteredData(this.state.search.toLowerCase())

    const sortedGroups = getSortData(filteredGroups, this.state.sortBy, this.state.sortDir)
    const numHiddenGroups = this.props.groups.size - sortedGroups.size;
    const errorTooltip = ({ error, active }) =>
      !active &&
        <Tooltip placement="bottom" className="in" id="tooltip-bottom">
          {error}
        </Tooltip>
    const inlineAddInputs = [
      [
        {
          input: <Field
            name="name"
            id="name"
            ErrorComponent={errorTooltip}
            placeholder={this.props.intl.formatMessage({id: 'portal.account.groups.name.placeholder'})}
            component={FieldFormGroup}/>
        }
      ],
      [
        // Disable until API support allows listing groups for user with some assigned
        // {
        //   input: <FilterChecklistDropdown
        //     id='members'
        //     value={this.state.newUsers}
        //     handleCheck={this.changeNewUsers}
        //     options={this.props.users.map(user => Immutable.Map({
        //       label: user.get('email') || this.props.intl.formatMessage({id: 'portal.account.groups.email.notSet.placeholder'}),
        //       value: user.get('email')
        //     }))}/>
        // }
      ],
      []
    ]
    const groupSize = sortedGroups.size
    const groupText = sortedGroups.size === 1 ? ` ${this.props.intl.formatMessage({id: 'portal.account.groups.single.text'})}` : ` ${this.props.intl.formatMessage({id: 'portal.account.groups.multiple.text'})}`
    const hiddenGroupText = numHiddenGroups ? ` (${numHiddenGroups} ${this.props.intl.formatMessage({id: 'portal.account.groups.hidden.text'})})` : ''
    const finalGroupText = groupSize + groupText + hiddenGroupText
    return (
      <PageContainer className="account-management-account-groups">
        <AsnLookup />
        <SectionHeader sectionHeaderTitle={finalGroupText}>
          <FormGroup className="search-input-group">
            <FormControl
              type="text"
              className="search-input"
              placeholder={this.props.intl.formatMessage({id: 'portal.common.search.text'})}
              value={this.state.search}
              onChange={this.changeSearch} />
          </FormGroup>
          <IsAllowed to={CREATE_GROUP}>
            <Button bsStyle="success" className="btn-icon" onClick={this.addGroup}>
              <IconAdd />
            </Button>
          </IsAllowed>
        </SectionHeader>

        <Table striped={true}>
          <thead>
            <tr>
              <TableSorter {...sorterProps} column="name">
                <FormattedMessage id="portal.account.groups.table.name.text"/>
              </TableSorter>
              <th><FormattedMessage id="portal.account.groups.table.members.text"/></th>
              <TableSorter {...sorterProps} column="created">
                <FormattedMessage id="portal.account.groups.table.createdOn.text"/>
              </TableSorter>
              {/* Not on 0.7
              <th><FormattedMessage id="portal.account.groups.table.properties.text"/></th>
              */}
              <th width="1%"/>
            </tr>
          </thead>
          <tbody>
          {this.state.adding && <InlineAdd
            validate={this.validateInlineAdd}
            inputs={inlineAddInputs}
            unmount={this.cancelAdding}
            save={this.saveNewGroup}/>}
          {sortedGroups.map((group, i) => {
            const userEmails = this.props.users
              .filter(user => user.get('group_id') &&
                user.get('group_id').size &&
                user.get('group_id').includes(group.get('id'))
              )
              .map(user => user.get('email'))
            return (
              <tr key={i}>
                <td>{group.get('name')}</td>
                <ArrayTd items={userEmails.size ? userEmails.toArray() : [this.props.intl.formatMessage({id: 'portal.account.groups.table.noMembers.text'})]} />
                <td>{formatUnixTimestamp(group.get('created'))}</td>
                {/* Not on 0.7
                <td>NEEDS_API</td>
                */}
                <td className="nowrap-column">
                  <IsAllowed to={MODIFY_GROUP}>
                    <ActionButtons onEdit={() => {this.props.editGroup(group)}} onDelete={() => {this.props.deleteGroup(group)}} />
                  </IsAllowed>
                </td>
              </tr>
            )
          })}
          </tbody>
        </Table>

        {
          sortedGroups.size === 0 &&
          this.state.search.length > 0 &&
          <div className="text-center"><FormattedMessage id="portal.account.groups.table.noGroupsFound.text" values={{searchTerm: this.state.search}}/></div>
        }
      </PageContainer>
    )
  }
}

AccountManagementAccountGroups.displayName  = 'AccountManagementAccountGroups'
AccountManagementAccountGroups.propTypes    = {
  addGroup: React.PropTypes.func,
  deleteGroup: React.PropTypes.func,
  editGroup: React.PropTypes.func,
  groupActions: React.PropTypes.object,
  groups: React.PropTypes.instanceOf(Immutable.List),
  intl: React.PropTypes.object,
  params: React.PropTypes.object,
  route: React.PropTypes.object,
  router: React.PropTypes.object,
  uiActions: React.PropTypes.object,
  userActions: React.PropTypes.object,
  users: React.PropTypes.instanceOf(Immutable.List)
}
AccountManagementAccountGroups.defaultProps = {
  groups: Immutable.List(),
  users: Immutable.List()
}

function mapStateToProps(state) {
  return {
    users: state.user.get('allUsers'),
    groups: state.group.get('allGroups')
  }
}

function mapDispatchToProps(dispatch) {
  return {
    groupActions: bindActionCreators(groupActionCreators, dispatch),
    uiActions: bindActionCreators(uiActionCreators, dispatch),
    userActions: bindActionCreators(userActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withRouter(AccountManagementAccountGroups)))
