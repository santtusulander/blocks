import React from 'react'
import { FormControl, FormGroup, Table, Button } from 'react-bootstrap'
import { FormattedMessage, injectIntl } from 'react-intl'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'
import { SubmissionError } from 'redux-form'

import propertyActions from '../../../redux/modules/entities/properties/actions'
import * as uiActionCreators from '../../../redux/modules/ui'
import { getById as getAccountById } from '../../../redux/modules/entities/accounts/selectors'
import { getById as getGroupById } from '../../../redux/modules/entities/groups/selectors'
import { getByGroup as getPropertiesByGroup } from '../../../redux/modules/entities/properties/selectors'
import { getFetchingByTag } from '../../../redux/modules/fetching/selectors'

import { parseResponseError } from '../../../redux/util'

import PageContainer from '../../../components/shared/layout/page-container'
import SectionHeader from '../../../components/shared/layout/section-header'
import ActionButtons from '../../../components/shared/action-buttons'
import IconAdd from '../../../components/shared/icons/icon-add'
import TableSorter from '../../../components/shared/table-sorter'
import IsAllowed from '../../../components/shared/permission-wrappers/is-allowed'
import LoadingSpinner from '../../../components/loading-spinner/loading-spinner'
import ModalWindow from '../../../components/shared/modal'
import SidePanel from '../../../components/shared/side-panel'
import AddHost from '../../../components/content/add-host'

import { getSortData, formatUnixTimestamp, getCISname} from '../../../util/helpers'
import { getContentUrl } from '../../../util/routes'

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

    this.createProperty = this.createProperty.bind(this)
    this.addProperty = this.addProperty.bind(this)
    this.changeSort = this.changeSort.bind(this)
    this.editProperty = this.editProperty.bind(this)
    this.cancelAdding = this.cancelAdding.bind(this)
    this.changeSearch = this.changeSearch.bind(this)

    this.notificationTimeout = null
  }

  componentWillMount() {
    const {
      params: {
        brand,
        account,
        group
      }
    } = this.props

    if (group) {
      this.props.fetchProperties({brand, account, group})
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params.brand !== nextProps.params.brand
      || this.props.params.account !== nextProps.params.account
      || this.props.params.group !== nextProps.params.group) {

      this.props.fetchProperties(nextProps.params)
    }
  }

  createProperty(id, deploymentMode, serviceType) {
    const payload = {
      services: [{
        service_type: serviceType,
        deployment_mode: deploymentMode,
        configurations: [{
          edge_configuration: {
            published_name: id
          }
        }]
      }]
    }
    return this.props.createProperty(
      this.props.params.brand,
      this.props.params.account,
      this.props.params.group,
      payload
      ).then(({ error, payload }) => {
        this.cancelAdding()
        if (error) {
          throw new SubmissionError({_error: parseResponseError(payload)})
        } else {
          this.showNotification(<FormattedMessage id="portal.account.properties.create.success.text" />)
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
    const { params, router } = this.props
    const propId = property.get('published_host_id')
    router.push(getContentUrl('propertyConfiguration', propId, params))
  }

  changeSearch(e) {
    this.setState({
      search: e.target.value
    })
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
        .set('deploymentMode', this.getPropertyDeploymentMode(property))
        .set('originHostname', this.getPropertyOriginHostname(property))
        .set('origin_type', this.getPropertyOriginType(property))
    ))
  }

  getPropertyOriginType(property) {
    return property.getIn(['services', 0 , 'configurations', 0, 'edge_configuration', 'origin_type'])
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
    const { currentAccount, currentGroup, deleteProperty, fetching, intl, properties, params: { brand, account } } = this.props
    const { search, sortBy, sortDir } = this.state

    const sorterProps  = {
      activateSort: this.changeSort,
      activeColumn: sortBy,
      activeDirection: sortDir
    }

    const filteredProperties = this.getFilteredData(properties, search)
    const modifiedProperties = this.getModifiedData(filteredProperties)
    const sortedProperties = getSortData(modifiedProperties, sortBy, sortDir)
    const numHiddenProperties = properties.size - sortedProperties.size;

    const propertyText = intl.formatMessage({id: 'portal.account.properties.counter.text' }, { numProperties: sortedProperties.size })
    const hiddenPropertyText = numHiddenProperties ? ` (${numHiddenProperties} ${intl.formatMessage({id: 'portal.account.properties.hidden.text'})})` : ''
    const headerText = propertyText + hiddenPropertyText

    const groupName = currentGroup && currentGroup.get('name')
    const addPropertyTitle = <FormattedMessage id="portal.content.property.header.add.label"/>
    const addPropertySubTitle = currentAccount && currentGroup
      ? `${currentAccount.get('name')} / ${currentGroup.get('name')}`
    : null

    return (
      !this.props.params.group
        ?
          <PageContainer>
            <p className='text-center'>
              <FormattedMessage id="portal.account.properties.groupNotSelected.text" values={{br: <br />}}/>
            </p>
          </PageContainer>
        :
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
                  <IsAllowed to={MODIFY_PROPERTY}>
                    <th width="1%"/>
                  </IsAllowed>
                </tr>
                </thead>
                <tbody>
                {sortedProperties.size > 0 && sortedProperties.map((property, i) => {
                  const propertyId = property.get('published_host_id')
                  const originHostname = property.get('origin_type') === 'cis'
                                          ? getCISname(property.get('originHostname'))
                                          : property.get('originHostname')

                  return (
                    <tr key={i}>
                      <td>{propertyId}</td>
                      <td>{groupName}</td>
                      <td>{this.getFormattedPropertyDeploymentMode(property.get('deploymentMode'))}</td>
                      <td>{originHostname}</td>
                      <td>{formatUnixTimestamp(property.get('created'))}</td>
                      <IsAllowed to={MODIFY_PROPERTY}>
                        <td className="nowrap-column">
                            <ActionButtons
                              onEdit={() => {
                                this.editProperty(property)
                              }}
                              onDelete={() => {
                                this.openDeleteModal(property.get('parentId'), propertyId)
                              }} />
                        </td>
                      </IsAllowed>
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

            {this.state.adding &&
              <SidePanel
                show={true}
                title={addPropertyTitle}
                subTitle={addPropertySubTitle}
                cancel={this.cancelAdding}
              >
                <AddHost
                  activeGroup={currentGroup}
                  createHost={this.createProperty}
                  cancelChanges={this.cancelAdding}
                />
              </SidePanel>
            }

            {this.state.deleting &&
              <ModalWindow
                title={<FormattedMessage id="portal.deleteModal.header.text" values={{ itemToDelete: <FormattedMessage id="portal.account.properties.property.text" /> }}/>}
                cancelButton={true}
                deleteButton={true}
                cancel={() => this.closeDeleteModal()}
                onSubmit={() => {
                  deleteProperty(brand, account, this.state.propertyToDelete.groupId, this.state.propertyToDelete.propertyId)
                    .then((result) => {
                      this.closeDeleteModal()
                      if (!result.error) {
                        this.showNotification(<FormattedMessage id="portal.account.properties.delete.success.text" />)
                      }
                    })
                }}
                invalid={true}
                verifyDelete={true}>
                <p>
                  <FormattedMessage id="portal.deleteModal.warning.text" values={{ itemToDelete: <FormattedMessage id="portal.account.properties.property.text" /> }}/>
                </p>
              </ModalWindow>
            }

          </PageContainer>
    )
  }
}

AccountManagementProperties.displayName  = 'AccountManagementAccountProperties'
AccountManagementProperties.propTypes    = {
  createProperty: React.PropTypes.func,
  currentAccount: React.PropTypes.instanceOf(Immutable.Map),
  currentGroup: React.PropTypes.instanceOf(Immutable.Map),
  deleteProperty: React.PropTypes.func,
  fetchProperties: React.PropTypes.func,
  fetching: React.PropTypes.bool,
  intl: React.PropTypes.object,
  params: React.PropTypes.object,
  properties: React.PropTypes.instanceOf(Immutable.List),
  router: React.PropTypes.object,
  uiActions: React.PropTypes.object
}
AccountManagementProperties.defaultProps = {
  properties: Immutable.List(),
  groups: Immutable.List()
}


/* istanbul ignore next */
function mapStateToProps(state, ownProps) {
  const { account, group } = ownProps.params
  return {
    currentAccount: getAccountById(state, account),
    fetching: getFetchingByTag(state, IS_FETCHING),
    currentGroup: getGroupById(state, group),
    properties: getPropertiesByGroup(state, group)
  }
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    createProperty: (brand, account, group, payload) => dispatch(propertyActions.create({brand, account, group, payload})),
    deleteProperty: (brand, account, group, id) => dispatch(propertyActions.remove({brand, account, group, id})),
    fetchProperties: (params) => dispatch(propertyActions.fetchAll({ ...params, requestTag: IS_FETCHING })),
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withRouter(AccountManagementProperties)))
export { AccountManagementProperties as PureProperties }
