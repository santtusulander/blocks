import React, { Component, PropTypes } from 'react'
import d3 from 'd3'
import { ButtonGroup, ButtonToolbar } from 'react-bootstrap'
import { withRouter } from 'react-router'

import { fromJS, is, List, Map } from 'immutable'
import { FormattedMessage } from 'react-intl';

import {
  ACCOUNT_TYPE_SERVICE_PROVIDER,
  ACCOUNT_TYPE_CONTENT_PROVIDER
} from '../../constants/account-management-options'

import { MEDIA_DELIVERY_SERVICE_ID, STORAGE_SERVICE_ID, VOD_STREAMING_SERVICE_ID } from '../../constants/service-permissions'
import sortOptions, {PAGE_SIZE, MAX_PAGINATION_ITEMS} from '../../constants/content-item-sort-options'
import {
  getContentUrl,
  getAnalyticsUrl
} from '../../util/routes'

import { userIsCloudProvider, hasService, hasAnyServices, getPage, getServiceType } from '../../util/helpers'

import { parseResponseError } from '../../redux/util'

import AddHost from './add-host'
import ColorLegend from './color-legend'
import AnalyticsLink from './analytics-link'
import UDNButton from '../shared/form-elements/button'
import NoContentItems from './no-content-items'
import PageContainer from '../shared/layout/page-container'
import AccountSelector from '../global-account-selector/account-selector-container'

import StorageChartContainer from '../../containers/storage-item-containers/storage-chart-container'
import StorageListContainer from '../../containers/storage-item-containers/storage-list-container'

import PropertyItemContainer from '../../containers/content/property-item-container'

import Content from '../shared/layout/content'
import PageHeader from '../shared/layout/page-header'
import ContentItem from './content-item'
import Select from '../shared/form-elements/select'
import IconAdd from '../shared/icons/icon-add.jsx'
import ButtonDropdown from '../shared/form-elements/button-dropdown'
import IconCaretDown from '../shared/icons/icon-caret-down.jsx'
import IconItemList from '../shared/icons/icon-item-list.jsx'
import IconItemChart from '../shared/icons/icon-item-chart.jsx'
import LoadingSpinner from '../loading-spinner/loading-spinner'
import TruncatedTitle from '../../components/shared/page-elements/truncated-title'
import IsAllowed from '../shared/permission-wrappers/is-allowed'

import * as PERMISSIONS from '../../constants/permissions.js'
import CONTENT_ITEMS_TYPES from '../../constants/content-items-types'

import EntityEdit from '../../components/account-management/entity-edit'

import SidePanel from '../shared/side-panel'
import StorageFormContainer from '../../containers/storage/modals/storage-modal'

import Paginator from '../shared/paginator/paginator'

//Starburst sizes in pixels
const TRAFFIC_SCALE_MIN = 400
const TRAFFIC_SCALE_MAX = 500

const sortContent = (path, direction) => (item1, item2) => {
  const val1 = item1.getIn(path) && item1.getIn(path).toLowerCase && item1.getIn(path).toLowerCase() || item1.getIn(path)
  const val2 = item2.getIn(path) && item2.getIn(path).toLowerCase && item2.getIn(path).toLowerCase() || item2.getIn(path)

  if (val1 > val2 || val2 === undefined) {
    return direction
  } else if (val1 < val2 || val1 === undefined) {
    return -1 * direction
  }
  return 0
}

class ContentItems extends Component {
  constructor(props) {
    super(props);

    this.state = {
      saving: false,
      showModal: false,
      showStorageModal: false,
      itemToEdit: undefined
    }

    this.trafficMin = 0;
    this.trafficMax = 0;

    this.itemSelectorTopBarAction = this.itemSelectorTopBarAction.bind(this)
    this.handleSortChange = this.handleSortChange.bind(this)
    this.onItemAdd = this.onItemAdd.bind(this)
    this.onItemSave = this.onItemSave.bind(this)
    this.onItemDelete = this.onItemDelete.bind(this)
    this.addItem = this.addItem.bind(this)
    this.editItem = this.editItem.bind(this)
    this.hideModal = this.hideModal.bind(this)
    this.showStorageModal = this.showStorageModal.bind(this)
    this.hideStorageModal = this.hideStorageModal.bind(this)
    this.showNotification = this.showNotification.bind(this)
    this.getCustomSortPath = this.getCustomSortPath.bind(this)

    this.onActivePageChange = this.onActivePageChange.bind(this)
    this.calculateMinMax = this.calculateMinMax.bind(this)

    this.addButtonOptions = [{
      label: <FormattedMessage id="portal.content.property.header.addProperty.label"/>,
      handleClick: this.addItem
    }, {
      label: <FormattedMessage id="portal.content.property.header.addStorage.label"/>,
      handleClick: this.showStorageModal
    }]
  }

  componentDidMount() {
    this.calculateMinMax(this.props.contentItems)
  }

  componentWillReceiveProps(nextProps) {
    //if contentItems changed recalculate min & max
    if (!is(this.props.contentItems, nextProps.contentItems)) {
      this.calculateMinMax(nextProps.contentItems)
    }

  }

  calculateMinMax(contentItems) {
    const totalTraffics = contentItems.map(val => {
      return val.getIn(['metrics', 'totalTraffic']) || 0
    })

    this.trafficMin = Math.min(...totalTraffics)
    this.trafficMax = Math.max(...totalTraffics)

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

  getDailyTraffic(item) {
    return this.props.dailyTraffic.find(traffic => traffic.get(this.props.type) === item.get('id'),
      null, fromJS({ detail: [] }))
  }
  handleSortChange(val) {
    const sortOption = sortOptions.find(opt => opt.value === val)
    if (sortOption) {
      this.props.sortItems(sortOption.path, sortOption.direction)
    }
  }

  getCustomSortPath(tag) {
    const [sortBy] = this.props.sortValuePath
    if (sortBy === 'item') {
      if (tag === 'storages') {
        return fromJS(['ingest_point_id'])
      }
      if (tag === 'properties') {
        return fromJS(['published_host_id'])
      }
      if (tag === 'content') {
        return fromJS(['name'])
      }

    }

    return fromJS(['totalTraffic'])
  }

  showNotification(message) {
    clearTimeout(this.notificationTimeout)
    this.props.changeNotification(message)
    this.notificationTimeout = setTimeout(this.props.changeNotification, 10000)
  }
  onItemAdd() {
    this.setState({ saving: true })

    return this.props.createNewItem(...arguments)
      .then(({ item, error, payload }) => {
        if (error) {
          this.props.showInfoDialog({
            title: <FormattedMessage id="portal.errorModal.error.text"/>,
            content: parseResponseError(payload),
            cancel: () => this.props.hideInfoDialog(),
            okButton: true
          })
        } else if (item) {
          this.hideModal()
          this.showNotification(<FormattedMessage id="portal.content.createEntity.status" values={{item}}/>)
        } else {
          this.hideModal()
        }
        this.setState({ saving: false })
      })
  }
  onItemSave() {
    return this.props.editItem(...arguments)
      .then(({ item, error, payload }) => {
        if (error) {
          this.props.showInfoDialog({
            title: <FormattedMessage id="portal.errorModal.error.text"/>,
            content: parseResponseError(payload),
            cancel: () => this.props.hideInfoDialog(),
            okButton: true
          })
        } else if (item) {
          this.hideModal()
          this.showNotification(<FormattedMessage id="portal.content.updateEntity.status" values={{item}}/>)
        } else {
          this.hideModal()
        }
      })
  }

  onItemDelete() {
    return this.props.deleteItem(...arguments)
      .then(({ item, error, payload }) => {
        if (error) {
          this.props.showInfoDialog({
            title: <FormattedMessage id="portal.errorModal.error.text"/>,
            content: parseResponseError(payload),
            cancel: () => this.props.hideInfoDialog(),
            okButton: true
          })
        } else if (item) {
          this.hideModal()
          this.showNotification(<FormattedMessage id="portal.content.deleteEntity.status" values={{item}}/>)
        } else {
          this.hideModal()
        }
      })
  }

  getTier() {
    const { brand, account, group } = this.props.params
    if (group) {
      return 'group'
    } else if (account && !group) {
      return 'account'
    } else if (brand && !account && !group) {
      return 'brand'
    }

    return null
  }
  itemSelectorTopBarAction(tier, fetchItems, IDs) {
    const { account } = IDs
    switch (tier) {
      case 'property':
        fetchItems('group', 'udn', account)
        break
      case 'group':
        fetchItems('account', 'udn')
        break
      case 'brand':
      case 'account':
        this.props.router.push(getContentUrl('brand', 'udn', {}))
        break
    }
  }

  editItem(id) {
    this.props.fetchItem(id)
      .then(({ entities }) => {
        const item = this.getTier() === 'brand' ? entities.accounts[id] : entities.groups[id]

        this.setState({
          showModal: true,
          itemToEdit: fromJS(item)
        })
      })
  }
  addItem() {
    this.setState({
      showModal: true,
      itemToEdit: undefined
    })
  }
  hideModal() {
    this.setState({
      showModal: false,
      itemToEdit: undefined
    })
  }
  showStorageModal(id) {
    this.setState({
      itemToEdit: id,
      showStorageModal: true
    });
  }
  hideStorageModal() {
    this.setState({
      itemToEdit: undefined,
      showStorageModal: false
    });
  }
  getTagText(isCloudProvider, providerType, trialMode) {
    let tagText = trialMode ? 'portal.configuration.details.deploymentMode.trial' : null
    if (isCloudProvider && !trialMode) {
      switch (providerType) {
        case ACCOUNT_TYPE_CONTENT_PROVIDER:
          tagText = 'portal.content.contentProvider'
          break
        case ACCOUNT_TYPE_SERVICE_PROVIDER:
          tagText = 'portal.content.serviceProvider'
          break
        default:
          break
      }
    }
    return { tagText: tagText }
  }

  renderAddButton (propertyCreationIsAllowed, storageCreationIsAllowed) {
    if (this.getTier() === 'group') {
      if (propertyCreationIsAllowed && storageCreationIsAllowed) {
        return <ButtonDropdown bsStyle="success" disabled={false} options={this.addButtonOptions}/>
      }

      if (storageCreationIsAllowed) {
        return <UDNButton bsStyle="success" icon={true} onClick={() => this.showStorageModal()}><IconAdd/></UDNButton>
      }

      if (!propertyCreationIsAllowed && !storageCreationIsAllowed) {
        return <UDNButton bsStyle="success" disabled={true} icon={true}><IconAdd/></UDNButton>
      }
    }

    return <UDNButton bsStyle="success" icon={true} onClick={this.addItem}><IconAdd/></UDNButton>
  }

  renderAccountSelector(props) {
    if (props.selectionDisabled === true) {
      return (
        <div className="dropdown-toggle header-toggle">
          <h1>
            <TruncatedTitle content={props.headerText.label} tooltipPlacement="bottom"/>
          </h1>
        </div>
      )
    }

    return (
      <AccountSelector
        params={props.params}
        onItemClick={(entity) => {

          const { nodeInfo, idKey = 'id' } = entity
          const url = getContentUrl(nodeInfo.entityType, entity[idKey], nodeInfo.parents)
          props.router.push(url)

        }}>
        <div className="btn btn-link dropdown-toggle header-toggle">
          <h1>
            <TruncatedTitle content={props.headerText.label} tooltipPlacement="bottom"/>
          </h1>
          <IconCaretDown />
        </div>
      </AccountSelector>
    )
  }

  render() {
    const {
      contentItems,
      sortValuePath,
      sortDirection,
      headerText,
      ifNoContent,
      activeGroup,
      activeAccount,
      analyticsURLBuilder,
      showAnalyticsLink,
      viewingChart,
      user,
      storages,
      properties,
      params,
      locationPermissions,
      storagePermission,
      params: { brand, account, group }
    } = this.props

    const { createAllowed, viewAllowed, viewAnalyticAllowed, modifyAllowed } = storagePermission
    const groupHasStorageService = hasService(activeGroup, STORAGE_SERVICE_ID)
    const groupHasPropertyService = hasAnyServices(activeGroup, [ MEDIA_DELIVERY_SERVICE_ID, VOD_STREAMING_SERVICE_ID])

    /*TODO: Please remove && false of the following line once the API for editing ingest_point(CIS-322) is ready*/
    const modifyStorageAllowed = modifyAllowed && false

    const trafficScale = d3.scale.linear()
        .domain([this.trafficMin, this.trafficMax])
        .range([TRAFFIC_SCALE_MIN, TRAFFIC_SCALE_MAX])

    const location = this.context.location
    const currentPage = location && location.query && location.query.page && !!parseInt(location.query.page) ? parseInt(location.query.page) : 1

    const paginationProps = {
      activePage: currentPage,
      items: Math.ceil(contentItems.count() / PAGE_SIZE),
      onSelect: this.onActivePageChange,
      maxButtons: MAX_PAGINATION_ITEMS,
      boundaryLinks: true,
      first: true,
      last: true,
      next: true,
      prev: true
    }


    // If trafficMin === trafficMax, there's only one property or all properties
    // have identical metrics. In that case the amoebas will all get the minimum
    // size. Let's make trafficMin less than trafficMax and all amoebas will
    // render with maximum size instead
    this.trafficMin = (this.trafficMin === this.trafficMax) ? (this.trafficMin * 0.9) : this.trafficMin

    const foundSort = sortOptions.find(opt => {
      return is(opt.path, sortValuePath) &&
        opt.direction === sortDirection
    })

    const currentValue = foundSort ? foundSort.value : sortOptions[0].value
    const isCloudProvider = userIsCloudProvider(user)
    const toggleView = (type) => {
      return type ? this.props.toggleChartView : () => {/*no-op*/}
    }

    const addHostTitle = <FormattedMessage id="portal.content.property.header.add.label"/>
    const addHostSubTitle = activeAccount && activeGroup
      ? `${activeAccount.get('name')} / ${activeGroup.get('name')}`
    : null

    return (
      <Content>
        <PageHeader pageSubTitle={headerText.summary}>
          {this.renderAccountSelector(this.props, this.itemSelectorTopBarAction)}
          <ButtonToolbar>
            {showAnalyticsLink ? <AnalyticsLink url={analyticsURLBuilder}/> : null}
            {/* Hide Add item button for SP/CP Admins at 'Brand' level */}
            {isCloudProvider || activeAccount.size ?
              <IsAllowed to={PERMISSIONS.CREATE_GROUP}>
                {this.renderAddButton(groupHasPropertyService, createAllowed && groupHasStorageService)}
              </IsAllowed>
            : null}
            {this.props.type !== CONTENT_ITEMS_TYPES.ACCOUNT || contentItems.size > 1 ?
             <Select
              onSelect={this.handleSortChange}
              value={currentValue}
              options={sortOptions.map(opt => [opt.value, opt.label])}/> : null}
            <ButtonGroup>
              <UDNButton className={viewingChart ? 'btn-tertiary' : 'btn-primary'}
                         active={viewingChart}
                         icon={true}
                         onClick={toggleView(!viewingChart)}>
                <IconItemChart/>
              </UDNButton>
              <UDNButton className={!viewingChart ? 'btn-tertiary' : 'btn-primary'}
                         active={!viewingChart}
                         icon={true}
                         onClick={toggleView(viewingChart)}>
                <IconItemList/>
              </UDNButton>
            </ButtonGroup>
          </ButtonToolbar>
        </PageHeader>

        <PageContainer>
          {this.props.fetching || this.props.fetchingMetrics  ?
            <LoadingSpinner /> : (
            this.props.contentItems.isEmpty() && storages.isEmpty() && properties.isEmpty() ?
              <NoContentItems content={ifNoContent} />
            :
            <div
              key={viewingChart}
              className={viewingChart ? 'content-item-grid' : 'content-item-lists'}>
              {this.props.showColorLegend ? <ColorLegend serviceTypes={[...new Set(properties.map(property => getServiceType(property)))]} /> : null}

                { /* STORAGES -header on List view */
                  this.getTier() === 'group' && !viewingChart && groupHasStorageService && !!storages.size &&
                  <h3><FormattedMessage id="portal.accountManagement.storages.text" /></h3>
                }

                {/* Storages */}
                <IsAllowed to={PERMISSIONS.LIST_STORAGE}>
                      <div className="storage-wrapper">
                        { groupHasStorageService && storages.sort(sortContent(this.getCustomSortPath('storages'), sortDirection)).map((storage, i) => {
                          const id = storage.get('ingest_point_id')
                          //const reduxId = buildReduxId(group, id)

                          if (viewingChart) {
                            return (
                              <StorageChartContainer
                                key={i}
                                analyticsLink={viewAnalyticAllowed && getAnalyticsUrl('storage', id, params)}
                                storageContentLink={viewAllowed && getContentUrl('storage', id, params)}
                                onConfigurationClick={modifyStorageAllowed && this.showStorageModal}
                                storageId={id}
                                params={params} />
                            )
                          } else {
                            return (
                              <StorageListContainer
                                key={i}
                                analyticsLink={viewAnalyticAllowed && getAnalyticsUrl('storage', id, params)}
                                storageContentLink={viewAllowed && getContentUrl('storage', id, params)}
                                onConfigurationClick={modifyStorageAllowed && this.showStorageModal}
                                storageId={id}
                                params={params}
                              />
                            )
                          }
                        })
                        }
                      </div>
                </IsAllowed>

                { /* PROPETIES -header on List view */
                  this.getTier() === 'group' && !viewingChart &&
                  <h3><FormattedMessage id="portal.accountManagement.properties.text" /></h3>
                }

                { /* Properties */}
                { properties.sort(sortContent(this.getCustomSortPath('properties'), sortDirection)).map((property,i) => {
                  return (
                    <PropertyItemContainer
                      serviceType={getServiceType(property)}
                      key={i}
                      propertyId={property.get('published_host_id')}
                      params={params}
                      viewingChart={viewingChart}
                    />)
                }
                  )
                }

                {/* OTHER ContentItems (brand / accouts / groups) */}
                { getPage(contentItems.sort(sortContent(this.getCustomSortPath('content'), sortDirection)), currentPage, PAGE_SIZE)
                      .map(item => {
                        const id = item.get('id')
                        const isTrialHost = false
                        const name = item.get('name')
                        const contentMetrics = item.get('metrics') || Map()

                        const scaledWidth =  trafficScale(item.get('totalTraffic') || 0)

                        const itemProps = {
                          id,
                          name,
                          ...this.getTagText(userIsCloudProvider, item.get('provider_type'), isTrialHost),
                          brightMode: isTrialHost,
                          linkTo: this.props.nextPageURLBuilder(id, item),
                          disableLinkTo: activeAccount.getIn(['provider_type']) === ACCOUNT_TYPE_SERVICE_PROVIDER,
                          configurationLink: this.props.configURLBuilder ? this.props.configURLBuilder(id) : null,
                          onConfiguration: this.getTier() === 'brand' || this.getTier() === 'account' ? () => {
                            this.editItem(id)
                          } : null,
                          analyticsLink: this.props.analyticsURLBuilder(id),
                          dailyTraffic: this.getDailyTraffic(item).get('detail').reverse(),
                          description: 'Desc',
                          delete: this.props.deleteItem,
                          primaryData: contentMetrics.get('traffic'),
                          secondaryData: contentMetrics.get('historical_traffic'),
                          differenceData: contentMetrics.get('historical_variance'),
                          cacheHitRate: contentMetrics.get('avg_cache_hit_rate'),
                          timeToFirstByte: contentMetrics.get('avg_ttfb'),
                          maxTransfer: contentMetrics.getIn(['transfer_rates','peak'], '0.0 Gbps'),
                          minTransfer: contentMetrics.getIn(['transfer_rates', 'lowest'], '0.0 Gbps'),
                          avgTransfer: contentMetrics.getIn(['transfer_rates', 'average'], '0.0 Gbps'),
                          fetchingMetrics: this.props.fetchingMetrics,
                          chartWidth: scaledWidth.toString(),
                          barMaxHeight: (scaledWidth / 7).toString(),
                          showSlices: this.props.showSlices,
                          isAllowedToConfigure: this.props.isAllowedToConfigure
                        }

                        return (
                          <ContentItem key={`content-item-${id}`}
                            isChart={viewingChart}
                            itemProps={itemProps}
                            scaledWidth={scaledWidth}
                            deleteItem={this.props.deleteItem}/>
                        )
                      })}


                { /* Show Pagination if more items than fit on PAGE_SIZE */
                  contentItems && contentItems.count() > PAGE_SIZE &&
                  <Paginator {...paginationProps} />
                }
              </div>
          )}

          {this.state.showModal && this.getTier() === 'brand' &&
            <EntityEdit
              type='account'
              entityToUpdate={this.state.itemToEdit}
              currentUser={user}
              onCancel={this.hideModal}
              onSave={this.state.itemToEdit ? this.onItemSave : this.onItemAdd}
            />
          }
          {this.state.showModal && this.getTier() === 'account' &&
            <EntityEdit
              type='group'
              entityToUpdate={this.state.itemToEdit}
              params={this.props.params}
              canSeeLocations={false}
              groupId={this.state.itemToEdit && this.state.itemToEdit.get('id')}
              locationPermissions={locationPermissions}
              onDelete={this.onItemDelete}
              onCancel={this.hideModal}
              onSave={this.state.itemToEdit ? this.onItemSave : this.onItemAdd}
            />
          }

          {

            this.state.showModal && this.getTier() === 'group' &&
              <SidePanel
                show={true}
                title={addHostTitle}
                subTitle={addHostSubTitle}
                cancel={this.hideModal}
              >

              <AddHost
                activeGroup={activeGroup}
                createHost={this.onItemAdd}
                cancelChanges={this.hideModal}
              />
              </SidePanel>
          }

          {
            this.state.showStorageModal && this.getTier() === 'group' &&
            <StorageFormContainer
              brand={brand}
              accountId={account}
              groupId={group}
              storageId={this.state.itemToEdit}
              show={true}
              editing={false}
              fetching={false}
              onCancel={this.hideStorageModal}
              onSubmit={() => {/* onsubmit here */}}
            />
          }
        </PageContainer>
      </Content>
    )
  }
}

ContentItems.displayName = 'ContentItems'
ContentItems.propTypes = {
  activeAccount: PropTypes.instanceOf(Map),
  activeGroup: PropTypes.instanceOf(Map),
  analyticsURLBuilder: PropTypes.func,
  changeNotification: PropTypes.func,
  configURLBuilder: PropTypes.func,
  contentItems: PropTypes.instanceOf(List),
  createNewItem: PropTypes.func,
  dailyTraffic: PropTypes.instanceOf(List),
  deleteItem: PropTypes.func,
  editItem: PropTypes.func,
  fetchItem: PropTypes.func,
  fetching: PropTypes.bool,
  fetchingMetrics: PropTypes.bool,
  group: PropTypes.string,
  headerText: PropTypes.object,
  hideInfoDialog: PropTypes.func,
  ifNoContent: PropTypes.string,
  isAllowedToConfigure: PropTypes.bool,
  locationPermissions: PropTypes.object,
  nextPageURLBuilder: PropTypes.func,
  params: PropTypes.object,
  properties: PropTypes.instanceOf(List),
  router: PropTypes.object,
  // eslint-disable-next-line react/no-unused-prop-types
  selectionDisabled: PropTypes.bool, // this is used in a helper render method
  // eslint-disable-next-line react/no-unused-prop-types
  selectionStartTier: PropTypes.string, // this is used in a helper render method
  showAnalyticsLink: PropTypes.bool,
  showColorLegend: PropTypes.bool,
  showInfoDialog: PropTypes.func,
  showSlices: PropTypes.bool,
  sortDirection: PropTypes.number,
  sortItems: PropTypes.func,
  sortValuePath: PropTypes.instanceOf(List),
  storagePermission: PropTypes.object,
  storages: PropTypes.instanceOf(List),
  toggleChartView: PropTypes.func,
  type: PropTypes.string,
  user: PropTypes.instanceOf(Map),
  viewingChart: PropTypes.bool
}
ContentItems.defaultProps = {
  activeAccount: Map(),
  activeGroup: Map(),
  contentItems: List(),
  dailyTraffic: List(),
  sortValuePath: List(),
  storages: List(),
  properties: List(),
  user: Map(),
  storagePermission: {}
}

ContentItems.contextTypes = {
  location: PropTypes.object
}

export default withRouter(ContentItems)
