import React, { PropTypes } from 'react'
import { List, Map, is, fromJS } from 'immutable'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Table } from 'react-bootstrap'

import {
  formatBitsPerSecond,
  formatBytes,
  separateUnit
} from '../util/helpers'
import numeral from 'numeral'
import DateRanges from '../constants/date-ranges'
import { BRAND_DASHBOARD_TOP_PROVIDER_LENGTH } from '../constants/dashboard'
import { getDashboardUrl } from '../util/routes'
import { ACCOUNT_TYPE_CLOUD_PROVIDER, UDN_CORE_ACCOUNT_ID } from '../constants/account-management-options'
import * as PERMISSIONS from '../constants/permissions'
import * as dashboardActionCreators from '../redux/modules/dashboard'
import { defaultFilters } from '../redux/modules/filters'
import * as filterActionCreators from '../redux/modules/filters'
import * as filtersActionCreators from '../redux/modules/filters'
import * as mapboxActionCreators from '../redux/modules/mapbox'
import * as trafficActionCreators from '../redux/modules/traffic'

import markersActions from '../redux/modules/entities/map-markers/actions'
import { getAll as getMarkers} from '../redux/modules/entities/map-markers/selectors'

import accountActions from '../redux/modules/entities/accounts/actions'
import { getById as getAccountById} from '../redux/modules/entities/accounts/selectors'

import groupActions from '../redux/modules/entities/groups/actions'
import { getIdsByAccount } from '../redux/modules/entities/groups/selectors'

import AccountSelector from '../components/global-account-selector/account-selector-container'
import AnalysisByLocation from '../components/analysis/by-location'
import AnalyticsFilters from '../components/analytics/analytics-filters'
import Content from '../components/shared/layout/content'
import DashboardPanel from '../components/dashboard/dashboard-panel'
import DashboardPanels from '../components/dashboard/dashboard-panels'
import IconCaretDown from '../components/shared/icons/icon-caret-down'
import IsAllowed from '../components/shared/permission-wrappers/is-allowed'
import MiniChart from '../components/charts/mini-chart'
import PageContainer from '../components/shared/layout/page-container'
import PageHeader from '../components/shared/layout/page-header'
import StackedByTimeSummary from '../components/charts/stacked-by-time-summary'
import TruncatedTitle from '../components/shared/page-elements/truncated-title'

import { buildAnalyticsOptsForContribution, buildFetchOpts } from '../util/helpers.js'
import { getCitiesWithinBounds } from '../util/mapbox-helpers'

export class BrandDashboard extends React.Component {
  constructor(props) {
    super(props)

    this.fetchData = this.fetchData.bind(this)
    this.onFilterChange = this.onFilterChange.bind(this)
    this.getCityData = this.getCityData.bind(this)
  }

  componentWillMount() {
    if (is(defaultFilters, this.props.filters)) {
      this.fetchData(this.props.params, this.props.filters)
    } else {
      this.props.filterActions.resetFilters()
    }
  }

  componentWillReceiveProps(nextProps) {
    const prevParams = JSON.stringify(this.props.params)
    const params = JSON.stringify(nextProps.params)

    if (prevParams !== params) {
      this.props.filterActions.resetContributionFilters()
    }

    if (prevParams !== params || !is(this.props.filters,nextProps.filters)) {
      this.fetchData(nextProps.params, nextProps.filters)
    }
  }

  componentWillUnmount() {
    this.props.filterActions.resetContributionFilters()
  }

  fetchData(urlParams, filters) {
    // Dashboard should fetch only account level data
    const params = { brand: urlParams.brand }

    const { dashboardOpts } = buildFetchOpts({ params, filters, coordinates: this.props.mapBounds.toJS() })
    dashboardOpts.field_filters = 'chit_ratio,avg_fbl,bytes,transfer_rates,connections,timestamp'

    const accountType = this.props.activeAccount.get('provider_type')
    const providerOpts = buildAnalyticsOptsForContribution(params, filters, accountType)

    return Promise.all([
      this.props.fetchMarkers(),
      this.props.dashboardActions.startFetching(),
      this.props.dashboardActions.fetchDashboard(dashboardOpts, accountType),
      this.props.filterActions.fetchServiceProvidersWithTrafficForCP(params.brand, providerOpts),
      this.props.filterActions.fetchContentProvidersWithTrafficForSP(params.brand, providerOpts)
    ]).then(this.props.dashboardActions.finishFetching, this.props.dashboardActions.finishFetching)
  }

  onFilterChange(filterName, filterValue) {
    this.props.filtersActions.setFilterValue({
      filterName: filterName,
      filterValue: filterValue
    })
  }

  getCityData(south, west, north, east) {
    const { params: { brand }, filters } = this.props
    return getCitiesWithinBounds({
      params: { brand },
      filters,
      coordinates: { south, west, north, east },
      actions: this.props.trafficActions
    })
  }

  /*
    This is aggregation function to gether all the data.
    We need to calculate SP edges traffic for the chart.
   */
  spDataAggregation(spEdgaData) {
    let firstIteration = true
    const resultData = {
      bytes: 0,
      detail: []
    }

    spEdgaData.forEach((accoutData) => {
      const accBytes = accoutData.get('bytes')
      const accDetail = accoutData.get('detail')

      resultData.bytes += accBytes

      accDetail.forEach((accountDetail, i) => {
        const accDetailBytes = accountDetail.get('bytes')
        const accDetailTimestamp = accountDetail.get('timestamp')

        /* We are pushing to detail array only on first iteration */
        if (firstIteration === true) {
          resultData.detail.push({
            bytes: accDetailBytes,
            timestamp: accDetailTimestamp
          })
        } else {
          resultData.detail[i].bytes += accDetailBytes

          // WE SHOULD NOT AGGREGATE TIMESTAMPS!!!
          // resultData.detail[i].timestamp += accDetailTimestamp
        }
      })
      firstIteration = false

    })

    return fromJS(resultData)
  }

  renderContent() {
    const { dashboard, filterOptions, intl, theme, markers } = this.props
    const chartTraffic = dashboard && dashboard.get('all_sp_providers')

    const coreData = []
    const spEdgaData = []
    let dataIsReady = false

    /* Separate SP Edges & UDN Core accounts */
    chartTraffic && chartTraffic.get('detail').forEach((accountData) => {
      if (String(accountData.get('account')) === String(UDN_CORE_ACCOUNT_ID)) {
        coreData.push(accountData)
      } else {
        spEdgaData.push(accountData)
      }
    })

    /* Verify that data is ready */
    if ((coreData && spEdgaData) &&
        (coreData.length && spEdgaData.length)) {
      dataIsReady = true
    }

    /* Prepared data for Stacked Summary */
    const coreResultData = dataIsReady && coreData[0]
    const spResultData = dataIsReady && this.spDataAggregation(spEdgaData)

    const coreTrafficDetail = coreResultData && coreResultData.get('detail')
    const spTrafficDetail = spResultData && spResultData.get('detail')

    /* Prepare datasets for chart */
    const trafficDatasetA = !coreTrafficDetail ?
      [] :
      coreTrafficDetail.map(datapoint => {
        return {
          bytes: datapoint && datapoint.get('bytes') || 0,
          timestamp: datapoint && datapoint.get('timestamp')
        }
      }).toJS()

    const trafficDatasetB = !spTrafficDetail ?
      [] :
      spTrafficDetail.map(datapoint => {
        return {
          bytes: datapoint && datapoint.get('bytes') || 0,
          timestamp: datapoint && datapoint.get('timestamp')
        }
      }).toJS()

    /* Prepare ammount of traffic for chart */
    const udn_core_traffic = dataIsReady && Number(coreResultData.get('bytes'))
    const sp_edges_traffic = dataIsReady && Number(spResultData.get('bytes'))

    const trafficBytes = chartTraffic && chartTraffic.getIn(['total', 'bytes'])
    const totalTraffic = separateUnit(formatBytes(trafficBytes))
    const totalTrafficValue = totalTraffic.value
    const totalTrafficUnit = totalTraffic.unit

    const udnCoreTotalTraffic = separateUnit(formatBytes(udn_core_traffic))
    const spEdgeTotalTraffic = separateUnit(formatBytes(sp_edges_traffic))

    const trafficDatasetAValue = numeral((udn_core_traffic * 100) / trafficBytes).format('0,0')
    const trafficDatasetBValue = numeral((sp_edges_traffic * 100) / trafficBytes).format('0,0')

    const datasetACalculatedValue = Number(udnCoreTotalTraffic.value)
    const datasetACalculatedUnit = udnCoreTotalTraffic.unit
    const datasetBCalculatedValue = Number(spEdgeTotalTraffic.value)
    const datasetBCalculatedUnit = spEdgeTotalTraffic.unit
    /* END - Stacked Summary */

    /* MAPBOX */
    const countries = !dashboard.size ? List() : dashboard.get('countries')
    const countriesAverageBandwidth = val => formatBitsPerSecond(val, true)
    /* END - MAPBOX */

    /* TOP 5 SERVICE/CONTENT PROVICERS */
    const topProvidersSp = !dashboard.size ? List() : dashboard.get('sp_providers') && dashboard.get('sp_providers').sortBy((provider) => provider.get('bytes'), (a, b) => {
      return a < b
    })
    const topProvidersCp = !dashboard.size ? List() : dashboard.get('cp_providers') && dashboard.get('cp_providers').sortBy((provider) => provider.get('bytes'), (a, b) => {
      return a < b
    })
    const topSPProvidersAccounts = filterOptions.getIn(['serviceProviders'], List())
    const topCPProvidersAccounts = filterOptions.getIn(['contentProviders'], List())
    /* END - TOP 5 SERVICE/CONTENT PROVICERS */

    return (
      <PageContainer>
        <DashboardPanels className="responsive">

          {/* Stacked Summary */}
          <DashboardPanel title={intl.formatMessage({id: 'portal.dashboard.traffic.title'})} className="full-width">
            <StackedByTimeSummary
              dataKey="bytes"
              addDelimiter={true}
              totalDatasetValue={totalTrafficValue}
              totalDatasetUnit={totalTrafficUnit}
              datasetAArray={trafficDatasetA}
              datasetALabel={intl.formatMessage({id: 'portal.analytics.udnCore.title'})}
              datasetAUnit="%"
              datasetAValue={trafficDatasetAValue}
              datasetACalculatedUnit={datasetACalculatedUnit}
              datasetACalculatedValue={datasetACalculatedValue}
              datasetBCalculatedUnit={datasetBCalculatedUnit}
              datasetBCalculatedValue={datasetBCalculatedValue}
              datasetBArray={trafficDatasetB}
              datasetBLabel={intl.formatMessage({id: 'portal.analytics.spEdge.title'})}
              datasetBUnit="%"
              datasetBValue={trafficDatasetBValue}
            />
          </DashboardPanel>
          {/* END ------- Stacked Summary */}

          {/* MAPBOX */}
          <DashboardPanel title={intl.formatMessage({id: 'portal.dashboard.trafficByLocation.title'})} noPadding={countries.size ? true : false} className="full-width">
            <div>
              <AnalysisByLocation
                countryData={countries}
                cityData={this.props.cityData}
                getCityData={this.getCityData}
                theme={theme}
                height={600}
                dataKey="bits_per_second"
                dataKeyFormat={countriesAverageBandwidth}
                mapBounds={this.props.mapBounds}
                mapboxActions={this.props.mapboxActions}
                markers={markers}
              />
            </div>
          </DashboardPanel>
          {/* END ------- MAPBOX */}

          {/* TOP 5 SERVICE PROVICERS */}
          <DashboardPanel title={intl.formatMessage({ id: 'portal.dashboard.topSP.title' }, { amount: BRAND_DASHBOARD_TOP_PROVIDER_LENGTH })}>
            <Table className="table-simple">
              <thead>
                <tr>
                  <th width="30%"><FormattedMessage id="portal.dashboard.provider.title" /></th>
                  <th width="35%" className="text-center"><FormattedMessage id="portal.dashboard.traffic.title" /></th>
                  <th width="35%" className="text-center"><FormattedMessage id="portal.dashboard.trafficPercentage.title" /></th>
                </tr>
              </thead>
              <tbody>
                {topProvidersSp && topProvidersSp.map((provider, i) => {
                  const traffic = separateUnit(formatBytes(provider.get('bytes')))
                  return (
                    <tr key={i}>
                      <td><b>{topSPProvidersAccounts.filter(item => item.get('id') === provider.get('account')).getIn([0, 'name'], provider.get('account'))}</b></td>
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
                          dataKey="percent_of_timestamp"
                          data={provider.get('detail').toJS()} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>

            {(!topProvidersSp || !topProvidersSp.size) &&
              <div className="no-data">
                <FormattedMessage id="portal.common.no-data.text"/>
              </div>
            }
          </DashboardPanel>
          {/* END ------- TOP 5 SERVICE PROVICERS */}

          {/* TOP 5 CONTENT PROVICERS */}
          <DashboardPanel title={intl.formatMessage({ id: 'portal.dashboard.topCP.title' }, { amount: BRAND_DASHBOARD_TOP_PROVIDER_LENGTH })}>
            <Table className="table-simple">
              <thead>
                <tr>
                  <th width="30%"><FormattedMessage id="portal.dashboard.provider.title" /></th>
                  <th width="35%" className="text-center"><FormattedMessage id="portal.dashboard.traffic.title" /></th>
                  <th width="35%" className="text-center"><FormattedMessage id="portal.dashboard.trafficPercentage.title" /></th>
                </tr>
              </thead>
              <tbody>
                {topProvidersCp && topProvidersCp.map((provider, i) => {
                  const traffic = separateUnit(formatBytes(provider.get('bytes')))
                  return (
                    <tr key={i}>
                      <td><b>{topCPProvidersAccounts.filter(item => item.get('id') === provider.get('account')).getIn([0, 'name'], provider.get('account'))}</b></td>
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
                          dataKey="percent_of_timestamp"
                          data={provider.get('detail').toJS()} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>

            {(!topProvidersCp || !topProvidersCp.size) &&
              <div className="no-data">
                <FormattedMessage id="portal.common.no-data.text"/>
              </div>
            }
          </DashboardPanel>
          {/* END ------- TOP 5 CONTENT PROVICERS */}

        </DashboardPanels>
      </PageContainer>
    )
  }

  render() {
    const { activeAccount, filterOptions, filters, intl, params, router, user } = this.props
    const showFilters = List(['dateRange'])
    // dashboard won't allow to drill down group, even it exist in params
    const dateRanges = [
      DateRanges.MONTH_TO_DATE,
      DateRanges.LAST_MONTH,
      DateRanges.THIS_WEEK,
      DateRanges.LAST_WEEK
    ]
    return (
      <Content>
        <PageHeader pageSubTitle={<FormattedMessage id="portal.navigation.dashboard.text"/>}>
          <IsAllowed to={PERMISSIONS.VIEW_CONTENT_ACCOUNTS}>
            <AccountSelector
              params={params}
              onItemClick={(entity) => {

                const { nodeInfo, idKey = 'id' } = entity
                router.push(getDashboardUrl(nodeInfo.entityType, entity[idKey], nodeInfo.parents))

              }}
              levels={[ 'brand' ]}>
              <div className="btn btn-link dropdown-toggle header-toggle">
                <h1>
                  <TruncatedTitle
                    content={activeAccount.get('name') || intl.formatMessage({id: 'portal.account.manage.selectAccount.text'})}
                    tooltipPlacement="bottom"
                    className="account-property-title"/>
                </h1>
                <IconCaretDown />
              </div>
            </AccountSelector>
          </IsAllowed>
          <IsAllowed not={true} to={PERMISSIONS.VIEW_CONTENT_ACCOUNTS}>
            <h1>{activeAccount.get('name') || <FormattedMessage id="portal.accountManagement.noActiveAccount.text"/>}</h1>
          </IsAllowed>
        </PageHeader>

        {activeAccount.size ?
          <AnalyticsFilters
            activeAccountProviderType={activeAccount && activeAccount.get('provider_type')}
            currentUser={user}
            dateRanges={dateRanges}
            onFilterChange={this.onFilterChange}
            filters={filters}
            filterOptions={filterOptions}
            showFilters={showFilters}
          />
        : null}

        {this.renderContent()}
      </Content>
    )
  }
}

BrandDashboard.displayName = 'BrandDashboard'
BrandDashboard.propTypes = {
  activeAccount: PropTypes.instanceOf(Map),
  cityData: PropTypes.instanceOf(List),
  dashboard: PropTypes.instanceOf(Map),
  dashboardActions: PropTypes.object,
  fetchMarkers: PropTypes.func,
  filterActions: React.PropTypes.object,
  filterOptions: PropTypes.object,
  filters: PropTypes.instanceOf(Map),
  filtersActions: PropTypes.object,
  intl: PropTypes.object,
  mapBounds: PropTypes.instanceOf(Map),
  mapboxActions: PropTypes.object,
  markers: PropTypes.instanceOf(List),
  params: PropTypes.object,
  router: PropTypes.object,
  theme: PropTypes.string,
  trafficActions: PropTypes.object,
  user: PropTypes.instanceOf(Map)
}

BrandDashboard.contextTypes = {
  currentUser: PropTypes.instanceOf(Map),
  roles: PropTypes.instanceOf(Map)
}

BrandDashboard.defaultProps = {
  activeAccount: Map({
    id: 1,
    name: <FormattedMessage id="portal.content.property.topBar.brand.label" />,
    provider_type: ACCOUNT_TYPE_CLOUD_PROVIDER
  }),
  dashboard: Map(),
  filters: Map(),
  user: Map()
}

/* istanbul ignore next */
const mapStateToProps = (state, { params: { account } }) => {
  return {
    getGroupIds: () => getIdsByAccount(state, account),
    activeAccount: getAccountById(state, account),
    dashboard: state.dashboard.get('dashboard'),
    fetching: state.dashboard.get('fetching'),
    filterOptions: state.filters.get('filterOptions'),
    filters: state.filters.get('filters'),
    user: state.user.get('currentUser'),
    theme: state.ui.get('theme'),
    mapBounds: state.mapbox.get('mapBounds'),
    cityData: state.traffic.get('byCity'),
    markers: getMarkers(state)
  }
}

/* istanbul ignore next */
const mapDispatchToProps = (dispatch) => {
  return {
    fetchAccount: requestParams => dispatch(accountActions.fetchOne(requestParams)),
    fetchGroups: requestParams => dispatch(groupActions.fetchAll(requestParams)),
    fetchMarkers: () => dispatch(markersActions.fetchAll({})),
    dashboardActions: bindActionCreators(dashboardActionCreators, dispatch),
    filterActions: bindActionCreators(filterActionCreators, dispatch),
    filtersActions: bindActionCreators(filtersActionCreators, dispatch),
    mapboxActions: bindActionCreators(mapboxActionCreators, dispatch),
    trafficActions: bindActionCreators(trafficActionCreators, dispatch)
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(injectIntl(BrandDashboard)))
