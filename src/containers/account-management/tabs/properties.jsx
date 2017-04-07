import React from 'react'
import { FormControl, FormGroup, Table, Button } from 'react-bootstrap'
import { FormattedMessage, injectIntl } from 'react-intl'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'

import groupActions from '../../../redux/modules/entities/groups/actions'
import propertyActions from '../../../redux/modules/entities/properties/actions'
import * as uiActionCreators from '../../../redux/modules/ui'
import { getByAccount as getGroupsByAccount } from '../../../redux/modules/entities/groups/selectors'
import { getByAccount as getPropertiesByAccount } from '../../../redux/modules/entities/properties/selectors'
import { getFetchingByTag } from '../../../redux/modules/fetching/selectors'

import withPagination from '../../../decorators/pagination-hoc'

import PageContainer from '../../../components/layout/page-container'
import SectionHeader from '../../../components/layout/section-header'
import ActionButtons from '../../../components/action-buttons'
import IconAdd from '../../../components/shared/icons/icon-add'
import TableSorter from '../../../components/table-sorter'
import IsAllowed from '../../../components/is-allowed'
import MultilineTextFieldError from '../../../components/shared/forms/multiline-text-field-error'
import LoadingSpinner from '../../../components/loading-spinner/loading-spinner'
import ModalWindow from '../../../components/modal'

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
      deleting: false,
      propertyToDelete: null,
      editing: null,
      newUsers: Immutable.List(),
      search: '',
      sortBy: 'name',
      sortDir: 1
    }

    this.addProperty = this.addProperty.bind(this)
    this.changeSort = this.changeSort.bind(this)
    this.editProperty = this.editProperty.bind(this)
    this.cancelAdding = this.cancelAdding.bind(this)
    this.changeSearch = this.changeSearch.bind(this)
    this.changeNewUsers = this.changeNewUsers.bind(this)
    this.shouldLeave = this.shouldLeave.bind(this)
    this.validateInlineAdd = this.validateInlineAdd.bind(this)

    this.isLeaving = false
    this.notificationTimeout = null

    const { params: { account, brand }, pagination } = this.props

    pagination.registerSubscriber((pagingParams) => this.refreshData(brand, account, pagingParams))
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

    if (properties.isEmpty()) {
      const { pagination: { getQueryParams } } = this.props
      this.refreshData(brand, account, getQueryParams())
    }
    router.setRouteLeaveHook(route, this.shouldLeave)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.account !== this.props.params.account) {
      const { brand, account, pagination: { getQueryParams } } = nextProps.params
      this.refreshData(brand, account, getQueryParams())
    }
  }

  refreshData(brand, account, pagingParams) {
    const { fetchGroups, fetchProperties, groups } = this.props
    fetchGroups({ brand, account }).then(response => {
      const groupsData = response ? response.entities.groups : groups.toKeyedSeq().toJS()
      for (const group in groupsData) {
        if (groupsData.hasOwnProperty(group)) {
          fetchProperties({ brand, account, group: groupsData[group].id, ...pagingParams })
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
      adding: true
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
      if (typeof a.get(sortBy) === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }
      if (aVal < bVal) {
        return -1 * sortDir
      } else if (aVal > bVal) {
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

  getFilteredData(data, searchTerm) {
    if (!searchTerm) {
      return data
    }
    const searchTermLowerCase = searchTerm.toLowerCase()
    return data.filter((property) => {
      return property.get('published_host_id').toLowerCase().includes(searchTermLowerCase) ||
        this.getPropertyOriginHostname(property).includes(searchTermLowerCase)
    })
  }

  // This function adds display names for group, deployment mode and origin host name
  // to properties so user will be able to sort data by any of those.
  getModifiedData(data) {
    return data.map(property => (
      property
        .set('group', this.getGroupName(property.get('parentId')))
        .set('deploymentMode', this.getPropertyDeploymentMode(property))
        .set('originHostname', this.getPropertyOriginHostname(property))
    ))
  }

  getGroupName(groupId) {
    const { groups } = this.props
    const groupIdNumber = Number(groupId)
    const group = groups.find(group => group.get('id') === groupIdNumber)
    return group ? group.get('name') : ''
  }

  getPropertyDeploymentMode(property) {
    return property.get('services').first().get('deployment_mode')
  }

  getFormattedPropertyDeploymentMode(deploymentMode) {
    if (deploymentMode === 'trial') {
      return <FormattedMessage id="portal.account.properties.deploymentMode.trial"/>
    } else if (deploymentMode === 'production') {
      return <FormattedMessage id="portal.account.properties.deploymentMode.production" />
    }
  }

  getPropertyOriginHostname(property) {
    return property.get('services').first()
      .get('configurations').first()
      .get('edge_configuration')
      .get('origin_host_name')
  }

  openDeleteModal(groupId, propertyId) {
    this.setState({
      deleting: true,
      propertyToDelete: { groupId, propertyId }
    })
  }

  closeDeleteModal() {
    this.setState({ deleting: false, propertyToDelete: null })
  }

  showNotification(message) {
    clearTimeout(this.notificationTimeout)
    this.props.uiActions.changeNotification(message)
    this.notificationTimeout = setTimeout(
      this.props.uiActions.changeNotification, 10000)
  }

  render() {
    const { deleteProperty, editProperty, intl, properties, fetching, params: { brand, account } } = this.props
    const { search, sortBy, sortDir } = this.state

    const sorterProps  = {
      activateSort: this.changeSort,
      activeColumn: sortBy,
      activeDirection: sortDir
    }

    const filteredProperties = this.getFilteredData(properties, search)
    const modifiedProperties = this.getModifiedData(filteredProperties)
    const sortedProperties = this.getSortedData(modifiedProperties, sortBy, sortDir)
    const numHiddenProperties = properties.size - sortedProperties.size;

    const propertyText = intl.formatMessage({id: 'portal.account.properties.counter.text' }, { numProperties: sortedProperties.size })
    const hiddenPropertyText = numHiddenProperties ? ` (${numHiddenProperties} ${intl.formatMessage({id: 'portal.account.properties.hidden.text'})})` : ''
    const headerText = propertyText + hiddenPropertyText

    return (
      <PageContainer className="account-management-account-properties">
        { fetching && <LoadingSpinner/> }
        { !fetching &&
        (<div>
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
              <TableSorter {...sorterProps} column="published_host_id">
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
            {sortedProperties.size > 0 && sortedProperties.map((property, i) => {
              const propertyId = property.get('published_host_id')
              return (
                <tr key={i}>
                  <td>{propertyId}</td>
                  <td>{property.get('group')}</td>
                  <td>{this.getFormattedPropertyDeploymentMode(property.get('deploymentMode'))}</td>
                  <td>{property.get('originHostname')}</td>
                  <td>{formatUnixTimestamp(property.get('created'))}</td>
                  <td className="nowrap-column">
                    <IsAllowed to={MODIFY_PROPERTY}>
                      <ActionButtons
                        onEdit={() => {
                          editProperty(property)
                        }}
                        onDelete={() => {
                          this.openDeleteModal(property.get('parentId'), propertyId)
                        }} />
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
              properties.size === 0 && fetching === false &&
              <tr>
                <td colSpan="6">
                  <FormattedMessage id="portal.account.properties.table.noProperties.text" />
                </td>
              </tr>
            }
            </tbody>
          </Table>
        </div>)}

        {this.state.deleting &&
          <ModalWindow
            title={<FormattedMessage id="portal.deleteModal.header.text" values={{ itemToDelete: "Property" }}/>}
            cancelButton={true}
            deleteButton={true}
            cancel={() => this.closeDeleteModal()}
            onSubmit={() => {
              deleteProperty(brand, account, this.state.propertyToDelete.groupId, this.state.propertyToDelete.propertyId)
                .then((result) => {
                  this.closeDeleteModal()
                  if (!result.error) {
                    this.showNotification(<FormattedMessage id="portal.configuration.deleteSuccess.text" />)
                  }
                })
            }}
            invalid={true}
            verifyDelete={true}>
            <p>
              <FormattedMessage id="portal.deleteModal.warning.text" values={{ itemToDelete: "Property" }}/>
            </p>
          </ModalWindow>
        }

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
  fetchProperties: React.PropTypes.func,
  fetching: React.PropTypes.bool,
  groups: React.PropTypes.instanceOf(Immutable.List),
  intl: React.PropTypes.object,
  pagination: React.PropTypes.shape({
    filtering: React.PropTypes.object,
    paging: React.PropTypes.object,
    sorting: React.PropTypes.object,
    registerSubscriber: React.PropTypes.func
  }).isRequired,
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

const paginationConfig = {
  fields: [],
  page_size: 5
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
    deleteProperty: (brand, account, group, id) => dispatch(propertyActions.remove({brand, account, group, id})),
    fetchGroups: (params) => dispatch(groupActions.fetchAll({ ...params, requestTag: IS_FETCHING })),
    fetchProperties: (params) => dispatch(propertyActions.fetchAll({ ...params, requestTag: IS_FETCHING })),
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withRouter(withPagination(AccountManagementProperties, paginationConfig))))
