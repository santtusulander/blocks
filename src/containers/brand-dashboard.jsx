import React, { PropTypes } from 'react'
import { List, Map, is } from 'immutable'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Table } from 'react-bootstrap'

import {
  accountIsContentProviderType,
  accountIsServiceProviderType,
  formatBitsPerSecond,
  formatBytes,
  separateUnit
} from '../util/helpers'
import numeral from 'numeral'
import DateRanges from '../constants/date-ranges'
import { BRAND_DASHBOARD_TOP_PROVIDER_LENGTH } from '../constants/dashboard'
import { getDashboardUrl } from '../util/routes'

import * as PERMISSIONS from '../constants/permissions'
import * as dashboardActionCreators from '../redux/modules/dashboard'
import { defaultFilters } from '../redux/modules/filters'
import * as filterActionCreators from '../redux/modules/filters'
import * as filtersActionCreators from '../redux/modules/filters'
import * as mapboxActionCreators from '../redux/modules/mapbox'
import * as trafficActionCreators from '../redux/modules/traffic'

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

    this.state = {
      byLocationWidth: 100
    }

    this.fetchData = this.fetchData.bind(this)
    this.measureContainers = this.measureContainers.bind(this)
    this.onFilterChange = this.onFilterChange.bind(this)
    this.measureContainersTimeout = null
    this.getCityData = this.getCityData.bind(this)
  }

  componentWillMount() {
    if (is(defaultFilters, this.props.filters)) {
      this.fetchData(this.props.params, this.props.filters)
    } else {
      this.props.filterActions.resetFilters()
    }
  }

  componentDidMount() {
    this.measureContainers()
    // TODO: remove this timeout as part of UDNP-1426
    window.addEventListener('resize', this.measureContainers)
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
    // TODO: remove this timeout as part of UDNP-1426
    if (this.measureContainersTimeout) {
      clearTimeout(this.measureContainersTimeout)
    }
    this.measureContainersTimeout = setTimeout(() => {
      this.measureContainers()
    }, 500)
  }

  componentWillUnmount() {
    this.props.filterActions.resetContributionFilters()
    window.removeEventListener('resize', this.measureContainers)
    // TODO: remove this timeout as part of UDNP-1426
    clearTimeout(this.measureContainersTimeout)
  }

  fetchData(urlParams, filters) {
    if (urlParams.account) {
      // Dashboard should fetch only account level data
      const { brand, account: id } = urlParams
      this.props.fetchAccount({brand, id}).then(() => {
        const params = { brand: urlParams.brand, account: urlParams.account }

        const { dashboardOpts } = buildFetchOpts({ params, filters, coordinates: this.props.mapBounds.toJS() })
        dashboardOpts.field_filters = 'chit_ratio,avg_fbl,bytes,transfer_rates,connections,timestamp'
        const accountType = this.props.activeAccount.get('provider_type')
        const providerOpts = buildAnalyticsOptsForContribution(params, filters, accountType)

        const fetchProvidersForCP = accountIsContentProviderType(this.props.activeAccount) &&
          this.props.filterActions.fetchServiceProvidersWithTrafficForCP(params.brand, providerOpts)
        const fetchProvidersForSP = accountIsServiceProviderType(this.props.activeAccount) &&
          this.props.filterActions.fetchContentProvidersWithTrafficForSP(params.brand, providerOpts)
        const fetchProviders = fetchProvidersForCP || fetchProvidersForSP

        return Promise.all([
          this.props.dashboardActions.startFetching(),
          this.props.dashboardActions.fetchDashboard(dashboardOpts, accountType),
          fetchProviders
        ])
        .then(this.props.dashboardActions.finishFetching, this.props.dashboardActions.finishFetching)
      })
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
    const { params: { brand, account }, filters } = this.props
    return getCitiesWithinBounds({
      params: { brand, account },
      filters,
      coordinates: { south, west, north, east },
      actions: this.props.trafficActions
    })
  }

  renderContent() {
    const { dashboard, filterOptions, intl, theme } = this.props

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

    const trafficDatasetAValue = numeral((dashboard.getIn(['traffic', 'bytes_net_on']))).format('0,0')
    const trafficDatasetBValue = numeral((dashboard.getIn(['traffic', 'bytes_net_off']))).format('0,0')
    const datasetACalculatedValue = (totalTrafficValue * trafficDatasetAValue) / 100
    const datasetACalculatedUnit = totalTrafficUnit
    const datasetBCalculatedValue = (totalTrafficValue * trafficDatasetBValue) / 100
    const datasetBCalculatedUnit = totalTrafficUnit

    const optionalDataset = true
    const optionalDatasetACalculatedUnit = totalTrafficUnit
    const optionalDatasetACalculatedValue = (totalTrafficValue * trafficDatasetAValue) / 100
    const optionalDatasetALabel = intl.formatMessage({id: 'portal.analytics.prod.title'})
    const optionalDatasetAUnit = "%"
    const optionalDatasetAValue = numeral((dashboard.getIn(['traffic', 'bytes_net_on']))).format('0,0')
    const optionalDatasetBCalculatedUnit = totalTrafficUnit
    const optionalDatasetBCalculatedValue = (totalTrafficValue * trafficDatasetBValue) / 100
    const optionalDatasetBLabel = intl.formatMessage({id: 'portal.analytics.trial.title'})
    const optionalDatasetBUnit = "%"
    const optionalDatasetBValue = numeral((dashboard.getIn(['traffic', 'bytes_net_off']))).format('0,0')

    const countries = !dashboard.size ? List() : dashboard.get('countries')
    const countriesAverageBandwidth = val => formatBitsPerSecond(val, true)

    const topProviders = !dashboard.size ? List() : dashboard.get('providers').sortBy((provider) => provider.get('bytes'), (a, b) => {
      return a < b
    })
    const topSPProvidersAccounts = filterOptions.getIn(['serviceProviders'], List())
    const topCPProvidersAccounts = filterOptions.getIn(['contentProviders'], List())

    return (
      <PageContainer>
        <DashboardPanels className="responsive">

          {/* Stacked Summary */}
          <DashboardPanel title={intl.formatMessage({id: 'portal.dashboard.traffic.title'})} className="full-width">
            <StackedByTimeSummary
              dataKey="bytes"
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
              optionalDataset={optionalDataset}
              optionalDatasetACalculatedUnit={optionalDatasetACalculatedUnit}
              optionalDatasetACalculatedValue={optionalDatasetACalculatedValue}
              optionalDatasetALabel={optionalDatasetALabel}
              optionalDatasetAUnit={optionalDatasetAUnit}
              optionalDatasetAValue={optionalDatasetAValue}
              optionalDatasetBCalculatedUnit={optionalDatasetBCalculatedUnit}
              optionalDatasetBCalculatedValue={optionalDatasetBCalculatedValue}
              optionalDatasetBLabel={optionalDatasetBLabel}
              optionalDatasetBUnit={optionalDatasetBUnit}
              optionalDatasetBValue={optionalDatasetBValue}
            />
          </DashboardPanel>
          {/* END ------- Stacked Summary */}

          {/* MAPBOX */}
          <DashboardPanel title={intl.formatMessage({id: 'portal.dashboard.trafficByLocation.title'})} noPadding={countries.size ? true : false} className="full-width">
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
                mapboxActions={this.props.mapboxActions}
                coreLocations={{}}
                spEdgesLocations={{}}
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
                {topProviders.map((provider, i) => {
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

            {!topProviders.size &&
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
                {topProviders.map((provider, i) => {
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

            {!topProviders.size &&
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
  fetchAccount: PropTypes.func,
  filterActions: React.PropTypes.object,
  filterOptions: PropTypes.object,
  filters: PropTypes.instanceOf(Map),
  filtersActions: PropTypes.object,
  intl: PropTypes.object,
  mapBounds: PropTypes.instanceOf(Map),
  mapboxActions: PropTypes.object,
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
  activeAccount: Map({id: 236, name: "UDN Mgmt"}),
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
    cityData: state.traffic.get('byCity')
  }
}

/* istanbul ignore next */
const mapDispatchToProps = (dispatch) => {
  return {
    fetchAccount: requestParams => dispatch(accountActions.fetchOne(requestParams)),
    fetchGroups: requestParams => dispatch(groupActions.fetchAll(requestParams)),
    dashboardActions: bindActionCreators(dashboardActionCreators, dispatch),
    filterActions: bindActionCreators(filterActionCreators, dispatch),
    filtersActions: bindActionCreators(filtersActionCreators, dispatch),
    mapboxActions: bindActionCreators(mapboxActionCreators, dispatch),
    trafficActions: bindActionCreators(trafficActionCreators, dispatch)
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(injectIntl(BrandDashboard)))
