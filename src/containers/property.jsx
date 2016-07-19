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

import AccountSelector from '../components/global-account-selector/global-account-selector'
import PageContainer from '../components/layout/page-container'
import Content from '../components/layout/content'
import PageHeader from '../components/layout/page-header'
import AnalysisByTime from '../components/analysis/by-time'
import IconChart from '../components/icons/icon-chart.jsx'
import IconConfiguration from '../components/icons/icon-configuration.jsx'
import PurgeModal from '../components/purge-modal'
import {formatBitsPerSecond, getContentUrl} from '../util/helpers'
import DateRangeSelect from '../components/date-range-select'
import Tooltip from '../components/tooltip'
import DateRanges from '../constants/date-ranges'

const endOfThisDay = () => moment().utc().endOf('day')
const startOfLast28 = () => endOfThisDay().add(1,'second').subtract(28, 'days')

// default dates to last 28 days
function safeMomentStartDate(date) {
  return date ? moment.utc(date, 'X') : startOfLast28()
}
function safeMomentEndDate(date) {
  return date ? moment.utc(date, 'X') : endOfThisDay()
}
function safeFormattedStartDate(date) {
  return date || startOfLast28().format('X')
}
function safeFormattedEndDate(date) {
  return date || endOfThisDay().format('X')
}

const itemSelectorTexts = {
  property: 'Back to Groups',
  group: 'Back to Accounts',
  account: 'UDN Admin',
  brand: 'UDN Admin'
}

export class Property extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeSlice: null,
      activeSliceX: 100,
      byTimeWidth: 0,
      purgeActive: false,
      propertyMenuOpen: false
    }

    this.itemSelectorTopBarAction = this.itemSelectorTopBarAction.bind(this)
    this.togglePurge = this.togglePurge.bind(this)
    this.measureContainers = this.measureContainers.bind(this)
    this.savePurge = this.savePurge.bind(this)
    this.showNotification = this.showNotification.bind(this)
    this.togglePropertyMenu = this.togglePropertyMenu.bind(this)
    this.notificationTimeout = null
    this.changeDateRange = this.changeDateRange.bind(this)
    this.hoverSlice = this.hoverSlice.bind(this)
    this.selectSlice = this.selectSlice.bind(this)
  }
  componentWillMount() {
    this.props.visitorsActions.visitorsReset()
    this.fetchData(this.props.params, this.props.location.query)
  }
  componentDidMount() {
    this.measureContainers()
    setTimeout(() => {this.measureContainers()}, 500)
    window.addEventListener('resize', this.measureContainers)
  }
  componentWillReceiveProps(nextProps) {
    const prevParams = JSON.stringify(this.props.params)
    const params = JSON.stringify(nextProps.params)

    const newQuery = nextProps.location.query
    const oldQuery = this.props.location.query
    if(params !== prevParams) {
      this.fetchHost(nextProps.params.property)
      this.fetchData(nextProps.params, newQuery)
    }
    else if(newQuery.startDate !== oldQuery.startDate ||
      newQuery.endDate !== oldQuery.endDate) {
      this.setState({
        activeSlice: null
      }, () => {
        this.fetchData(nextProps.params, newQuery)
      })
    }
    this.measureContainers()
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.measureContainers)
  }
  getEmptyHourlyTraffic(startDate, endDate) {
    let hourlyTraffic = [];
    for (var t = startDate.clone(); t < endDate; t = t.add(1, 'h')) {
      hourlyTraffic.push({
        bits_per_second: 0,
        timestamp: moment(t, 'X').toDate()
      })
    }
    return hourlyTraffic
  }
  changeDateRange (startDate, endDate) {
    const {pathname} = this.props.location
    const fStartDate = safeMomentStartDate(startDate).format('X')
    const fEndDate = safeMomentEndDate(endDate).format('X')
    this.setState({
      activeSlice: null
    }, () => {
      this.props.history.pushState(
        null,
        `${pathname}?startDate=${fStartDate}&endDate=${fEndDate}`
      )
    })
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
        this.props.history.pushState(null, getContentUrl('brand', 'udn', {}))
        break
    }
  }
  fetchHost(property) {
    this.props.hostActions.startFetching()
    this.props.hostActions.fetchHost(
      this.props.params.brand,
      this.props.params.account,
      this.props.params.group,
      property
    )
  }
  fetchData(params, queryParams) {
    const {brand, account, group, property} = this.props.params
    const startDate = safeFormattedStartDate(queryParams.startDate)
    const endDate = safeFormattedEndDate(queryParams.endDate)
    if(!this.props.activeHost || !this.props.activeHost.size) {
      this.fetchHost(property)
    }
    Promise.all([
      this.props.visitorsActions.fetchByCountry({
        account: account,
        group: group,
        property: property,
        startDate: startDate,
        endDate: endDate,
        granularity: 'day',
        aggregate_granularity: 'day',
        max_countries: 3
      })
    ]).then(this.props.visitorsActions.finishFetching)
    if(!this.props.properties || !this.props.properties.size) {
      this.props.hostActions.fetchHosts(brand, account, group)
    }
    if(!this.props.activeAccount || !this.props.activeAccount.size) {
      this.props.accountActions.fetchAccount(brand, account)
    }
    if(!this.props.activeGroup || !this.props.activeGroup.size) {
      this.props.groupActions.fetchGroup(brand, account, group)
    }
    const metricsOpts = {
      account: account,
      group: group,
      startDate: startDate,
      endDate: endDate,
      property: property,
      list_children: 'false'
    }
    this.props.metricsActions.fetchHourlyHostTraffic(metricsOpts)
    this.props.metricsActions.fetchDailyHostTraffic(metricsOpts)
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
  hoverSlice(date, x1, x2) {
    if(date && this.props.dailyTraffic.size) {
      const activeSlice = this.props.dailyTraffic.get(0).get('detail')
        .find(day => moment.utc(day.get('timestamp'), 'X')
          .isSame(moment.utc(date), 'day'))
      const xPos = (((x1 + x2) / 2) - 100)
      this.setState({
        activeSlice: activeSlice,
        activeSliceX: xPos
      })
    }
    else {
      this.setState({activeSlice: null})
    }
  }
  selectSlice(date) {
    this.changeDateRange(moment.utc(date), moment.utc(date).endOf('day'))
  }
  render() {
    if(this.props.fetching || !this.props.activeHost || !this.props.activeHost.size) {
      return <div>Loading...</div>
    }
    const startDate = safeMomentStartDate(this.props.location.query.startDate)
    const endDate = safeMomentEndDate(this.props.location.query.endDate)
    const activeHost = this.props.activeHost
    const activeConfig = activeHost.get('services').get(0).get('configurations').get(0)
    const totals = this.props.hourlyTraffic.getIn(['now',0,'totals'])
    // Add time difference to the historical data so it matches up
    const historical_traffic = !this.props.hourlyTraffic.get('history').size ?
      [] :
      this.props.hourlyTraffic.getIn(['history',0,'detail']).map(hour => {
        return {
          timestamp: moment(hour.get('timestamp'), 'X').add(28, 'days').toDate(),
          bits_per_second: hour.getIn(['transfer_rates','average'])
        }
      }).toJS()
    const metrics_traffic = !totals ?
      !historical_traffic.length ? [] : this.getEmptyHourlyTraffic(startDate, endDate) :
      this.props.hourlyTraffic.getIn(['now',0,'detail']).map(hour => {
        return {
          timestamp: moment(hour.get('timestamp'), 'X').toDate(),
          bits_per_second: hour.getIn(['transfer_rates','average'])
        }
      }).toJS()
    const avg_transfer_rate = totals && totals.get('transfer_rates').get('average')
    const avg_cache_hit_rate = totals && totals.get('chit_ratio')
    const avg_ttfb = totals && totals.get('avg_fbl')
    const uniq_vis = this.props.visitorsByCountry.get('total')
    const sliceGranularity = endDate.diff(startDate, 'days') <= 1 ? null : 'day'
    const formatHistoryTooltip = (date, value) => {
      const formattedDate = moment.utc(date)
        .subtract(28, 'days')
        .format('MMM D H:mm')
      const formattedValue = formatBitsPerSecond(value)
      return `${formattedDate} ${formattedValue}`
    }
    return (
      <PageContainer className="property-container">
        <Content>
          <PageHeader>
            <ButtonToolbar className="pull-right">
              <Button bsStyle="primary" onClick={this.togglePurge}>Purge</Button>
              <Link className="btn btn-success btn-icon"
                    to={`${getContentUrl('property', this.props.params.property, this.props.params)}/analytics`}>
                <IconChart/>
              </Link>
              <Link className="btn btn-success btn-icon"
                    to={`${getContentUrl('property', this.props.params.property, this.props.params)}/configuration`}>
                <IconConfiguration/>
              </Link>
            </ButtonToolbar>

            <p>PROPERTY SUMMARY</p>
            <AccountSelector
              params={this.props.params}
              topBarTexts={itemSelectorTexts}
              topBarAction={this.itemSelectorTopBarAction}
              user={this.props.user}
              onSelect={(...params) => this.props.history.pushState(null, getContentUrl(...params))}
              drillable={true}>
              <Dropdown.Toggle bsStyle="link" className="header-toggle">
                <h1>{this.props.params.property}</h1>
              </Dropdown.Toggle>
            </AccountSelector>
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
                  {formatBitsPerSecond(avg_transfer_rate, true)}
                </h3>
              </div>
              <h3 className="has-btn">
                Property Summary
                <DateRangeSelect
                  startDate={startDate}
                  endDate={endDate}
                  changeDateRange={this.changeDateRange}
                  availableRanges={[
                    DateRanges.LAST_28,
                    DateRanges.CUSTOM_TIMERANGE
                  ]}/>
              </h3>
            </div>

            <div className="extra-margin-top transfer-by-time" ref="byTimeHolder">
              <AnalysisByTime axes={true} padding={30}
                primaryData={metrics_traffic}
                secondaryData={historical_traffic}
                primaryLabel="Selected Period"
                comparisonLabel="Comparison Period"
                showLegend={true}
                showTooltip={false}
                dataKey='bits_per_second'
                width={this.state.byTimeWidth}
                height={this.state.byTimeWidth / 3}
                xAxisTickFrequency={this.state.byTimeWidth > 920 ? 1
                  : this.state.byTimeWidth > 600 ? 2 : 3}
                yAxisCustomFormat={formatBitsPerSecond}
                sliceGranularity={sliceGranularity}
                hoverSlice={this.hoverSlice}
                selectSlice={this.selectSlice}
                formatSecondaryTooltip={formatHistoryTooltip}/>
              {this.state.activeSlice && <Tooltip
                className="slice-tooltip"
                x={this.state.activeSliceX}
                y={-30}
                hidden={false}>
                <div className="tooltip-header">
                  <b>{moment.utc(this.state.activeSlice.get('timestamp'),'X').format('MMM D, ddd')}</b>
                </div>
                <div>
                  Peak
                  <span className="pull-right">
                    {formatBitsPerSecond(this.state.activeSlice.getIn(['transfer_rates','peak']))}
                  </span>
                </div>
                <div>
                  Average <span className="pull-right">
                    {formatBitsPerSecond(this.state.activeSlice.getIn(['transfer_rates','average']))}
                  </span>
                </div>
                <div>
                  Low <span className="pull-right">
                    {formatBitsPerSecond(this.state.activeSlice.getIn(['transfer_rates','low']))}
                  </span>
                </div>
              </Tooltip>}
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
  dailyTraffic: React.PropTypes.instanceOf(Immutable.List),
  delete: React.PropTypes.func,
  description: React.PropTypes.string,
  fetching: React.PropTypes.bool,
  fetchingMetrics: React.PropTypes.bool,
  group: React.PropTypes.string,
  groupActions: React.PropTypes.object,
  history: React.PropTypes.object,
  hostActions: React.PropTypes.object,
  hourlyTraffic: React.PropTypes.instanceOf(Immutable.Map),
  id: React.PropTypes.string,
  location: React.PropTypes.object,
  metricsActions: React.PropTypes.object,
  name: React.PropTypes.string,
  params: React.PropTypes.object,
  properties: React.PropTypes.instanceOf(Immutable.List),
  purgeActions: React.PropTypes.object,
  trafficActions: React.PropTypes.object,
  trafficFetching: React.PropTypes.bool,
  uiActions: React.PropTypes.object,
  user: React.PropTypes.instanceOf(Immutable.Map),
  visitorsActions: React.PropTypes.object,
  visitorsByCountry: React.PropTypes.instanceOf(Immutable.Map),
  visitorsFetching: React.PropTypes.bool
}
Property.defaultProps = {
  activeAccount: Immutable.Map(),
  activeGroup: Immutable.Map(),
  activeHost: Immutable.Map(),
  activePurge: Immutable.Map(),
  dailyTraffic: Immutable.List(),
  hourlyTraffic: Immutable.fromJS({
    now: [],
    history: []
  }),
  properties: Immutable.List(),
  user: Immutable.Map(),
  visitorsByCountry: Immutable.Map()
}

function mapStateToProps(state) {
  return {
    activeAccount: state.account.get('activeAccount'),
    activeGroup: state.group.get('activeGroup'),
    activeHost: state.host.get('activeHost'),
    activePurge: state.purge.get('activePurge'),
    dailyTraffic: state.metrics.get('hostDailyTraffic'),
    fetching: state.host.get('fetching'),
    fetchingMetrics: state.metrics.get('fetchingHostMetrics'),
    hourlyTraffic: state.metrics.get('hostHourlyTraffic'),
    properties: state.host.get('allHosts'),
    trafficFetching: state.traffic.get('fetching'),
    user: state.user,
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
