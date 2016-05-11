import React from 'react'
import d3 from 'd3'
import { Modal, ButtonToolbar } from 'react-bootstrap'
import { Link } from 'react-router'
import Immutable from 'immutable'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import sortOptions from '../constants/content-item-sort-options'

import AddHost from './add-host'
import { ButtonWrapper as Button } from './button'
import PageContainer from './layout/page-container'
import Content from './layout/content'
import PageHeader from './layout/page-header'
import ContentItem from './content-item'
import { Breadcrumbs } from './breadcrumbs'
import Select from './select'
import IconAdd from './icons/icon-add.jsx'
import IconChart from './icons/icon-chart.jsx'
import IconItemList from './icons/icon-item-list.jsx'
import IconItemChart from './icons/icon-item-chart.jsx'

const rangeMin = 400
const rangeMax = 500

let trafficMin = 0
let trafficMax = 0

const sortContent = (path, direction) => (item1, item2) => {
  const val1 = item1.getIn(path)
  const val2 = item2.getIn(path)
  if(val1 > val2) {
    return direction
  }
  else if(val1 < val2) {
    return -1 * direction
  }
}

class ContentItems extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      addItem: false
    }

    this.handleSortChange = this.handleSortChange.bind(this)
    this.toggleAddItem = this.toggleAddItem.bind(this)
    this.createNewItem = this.createNewItem.bind(this)
  }
  handleSortChange(val) {
    const sortOption = sortOptions.find(opt => opt.value === val)
    if(sortOption) {
      this.props.sortItems(sortOption.path, sortOption.direction)
    }
  }
  toggleAddItem() {
    this.setState({
      addItem: !this.state.addItem
    })
  }
  createNewItem() {
    this.props.createNewItem(...arguments)
    this.toggleAddItem()
  }
  render() {
    const {
      sortValuePath,
      sortDirection,
      metrics,
      headerText,
      activeGroup,
      activeAccount,
      type,
      analyticsURLBuilder,
      fetchingMetrics,
      showAnalyticsLink,
      viewingChart,
      createNewItem } = this.props
    if(!fetchingMetrics) {
      const trafficTotals = this.props.contentItems.map((item, i) => metrics.getIn([i, 'totalTraffic'], 0))
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
    const contentItems = this.props.contentItems.map(item => {
      return Immutable.Map({
        item: item,
        metrics: metrics.find(metric => {
          return metric.get(type) === item.get('id')
        }) || Immutable.Map()
      })
    })
    .sort(sortContent(sortValuePath, sortDirection))
    const foundSort = sortOptions.find(opt => {
      return Immutable.is(opt.path, sortValuePath) &&
        opt.direction === sortDirection
    })
    const currentValue = foundSort ? foundSort.value : sortOptions[0].value
    return (
      <PageContainer className={`${this.props.className} content-subcontainer`}>
        <Content>
          <PageHeader>
            <ButtonToolbar className="pull-right">
              {showAnalyticsLink ? <AnalyticsLink url={analyticsURLBuilder}/> : null}
              <Button bsStyle="primary"
                icon={true}
                addNew={true}
                hidden={createNewItem === undefined}
                onClick={this.toggleAddItem}>
                <IconAdd/>
              </Button>
              <Select
                onSelect={this.handleSortChange}
                value={currentValue}
                options={sortOptions.map(opt => [opt.value, opt.label])}/>
              <Button bsStyle="primary"
                icon={true}
                toggleView={true}
                hidden={viewingChart}
                onClick={this.props.toggleChartView}>
                <IconItemChart/>
              </Button>
              <Button bsStyle="primary"
                icon={true}
                toggleView={true}
                hidden={!viewingChart}
                onClick={this.props.toggleChartView}>
                <IconItemList/>
              </Button>
            </ButtonToolbar>
            <p>{headerText.summary}</p>
            <h1>{headerText.label}</h1>
          </PageHeader>

          <div className="container-fluid body-content">
            {this.props.breadcrumbs ? <Breadcrumbs links={this.props.breadcrumbs}/> : null}
            {this.props.fetching || this.props.fetchingMetrics  ?
              <p className="fetching-info">Loading...</p> : (
              this.props.contentItems.size === 0 ?
                <p className="fetching-info text-center">
                  {activeGroup ?
                    activeGroup.get('name') +
                    ' does not contain any properties'
                    : 'Loading...'}
                <br/>
                You can create new properties by clicking the Add New (+) button
                </p>
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
                  {contentItems.map((content, i) => {
                    const item = content.get('item')
                    const contentMetrics = content.get('metrics')
                    const id = String(item.get('id'))
                    const scaledWidth = trafficScale(contentMetrics.get('totalTraffic') || 0)
                    const itemProps = {
                      id: id,
                      linkTo: this.props.nextPageURLBuilder(id),
                      configurationLink: this.props.configURLBuilder ? this.props.configURLBuilder(id) : null,
                      analyticsLink: this.props.analyticsURLBuilder(id),
                      name: item.get('name'),
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
                      barMaxHeight: (scaledWidth / 7).toString()
                    }
                    return (
                      <ContentItem key={i}
                        isChart={viewingChart}
                        itemProps={itemProps}
                        scaledWidth={scaledWidth}
                        deleteItem={this.props.deleteItem}/>
                    )
                  })}
                </div>
              </ReactCSSTransitionGroup>
            )}

            {this.state.addItem ?
              <Modal show={true} dialogClassName="configuration-sidebar"
                onHide={this.toggleAddItem}>
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
                  <AddHost createHost={this.createNewItem}
                    cancelChanges={this.toggleAddItem}/>
                </Modal.Body>
              </Modal> : null
            }
          </div>
        </Content>
      </PageContainer>
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

ContentItems.displayName = 'ContentItems'
ContentItems.propTypes = {
  account: React.PropTypes.string,
  activeAccount: React.PropTypes.instanceOf(Immutable.Map),
  activeGroup: React.PropTypes.instanceOf(Immutable.Map),
  analyticsURLBuilder: React.PropTypes.func,
  breadcrumbs: React.PropTypes.array,
  className: React.PropTypes.string,
  configURLBuilder: React.PropTypes.func,
  contentItems: React.PropTypes.instanceOf(Immutable.List),
  createNewItem: React.PropTypes.func,
  deleteItem: React.PropTypes.func,
  fetching: React.PropTypes.bool,
  fetchingMetrics: React.PropTypes.bool,
  group: React.PropTypes.string,
  headerText: React.PropTypes.object,
  metrics: React.PropTypes.instanceOf(Immutable.List),
  nextPageURLBuilder: React.PropTypes.func,
  showAnalyticsLink: React.PropTypes.bool,
  sortDirection: React.PropTypes.number,
  sortItems: React.PropTypes.func,
  sortValuePath: React.PropTypes.instanceOf(Immutable.List),
  toggleChartView: React.PropTypes.func,
  type: React.PropTypes.string,
  viewingChart: React.PropTypes.bool
}

module.exports = ContentItems
