import React from 'react'

import AddHost from './add-host'
import PageContainer from './layout/page-container'
import Content from './layout/content'
import PageHeader from './layout/page-header'
import ContentItemList from './content-item-list'
import ContentItemChart from './content-item-chart'
import Select from './select'
import IconAdd from './icons/icon-add.jsx'
import IconChart from './icons/icon-chart.jsx'
import IconItemList from './icons/icon-item-list.jsx'
import IconItemChart from './icons/icon-item-chart.jsx'

class ContentItems extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeFilter: 'traffic_high_to_low',
      addHost: false
    }

    this.cancelChanges = this.cancelChanges.bind(this)
  }
  render() {
    let trafficMin = 0
    let trafficMax = 0
    if(!this.props.fetchingMetrics) {
      const trafficTotals = this.props.contentItems.map((item, i) => {
        return this.props.metrics.has(i) ?
          this.props.metrics.get(i).get('totalTraffic') : 0
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
    return (
      <PageContainer className='hosts-container content-subcontainer'>
        <Content>
          <PageHeader>
            <ButtonToolbar className="pull-right">
              <Link className="btn btn-primary btn-icon"
                to={`/content/analytics/group/${this.props.params.brand}/${this.props.params.account}/${this.props.params.group}`}>
                <IconChart />
              </Link>

              <Button bsStyle="primary" className="btn-icon btn-add-new"
                onClick={this.toggleAddHost}>
                <IconAdd />
              </Button>

              <Select
                onSelect={this.handleSelectChange()}
                value={this.state.activeFilter}
                options={[
                  ['traffic_high_to_low', 'Traffic High to Low'],
                  ['traffic_low_to_high', 'Traffic Low to High']]}/>

              <Button bsStyle="primary" className={'btn-icon toggle-view' +
                (this.props.viewingChart ? ' hidden' : '')}
                onClick={this.props.uiActions.toggleChartView}>
                <IconItemChart/>
              </Button>
              <Button bsStyle="primary" className={'btn-icon toggle-view' +
                (!this.props.viewingChart ? ' hidden' : '')}
                onClick={this.props.uiActions.toggleChartView}>
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
                <Link to={`/content/groups/udn/${this.props.params.account}`}>
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
              this.props.hosts.size === 0 ?
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
                {this.props.viewingChart ?
                  <div className="content-item-grid">
                    {this.props.hosts.map((host, i) => {
                      const metrics = this.props.metrics.find(metric => metric.get('property') === host) || Immutable.Map()
                      const scaledWidth = trafficScale(metrics.get('totalTraffic') || 0)
                      return (
                        <ContentItemChart key={i} id={host}
                          linkTo={`/content/property/${this.props.params.brand}/${this.props.params.account}/${this.props.params.group}/property?name=${encodeURIComponent(host).replace(/\./g, "%2e")}`}
                          configurationLink={`/content/configuration/${this.props.params.brand}/${this.props.params.account}/${this.props.params.group}/property?name=${encodeURIComponent(host).replace(/\./g, "%2e")}`}
                          analyticsLink={`/content/analytics/property/${this.props.params.brand}/${this.props.params.account}/${this.props.params.group}/property?name=${encodeURIComponent(host).replace(/\./g, "%2e")}`}
                          name={host} description="Desc"
                          delete={this.deleteHost}
                          primaryData={metrics.has('traffic') ? metrics.get('traffic').toJS() : []}
                          secondaryData={metrics.has('historical_traffic') ? metrics.get('historical_traffic').toJS() : []}
                          differenceData={metrics.has('historical_variance') ? metrics.get('historical_variance').toJS() : []}
                          cacheHitRate={metrics.get('avg_cache_hit_rate')}
                          timeToFirstByte={metrics.get('avg_ttfb')}
                          maxTransfer={metrics.has('transfer_rates') ? metrics.get('transfer_rates').get('peak') : '0.0 Gbps'}
                          minTransfer={metrics.has('transfer_rates') ? metrics.get('transfer_rates').get('lowest') : '0.0 Gbps'}
                          avgTransfer={metrics.has('transfer_rates') ? metrics.get('transfer_rates').get('average') : '0.0 Gbps'}
                          fetchingMetrics={this.props.fetchingMetrics}
                          barWidth="1"
                          chartWidth={scaledWidth.toString()}
                          barMaxHeight={(scaledWidth / 7).toString()} />
                      )
                    }).sort(
                      (item1, item2) => {
                        let sortType = item2.props.chartWidth - item1.props.chartWidth
                        if (this.state.activeFilter === 'traffic_low_to_high') {
                          sortType = item1.props.chartWidth - item2.props.chartWidth
                        }
                        return sortType
                      }
                    )}
                  </div> :
                  <div className="content-item-lists" key="lists">
                    {this.props.hosts.map((host, i) => {
                      const metrics = this.props.metrics.find(metric => metric.get('property') === host) || Immutable.Map()
                      const scaledWidth = trafficScale(metrics.get('totalTraffic') || 0)
                      return (
                        <ContentItemList key={i} id={host}
                          linkTo={`/content/property/${this.props.params.brand}/${this.props.params.account}/${this.props.params.group}/property?name=${encodeURIComponent(host).replace(/\./g, "%2e")}`}
                          configurationLink={`/content/configuration/${this.props.params.brand}/${this.props.params.account}/${this.props.params.group}/property?name=${encodeURIComponent(host).replace(/\./g, "%2e")}`}
                          analyticsLink={`/content/analytics/property/${this.props.params.brand}/${this.props.params.account}/${this.props.params.group}/property?name=${encodeURIComponent(host).replace(/\./g, "%2e")}`}
                          name={host} description="Desc"
                          primaryData={metrics.has('traffic') ? metrics.get('traffic').toJS().reverse() : []}
                          secondaryData={metrics.has('historical_traffic') ? metrics.get('historical_traffic').toJS().reverse() : []}
                          cacheHitRate={metrics.get('avg_cache_hit_rate')}
                          timeToFirstByte={metrics.get('avg_ttfb')}
                          maxTransfer={metrics.has('transfer_rates') ? metrics.get('transfer_rates').get('peak') : '0.0 Gbps'}
                          minTransfer={metrics.has('transfer_rates') ? metrics.get('transfer_rates').get('lowest') : '0.0 Gbps'}
                          avgTransfer={metrics.has('transfer_rates') ? metrics.get('transfer_rates').get('average') : '0.0 Gbps'}
                          chartWidth={scaledWidth.toString()}
                          fetchingMetrics={this.props.fetchingMetrics}/>
                      )
                    }).sort(
                      (item1, item2) => {
                        let sortType = item2.props.chartWidth - item1.props.chartWidth
                        if (this.state.activeFilter === 'traffic_low_to_high') {
                          sortType = item1.props.chartWidth - item2.props.chartWidth
                        }
                        return sortType
                      }
                    )}
                  </div>
                }
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
  activeAccount: React.PropTypes.instanceOf(Immutable.Map),
  activeGroup: React.PropTypes.instanceOf(Immutable.Map),
  className: React.PropTypes.string,
  fetching: React.PropTypes.bool,
  fetchingMetrics: React.PropTypes.bool,
  contentItems: React.PropTypes.instanceOf(Immutable.List),
  metrics: React.PropTypes.instanceOf(Immutable.List),
  viewingChart: React.PropTypes.bool
}

module.exports = ContentItems
