import React, { PropTypes } from 'react'
import { List, Map } from 'immutable'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Col, Row, Table } from 'react-bootstrap'
import { formatBitsPerSecond } from '../util/helpers'

import * as filtersActionCreators from '../redux/modules/filters'

import AnalysisByLocation from '../components/analysis/by-location'
import AnalyticsFilters from '../components/analytics/analytics-filters'
import Content from '../components/layout/content'
import DashboardPanel from '../components/dashboard/dashboard-panel'
import DashboardPanels from '../components/dashboard/dashboard-panels'
import MiniChart from '../components/mini-chart'
import PageContainer from '../components/layout/page-container'
import PageHeader from '../components/layout/page-header'
import TruncatedTitle from '../components/truncated-title'

export class Dashboard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      byLocationWidth: 100
    }

    this.measureContainers = this.measureContainers.bind(this)
    this.onFilterChange = this.onFilterChange.bind(this)
    this.measureContainersTimeout = null
  }

  componentDidMount() {
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

  measureContainers() {
    let containerWidth = this.refs.byLocationHolder.clientWidth
    this.setState({
      byLocationWidth: containerWidth < 720 ? containerWidth : 720
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
    const showFilters = List(['date-range'])
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
    filterOptions: state.filters.get('filterOptions'),
    filters: state.filters.get('filters'),
    user: state.user.get('currentUser')
  }
}

function mapDispatchToProps(dispatch) {
  return {
    filtersActions: bindActionCreators(filtersActionCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Dashboard))
