import React, { PropTypes } from 'react'
import { List, Map } from 'immutable'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Col, Row, Table } from 'react-bootstrap'
import { formatBitsPerSecond } from '../util/helpers'
import { getDashboardUrl } from '../util/routes.js'

import * as accountActionCreators from '../redux/modules/account'
import * as filtersActionCreators from '../redux/modules/filters'
import * as groupActionCreators from '../redux/modules/group'

import AccountSelector from '../components/global-account-selector/global-account-selector.jsx'
import AnalysisByLocation from '../components/analysis/by-location'
import AnalyticsFilters from '../components/analytics/analytics-filters'
import Content from '../components/layout/content'
import DashboardPanel from '../components/dashboard/dashboard-panel'
import DashboardPanels from '../components/dashboard/dashboard-panels'
import MiniChart from '../components/dashboard/mini-chart'
import PageContainer from '../components/layout/page-container'
import PageHeader from '../components/layout/page-header'
import TruncatedTitle from '../components/truncated-title'

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
  componentWillMount() {
    this.fetchData(this.props.params)
  }
  componentDidMount() {
    this.measureContainers()
    // TODO: remove this timeout as part of UDNP-1426
    window.addEventListener('resize', this.measureContainers)
  }
  componentWillReceiveProps(nextProps) {
    const prevParams = JSON.stringify(this.props.params)
    const params = JSON.stringify(nextProps.params)

    if(params !== prevParams) {
      this.fetchData(nextProps.params)
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
  fetchData(params) {
    const { brand, account, group } = params
    if(account && (!this.props.activeAccount || !this.props.activeAccount.size)) {
      this.props.accountActions.fetchAccount(brand, account)
    }
    if(account && group && (!this.props.activeGroup || !this.props.activeGroup.size)) {
      this.props.groupActions.fetchGroup(brand, account, group)
    }
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
    const { activeAccount, activeGroup, filterOptions,
      filters, intl, params, router, user } = this.props
    const { account, group } = params
    const restriction = account ? "group" : null
    let activeItem
    if (group && activeGroup) {
      activeItem = activeGroup.get('name')
    }
    else if (account && activeAccount) {
      activeItem = activeAccount.get('name')
    }
    const topBarTexts = {
      property: 'Back to Groups',
      group: 'Back to Accounts',
      account: 'UDN Admin',
      brand: 'UDN Admin'
    }
    const topBarFunc = (tier, fetchItems, IDs) => {
      const { brand } = IDs
      switch(tier) {
        case 'group':
          fetchItems('account', brand)
          break
        case 'brand':
        case 'account':
          router.push(getDashboardUrl('brand', 'udn', {}))
          break
      }
    }
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
    return (
      <Content>
        <PageHeader pageSubTitle="Dashboard">
          <AccountSelector
            as="security"
            params={params}
            topBarTexts={topBarTexts}
            topBarAction={topBarFunc}
            onSelect={(...params) => {
              router.push(getDashboardUrl(...params))
            }}
            restrictedTo={restriction}
            startTier={account ? "group" : "account"}
            drillable={true}>
            <div className="btn btn-link dropdown-toggle header-toggle">
              <h1>
                <TruncatedTitle
                  content={activeItem || intl.formatMessage({id: 'portal.account.manage.selectAccount.text'})}
                  tooltipPlacement="bottom"
                  className="account-management-title"/>
              </h1>
              <span className="caret"></span>
            </div>
          </AccountSelector>
        </PageHeader>
        <AnalyticsFilters
          activeAccountProviderType={activeAccount && activeAccount.get('provider_type')}
          currentUser={user}
          params={params}
          onFilterChange={this.onFilterChange}
          filters={filters}
          filterOptions={filterOptions}
          showFilters={List(['date-range'])}
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
                  countryData={List([
                    Map({bits_per_second: 50000, code: "USA"}),
                    Map({bits_per_second: 40000, code: "UKR"}),
                    Map({bits_per_second: 30000, code: "CHN"}),
                    Map({bits_per_second: 20000, code: "CAN"}),
                    Map({bits_per_second: 10000, code: "FIN"})
                  ])}/>
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
  accountActions: PropTypes.object,
  activeAccount: PropTypes.instanceOf(Map),
  activeGroup: PropTypes.instanceOf(Map),
  filterOptions: PropTypes.object,
  filters: PropTypes.instanceOf(Map),
  filtersActions: PropTypes.object,
  groupActions: PropTypes.object,
  intl: PropTypes.object,
  params: PropTypes.object,
  router: PropTypes.object,
  user: PropTypes.instanceOf(Map)
}

Dashboard.defaultProps = {
  activeAccount: Map(),
  activeGroup: Map(),
  filters: Map(),
  user: Map()
}

function mapStateToProps(state) {
  return {
    activeAccount: state.account.get('activeAccount') || Map(),
    activeGroup: state.group.get('activeGroup') || Map(),
    filterOptions: state.filters.get('filterOptions'),
    filters: state.filters.get('filters'),
    user: state.user.get('currentUser')
  }
}

function mapDispatchToProps(dispatch) {
  return {
    accountActions: bindActionCreators(accountActionCreators, dispatch),
    filtersActions: bindActionCreators(filtersActionCreators, dispatch),
    groupActions: bindActionCreators(groupActionCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(Dashboard)))
