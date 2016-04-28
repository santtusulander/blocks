import React from 'react'
import d3 from 'd3'
import { Modal, Button, ButtonToolbar } from 'react-bootstrap'
import { Link } from 'react-router'
import Immutable from 'immutable'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import sortOptions from '../constants/content-item-sort-options'

import AddHost from './add-host'
import PageContainer from './layout/page-container'
import Content from './layout/content'
import PageHeader from './layout/page-header'
import ContentItem from './content-item'
import Select from './select'
import IconAdd from './icons/icon-add.jsx'
import IconChart from './icons/icon-chart.jsx'
import IconItemList from './icons/icon-item-list.jsx'
import IconItemChart from './icons/icon-item-chart.jsx'

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
      activeFilter: 'traffic_high_to_low',
      addHost: false
    }

    this.handleSortChange = this.handleSortChange.bind(this)
  }
  handleSortChange(val) {
    const sortOption = sortOptions.find(opt => opt.value === val)
    if(sortOption) {
      this.props.sortItems(sortOption.path, sortOption.direction)
    }
  }
  render() {
    const {brand, account, group, sortValuePath, sortDirection, metrics} = this.props
    let trafficMin = 0
    let trafficMax = 0
    if(!this.props.fetchingMetrics) {
      const trafficTotals = this.props.contentItems.map((item, i) => {
        return metrics.has(i) ?
          metrics.get(i).get('totalTraffic') : 0
      })
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
      .range([400, 500]);
    const contentItems = this.props.contentItems.map(item => {
      return Immutable.Map({
        item: item,
        metrics: metrics.find(metric => {
          return metric.get('property') === item.get('id')
        }) || Immutable.Map()
      })
    })
    .sort(sortContent(sortValuePath, sortDirection))
    const foundSort = sortOptions.find(opt => {
      return Immutable.is(opt.path, this.props.sortValuePath) &&
        opt.direction === this.props.sortDirection
    })
    const currentValue = foundSort ? foundSort.value : sortOptions[0].value
    return (
      <PageContainer className='hosts-container content-subcontainer'>
        <Content>
          <PageHeader>
            <ButtonToolbar className="pull-right">
              <Link className="btn btn-primary btn-icon"
                to={`/content/analytics/group/${brand}/${account}/${group}`}>
                <IconChart />
              </Link>

              <Button bsStyle="primary" className="btn-icon btn-add-new"
                onClick={this.toggleAddHost}>
                <IconAdd />
              </Button>

              <Select
                onSelect={this.handleSortChange}
                value={currentValue}
                options={sortOptions.map(opt => [opt.value, opt.label])}/>

              <Button bsStyle="primary" className={'btn-icon toggle-view' +
                (this.props.viewingChart ? ' hidden' : '')}
                onClick={this.props.toggleChartView}>
                <IconItemChart/>
              </Button>
              <Button bsStyle="primary" className={'btn-icon toggle-view' +
                (!this.props.viewingChart ? ' hidden' : '')}
                onClick={this.props.toggleChartView}>
                <IconItemList/>
              </Button>
            </ButtonToolbar>

            <p>GROUP CONTENT SUMMARY</p>
            <h1>
              {this.props.activeGroup ?
                this.props.activeGroup.get('name')
                : 'Loading...'}
            </h1>
          </PageHeader>

          <div className="container-fluid body-content">
            <ol role="navigation" aria-label="breadcrumbs" className="breadcrumb">
              <li>
                <Link to={`/content/groups/udn/${this.props.account}`}>
                  {this.props.activeAccount ?
                    this.props.activeAccount.get('name')
                    : 'Loading...'}
                </Link>
              </li>
                <li className="active">
                {this.props.activeGroup ?
                  this.props.activeGroup.get('name')
                  : 'Loading...'}
              </li>
            </ol>

            {this.props.fetching || this.props.fetchingMetrics  ?
              <p className="fetching-info">Loading...</p> : (
              this.props.contentItems.size === 0 ?
                <p className="fetching-info text-center">
                  {this.props.activeGroup ?
                    this.props.activeGroup.get('name') +
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
                  key={this.props.viewingChart}
                  className={this.props.viewingChart ?
                    'content-item-grid' :
                    'content-item-lists'}>
                  {contentItems.map((content, i) => {
                    const item = content.get('item')
                    const contentMetrics = content.get('metrics')
                    const id = item.get('id')
                    const scaledWidth = trafficScale(contentMetrics.get('totalTraffic') || 0)
                    const itemProps = {
                      id: id,
                      linkTo: this.props.nextPageURLBuilder(id),
                      configurationLink: this.props.configURLBuilder(id),
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
                        isChart={this.props.viewingChart}
                        itemProps={itemProps}
                        scaledWidth={scaledWidth}
                        deleteItem={this.props.deleteItem}/>
                    )
                  })}
                </div>
              </ReactCSSTransitionGroup>
            )}

            {this.state.addHost ?
              <Modal show={true} dialogClassName="configuration-sidebar"
                onHide={this.toggleAddHost}>
                <Modal.Header>
                  <h1>Add Property</h1>
                  <p>
                    {this.props.activeAccount && this.props.activeGroup ?
                      this.props.activeAccount.get('name') + ' / ' +
                      this.props.activeGroup.get('name')
                    : null}
                  </p>
                </Modal.Header>
                <Modal.Body>
                  <AddHost createHost={this.createNewHost}
                    cancelChanges={this.toggleAddHost}/>
                </Modal.Body>
              </Modal> : null
            }
          </div>
        </Content>
      </PageContainer>
    )
  }
}

ContentItems.displayName = 'ContentItems'
ContentItems.propTypes = {
  account: React.PropTypes.string,
  activeAccount: React.PropTypes.instanceOf(Immutable.Map),
  activeGroup: React.PropTypes.instanceOf(Immutable.Map),
  analyticsURLBuilder: React.PropTypes.func,
  brand: React.PropTypes.string,
  className: React.PropTypes.string,
  configURLBuilder: React.PropTypes.func,
  contentItems: React.PropTypes.instanceOf(Immutable.List),
  deleteItem: React.PropTypes.func,
  fetching: React.PropTypes.bool,
  fetchingMetrics: React.PropTypes.bool,
  group: React.PropTypes.string,
  metrics: React.PropTypes.instanceOf(Immutable.List),
  nextPageURLBuilder: React.PropTypes.func,
  sortDirection: React.PropTypes.number,
  sortItems: React.PropTypes.func,
  sortValuePath: React.PropTypes.instanceOf(Immutable.List),
  toggleChartView: React.PropTypes.func,
  viewingChart: React.PropTypes.bool
}

module.exports = ContentItems
