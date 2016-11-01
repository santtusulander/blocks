import React, { PropTypes } from 'react'
import { List, Map } from 'immutable'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Col, Row, Table } from 'react-bootstrap'
import { formatBitsPerSecond, formatBytes, separateUnit } from '../util/helpers'
import numeral from 'numeral'

import * as filtersActionCreators from '../redux/modules/filters'

import AnalysisByLocation from '../components/analysis/by-location'
import AnalyticsFilters from '../components/analytics/analytics-filters'
import Content from '../components/layout/content'
import DashboardPanel from '../components/dashboard/dashboard-panel'
import DashboardPanels from '../components/dashboard/dashboard-panels'
import MiniChart from '../components/mini-chart'
import PageContainer from '../components/layout/page-container'
import PageHeader from '../components/layout/page-header'
import StackedByTimeSummary from '../components/stacked-by-time-summary'
import TruncatedTitle from '../components/truncated-title'

import * as dashboardActionCreators from '../redux/modules/dashboard'

// import { buildAnalyticsOpts } from '../util/helpers.js'

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
  }

  componentDidMount() {
    this.fetchData(this.props.params)
    this.measureContainers()
    // TODO: remove this timeout as part of UDNP-1426
    window.addEventListener('resize', this.measureContainers)
  }

  componentWillReceiveProps() {
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

  fetchData(params) {
    const dashboardOpts = Object.assign({
      account: 143,
      startDate: 1477872000,
      endDate: 1477958399,
      granularity: 'hour'
    }, params)
    this.props.dashboardActions.fetchDashboard(dashboardOpts)
  }

  measureContainers() {
    let containerWidth = this.refs.byLocationHolder.clientWidth
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

  render() {
    const { activeAccount, filterOptions, filters, intl, params, user } = this.props
    // Remove these as part of UDNP-1739
    const fakeTop5cp = List([1,2,3,4,5])
    const fakeData = [
      {bits_per_second: 15000, timestamp: new Date('Thu May 26 2016 11:17:01 GMT-0700 (PDT)')},
      {bits_per_second: 150000, timestamp: new Date('Thu May 26 2016 12:17:01 GMT-0700 (PDT)')},
      {bits_per_second: 125000, timestamp: new Date('Thu May 26 2016 13:17:01 GMT-0700 (PDT)')},
      {bits_per_second: 140000, timestamp: new Date('Thu May 26 2016 14:17:01 GMT-0700 (PDT)')},
      {bits_per_second: 190000, timestamp: new Date('Thu May 26 2016 15:17:01 GMT-0700 (PDT)')},
      {bits_per_second: 180000, timestamp: new Date('Thu May 26 2016 16:17:01 GMT-0700 (PDT)')},
      {bits_per_second: 125000, timestamp: new Date('Thu May 26 2016 17:17:01 GMT-0700 (PDT)')}
    ]
    const fakeCountryData = List([
      Map({bits_per_second: 50000, code: "USA"}),
      Map({bits_per_second: 40000, code: "UKR"}),
      Map({bits_per_second: 30000, code: "CHN"}),
      Map({bits_per_second: 20000, code: "CAN"}),
      Map({bits_per_second: 10000, code: "FIN"})
    ])
    const fakeSpDashboardData = {
      "traffic": {
        "bytes": 446265804980374,
        "bytes_net_on": 352569123057670,
        "bytes_net_off": 93696681922704,
        "detail": [
          {
            "timestamp": new Date('Thu May 26 2016 12:17:01 GMT-0700 (PDT)'),
            "bytes": 92020173697866,
            "bytes_net_on": 71856580682504,
            "bytes_net_off": 20163593015362
          },
          {
            "timestamp": new Date('Thu May 26 2016 13:17:01 GMT-0700 (PDT)'),
            "bytes": 99672709053865,
            "bytes_net_on": 76848354018252,
            "bytes_net_off": 22824355035613
          },
          {
            "timestamp": new Date('Thu May 26 2016 14:17:01 GMT-0700 (PDT)'),
            "bytes": 94821186769899,
            "bytes_net_on": 72941835769369,
            "bytes_net_off": 21879351000530
          },
          {
            "timestamp": new Date('Thu May 26 2016 15:17:01 GMT-0700 (PDT)'),
            "bytes": 117441291619312,
            "bytes_net_on": 90477417340581,
            "bytes_net_off": 26963874278731
          },
          {
            "timestamp": new Date('Thu May 26 2016 16:17:01 GMT-0700 (PDT)'),
            "bytes": 81546375702611,
            "bytes_net_on": 62160286504951,
            "bytes_net_off": 19386089197660
          },
          {
            "timestamp": new Date('Thu May 26 2016 17:17:01 GMT-0700 (PDT)'),
            "bytes": 117341539984300,
            "bytes_net_on": 90364165873239,
            "bytes_net_off": 26977374111061
          },
          {
            "timestamp": new Date('Thu May 26 2016 18:17:01 GMT-0700 (PDT)'),
            "bytes": 94064934029131,
            "bytes_net_on": 72989086766237,
            "bytes_net_off": 21075847262894
          },
          {
            "timestamp": new Date('Thu May 26 2016 19:17:01 GMT-0700 (PDT)'),
            "bytes": 93196929110225,
            "bytes_net_on": 72133332220394,
            "bytes_net_off": 21063596889831
          }
        ]
      }
    }
    const showFilters = List(['date-range'])
    const datasetA = fakeSpDashboardData.traffic.detail.map(datapoint => {
      return {
        bytes: datapoint.bytes_net_on || 0,
        timestamp: datapoint.timestamp
      }
    })
    const datasetB = fakeSpDashboardData.traffic.detail.map(datapoint => {
      return {
        bytes: datapoint.bytes_net_off || 0,
        timestamp: datapoint.timestamp
      }
    })
    let totalDatasetValueOutput = separateUnit(formatBytes(fakeSpDashboardData.traffic.bytes))
    let totalDatasetValue = totalDatasetValueOutput.value
    let totalDatasetUnit = totalDatasetValueOutput.unit
    let datasetAValue = numeral((fakeSpDashboardData.traffic.bytes_net_on / fakeSpDashboardData.traffic.bytes) * 100).format('0,0')
    let datasetBValue = numeral((fakeSpDashboardData.traffic.bytes_net_off / fakeSpDashboardData.traffic.bytes) * 100).format('0,0')
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
          params={params}
          onFilterChange={this.onFilterChange}
          filters={filters}
          filterOptions={filterOptions}
          showFilters={showFilters}
        />
        <PageContainer>
          <DashboardPanels>
            <DashboardPanel title={intl.formatMessage({id: 'portal.dashboard.traffic.title'})}>
              <StackedByTimeSummary
                dataKey="bytes"
                totalDatasetValue={totalDatasetValue}
                totalDatasetUnit={totalDatasetUnit}
                datasetAArray={datasetA}
                datasetALabel="On-Net"
                datasetAUnit="%"
                datasetAValue={datasetAValue}
                datasetBArray={datasetB}
                datasetBLabel="Off-Net"
                datasetBUnit="%"
                datasetBValue={datasetBValue}/>
              <hr />
              <Row>
                <Col xs={6}>
                  <MiniChart
                    label={intl.formatMessage({id: 'portal.dashboard.avgBandwidth.title'})}
                    kpiValue={80}
                    kpiUnit="Gb/s"
                    dataKey="bits_per_second"
                    data={fakeData} />
                </Col>
                <Col xs={6}>
                  <MiniChart
                    label={intl.formatMessage({id: 'portal.dashboard.avgLatency.title'})}
                    kpiValue={30}
                    kpiUnit="ms"
                    dataKey="bits_per_second"
                    data={fakeData} />
                </Col>
              </Row>
              <Row>
                <Col xs={6}>
                  <MiniChart
                    label={intl.formatMessage({id: 'portal.dashboard.connectionsPerSec.title'})}
                    kpiValue={10}
                    kpiUnit="k"
                    dataKey="bits_per_second"
                    data={fakeData} />
                </Col>
                <Col xs={6}>
                  <MiniChart
                    label={intl.formatMessage({id: 'portal.dashboard.avgCacheHitRate.title'})}
                    kpiValue={95}
                    kpiUnit="%"
                    dataKey="bits_per_second"
                    data={fakeData} />
                </Col>
              </Row>
            </DashboardPanel>
            <DashboardPanel title={intl.formatMessage({id: 'portal.dashboard.trafficByLocation.title'})} noPadding={true}>
              <div ref="byLocationHolder">
                <AnalysisByLocation
                  dataKey="bits_per_second"
                  tooltipCustomFormat={val => formatBitsPerSecond(val, true)}
                  timelineKey="detail"
                  noBg={true}
                  width={this.state.byLocationWidth}
                  height={this.state.byLocationWidth / 1.6}
                  countryData={fakeCountryData}/>
              </div>
            </DashboardPanel>
            <DashboardPanel title={intl.formatMessage({id: 'portal.dashboard.top5CP.title'})}>
              <Table className="table-simple">
                <thead>
                  <tr>
                    <th><FormattedMessage id="portal.dashboard.provider.title" /></th>
                    <th className="text-center"><FormattedMessage id="portal.dashboard.traffic.title" /></th>
                    <th className="text-center"><FormattedMessage id="portal.dashboard.trafficPercentage.title" /></th>
                  </tr>
                </thead>
                <tbody>
                  {fakeTop5cp.map((i) => {
                    return (
                      <tr key={i}>
                        <td width="30%"><b>HBO</b></td>
                        <td width="35%">
                          <MiniChart
                            kpiRight={true}
                            kpiValue={1}
                            kpiUnit="PB"
                            dataKey="bits_per_second"
                            data={fakeData} />
                        </td>
                        <td width="35%">
                          <MiniChart
                            kpiRight={true}
                            kpiValue={40}
                            kpiUnit="%"
                            dataKey="bits_per_second"
                            data={fakeData} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            </DashboardPanel>
          </DashboardPanels>
        </PageContainer>
      </Content>
    )
  }
}

Dashboard.displayName = 'Dashboard'
Dashboard.propTypes = {
  activeAccount: PropTypes.instanceOf(Map),
  dashboardActions: PropTypes.object,
  filterOptions: PropTypes.object,
  filters: PropTypes.instanceOf(Map),
  filtersActions: PropTypes.object,
  intl: PropTypes.object,
  params: PropTypes.object,
  user: PropTypes.instanceOf(Map)
}

Dashboard.defaultProps = {
  activeAccount: Map(),
  filters: Map(),
  user: Map()
}

function mapStateToProps(state) {
  return {
    activeAccount: state.account.get('activeAccount') || Map(),
    dashboard: state.dashboard.get('dashboard'),
    filterOptions: state.filters.get('filterOptions'),
    filters: state.filters.get('filters'),
    user: state.user.get('currentUser')
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dashboardActions: bindActionCreators(dashboardActionCreators, dispatch),
    filtersActions: bindActionCreators(filtersActionCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Dashboard))
