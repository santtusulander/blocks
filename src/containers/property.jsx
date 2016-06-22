import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Button, ButtonToolbar, Col, Dropdown, Row } from 'react-bootstrap';
import { Link } from 'react-router'
import moment from 'moment'
import numeral from 'numeral'

import * as accountActionCreators from '../redux/modules/account'
import * as groupActionCreators from '../redux/modules/group'
import * as hostActionCreators from '../redux/modules/host'
import * as metricsActionCreators from '../redux/modules/metrics'
import * as purgeActionCreators from '../redux/modules/purge'
import * as trafficActionCreators from '../redux/modules/traffic'
import * as uiActionCreators from '../redux/modules/ui'
import * as visitorsActionCreators from '../redux/modules/visitors'

import PageContainer from '../components/layout/page-container'
import Content from '../components/layout/content'
import PageHeader from '../components/layout/page-header'
import AnalysisByTime from '../components/analysis/by-time'
import IconChart from '../components/icons/icon-chart.jsx'
import IconConfiguration from '../components/icons/icon-configuration.jsx'
import PurgeModal from '../components/purge-modal'
import {formatBitsPerSecond} from '../util/helpers'

export class Property extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      byLocationWidth: 0,
      byTimeWidth: 0,
      purgeActive: false,
      propertyMenuOpen: false
    }

    this.togglePurge = this.togglePurge.bind(this)
    this.measureContainers = this.measureContainers.bind(this)
    this.savePurge = this.savePurge.bind(this)
    this.showNotification = this.showNotification.bind(this)
    this.togglePropertyMenu = this.togglePropertyMenu.bind(this)
    this.notificationTimeout = null
  }
  componentWillMount() {
    this.props.visitorsActions.visitorsReset()
    this.fetchData(this.props.location.query.name)
  }
  componentDidMount() {
    this.measureContainers()
    setTimeout(() => {this.measureContainers()}, 500)
    window.addEventListener('resize', this.measureContainers)
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.location.query.name !== this.props.location.query.name) {
      this.fetchData(nextProps.location.query.name)
    }
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.measureContainers)
  }
  fetchData(property) {
    this.props.hostActions.startFetching()
    this.props.hostActions.fetchHost(
      this.props.params.brand,
      this.props.params.account,
      this.props.params.group,
      property
    )
    this.props.trafficActions.startFetching()
    Promise.all([
      this.props.trafficActions.fetchByTime({
        account: this.props.params.account,
        group: this.props.params.group,
        property: property,
        startDate: moment.utc().endOf('hour').add(1,'second').subtract(28, 'days').format('X'),
        endDate: moment.utc().endOf('hour').format('X')
      })
    ]).then(this.props.trafficActions.finishFetching)
    Promise.all([
      this.props.visitorsActions.fetchByCountry({
        account: this.props.params.account,
        group: this.props.params.group,
        property: property,
        startDate: moment.utc().endOf('day').add(1,'second').subtract(28, 'days').format('X'),
        endDate: moment.utc().endOf('day').format('X'),
        granularity: 'day',
        aggregate_granularity: 'day',
        max_countries: 3
      })
    ]).then(this.props.visitorsActions.finishFetching)
    if(!this.props.properties || !this.props.properties.size) {
      this.props.hostActions.fetchHosts(
        this.props.params.brand,
        this.props.params.account,
        this.props.params.group
      )
    }
    if(!this.props.activeAccount || !this.props.activeAccount.size) {
      this.props.accountActions.fetchAccount(
        this.props.params.brand,
        this.props.params.account
      )
    }
    if(!this.props.activeGroup || !this.props.activeGroup.size) {
      this.props.groupActions.fetchGroup(
        this.props.params.brand,
        this.props.params.account,
        this.props.params.group
      )
    }
    if(!this.props.metrics || !this.props.metrics.size) {
      this.props.metricsActions.fetchHostMetrics({
        account: this.props.params.account,
        group: this.props.params.group,
        startDate: moment.utc().endOf('day').add(1,'second').subtract(28, 'days').format('X'),
        endDate: moment.utc().endOf('day').format('X')
      })
    }
  }
  measureContainers() {
    if(this.refs.byTimeHolder) {
      this.setState({
        byTimeWidth: this.refs.byTimeHolder.clientWidth
      })
    }
  }
  togglePurge() {
    this.setState({
      purgeActive: !this.state.purgeActive
    })
    this.props.purgeActions.resetActivePurge()
  }
  savePurge() {
    let targetUrl = this.props.activeHost.get('services').get(0)
      .get('configurations').get(0).get('edge_configuration')
      .get('published_name')
    if(this.props.activeHost.get('services').get(0)
      .get('deployment_mode') === 'trial') {
      targetUrl = this.props.activeHost.get('services').get(0)
        .get('configurations').get(0).get('edge_configuration')
        .get('trial_name')
    }
    this.props.purgeActions.createPurge(
      this.props.params.brand,
      this.props.params.account,
      this.props.params.group,
      targetUrl,
      this.props.activePurge.toJS()
    ).then((action) => {
      if(action.payload instanceof Error) {
        this.setState({purgeActive: false})
        this.showNotification('Purge request failed: ' +
          action.payload.message)
      }
      else {
        this.setState({purgeActive: false})
        this.showNotification('Purge request succesfully submitted')
      }
    })
  }
  showNotification(message) {
    clearTimeout(this.notificationTimeout)
    this.props.uiActions.changeNotification(message)
    this.notificationTimeout = setTimeout(
      this.props.uiActions.changeNotification, 10000)
  }
  togglePropertyMenu() {
    this.setState({propertyMenuOpen: !this.state.propertyMenuOpen})
  }
  render() {
    if(this.props.fetching || !this.props.activeHost || !this.props.activeHost.size) {
      return <div>Loading...</div>
    }
    const activeHost = this.props.activeHost
    const activeConfig = activeHost.get('services').get(0).get('configurations').get(0)
    const metrics = this.props.metrics.find(
      metric => metric.get('property') === this.props.location.query.name)
      || Immutable.Map()
    const metrics_traffic = metrics.has('traffic') ? metrics.get('traffic').toJS() : []
    // Add 28 days to the historical data so it matches up
    const historical_traffic = (metrics.has('historical_traffic') ? metrics.get('historical_traffic').toJS() : [])
      .map(datapoint => {
        datapoint.timestamp = moment(datapoint.timestamp).add(28, 'days').toDate()
        return datapoint
      })
    const avg_transfer_rate = metrics.has('transfer_rates') ?
      metrics.get('transfer_rates').get('average').split(' ') : [0, null]
    const avg_cache_hit_rate = metrics.has('avg_cache_hit_rate') ? metrics.get('avg_cache_hit_rate') : 0
    const avg_ttfb = metrics.has('avg_ttfb') ? metrics.get('avg_ttfb') : 0
    const uniq_vis = this.props.visitorsByCountry.get('total')
    return (
      <PageContainer className="property-container">
        <Content>
          <PageHeader>
            <ButtonToolbar className="pull-right">
              <Button bsStyle="primary" onClick={this.togglePurge}>Purge</Button>
              <Link className="btn btn-success btn-icon"
                to={`/content/analytics/property/${this.props.params.brand}/${this.props.params.account}/${this.props.params.group}/property?name=${this.props.location.query.name}`}>
                <IconChart/>
              </Link>
              <Link className="btn btn-success btn-icon"
                to={`/content/configuration/${this.props.params.brand}/${this.props.params.account}/${this.props.params.group}/property?name=${this.props.location.query.name}`}>
                <IconConfiguration/>
              </Link>
            </ButtonToolbar>

            <p>PROPERTY SUMMARY</p>
            <Dropdown id="dropdown-content"
              open={this.state.propertyMenuOpen}
              onToggle={this.togglePropertyMenu}>
              <Dropdown.Toggle bsStyle="link" className="header-toggle">
                <h1>{this.props.location.query.name}</h1>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {this.props.properties.map(
                  (property, i) =>
                    property !== this.props.location.query.name ?
                    <li key={i}>
                      <Link to={`/content/property/${this.props.params.brand}/${this.props.params.account}/${this.props.params.group}/property?name=${property}`}
                        onClick={this.togglePropertyMenu}>
                        {property}
                      </Link>
                    </li> : null
                ).toJS()}
              </Dropdown.Menu>
            </Dropdown>
          </PageHeader>
          <div className="container-fluid">

            <Row className="property-info-row no-end-gutters">
              <Col xs={3} className="kpi">
                Origin Hostname
                <h3>
                  {activeConfig.get('edge_configuration').get('origin_host_name')}
                </h3>
              </Col>
              <Col xs={3} className="kpi">
                Published Hostname
                <h3>
                  {activeConfig.get('edge_configuration').get('published_name')}
                </h3>
              </Col>
              <Col xs={2} className="kpi">
                Current Version
                <h3>{activeConfig.get('config_name')}</h3>
              </Col>
              <Col xs={4} className="kpi">
                Deployed
                <h3>
                  {moment(
                    activeConfig.get('configuration_status').get('deployment_date'), 'X'
                  ).format('M/D/YYYY, h:mma')}
                </h3>
              </Col>
            </Row>

            <div className="chart-header">
              <div className="kpi">
                Unique visitors / h (avg)
                <h3>
                  {this.props.fetching || this.props.visitorsFetching ?
                    <span>Loading...</span> :
                    numeral(uniq_vis).format('0,0')
                  }
                </h3>
              </div>
              <div className="kpi">
                Time to First Byte (avg)
                <h3>
                  {avg_ttfb}
                </h3>
              </div>
              <div className="kpi">
                Cache Hit Rate (avg)
                <h3>
                  {avg_cache_hit_rate}%
                </h3>
              </div>
              <div className="kpi">
                Bandwidth (avg/s)
                <h3>
                  {avg_transfer_rate}
                </h3>
              </div>
              <h3 className="has-btn">
                Traffic Summary
                <span className="heading-suffix"> (last 28 days)</span>
              </h3>
            </div>

            <div className="extra-margin-top transfer-by-time" ref="byTimeHolder">
              <AnalysisByTime axes={true} padding={30}
                primaryData={metrics_traffic.reverse()}
                secondaryData={historical_traffic.reverse()}
                primaryLabel="Selected Period"
                comparisonLabel="Comparison Period"
                showLegend={true}
                showTooltip={false}
                dataKey='bits_per_second'
                width={this.state.byTimeWidth}
                height={this.state.byTimeWidth / 3}
                xAxisTickFrequency={this.state.byTimeWidth > 920 ? 1
                  : this.state.byTimeWidth > 600 ? 2 : 3}
                yAxisCustomFormat={formatBitsPerSecond}/>
            </div>
          </div>
        </Content>
        {this.state.purgeActive ? <PurgeModal
          activePurge={this.props.activePurge}
          changePurge={this.props.purgeActions.updateActivePurge}
          hideAction={this.togglePurge}
          savePurge={this.savePurge}
          showNotification={this.showNotification}/> : ''}
      </PageContainer>
    )
  }
}

Property.displayName = 'Property'
Property.propTypes = {
  account: React.PropTypes.string,
  accountActions: React.PropTypes.object,
  activeAccount: React.PropTypes.instanceOf(Immutable.Map),
  activeGroup: React.PropTypes.instanceOf(Immutable.Map),
  activeHost: React.PropTypes.instanceOf(Immutable.Map),
  activePurge: React.PropTypes.instanceOf(Immutable.Map),
  brand: React.PropTypes.string,
  delete: React.PropTypes.func,
  description: React.PropTypes.string,
  fetching: React.PropTypes.bool,
  fetchingMetrics: React.PropTypes.bool,
  group: React.PropTypes.string,
  groupActions: React.PropTypes.object,
  hostActions: React.PropTypes.object,
  id: React.PropTypes.string,
  location: React.PropTypes.object,
  metrics: React.PropTypes.instanceOf(Immutable.List),
  metricsActions: React.PropTypes.object,
  name: React.PropTypes.string,
  params: React.PropTypes.object,
  properties: React.PropTypes.instanceOf(Immutable.List),
  purgeActions: React.PropTypes.object,
  trafficActions: React.PropTypes.object,
  trafficByTime: React.PropTypes.instanceOf(Immutable.List),
  trafficFetching: React.PropTypes.bool,
  uiActions: React.PropTypes.object,
  visitorsActions: React.PropTypes.object,
  visitorsByCountry: React.PropTypes.instanceOf(Immutable.Map),
  visitorsFetching: React.PropTypes.bool
}
Property.defaultProps = {
  activeAccount: Immutable.Map(),
  activeGroup: Immutable.Map(),
  activeHost: Immutable.Map(),
  activePurge: Immutable.Map(),
  metrics: Immutable.List(),
  properties: Immutable.List(),
  trafficByTime: Immutable.List(),
  visitorsByCountry: Immutable.Map()
}

function mapStateToProps(state) {
  return {
    activeAccount: state.account.get('activeAccount'),
    activeGroup: state.group.get('activeGroup'),
    activeHost: state.host.get('activeHost'),
    activePurge: state.purge.get('activePurge'),
    fetching: state.host.get('fetching'),
    fetchingMetrics: state.metrics.get('fetchingHostMetrics'),
    metrics: state.metrics.get('hostMetrics'),
    properties: state.host.get('allHosts'),
    trafficByTime: state.traffic.get('byTime'),
    trafficFetching: state.traffic.get('fetching'),
    visitorsByCountry: state.visitors.get('byCountry'),
    visitorsFetching: state.traffic.get('fetching')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    accountActions: bindActionCreators(accountActionCreators, dispatch),
    groupActions: bindActionCreators(groupActionCreators, dispatch),
    hostActions: bindActionCreators(hostActionCreators, dispatch),
    metricsActions: bindActionCreators(metricsActionCreators, dispatch),
    purgeActions: bindActionCreators(purgeActionCreators, dispatch),
    trafficActions: bindActionCreators(trafficActionCreators, dispatch),
    uiActions: bindActionCreators(uiActionCreators, dispatch),
    visitorsActions: bindActionCreators(visitorsActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Property);
