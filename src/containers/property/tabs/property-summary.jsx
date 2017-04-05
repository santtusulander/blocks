import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { bindActionCreators } from 'redux'
import { Col, Row } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl'
import moment from 'moment'
import numeral from 'numeral'

import * as accountActionCreators from '../../../redux/modules/account'
import * as groupActionCreators from '../../../redux/modules/group'
import * as hostActionCreators from '../../../redux/modules/host'
import * as metricsActionCreators from '../../../redux/modules/metrics'
import * as purgeActionCreators from '../../../redux/modules/purge'
import * as uiActionCreators from '../../../redux/modules/ui'
import * as visitorsActionCreators from '../../../redux/modules/visitors'

import PageContainer from '../../../components/shared/layout/page-container'
import AnalysisByTime from '../../../components/analysis/by-time'
import DateRangeSelect from '../../../components/shared/form-elements/date-range-select'
import Tooltip from '../../../components/tooltip'
import LoadingSpinner from '../../../components/loading-spinner/loading-spinner'

import {
  formatBitsPerSecond
} from '../../../util/helpers'

import DateRanges from '../../../constants/date-ranges'
import { paleblue } from "../../../constants/colors";

const endOfThisDay = () => moment().utc().endOf('day')
const startOfLast28 = () => endOfThisDay().endOf('day').add(1, 'second').subtract(28, 'days')

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

class PropertySummary extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      activeSlice: null,
      activeSliceX: 100,
      byTimeWidth: 0
    }

    this.togglePurge = this.togglePurge.bind(this)
    this.measureContainers = this.measureContainers.bind(this)
    this.savePurge = this.savePurge.bind(this)
    this.showNotification = this.showNotification.bind(this)
    this.togglePropertyMenu = this.togglePropertyMenu.bind(this)
    this.notificationTimeout = null
    this.changeDateRange = this.changeDateRange.bind(this)
    this.hoverSlice = this.hoverSlice.bind(this)
    this.selectSlice = this.selectSlice.bind(this)

    this.measureContainersTimeout = null
  }

  componentWillMount() {
    this.props.visitorsActions.visitorsReset()
    this.fetchData(
      this.props.params,
      this.props.location.query,
      this.props.activeHostConfiguredName
    )
  }

  componentDidMount() {
    this.measureContainers()
    // TODO: remove this timeout as part of UDNP-1426
    this.measureContainersTimeout = setTimeout(() => {
      this.measureContainers()
    }, 500)
    window.addEventListener('resize', this.measureContainers)
  }

  componentWillReceiveProps(nextProps) {
    const prevParams = JSON.stringify(this.props.params)
    const params = JSON.stringify(nextProps.params)

    const newQuery = nextProps.location.query
    const oldQuery = this.props.location.query
    const fetch = () => {
      this.fetchData(
        nextProps.params,
        newQuery,
        nextProps.activeHostConfiguredName
      )
    }
    if (params !== prevParams) {
      this.fetchHost(nextProps.params.property)
      fetch()
    } else if (newQuery.startDate !== oldQuery.startDate ||
      newQuery.endDate !== oldQuery.endDate) {
      this.setState({
        activeSlice: null
      }, fetch)
    } else if (this.props.activeHostConfiguredName !== nextProps.activeHostConfiguredName) {
      fetch()
    }
    this.measureContainers()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.measureContainers)
    clearTimeout(this.measureContainersTimeout)
  }

  getEmptyHourlyTraffic(startDate, endDate) {
    const hourlyTraffic = [];
    for (let t = startDate.clone(); t < endDate; t = t.add(1, 'h')) {
      hourlyTraffic.push({
        bits_per_second: 0,
        timestamp: moment(t, 'X').toDate()
      })
    }
    return hourlyTraffic
  }

  changeDateRange(startDate, endDate) {
    const { pathname } = this.props.location
    const fStartDate = safeMomentStartDate(startDate).format('X')
    const fEndDate = safeMomentEndDate(endDate).format('X')
    this.setState({
      activeSlice: null
    }, () => {
      this.props.router.push(
        `${pathname}?startDate=${fStartDate}&endDate=${fEndDate}`
      )
    })
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

  fetchData(params, queryParams, hostConfiguredName) {
    const { brand, account, group, property } = params
    const startDate = safeFormattedStartDate(queryParams.startDate)
    const endDate = safeFormattedEndDate(queryParams.endDate)
    if (!this.props.activeHost || !this.props.activeHost.size || this.props.activeHostConfiguredName !== property) {
      this.fetchHost(property)
    }

    this.props.visitorsActions.fetchByTime({
      account: account,
      group: group,
      property: hostConfiguredName,
      startDate: startDate,
      endDate: endDate,
      granularity: 'hour'
    }).then(this.props.visitorsActions.finishFetching)

    if (!this.props.properties || !this.props.properties.size) {
      this.props.hostActions.fetchHosts(brand, account, group)
    }
    if (!this.props.activeAccount || !this.props.activeAccount.size) {
      this.props.accountActions.fetchAccount(brand, account)
    }
    if (!this.props.activeGroup || !this.props.activeGroup.size) {
      this.props.groupActions.fetchGroup(brand, account, group)
    }
    const metricsOpts = {
      account: account,
      group: group,
      startDate: startDate,
      endDate: endDate,
      property: hostConfiguredName,
      list_children: 'false'
    }
    this.props.metricsActions.fetchHourlyHostTraffic(metricsOpts)
    this.props.metricsActions.fetchDailyHostTraffic(metricsOpts)
  }

  measureContainers() {
    const byTimeHolder = this.refs.byTimeHolder

    if (byTimeHolder && byTimeHolder.clientWidth !== this.state.byTimeWidth) {
      this.setState({
        byTimeWidth: byTimeHolder.clientWidth
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
    this.props.purgeActions.createPurge(
      this.props.params.brand,
      this.props.params.account,
      this.props.params.group,
      this.props.activeHostConfiguredName,
      this.props.activePurge.toJS()
    ).then((action) => {
      if (action.payload instanceof Error) {
        this.setState({ purgeActive: false })
        this.showNotification(
          <FormattedMessage
            id="portal.content.property.summary.requestFailed.label"
            value={{ reason: action.payload.message }}
          />
        )
      } else {
        this.setState({ purgeActive: false })
        this.showNotification(<FormattedMessage id="portal.content.property.summary.requestSuccess.label"/>)
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
    this.setState({ propertyMenuOpen: !this.state.propertyMenuOpen })
  }

  hoverSlice(date, x1, x2) {
    if (date && this.props.dailyTraffic.size) {
      const activeSlice = this.props.dailyTraffic.get(0).get('detail')
        .find(day => moment.utc(day.get('timestamp'), 'X')
          .isSame(moment.utc(date), 'day'))
      const xPos = (((x1 + x2) / 2) - 100)
      this.setState({
        activeSlice: activeSlice,
        activeSliceX: xPos
      })
    } else {
      this.setState({ activeSlice: null })
    }
  }

  selectSlice(date) {
    this.changeDateRange(moment.utc(date), moment.utc(date).endOf('day'))
  }

  render() {

    if (this.props.fetching || !this.props.activeHost || !this.props.activeHost.size) {
      return <LoadingSpinner />
    }

    const startDate = safeMomentStartDate(this.props.location.query.startDate)
    const endDate = safeMomentEndDate(this.props.location.query.endDate)
    let dateRange = moment.duration(endDate - startDate, 'milliseconds').add(1, 's')

    if (dateRange < moment.duration(28, 'days')) {
      dateRange = moment.duration(28, 'days')
    }

    const activeHost = this.props.activeHost
    const activeConfig = activeHost.get('services').get(0).get('configurations').get(0)
    const totals = this.props.hourlyTraffic.getIn(['now', 0, 'totals'])

    // Add time difference to the historical data so it matches up
    const historical_traffic = !this.props.hourlyTraffic.get('history').size ?
      [] :
      this.props.hourlyTraffic.getIn(['history', 0, 'detail']).map(hour => {
        return {
          timestamp: moment(hour.get('timestamp'), 'X').add(dateRange.asDays(), 'days').toDate(),
          bits_per_second: hour.getIn(['transfer_rates', 'total'])
        }
      })
    const metrics_traffic = !totals ?
      !historical_traffic.length ? [] : this.getEmptyHourlyTraffic(startDate, endDate) :
      this.props.hourlyTraffic.getIn(['now', 0, 'detail']).map(hour => {
        return {
          timestamp: moment(hour.get('timestamp'), 'X').toDate(),
          bits_per_second: hour.getIn(['transfer_rates', 'total'])
        }
      })
    const avg_transfer_rate = totals && totals.get('transfer_rates').get('average')
    const avg_cache_hit_rate = totals && totals.get('chit_ratio')
    const avg_ttfb = totals && totals.get('avg_fbl')
    const sliceGranularity = endDate.diff(startDate, 'days') <= 1 ? null : 'day'
    const formatHistoryTooltip = (date, value) => {
      const formattedDate = moment.utc(date)
        .subtract(dateRange.asDays(), 'days')
        .format('MMM D H:mm')
      const formattedValue = formatBitsPerSecond(value)
      return `${formattedDate} ${formattedValue}`
    }
    const timespanAdjust = direction => time => time.set(
      'timestamp',
      new Date(time.get('timestamp').getTime() + dateRange.asMilliseconds() * direction))
    const datasets = []
    if (metrics_traffic.size) {
      datasets.push({
        area: false,
        color: paleblue,
        comparisonData: false,
        data: metrics_traffic.toJS(),
        id: '',
        label: <FormattedMessage id="portal.content.property.summary.selectedPeriod.label"/>,
        line: true,
        stackedAgainst: false,
        xAxisFormatter: false
      })
    }
    if (historical_traffic.size) {
      datasets.push({
        area: true,
        color: paleblue,
        comparisonData: true,
        data: historical_traffic.toJS(),
        noGradient: true,
        id: '',
        label: <FormattedMessage id="portal.content.property.summary.comparisonPeriod.label"/>,
        line: false,
        stackedAgainst: false,
        xAxisFormatter: (date) => moment.utc(timespanAdjust(-1)(date).get('timestamp'))
      })
    }

    return (

      <PageContainer className="property-container">
        <Row className="property-info-row no-end-gutters">
          <Col xs={3} className="kpi">
            <FormattedMessage id="portal.content.property.summary.originHostname.title"/>
            <h3>
              {activeConfig.get('edge_configuration').get('origin_host_name')}
            </h3>
          </Col>
          <Col xs={3} className="kpi">
            <FormattedMessage id="portal.content.property.summary.publishedHostname.title"/>
            <h3>
              {activeConfig.get('edge_configuration').get('published_name')}
            </h3>
          </Col>
          <Col xs={4} className="kpi">
            <FormattedMessage id="portal.content.property.summary.deployed.title"/>
            <h3>
              {moment(
                activeConfig.get('configuration_status').get('deployment_date'), 'X'
              ).format('M/D/YYYY, h:mma')}
            </h3>
          </Col>
        </Row>

        <div className="chart-header">
          <div className="kpi">
            <FormattedMessage id="portal.content.property.summary.uniqueVisitors.title"/>
            <h3>
              {this.props.fetching || this.props.visitorsFetching ?
                <span><FormattedMessage id="portal.loading.text"/></span> :
                numeral(this.props.visitorsByTimeAverage).format('0,0')
              }
            </h3>
          </div>
          <div className="kpi">
            <FormattedMessage id="portal.content.property.summary.timeToFirstByte.title"/>
            <h3>
              {avg_ttfb}
            </h3>
          </div>
          <div className="kpi">
            <FormattedMessage id="portal.content.property.summary.cacheHitRate.title"/>
            <h3>
              {avg_cache_hit_rate}%
            </h3>
          </div>
          <div className="kpi">
            <FormattedMessage id="portal.content.property.summary.bandWidth.title"/>
            <h3>
              {formatBitsPerSecond(avg_transfer_rate, true)}

            </h3>
          </div>
          <h3 className="has-btn">
            <FormattedMessage id="portal.content.property.summary.propertySummary.title"/>
            <DateRangeSelect
              startDate={startDate}
              endDate={endDate}
              changeDateRange={this.changeDateRange}
              availableRanges={[
                DateRanges.LAST_28
              ]}/>
          </h3>
        </div>

        <div className="extra-margin-top transfer-by-time" ref="byTimeHolder">
          <AnalysisByTime
            axes={true}
            padding={40}
            dataSets={datasets}
            showLegend={true}
            showTooltip={false}
            dataKey='bits_per_second'
            width={this.state.byTimeWidth}
            height={this.state.byTimeWidth / 3}
            xAxisTickFrequency={this.state.byTimeWidth > 920 ? 1
              : this.state.byTimeWidth > 600 ? 2 : 3}
            yAxisCustomFormat={(val, setMax) => formatBitsPerSecond(val, false, setMax)}
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
              <b>{moment.utc(this.state.activeSlice.get('timestamp'), 'X').format('MMM D, ddd')}</b>
            </div>
            <div>
              <FormattedMessage id="portal.content.property.summary.peak.label"/>
              <span className="pull-right">
                  {formatBitsPerSecond(this.state.activeSlice.getIn(['transfer_rates', 'peak']))}
                </span>
            </div>
            <div>
              <FormattedMessage id="portal.content.property.summary.average.label"/>
              <span className="pull-right">
                  {formatBitsPerSecond(this.state.activeSlice.getIn(['transfer_rates', 'average']))}
                </span>
            </div>
            <div>
              <FormattedMessage id="portal.content.property.summary.low.label"/>
              <span className="pull-right">
                  {formatBitsPerSecond(this.state.activeSlice.getIn(['transfer_rates', 'low']))}
                </span>

            </div>
          </Tooltip>}
        </div>
      </PageContainer>
    )
  }
}

PropertySummary.displayName = 'PropertySummary'
PropertySummary.propTypes = {
  account: React.PropTypes.string,
  accountActions: React.PropTypes.object,
  activeAccount: React.PropTypes.instanceOf(Immutable.Map),
  activeGroup: React.PropTypes.instanceOf(Immutable.Map),
  activeHost: React.PropTypes.instanceOf(Immutable.Map),
  activeHostConfiguredName: React.PropTypes.string,
  activePurge: React.PropTypes.instanceOf(Immutable.Map),
  brand: React.PropTypes.string,
  dailyTraffic: React.PropTypes.instanceOf(Immutable.List),
  fetching: React.PropTypes.bool,
  group: React.PropTypes.string,
  groupActions: React.PropTypes.object,
  hostActions: React.PropTypes.object,
  hourlyTraffic: React.PropTypes.instanceOf(Immutable.Map),
  location: React.PropTypes.object,
  metricsActions: React.PropTypes.object,
  params: React.PropTypes.object,
  properties: React.PropTypes.instanceOf(Immutable.List),
  purgeActions: React.PropTypes.object,
  router: React.PropTypes.object,
  uiActions: React.PropTypes.object,
  visitorsActions: React.PropTypes.object,
  visitorsByTimeAverage: React.PropTypes.number,
  visitorsFetching: React.PropTypes.bool
}
PropertySummary.defaultProps = {
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
  visitorsByTimeAverage: 0
}

function mapStateToProps(state) {
  return {
    activeAccount: state.account.get('activeAccount'),
    activeGroup: state.group.get('activeGroup'),
    activeHost: state.host.get('activeHost'),
    activeHostConfiguredName: state.host.get('activeHostConfiguredName'),
    activePurge: state.purge.get('activePurge'),
    currentUser: state.user.get('currentUser'),
    dailyTraffic: state.metrics.get('hostDailyTraffic'),
    fetching: state.host.get('fetching'),
    hourlyTraffic: state.metrics.get('hostHourlyTraffic'),
    properties: state.host.get('allHosts'),
    visitorsByTimeAverage: state.visitors.get('byTimeAverage'),
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
    uiActions: bindActionCreators(uiActionCreators, dispatch),
    visitorsActions: bindActionCreators(visitorsActionCreators, dispatch)
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(withRouter(PropertySummary)));
