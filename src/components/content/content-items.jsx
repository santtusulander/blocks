import React from 'react'
import d3 from 'd3'
import { Modal, ButtonToolbar } from 'react-bootstrap'
import { Link, withRouter } from 'react-router'
import Immutable from 'immutable'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import sortOptions from '../../constants/content-item-sort-options'
import { getContentUrl } from '../../util/routes'

import AddHost from './add-host'
import UDNButton from '../button'
import PageContainer from '../layout/page-container'
import AccountSelector from '../global-account-selector/global-account-selector'
import Content from '../layout/content'
import PageHeader from '../layout/page-header'
import ContentItem from './content-item'
import Select from '../select'
import IconAdd from '../icons/icon-add.jsx'
import IconChart from '../icons/icon-chart.jsx'
import IconItemList from '../icons/icon-item-list.jsx'
import IconItemChart from '../icons/icon-item-chart.jsx'
import LoadingSpinner from '../loading-spinner/loading-spinner'
import AccountForm from '../../components/account-management/account-form.jsx'
import GroupForm from '../../components/account-management/group-form.jsx'
import TruncatedTitle from '../../components/truncated-title'
import { Button } from 'react-bootstrap'

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
      itemToEdit: undefined
    }
    this.itemSelectorTopBarAction = this.itemSelectorTopBarAction.bind(this)
    this.handleSortChange = this.handleSortChange.bind(this)
    this.onItemAdd = this.onItemAdd.bind(this)
    this.onItemSave = this.onItemSave.bind(this)
    this.addItem = this.addItem.bind(this)
    this.editItem = this.editItem.bind(this)
    this.hideModal = this.hideModal.bind(this)
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
    this.props.createNewItem(...arguments)
      .then(({ item, name, error, payload }) => {
        if (error) {
          this.props.showInfoDialog({
            title: 'Error',
            content: payload.data.message,
            buttons:  <Button onClick={this.props.hideInfoDialog} bsStyle="primary" >OK</Button>
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
    this.props.editItem(...arguments)
      .then(({ item, name, error, payload }) => {
        if (error) {
          this.props.showInfoDialog({
            title: 'Error',
            content: payload.data.message,
            buttons:  <Button onClick={this.props.hideInfoDialog} bsStyle="primary" >OK</Button>
          })
        } else if(item && name) {
          this.hideModal()
          this.showNotification('Group detail updates saved.')
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
          itemToEdit: Immutable.Map(response.payload)
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
      viewingChart
    } = this.props
    let trafficTotals = Immutable.List()
    const contentItems = this.props.contentItems.map(item => {
      const trialNameRegEx = /(.+)\.cdx.*\.unifieddeliverynetwork\.net/
      const itemMetrics = this.getMetrics(item)
      const itemDailyTraffic = this.getDailyTraffic(item)

      if(!fetchingMetrics) {
        trafficTotals = trafficTotals.push(itemMetrics.get('totalTraffic'))
      }

      // Remove the trial url from trial property names
      if (trialNameRegEx.test(item.get('id'))) {
        item = item.merge({
          id: item.get('id').replace(trialNameRegEx, '$1'),
          name: item.get('id').replace(trialNameRegEx, '$1')
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
    return (
      <Content>
        <PageHeader pageSubTitle={headerText.summary}>
          <AccountSelector
            as="content"
            params={this.props.params}
            startTier={this.props.selectionStartTier}
            topBarTexts={itemSelectorTexts}
            topBarAction={this.itemSelectorTopBarAction}
            onSelect={(...params) => this.props.router.push(getContentUrl(...params))}>
            <div className="btn btn-link dropdown-toggle header-toggle">
              <h1>
                <TruncatedTitle content={headerText.label} tooltipPlacement="bottom"/>
              </h1>
              <span className="caret"></span>
            </div>
          </AccountSelector>
          <ButtonToolbar>
            {showAnalyticsLink ? <AnalyticsLink url={analyticsURLBuilder}/> : null}
            <UDNButton bsStyle="success"
                       icon={true}
                       onClick={this.addItem}>
              <IconAdd/>
            </UDNButton>
            <Select
              onSelect={this.handleSortChange}
              value={currentValue}
              options={sortOptions.map(opt => [opt.value, opt.label])}/>
            <UDNButton bsStyle="primary"
                       icon={true}
                       toggleView={true}
                       hidden={viewingChart}
                       onClick={this.props.toggleChartView}>
              <IconItemChart/>
            </UDNButton>
            <UDNButton bsStyle="primary"
                       icon={true}
                       toggleView={true}
                       hidden={!viewingChart}
                       onClick={this.props.toggleChartView}>
              <IconItemList/>
            </UDNButton>
          </ButtonToolbar>
        </PageHeader>

        <PageContainer>
          {this.props.fetching || this.props.fetchingMetrics  ?
            <LoadingSpinner /> : (
            this.props.contentItems.isEmpty() ?
              <NoContentItems content={ifNoContent} />
            :
            <ReactCSSTransitionGroup
              component="div"
              className="content-transition"
              transitionName="content-transition"
              transitionEnterTimeout={400}
              transitionLeaveTimeout={250}>
              <div
                key={viewingChart}
                className={viewingChart ?
                  'content-item-grid' :
                  'content-item-lists'}>
                {contentItems.map(content => {
                  const item = content.get('item')
                  const contentMetrics = content.get('metrics')
                  const id = String(item.get('id'))
                  const scaledWidth = trafficScale(contentMetrics.get('totalTraffic') || 0)
                  const itemProps = {
                    id: id,
                    linkTo: this.props.nextPageURLBuilder(id),
                    disableLinkTo: activeAccount.getIn(['provider_type']) === 2,
                    configurationLink: this.props.configURLBuilder ? this.props.configURLBuilder(id) : null,
                    onConfiguration: this.getTier() === 'brand' || this.getTier() === 'account' ? () => {
                      this.editItem(id)
                    } : null,
                    analyticsLink: this.props.analyticsURLBuilder(id),
                    name: item.get('name'),
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
                    showSlices: this.props.showSlices
                  }

                  return (
                    <ContentItem key={id}
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
            <AccountForm
              id="account-form"
              account={this.state.itemToEdit}
              onSave={this.state.itemToEdit ? this.onItemSave : this.onItemAdd}
              onCancel={this.hideModal}
              show={true}/>
          }
          {this.state.showModal && this.getTier() === 'account' &&
            <GroupForm
              id="group-form"
              users={this.props.user.get('allUsers')}
              group={this.state.itemToEdit}
              account={activeAccount}
              onSave={this.state.itemToEdit ? this.onItemSave : this.onItemAdd}
              onCancel={this.hideModal}
              show={true}/>
          }
          {this.state.showModal && this.getTier() === 'group' &&
            <Modal show={true} dialogClassName="configuration-sidebar"
              onHide={this.hideModal}>
              <Modal.Header>
                <h1>Add Property</h1>
                <p>
                  {activeAccount && activeGroup ?
                    activeAccount.get('name') + ' / ' +
                    activeGroup.get('name')
                  : null}
                </p>
              </Modal.Header>
              <Modal.Body>
                <AddHost
                  createHost={this.onItemAdd}
                  cancelChanges={this.hideModal}
                  saving={this.state.saving}/>
              </Modal.Body>
            </Modal>
          }
        </PageContainer>
      </Content>
    )
  }
}

const AnalyticsLink = props => {
  return (
    <Link
      className="btn btn-primary btn-icon"
      to={props.url()}>
      <IconChart />
   </Link>
  )
}
AnalyticsLink.propTypes = { url: React.PropTypes.func }

const NoContentItems = props => {
  return (
    <p className="fetching-info text-center">
      {props.content}
      <br/>
      You can create new properties by clicking the Add New (+) button
    </p>
  )
}
NoContentItems.propTypes = { content: React.PropTypes.string }

ContentItems.displayName = 'ContentItems'
ContentItems.propTypes = {
  activeAccount: React.PropTypes.instanceOf(Immutable.Map),
  activeGroup: React.PropTypes.instanceOf(Immutable.Map),
  analyticsURLBuilder: React.PropTypes.func,
  changeNotification: React.PropTypes.func,
  className: React.PropTypes.string,
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
  history: React.PropTypes.object,
  ifNoContent: React.PropTypes.string,
  metrics: React.PropTypes.instanceOf(Immutable.List),
  nextPageURLBuilder: React.PropTypes.func,
  params: React.PropTypes.object,
  router: React.PropTypes.object,
  selectionStartTier: React.PropTypes.string,
  showAnalyticsLink: React.PropTypes.bool,
  showInfoDialog: React.PropTypes.func,
  showSlices: React.PropTypes.bool,
  sortDirection: React.PropTypes.number,
  sortItems: React.PropTypes.func,
  sortValuePath: React.PropTypes.instanceOf(Immutable.List),
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
  user: Immutable.Map()
}

export default withRouter(ContentItems)
