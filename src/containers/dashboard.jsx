import React, { PropTypes } from 'react'
import { List, Map } from 'immutable'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Col, Row, Table } from 'react-bootstrap'
import {
  accountIsContentProviderType,
  formatBitsPerSecond,
  formatBytes,
  formatTime,
  getAccountByID,
  separateUnit,
  userIsContentProvider } from '../util/helpers'
import numeral from 'numeral'
import DateRanges from '../constants/date-ranges'
import { TOP_PROVIDER_LENGTH } from '../constants/dashboard'
import {
  ACCOUNT_TYPE_SERVICE_PROVIDER,
  ACCOUNT_TYPE_CONTENT_PROVIDER
} from '../constants/account-management-options'

import * as accountActionCreators from '../redux/modules/account'
import * as dashboardActionCreators from '../redux/modules/dashboard'
import * as filtersActionCreators from '../redux/modules/filters'
import * as mapboxActionCreators from '../redux/modules/mapbox'
import * as trafficActionCreators from '../redux/modules/traffic'

import AnalysisByLocation from '../components/analysis/by-location'
import AnalyticsFilters from '../components/analytics/analytics-filters'
import Content from '../components/layout/content'
import DashboardPanel from '../components/dashboard/dashboard-panel'
import DashboardPanels from '../components/dashboard/dashboard-panels'
import LoadingSpinner from '../components/loading-spinner/loading-spinner'
import MiniChart from '../components/mini-chart'
import PageContainer from '../components/layout/page-container'
import PageHeader from '../components/layout/page-header'
import StackedByTimeSummary from '../components/stacked-by-time-summary'
import TruncatedTitle from '../components/truncated-title'

import { buildFetchOpts } from '../util/helpers.js'
import { getCitiesWithinBounds } from '../util/mapbox-helpers'

export class Dashboard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      byLocationWidth: 100
    }

    this.fetchData = this.fetchData.bind(this)
    this.measureContainers = this.measureContainers.bind(this)
    this.onFilterChange = this.onFilterChange.bind(this)
    this.measureContainersTimeout = null
    this.getCityData = this.getCityData.bind(this)
    this.renderContent = this.renderContent.bind(this)
  }

  componentWillMount() {
    this.fetchData(this.props.params, this.props.filters)
  }

  componentDidMount() {
    this.measureContainers()
    // TODO: remove this timeout as part of UDNP-1426
    window.addEventListener('resize', this.measureContainers)
  }

  componentWillReceiveProps(nextProps) {
    const prevParams = JSON.stringify(this.props.params)
    const params = JSON.stringify(nextProps.params)

    if (prevParams !== params || this.props.filters !== nextProps.filters) {
      this.fetchData(nextProps.params, nextProps.filters)
    }
    // TODO: remove this timeout as part of UDNP-1426
    if (this.measureContainersTimeout) {
      clearTimeout(this.measureContainersTimeout)
    }
    this.measureContainersTimeout = setTimeout(() => {this.measureContainers()}, 500)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.measureContainers)
    // TODO: remove this timeout as part of UDNP-1426
    clearTimeout(this.measureContainersTimeout)
  }

  fetchData(params, filters) {
    if (params.account) {
      let { dashboardOpts } = buildFetchOpts({ params, filters, coordinates: this.props.mapBounds.toJS() })
      dashboardOpts.field_filters = 'chit_ratio,avg_fbl,bytes,transfer_rates,connections,timestamp'
      const activeAccount = getAccountByID(this.props.accounts, Number(params.account)) || this.props.activeAccount
      const accountType = (accountIsContentProviderType(activeAccount) || userIsContentProvider(this.props.user))
        ? ACCOUNT_TYPE_CONTENT_PROVIDER
        : ACCOUNT_TYPE_SERVICE_PROVIDER

      return Promise.all([
        this.props.dashboardActions.startFetching(),
        this.props.accountActions.fetchAccounts(this.props.params.brand),
        this.props.dashboardActions.fetchDashboard(dashboardOpts, accountType)
      ]).then(this.props.dashboardActions.finishFetching)
    }
  }

  measureContainers() {
    const containerWidth = this.refs.byLocationHolder &&  this.refs.byLocationHolder.clientWidth
    this.setState({
      byLocationWidth: containerWidth < 640 ? containerWidth : 640
    })
  }

  onFilterChange(filterName, filterValue) {
    this.props.filtersActions.setFilterValue({
      filterName: filterName,
      filterValue: filterValue
    })
  }

  getCityData(south, west, north, east) {
    const { params, filters } = this.props
    return getCitiesWithinBounds({
      params,
      filters,
      coordinates: { south, west, north, east },
      actions: this.props.trafficActions
    })
  }

  renderContent() {
    const { accounts, activeAccount, dashboard, intl, params, user, theme } = this.props

    if (!params.account) {
      return(
        <div className="text-center">
          <FormattedMessage id="portal.dashboard.selectAccount.text" values={{br: <br/>}} />
        </div>
      )
    }

    const isCP = (accountIsContentProviderType(activeAccount) || userIsContentProvider(user))

    const trafficDetail = dashboard.getIn(['traffic', 'detail'])
    const trafficDatasetA = !trafficDetail ?
      [] :
      trafficDetail.map(datapoint => {
        return {
          bytes: datapoint.bytes_net_on || datapoint.bytes_http || 0,
          timestamp: datapoint.timestamp
        }
      }).toJS()
    const trafficDatasetB = !trafficDetail ?
      [] :
      trafficDetail.map(datapoint => {
        return {
          bytes: datapoint.bytes_net_off ||  datapoint.bytes_https || 0,
          timestamp: datapoint.timestamp
        }
      }).toJS()

    const trafficBytes = dashboard.getIn(['traffic', 'bytes'])
    const totalTraffic = separateUnit(formatBytes(trafficBytes))
    const totalTrafficValue = totalTraffic.value
    const totalTrafficUnit = totalTraffic.unit
    const trafficDatasetAValue = numeral((dashboard.getIn(['traffic', isCP ? 'http' : 'bytes_net_on']))).format('0,0')
    const trafficDatasetBValue = numeral((dashboard.getIn(['traffic', isCP ? 'https' : 'bytes_net_off']))).format('0,0')

    const averageBandwidth = separateUnit(formatBitsPerSecond(dashboard.getIn(['bandwidth', 'bits_per_second'])))
    const averageBandwidthValue = averageBandwidth.value
    const averageBandwidthUnit = averageBandwidth.unit
    const bandwidthDetail = !dashboard.size ? [] : dashboard.getIn(['bandwidth', 'detail']).toJS()

    const averageLatency = separateUnit(formatTime(dashboard.getIn(['latency', 'avg_fbl'])))
    const averageLatencyValue = averageLatency.value
    const averageLatencyUnit = averageLatency.unit
    const latencyDetail = !dashboard.size ? [] : dashboard.getIn(['latency', 'detail']).toJS()

    const connectionsPerSecond = dashboard.getIn(['connections', 'connections_per_second'])
    const averageConnectionsFormat = connectionsPerSecond < 10 ? '0.0' : '0 a'
    const averageConnections = separateUnit(numeral(connectionsPerSecond).format(averageConnectionsFormat))
    const averageConnectionsValue = averageConnections.value
    const averageConnectionsUnit = averageConnections.unit
    const connectionsDetail = !dashboard.size ? [] : dashboard.getIn(['connections', 'detail']).toJS()

    const averageCacheHitValue = dashboard.getIn(['cache_hit', 'chit_ratio'], null)
    const averageCacheHitUnit = '%'
    const cacheHitDetail = !dashboard.size ? [] : dashboard.getIn(['cache_hit', 'detail']).toJS()

    const countries = !dashboard.size ? List() : dashboard.get('countries')
    const countriesAverageBandwidth = val => formatBitsPerSecond(val, true)

    const topProviders = !dashboard.size ? List() : dashboard.get('providers')
      .sortBy(provider => provider.get('bytes'), (a, b) => a < b)
    const topProvidersIDs = topProviders.map(provider => provider.get('account')).toJS()
    const topProvidersAccounts = getAccountByID(accounts, topProvidersIDs)

    const topProviderTitleId = isCP ? 'portal.dashboard.topSP.title' : 'portal.dashboard.topCP.title'

    return (
      <DashboardPanels>
        <DashboardPanel title={intl.formatMessage({id: 'portal.dashboard.traffic.title'})}>
          <StackedByTimeSummary
            dataKey="bytes"
            totalDatasetValue={totalTrafficValue}
            totalDatasetUnit={totalTrafficUnit}
            datasetAArray={trafficDatasetA}
            datasetALabel={intl.formatMessage({id: isCP ? 'portal.analytics.trafficOverview.httpDatasetLabel.text' : 'portal.analytics.onNet.title'})}
            datasetAUnit="%"
            datasetAValue={trafficDatasetAValue}
            datasetBArray={trafficDatasetB}
            datasetBLabel={intl.formatMessage({id: isCP ? 'portal.analytics.trafficOverview.httpsDatasetLabel.text' : 'portal.analytics.offNet.title'})}
            datasetBUnit="%"
            datasetBValue={trafficDatasetBValue}/>
          <hr />
          <Row>
            <Col xs={6}>
              <MiniChart
                label={intl.formatMessage({id: 'portal.dashboard.avgBandwidth.title'})}
                kpiValue={averageBandwidthValue}
                kpiUnit={averageBandwidthUnit}
                dataKey="bits_per_second"
                data={bandwidthDetail} />
            </Col>
            <Col xs={6}>
              <MiniChart
                label={intl.formatMessage({id: 'portal.dashboard.avgLatency.title'})}
                kpiValue={averageLatencyValue}
                kpiUnit={averageLatencyUnit}
                dataKey="avg_fbl"
                data={latencyDetail} />
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <MiniChart
                label={intl.formatMessage({id: 'portal.dashboard.connectionsPerSec.title'})}
                kpiValue={averageConnectionsValue}
                kpiUnit={averageConnectionsUnit}
                dataKey="connections_per_second"
                data={connectionsDetail} />
            </Col>
            <Col xs={6}>
              <MiniChart
                label={intl.formatMessage({id: 'portal.dashboard.avgCacheHitRate.title'})}
                kpiValue={averageCacheHitValue}
                kpiUnit={averageCacheHitUnit}
                dataKey="chit_ratio"
                data={cacheHitDetail} />
            </Col>
          </Row>
        </DashboardPanel>
        <DashboardPanel title={intl.formatMessage({id: 'portal.dashboard.trafficByLocation.title'})} noPadding={true}>
          <div ref="byLocationHolder">
            <AnalysisByLocation
              countryData={countries}
              cityData={this.props.cityData}
              getCityData={this.getCityData}
              theme={theme}
              height={this.state.byLocationWidth / 1.6}
              dataKey="bits_per_second"
              dataKeyFormat={countriesAverageBandwidth}
              mapBounds={this.props.mapBounds}
              mapboxActions={this.props.mapboxActions}/>
          </div>
        </DashboardPanel>
        <DashboardPanel title={intl.formatMessage({ id: topProviderTitleId }, { amount: TOP_PROVIDER_LENGTH })}>
          <Table className="table-simple">
            <thead>
              <tr>
                <th width="30%"><FormattedMessage id="portal.dashboard.provider.title" /></th>
                <th width="35%" className="text-center"><FormattedMessage id="portal.dashboard.traffic.title" /></th>
                <th width="35%" className="text-center"><FormattedMessage id="portal.dashboard.trafficPercentage.title" /></th>
              </tr>
            </thead>
            <tbody>
              {topProviders.map((provider, i) => {
                const traffic = separateUnit(formatBytes(provider.get('bytes')))
                return (
                  <tr key={i}>
                    <td><b>{topProvidersAccounts[i] ? topProvidersAccounts[i].get('name') : provider.get('account')}</b></td>
                    <td>
                      <MiniChart
                        kpiRight={true}
                        kpiValue={traffic.value}
                        kpiUnit={traffic.unit}
                        dataKey="bytes"
                        data={provider.get('detail').toJS()} />
                    </td>
                    <td>
                      <MiniChart
                        kpiRight={true}
                        kpiValue={numeral(provider.get('percent_total')).format('0')}
                        kpiUnit="%"
                        dataKey="percent_total"
                        data={provider.get('detail').toJS()} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
          {!topProviders.size &&
            <div className="no-data">
              <FormattedMessage id="portal.common.no-data.text"/>
            </div>}
        </DashboardPanel>
      </DashboardPanels>
    )
  }

  render() {
    const { activeAccount, fetching, filterOptions, filters, intl, user } = this.props
    const showFilters = List(['dateRange'])
    const dateRanges = [
      DateRanges.MONTH_TO_DATE,
      DateRanges.LAST_MONTH,
      DateRanges.THIS_WEEK,
      DateRanges.LAST_WEEK
    ]

    return (
      <Content>
        <PageHeader pageSubTitle="Dashboard">
          <h1>
            <TruncatedTitle
              content={activeAccount.get('name') || intl.formatMessage({id: 'portal.account.manage.selectAccount.text'})}
              tooltipPlacement="bottom"
              className="account-management-title"/>
          </h1>
        </PageHeader>
        <AnalyticsFilters
          activeAccountProviderType={activeAccount && activeAccount.get('provider_type')}
          currentUser={user}
          dateRanges={dateRanges}
          onFilterChange={this.onFilterChange}
          filters={filters}
          filterOptions={filterOptions}
          showFilters={showFilters}
        />
        {fetching ?
          <LoadingSpinner />
        :
        <PageContainer>
          {this.renderContent()}
        </PageContainer>}
      </Content>
    )
  }
}

Dashboard.displayName = 'Dashboard'
Dashboard.propTypes = {
  accountActions: PropTypes.object,
  accounts: PropTypes.object,
  activeAccount: PropTypes.instanceOf(Map),
  cityData: PropTypes.instanceOf(List),
  dashboard: PropTypes.instanceOf(Map),
  dashboardActions: PropTypes.object,
  fetching: PropTypes.bool,
  filterOptions: PropTypes.object,
  filters: PropTypes.instanceOf(Map),
  filtersActions: PropTypes.object,
  intl: PropTypes.object,
  mapBounds: PropTypes.instanceOf(Map),
  mapboxActions: PropTypes.object,
  params: PropTypes.object,
  theme: PropTypes.string,
  trafficActions: PropTypes.object,
  user: PropTypes.instanceOf(Map)
}

Dashboard.defaultProps = {
  activeAccount: Map(),
  dashboard: Map(),
  filters: Map(),
  user: Map()
}

function mapStateToProps(state) {
  return {
    accounts: state.account.get('allAccounts'),
    activeAccount: state.account.get('activeAccount'),
    dashboard: state.dashboard.get('dashboard'),
    fetching: state.dashboard.get('fetching'),
    filterOptions: state.filters.get('filterOptions'),
    filters: state.filters.get('filters'),
    user: state.user.get('currentUser'),
    theme: state.ui.get('theme'),
    mapBounds: state.mapbox.get('mapBounds'),
    cityData: state.traffic.get('byCity')
  }
}

function mapDispatchToProps(dispatch) {
  return {
    accountActions: bindActionCreators(accountActionCreators, dispatch),
    dashboardActions: bindActionCreators(dashboardActionCreators, dispatch),
    filtersActions: bindActionCreators(filtersActionCreators, dispatch),
    mapboxActions: bindActionCreators(mapboxActionCreators, dispatch),
    trafficActions: bindActionCreators(trafficActionCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Dashboard))
