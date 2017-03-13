import React from 'react'
import d3 from 'd3'
import { ButtonGroup, ButtonToolbar } from 'react-bootstrap'
import { withRouter } from 'react-router'
import Immutable from 'immutable'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { FormattedMessage } from 'react-intl';

import {
  ACCOUNT_TYPE_SERVICE_PROVIDER,
  ACCOUNT_TYPE_CONTENT_PROVIDER
} from '../../constants/account-management-options'

import sortOptions from '../../constants/content-item-sort-options'
import {
  getContentUrl
} from '../../util/routes'
import { userIsCloudProvider, hasStorageService } from '../../util/helpers'

import AddHost from './add-host'
import AnalyticsLink from './analytics-link'
import UDNButton from '../button'
import NoContentItems from './no-content-items'
import PageContainer from '../layout/page-container'
import AccountSelector from '../global-account-selector/global-account-selector'
import StorageChartContainer from '../../containers/storage/storage-chart-container'
import Content from '../layout/content'
import PageHeader from '../layout/page-header'
import ContentItem from './content-item'
import Select from '../select'
import IconAdd from '../icons/icon-add.jsx'
import ButtonDropdown from '../button-dropdown'
import IconCaretDown from '../icons/icon-caret-down.jsx'
import IconItemList from '../icons/icon-item-list.jsx'
import IconItemChart from '../icons/icon-item-chart.jsx'
import LoadingSpinner from '../loading-spinner/loading-spinner'
import TruncatedTitle from '../../components/truncated-title'
import IsAllowed from '../is-allowed'
import * as PERMISSIONS from '../../constants/permissions.js'
import CONTENT_ITEMS_TYPES from '../../constants/content-items-types'

import EntityEdit from '../../components/account-management/entity-edit'

import SidePanel from '../side-panel'
import StorageFormContainer from '../../containers/storage/modals/storage-modal'


const rangeMin = 400
const rangeMax = 500

let trafficMin = 0
let trafficMax = 0

const itemSelectorTexts = {
  property: 'Back to Groups',
  group: 'Back to Accounts',
  account: 'UDN Admin',
  brand: 'UDN Admin'
}

const sortContent = (path, direction) => (item1, item2) => {
  const val1 = item1.getIn(path) && item1.getIn(path).toLowerCase && item1.getIn(path).toLowerCase() || item1.getIn(path)
  const val2 = item2.getIn(path) && item2.getIn(path).toLowerCase && item2.getIn(path).toLowerCase() || item2.getIn(path)

  if(val1 > val2 || val2 === undefined) {
    return direction
  }
  else if(val1 < val2 || val1 === undefined) {
    return -1 * direction
  }
  return 0
}

class ContentItems extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      saving: false,
      showModal: false,
      showStorageModal: false,
      itemToEdit: undefined
    }
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

    this.addButtonOptions = [{
      label: <FormattedMessage id="portal.content.property.header.addProperty.label"/>,
      handleClick: this.addItem
    }, {
      label: <FormattedMessage id="portal.content.property.header.addStorage.label"/>,
      handleClick: this.showStorageModal
    }]
  }
  getMetrics(item) {
    return this.props.metrics.find(metric => metric.get(this.props.type) === item.get('id'),
      null, Immutable.Map({ totalTraffic: 0 }))
  }
  getDailyTraffic(item) {
    return this.props.dailyTraffic.find(traffic => traffic.get(this.props.type) === item.get('id'),
      null, Immutable.fromJS({ detail: [] }))
  }
  handleSortChange(val) {
    const sortOption = sortOptions.find(opt => opt.value === val)
    if(sortOption) {
      this.props.sortItems(sortOption.path, sortOption.direction)
    }
  }
  showNotification(message) {
    clearTimeout(this.notificationTimeout)
    this.props.changeNotification(message)
    this.notificationTimeout = setTimeout(this.props.changeNotification, 10000)
  }
  onItemAdd() {
    this.setState({ saving: true })

    return this.props.createNewItem(...arguments)
      .then(({ item, name, error, payload }) => {
        if (error) {
          this.props.showInfoDialog({
            title: 'Error',
            content: payload.data.message,
            cancel: () => this.props.hideInfoDialog(),
            okButton: true
          })
        } else if(item && name) {
          this.hideModal()
          this.showNotification(`${item} ${name} created.`)
        } else {
          this.hideModal()
        }
        this.setState({ saving: false })
      })
  }
  onItemSave() {
    return this.props.editItem(...arguments)
      .then(({ item, name, error, payload }) => {
        if (error) {
          this.props.showInfoDialog({
            title: 'Error',
            content: payload.data.message,
            cancel: () => this.props.hideInfoDialog(),
            okButton: true
          })
        } else if(item && name) {
          this.hideModal()
          this.showNotification('Group detail updates saved.')
        } else {
          this.hideModal()
        }
      })
  }

  onItemDelete() {
    return this.props.deleteItem(...arguments)
      .then(({ item, name, error, payload }) => {
        if(error) {
          this.props.showInfoDialog({
            title: 'Error',
            content: payload.data.message,
            cancel: () => this.props.hideInfoDialog(),
            okButton: true
          })
        } else if(item && name) {
          this.hideModal()
          this.showNotification(`${item} ${name} deleted.`)
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
    switch(tier) {
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
      .then((response) => {
        this.setState({
          showModal: true,
          itemToEdit: Immutable.fromJS(response.payload)
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
  showStorageModal() {
    this.setState({
      showStorageModal : true
    });
  }
  hideStorageModal() {
    this.setState({
      showStorageModal : false
    });
  }
  getTagText(isCloudProvider, providerType, trialMode) {
    let tagText = trialMode ? 'portal.configuration.details.deploymentMode.trial' : null
    if (isCloudProvider && !trialMode) {
      switch(providerType) {
        case ACCOUNT_TYPE_CONTENT_PROVIDER:
          tagText = 'portal.content.contentProvider'
          break
        case ACCOUNT_TYPE_SERVICE_PROVIDER:
          tagText = 'portal.content.serviceProvider'
        default: break
      }
    }
    return { tagText: tagText }
  }

  renderAddButton (storageCreationIsAllowed) {
    if(this.getTier() === 'group' && storageCreationIsAllowed){
      return <ButtonDropdown bsStyle="success" disabled={false} options={this.addButtonOptions}/>
    }

    return <UDNButton bsStyle="success" icon={true} onClick={this.addItem}><IconAdd/></UDNButton>
  }

  renderAccountSelector(props, itemSelectorTopBarAction) {
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
        as="content"
        params={props.params}
        startTier={props.selectionStartTier}
        topBarTexts={itemSelectorTexts}
        topBarAction={itemSelectorTopBarAction}
        onSelect={(...params) => {
          // This check is done to prevent UDN admin from accidentally hitting
          // the account detail endpoint, which they don't have permission for
          const currentUser = props.user.get('currentUser')
          if (params[0] === 'account' && userIsCloudProvider(currentUser)) {
            params[0] = 'groups'
          }

          const url = getContentUrl(...params)

          // We perform this check to prevent routing to unsupported routes
          // For example, prevent clicking to SP group route (not yet supported)
          if (url) {
            props.router.push(url)
          }
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
      sortValuePath,
      sortDirection,
      headerText,
      ifNoContent,
      activeGroup,
      activeAccount,
      analyticsURLBuilder,
      fetchingMetrics,
      showAnalyticsLink,
      viewingChart,
      user,
      storageIds,
      params,
      locationPermissions,
      storageContentItems,
      storagePermission,
      params: { brand, account, group }
    } = this.props

    const { createAllowed } = storagePermission
    const groupHasStorageService = hasStorageService(activeGroup)
    let trafficTotals = Immutable.List()
    const contentItems = this.props.contentItems.map(item => {
      const trialNameRegEx = /(.+?)(?:\.cdx.*)?\.unifieddeliverynetwork\.net/
      const itemMetrics = this.getMetrics(item)
      const itemDailyTraffic = this.getDailyTraffic(item)

      if(!fetchingMetrics) {
        trafficTotals = trafficTotals.push(itemMetrics.get('totalTraffic'))
      }
      // Remove the trial url from trial property names
      if (trialNameRegEx.test(item.get('id'))) {
        item = item.merge({
          id: item.get('id').replace(trialNameRegEx, '$1'),
          name: item.get('id').replace(trialNameRegEx, '$1'),
          isTrialHost: true
        })
      }
      return Immutable.Map({
        item: item,
        metrics: itemMetrics,
        dailyTraffic: itemDailyTraffic
      })
    })
    .sort(sortContent(sortValuePath, sortDirection))
    if(!fetchingMetrics){
      trafficMin = Math.min(...trafficTotals)
      trafficMax = Math.max(...trafficTotals)
    }
    // If trafficMin === trafficMax, there's only one property or all properties
    // have identical metrics. In that case the amoebas will all get the minimum
    // size. Let's make trafficMin less than trafficMax and all amoebas will
    // render with maximum size instead
    trafficMin = trafficMin == trafficMax ? trafficMin * 0.9 : trafficMin
    const trafficScale = d3.scale.linear()
      .domain([trafficMin, trafficMax])
      .range([rangeMin, rangeMax]);
    const foundSort = sortOptions.find(opt => {
      return Immutable.is(opt.path, sortValuePath) &&
        opt.direction === sortDirection
    })
    const currentValue = foundSort ? foundSort.value : sortOptions[0].value
    const isCloudProvider = userIsCloudProvider(user.get('currentUser'))
    const toggleView = type => type ? this.props.toggleChartView : () => {/*no-op*/}

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
                {this.renderAddButton(createAllowed && groupHasStorageService)}
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
            this.props.contentItems.isEmpty() && storageContentItems.isEmpty() ?
              <NoContentItems content={ifNoContent} />
            :
            <ReactCSSTransitionGroup
              component="div"
              className="content-transition"
              transitionName="content-transition"
              transitionEnterTimeout={400}
              transitionLeaveTimeout={250}>

              {!storageContentItems.isEmpty() && groupHasStorageService &&
                <IsAllowed to={PERMISSIONS.LIST_STORAGE}>
                <div>
                  {!viewingChart && <h3><FormattedMessage id="portal.accountManagement.storages.text" /></h3>}
                  <div key={viewingChart} className={viewingChart ? 'content-item-grid' : 'content-item-lists'}>
                    {!viewingChart && storageContentItems.map(storage => {
                      const id = storage.get('id')

                      // TODO UNDP-2906
                      // Fix this in scope of integration with create/edit forms task, analytics
                      const itemProps = {
                        id,
                        name: storage.get('name'),
                        location: storage.get('location'),
                        linkTo: '',
                        disableLinkTo: false,
                        configurationLink: '',
                        onConfiguration: () => {this.editItem(id)},
                        analyticsLink: '',
                        delete: this.props.deleteItem,
                        primaryData: Immutable.List(),
                        maxTransfer: storage.get('maxTransfer'),
                        minTransfer: storage.get('minTransfer'),
                        avgTransfer: storage.get('avgTransfer'),
                        currentUsage: storage.get('currentUsage'),
                        usageQuota: storage.get('usageQuota'),
                        fetchingMetrics: this.props.fetchingMetrics,
                        isAllowedToConfigure: this.props.isAllowedToConfigure,
                        chartWidth: '450'
                      }

                      return (
                        <ContentItem key={`content-item-${id}`}
                          isChart={viewingChart}
                          isStorage={true}
                          itemProps={itemProps}
                          deleteItem={this.props.deleteItem}/>
                      )
                    })}
                  </div>
                  <br />
                  <br />
                  </div>
                </IsAllowed>}

              {this.getTier() === 'group' && !viewingChart &&
                <h3><FormattedMessage id="portal.accountManagement.properties.text" /></h3>}
              <div
                key={viewingChart}
                className={viewingChart ? 'content-item-grid' : 'content-item-lists'}>
                  <IsAllowed to={PERMISSIONS.LIST_STORAGE}>
                    <div className="storage-wrapper">
                      {viewingChart && groupHasStorageService && storageIds.map(id => <StorageChartContainer key={id} storageId={id} params={params} />)}
                    </div>
                  </IsAllowed>

                {contentItems.map(content => {
                  const item = content.get('item')
                  const id = item.get('id')
                  const isTrialHost = item.get('isTrialHost')
                  const name = item.get('name')
                  const contentMetrics = content.get('metrics')
                  const scaledWidth = trafficScale(contentMetrics.get('totalTraffic') || 0)
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
                    dailyTraffic: content.get('dailyTraffic').get('detail').reverse(),
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
              </div>
            </ReactCSSTransitionGroup>
          )}

          {this.state.showModal && this.getTier() === 'brand' &&
            <EntityEdit
              type='account'
              entityToUpdate={this.state.itemToEdit}
              currentUser={this.props.user.get('currentUser')}
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
              show= {true}
              editing={false}
              fetching={false}
              onCancel={this.hideStorageModal}
              onSubmit={()=>{/* onsubmit here */}}
            />
          }
        </PageContainer>
      </Content>
    )
  }
}

ContentItems.displayName = 'ContentItems'
ContentItems.propTypes = {
  activeAccount: React.PropTypes.instanceOf(Immutable.Map),
  activeGroup: React.PropTypes.instanceOf(Immutable.Map),
  analyticsURLBuilder: React.PropTypes.func,
  changeNotification: React.PropTypes.func,
  configURLBuilder: React.PropTypes.func,
  contentItems: React.PropTypes.instanceOf(Immutable.List),
  createNewItem: React.PropTypes.func,
  dailyTraffic: React.PropTypes.instanceOf(Immutable.List),
  deleteItem: React.PropTypes.func,
  editItem: React.PropTypes.func,
  fetchItem: React.PropTypes.func,
  fetching: React.PropTypes.bool,
  fetchingMetrics: React.PropTypes.bool,
  group: React.PropTypes.string,
  headerText: React.PropTypes.object,
  hideInfoDialog: React.PropTypes.func,
  ifNoContent: React.PropTypes.string,
  isAllowedToConfigure: React.PropTypes.bool,
  locationPermissions: React.PropTypes.object,
  metrics: React.PropTypes.instanceOf(Immutable.List),
  nextPageURLBuilder: React.PropTypes.func,
  params: React.PropTypes.object,
  router: React.PropTypes.object,
  // eslint-disable-next-line react/no-unused-prop-types
  selectionDisabled: React.PropTypes.bool, // this is used in a helper render method
  // eslint-disable-next-line react/no-unused-prop-types
  selectionStartTier: React.PropTypes.string, // this is used in a helper render method
  showAnalyticsLink: React.PropTypes.bool,
  showInfoDialog: React.PropTypes.func,
  showSlices: React.PropTypes.bool,
  sortDirection: React.PropTypes.number,
  sortItems: React.PropTypes.func,
  sortValuePath: React.PropTypes.instanceOf(Immutable.List),
  storageContentItems: React.PropTypes.instanceOf(Immutable.List),
  storageIds: React.PropTypes.instanceOf(Immutable.Iterable),
  storagePermission: React.PropTypes.object,
  toggleChartView: React.PropTypes.func,
  type: React.PropTypes.string,
  user: React.PropTypes.instanceOf(Immutable.Map),
  viewingChart: React.PropTypes.bool
}
ContentItems.defaultProps = {
  activeAccount: Immutable.Map(),
  activeGroup: Immutable.Map(),
  contentItems: Immutable.List(),
  dailyTraffic: Immutable.List(),
  metrics: Immutable.List(),
  sortValuePath: Immutable.List(),
  storageContentItems: Immutable.List(),
  storageIds: Immutable.Iterable(),
  user: Immutable.Map(),
  storagePermission: {}
}

export default withRouter(ContentItems)
