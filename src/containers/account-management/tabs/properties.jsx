import React from 'react'
import { Tooltip, FormControl, FormGroup, Table, Button } from 'react-bootstrap'
import { FormattedMessage, injectIntl } from 'react-intl'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'
import { Field } from 'redux-form'

import groupActions from '../../../redux/modules/entities/groups/actions'
import propertyActions from '../../../redux/modules/entities/properties/actions'
import * as uiActionCreators from '../../../redux/modules/ui'
import { getByAccount as getGroupsByAccount } from '../../../redux/modules/entities/groups/selectors'
import { getByAccount as getPropertiesByAccount } from '../../../redux/modules/entities/properties/selectors'
import { getFetchingByTag } from '../../../redux/modules/fetching/selectors'

import FieldFormGroup from '../../../components/form/field-form-group'
import PageContainer from '../../../components/layout/page-container'
import SectionHeader from '../../../components/layout/section-header'
import ActionButtons from '../../../components/action-buttons'
import IconAdd from '../../../components/icons/icon-add'
import TableSorter from '../../../components/table-sorter'
import InlineAdd from '../../../components/inline-add'
import IsAllowed from '../../../components/is-allowed'
import MultilineTextFieldError from '../../../components/shared/forms/multiline-text-field-error'

import { formatUnixTimestamp} from '../../../util/helpers'
import { checkForErrors } from '../../../util/helpers'
import { isValidTextField } from '../../../util/validators'

import { MODIFY_PROPERTY, CREATE_PROPERTY } from '../../../constants/permissions'

const IS_FETCHING = 'PropertiesTabFetching'

class AccountManagementProperties extends React.Component {
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

    this.addProperty        = this.addProperty.bind(this)
    this.changeSort      = this.changeSort.bind(this)
    this.editProperty       = this.editProperty.bind(this)
    this.getSortedData      = this.getSortedData.bind(this)
    this.cancelAdding    = this.cancelAdding.bind(this)
    this.changeSearch    = this.changeSearch.bind(this)
    this.changeNewUsers  = this.changeNewUsers.bind(this)
    this.shouldLeave     = this.shouldLeave.bind(this)
    this.validateInlineAdd = this.validateInlineAdd.bind(this)
    this.isLeaving       = false;
  }
  componentWillMount() {
    const {
      router,
      route,
      properties,
      params: {
        brand,
        account
      }
    } = this.props

    if (properties.size === 0) {
      this.refreshData(brand, account)
    }
    router.setRouteLeaveHook(route, this.shouldLeave)
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.params.account !== this.props.params.account) {
      const { brand, account } = nextProps.params
      this.refreshData(brand, account)
    }
  }

  refreshData(brand, account) {
    const { fetchGroups, fetchPropertiesByIds } = this.props
    fetchGroups({ brand, account }).then(groupData => {
      for (let groupId in groupData.response.entities.groups) {
        if (groupData.response.entities.groups.hasOwnProperty(groupId)) {
          fetchPropertiesByIds({ brand, account, group: groupId })
        }
      }
    })
  }

  cancelAdding() {
    this.setState({
      adding: false,
      editing: null
    })
  }

  addProperty(e) {
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

  editProperty(property) {
    return (e) => {
      e.preventDefault()
      e.stopPropagation()
      this.setState({ editing: property })
    }
  }

  validateInlineAdd({name = ''}) {
    const { properties } = this.props
    const conditions = {
      name: [
        {
          condition: properties.findIndex(property => property.get('name') === name) > -1,
          errorText: <FormattedMessage id="portal.account.properties.name.error.exists"/>
        },
        {
          condition: !isValidTextField(name),
          errorText: <MultilineTextFieldError fieldLabel="portal.account.groupForm.name.label" />
        }
      ]
    }
    return checkForErrors({ name }, conditions)
  }

  getSortedData(data, sortBy, sortDir) {
    return data.sort((a, b) => {
      let aVal = a.get(sortBy)
      let bVal = b.get(sortBy)
      if(typeof a.get(sortBy) === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }
      if(aVal < bVal) {
        return -1 * sortDir
      }
      else if(aVal > bVal) {
        return 1 * sortDir
      }
      return 0
    })
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
    const { router, uiActions } = this.props
    const { adding } = this.state
    if (!this.isLeaving && adding) {
      uiActions.showInfoDialog({
        title: <FormattedMessage id="portal.common.error.warning.title"/>,
        content: <FormattedMessage id="portal.account.groups.modal.unsaved.content"/>,
        stayButton: true,
        continueButton: true,
        cancel: () => uiActions.hideInfoDialog(),
        onSubmit: () => {
          this.isLeaving = true
          router.push(pathname)
          uiActions.hideInfoDialog()
        }
      })
      return false;
    }
    return true
  }

  getFilteredData(searchTerm) {
    return this.props.properties.filter((property) => {
      return property.get('name').toLowerCase().includes(searchTerm)
    })
  }

  getInlineAddInputs() {
    const { intl } = this.props
    const errorTooltip = ({ error, active }) => !active && <Tooltip placement="bottom" className="in" id="tooltip-bottom">{error}</Tooltip>
    return [
      [
        {
          input: <Field
            name="name"
            id="name"
            ErrorComponent={errorTooltip}
            placeholder={intl.formatMessage({id: 'portal.account.properties.table.publishedHostname.placeholder.text'})}
            component={FieldFormGroup}/>
        }
      ],
      [
        {
          input: <Field
            name="group"
            id="group"
            ErrorComponent={errorTooltip}
            placeholder={intl.formatMessage({id: 'portal.account.properties.table.publishedHostname.placeholder.text'})}
            component={FieldFormGroup}/>
        }
      ],
      [],
      [],
      [],
      []
    ]
  }

  render() {
    const { addProperty, deleteProperty, editProperty, intl, properties } = this.props
    const { adding, search, sortBy, sortDir } = this.state

    const sorterProps  = {
      activateSort: this.changeSort,
      activeColumn: sortBy,
      activeDirection: sortDir
    }

    const filteredProperties = this.getFilteredData(search.toLowerCase())
    const sortedProperties = this.getSortedData(filteredProperties, sortBy, sortDir)
    const numHiddenProperties = properties.size - sortedProperties.size;

    const propertyText = intl.formatMessage({id: 'portal.account.properties.counter.text' }, { numProperties: sortedProperties.size })
    const hiddenPropertyText = numHiddenProperties ? ` (${numHiddenProperties} ${intl.formatMessage({id: 'portal.account.properties.hidden.text'})})` : ''
    const headerText = propertyText + hiddenPropertyText

    return (
      <PageContainer className="account-management-account-properties">
        <SectionHeader sectionHeaderTitle={headerText}>
          <FormGroup className="search-input-group">
            <FormControl
              type="text"
              className="search-input"
              placeholder={intl.formatMessage({id: 'portal.common.search.text'})}
              value={search}
              disabled={!properties.size}
              onChange={this.changeSearch} />
          </FormGroup>
          <IsAllowed to={CREATE_PROPERTY}>
            <Button bsStyle="success" className="btn-icon" onClick={this.addProperty}>
              <IconAdd />
            </Button>
          </IsAllowed>
        </SectionHeader>

        <Table striped={true}>
          <thead>
          <tr>
            <TableSorter {...sorterProps} column="name">
              <FormattedMessage id="portal.account.properties.table.publishedHostname.text"/>
            </TableSorter>
            <TableSorter {...sorterProps} column="group">
              <FormattedMessage id="portal.account.groups.single.text"/>
            </TableSorter>
            <TableSorter {...sorterProps} column="deploymentMode">
              <FormattedMessage id="portal.account.properties.table.deploymentMode.text"/>
            </TableSorter>
            <TableSorter {...sorterProps} column="originHostname">
              <FormattedMessage id="portal.account.properties.table.originHostname.text"/>
            </TableSorter>
            <TableSorter {...sorterProps} column="created">
              <FormattedMessage id="portal.account.properties.table.deployed.text"/>
            </TableSorter>
            <th width="12%"/>
          </tr>
          </thead>
          <tbody>
          {adding && <InlineAdd
            validate={this.validateInlineAdd}
            inputs={this.getInlineAddInputs()}
            unmount={this.cancelAdding}
            save={addProperty}/>}
          {sortedProperties.size > 0 && sortedProperties.map((property, i) => {
            return (
              <tr key={i}>
                <td>{property.get('published_host_id')}</td>
                <td>{property.get('group')}</td>
                <td>{property.get('deploymentMode')}</td>
                <td>{property.get('originHostname')}</td>
                <td>{formatUnixTimestamp(property.get('created'))}</td>
                <td className="nowrap-column">
                  <IsAllowed to={MODIFY_PROPERTY}>
                    <ActionButtons onEdit={() => {editProperty(property)}} onDelete={() => {deleteProperty(property)}} />
                  </IsAllowed>
                </td>
              </tr>
            )
          })}
          {
            sortedProperties.size === 0 && search.length > 0 &&
            <tr>
              <td colSpan="6">
                <FormattedMessage id="portal.account.properties.table.noPropertiesFound.text" values={{searchTerm: search}}/>
              </td>
            </tr>
          }
          {
            properties.size === 0 &&
            <tr>
              <td colSpan="6">
                <FormattedMessage id="portal.account.properties.table.noProperties.text" />
              </td>
            </tr>
          }
          </tbody>
        </Table>
      </PageContainer>
    )
  }
}

AccountManagementProperties.displayName  = 'AccountManagementAccountProperties'
AccountManagementProperties.propTypes    = {
  addProperty: React.PropTypes.func,
  deleteProperty: React.PropTypes.func,
  editProperty: React.PropTypes.func,
  fetchGroups: React.PropTypes.func,
  fetchPropertiesByIds: React.PropTypes.func,
  fetching: React.PropTypes.bool,
  groups: React.PropTypes.instanceOf(Immutable.List),
  intl: React.PropTypes.object,
  params: React.PropTypes.object,
  properties: React.PropTypes.instanceOf(Immutable.List),
  route: React.PropTypes.object,
  router: React.PropTypes.object,
  uiActions: React.PropTypes.object
}
AccountManagementProperties.defaultProps = {
  properties: Immutable.List(),
  groups: Immutable.List()
}

function mapStateToProps(state, ownProps) {
  const { account } = ownProps.params
  return {
    fetching: getFetchingByTag(state, IS_FETCHING),
    groups: getGroupsByAccount(state, account),
    properties: getPropertiesByAccount(state, account)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchGroups: (params) => dispatch(groupActions.fetchAll({ ...params, requestTag: IS_FETCHING })),
    fetchPropertiesByIds: (params) => propertyActions.fetchByIds(dispatch)({ ...params, requestTag: IS_FETCHING }),
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withRouter(AccountManagementProperties)))
