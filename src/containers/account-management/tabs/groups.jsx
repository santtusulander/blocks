import React, {Component, PropTypes} from 'react'
import { FormControl, FormGroup, Table, Button } from 'react-bootstrap'
import { FormattedMessage, FormattedDate, injectIntl } from 'react-intl'
import { List } from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'

import * as userActionCreators from '../../../redux/modules/user'
import * as uiActionCreators from '../../../redux/modules/ui'

import groupActions from '../../../redux/modules/entities/groups/actions'
import {getByAccount as getGroupsByAccount} from '../../../redux/modules/entities/groups/selectors'

import PageContainer from '../../../components/shared/layout/page-container'
import SectionHeader from '../../../components/shared/layout/section-header'
import ActionButtons from '../../../components/shared/action-buttons'
import IconAdd from '../../../components/shared/icons/icon-add'
import TableSorter from '../../../components/shared/table-sorter'
import ArrayTd from '../../../components/shared/page-elements/array-td'
import IsAllowed from '../../../components/shared/permission-wrappers/is-allowed'
import MultilineTextFieldError from '../../../components/shared/form-elements/multiline-text-field-error'
import Paginator from '../../../components/shared/paginator/paginator'

import { unixTimestampToDate, checkForErrors, getSortData, getPage } from '../../../util/helpers'
import { isValidTextField } from '../../../util/validators'

import { DATE_FORMATS } from '../../../constants/date-formats'
import { MODIFY_GROUP, CREATE_GROUP } from '../../../constants/permissions'
import { PAGE_SIZE, MAX_PAGINATION_ITEMS } from '../../../constants/content-item-sort-options'

class AccountManagementAccountGroups extends Component {
  constructor(props) {
    super(props);

    this.state = {
      adding: false,
      editing: null,
      newUsers: List(),
      search: '',
      sortBy: 'name',
      sortDir: 1
    }

    this.changeSort      = this.changeSort.bind(this)
    this.deleteGroup     = this.deleteGroup.bind(this)
    this.editGroup       = this.editGroup.bind(this)
    this.cancelAdding    = this.cancelAdding.bind(this)
    this.changeSearch    = this.changeSearch.bind(this)
    this.changeNewUsers  = this.changeNewUsers.bind(this)
    this.onActivePageChange = this.onActivePageChange.bind(this)
    this.shouldLeave     = this.shouldLeave.bind(this)
    this.validateInlineAdd = this.validateInlineAdd.bind(this)
    this.isLeaving       = false;
  }
  componentWillMount() {
    const {router, route} = this.props
    const {brand, account} = this.props.params

    this.props.userActions.fetchUsers(brand, account)

    this.props.fetchGroups({brand, account})

    router.setRouteLeaveHook(route, this.shouldLeave)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.account !== this.props.params.account) {
      const { brand, account } = nextProps.params

      this.props.fetchGroups({brand, account})
      this.props.userActions.fetchUsers(brand, account)
    }
  }

  cancelAdding() {
    this.setState({
      adding: false,
      editing: null
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

  validateInlineAdd({name = ''}) {
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

  filteredData(groupName) {
    return this.props.groups.filter((group) => {
      return group.get('name').toLowerCase().includes(groupName)
    })
  }

  /**
   * Pushes ?page= -param to url for pagination
   */
  onActivePageChange(nextPage) {
    this.props.router.push({
      pathname: this.context.location.pathname,
      query: {
        page: nextPage
      }
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
    const groupText = this.props.intl.formatMessage({id: 'portal.account.groups.counter.text'}, {numGroups: sortedGroups.size})
    const hiddenGroupText = numHiddenGroups ? ` (${numHiddenGroups} ${this.props.intl.formatMessage({id: 'portal.account.groups.hidden.text'})})` : ''
    const finalGroupText = groupText + hiddenGroupText

    const location = this.context.location
    const currentPage = location && location.query && location.query.page && !!parseInt(location.query.page) ? parseInt(location.query.page) : 1

    const paginationProps = {
      activePage: currentPage,
      items: Math.ceil(sortedGroups.count() / PAGE_SIZE),
      onSelect: this.onActivePageChange,
      maxButtons: MAX_PAGINATION_ITEMS,
      boundaryLinks: true,
      first: true,
      last: true,
      next: true,
      prev: true
    }

    return (
      <PageContainer className="account-management-account-groups">
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
            <Button bsStyle="success" className="btn-icon" onClick={() => this.props.showGroupModal()}>
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
              <IsAllowed to={MODIFY_GROUP}>
                <th width="1%"/>
              </IsAllowed>
            </tr>
          </thead>
          <tbody>

          {getPage(sortedGroups, currentPage, PAGE_SIZE).map((group, i) => {
            const userEmails = this.props.users
              .filter(user => user.get('group_id') &&
                user.get('group_id').size &&
                user.get('group_id').includes(group.get('id'))
              )
              .map(user => user.get('email'))
            const disabledDeleteButton = String(group.get('id')) === String(this.props.params.group)
            return (
              <tr key={i}>
                <td>{group.get('name')}</td>
                <ArrayTd items={userEmails.size ? userEmails.toArray() : [this.props.intl.formatMessage({id: 'portal.account.groups.table.noMembers.text'})]} />
                <td><FormattedDate value={unixTimestampToDate(group.get('created'))} format={DATE_FORMATS.FULL_DATE}/></td>
                <IsAllowed to={MODIFY_GROUP}>
                  <td className="nowrap-column">
                      <ActionButtons
                        onEdit={() => {
                          this.props.showGroupModal(group)
                        }}
                        onDelete={() => {
                          this.props.deleteGroup(group)
                        }}
                        deleteDisabled={disabledDeleteButton}
                      />
                  </td>
                </IsAllowed>
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
        { /* Show Pagination if more items than fit on PAGE_SIZE */
          sortedGroups && sortedGroups.count() > PAGE_SIZE &&
          <Paginator {...paginationProps} />
        }
      </PageContainer>
    )
  }
}

AccountManagementAccountGroups.displayName = 'AccountManagementAccountGroups'
AccountManagementAccountGroups.propTypes = {
  deleteGroup: PropTypes.func,
  fetchGroups: PropTypes.func,
  groups: PropTypes.instanceOf(List),
  intl: PropTypes.object,
  params: PropTypes.object,
  route: PropTypes.object,
  router: PropTypes.object,
  showGroupModal: PropTypes.func,
  uiActions: PropTypes.object,
  userActions: PropTypes.object,
  users: PropTypes.instanceOf(List)
}
AccountManagementAccountGroups.defaultProps = {
  groups: List(),
  users: List()
}

/* istanbul ignore next */
const mapStateToProps = (state, ownProps) => {
  const {account} = ownProps.params

  return {
    users: state.user.get('allUsers'),
    groups: getGroupsByAccount(state, account)
  }
}

/* istanbul ignore next */
const mapDispatchToProps = (dispatch) => {

  return {
    fetchGroups: (params) => dispatch(groupActions.fetchAll(params)),

    uiActions: bindActionCreators(uiActionCreators, dispatch),
    userActions: bindActionCreators(userActionCreators, dispatch)
  };
}

AccountManagementAccountGroups.contextTypes = {
  location: PropTypes.object
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withRouter(AccountManagementAccountGroups)))
