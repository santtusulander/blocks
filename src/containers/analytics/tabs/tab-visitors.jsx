import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FormattedMessage } from 'react-intl'
import PROVIDER_TYPES from '../../../constants/provider-types'

import AnalysisVisitors from '../../../components/analysis/visitors.jsx'
import * as visitorsActionCreators from '../../../redux/modules/visitors'
import * as mapboxActionCreators from '../../../redux/modules/mapbox'
import { changedParamsFiltersQS, buildFetchOpts } from '../../../util/helpers.js'
import { getCitiesWithinBounds } from '../../../util/mapbox-helpers.js'
import { userHasRole } from '../../../util/helpers'

import { MAPBOX_CITY_LEVEL_ZOOM } from '../../../constants/mapbox'

class AnalyticsTabVisitors extends React.Component {
  constructor(props) {
    super(props)

    this.getCityData = this.getCityData.bind(this)
  }

  componentDidMount() {
    this.fetchData(
      this.props.params,
      this.props.filters,
      this.props.location,
      this.props.activeHostConfiguredName
    )
  }

  componentWillReceiveProps(nextProps) {
    if (changedParamsFiltersQS(this.props, nextProps) ||
      this.props.activeHostConfiguredName !== nextProps.activeHostConfiguredName) {
      this.fetchData(
        nextProps.params,
        nextProps.filters,
        nextProps.location,
        nextProps.activeHostConfiguredName
      )
    }
  }

  fetchData(params, filters, location, hostConfiguredName) {
    if (params.property && hostConfiguredName) {
      params = Object.assign({}, params, {
        property: hostConfiguredName
      })
    }

    const aggregation = this.determineAggregation(filters)

    const { fetchOpts, byCityOpts } = buildFetchOpts({ params, filters, location, coordinates: this.props.mapBounds.toJS() })
    const optsWithAggregation = {...fetchOpts, aggregate_granularity: aggregation}

    this.props.visitorsActions.fetchByBrowser(optsWithAggregation)
    this.props.visitorsActions.fetchByCountry(optsWithAggregation)
    this.props.visitorsActions.fetchByTime(fetchOpts)
    this.props.visitorsActions.fetchByOS(optsWithAggregation)

    if (this.props.mapZoom >= MAPBOX_CITY_LEVEL_ZOOM && this.props.mapBounds.size) {
      this.props.visitorsActions.startFetching()
      this.props.visitorsActions.fetchByCity({...byCityOpts, aggregate_granularity: aggregation}).then(() =>
        this.props.visitorsActions.finishFetching()
      )

    }
  }

  getCityData(south, west, north, east) {
    const { params, filters, location } = this.props

    const aggregation = this.determineAggregation(filters)

    return getCitiesWithinBounds({
      params,
      filters,
      location,
      coordinates: { south, west, north, east },
      activeHostConfiguredName: this.props.activeHostConfiguredName,
      actions: this.props.visitorsActions,
      aggregation
    })
  }

  determineAggregation(filters) {
    const startDate = filters.getIn(['customDateRange', 'startDate'])
    const endDate = filters.getIn(['customDateRange', 'endDate'])
    const rangeDiff = startDate && endDate ? endDate.diff(startDate, 'day') : 0
    return rangeDiff > 0 ? 'month' : 'day'
  }

  render () {
    const { activeAccount, currentUser } = this.props

    // Check for Cloud Providers / UDN Admins
    if (userHasRole(currentUser, PROVIDER_TYPES.CLOUD_PROVIDER) &&
        (!activeAccount || activeAccount.get('provider_type') !== PROVIDER_TYPES.CONTENT_PROVIDER)) {
      return (
        <div className="text-center">
          <FormattedMessage id="portal.analytics.selectContentProviderAccount.text" values={{ br: <br/> }}/>
        </div>
      )
    }

    return (
      <AnalysisVisitors
        byBrowser={this.props.byBrowser.get('browsers')}
        byCountry={this.props.byCountry.get('countries')}
        byCity={this.props.byCity}
        byOS={this.props.byOS.get('os')}
        byTime={this.props.byTime}
        fetching={this.props.fetching}
        mapBounds={this.props.mapBounds}
        theme={this.props.theme}
        mapboxActions={this.props.mapboxActions}
        getCityData={this.getCityData}
      />
    )
  }
}

AnalyticsTabVisitors.displayName = "AnalyticsTabVisitors"
AnalyticsTabVisitors.propTypes = {
  activeAccount: React.PropTypes.instanceOf(Immutable.Map),
  activeHostConfiguredName: React.PropTypes.string,
  byBrowser: React.PropTypes.instanceOf(Immutable.Map),
  byCity: React.PropTypes.instanceOf(Immutable.List),
  byCountry: React.PropTypes.instanceOf(Immutable.Map),
  byOS: React.PropTypes.instanceOf(Immutable.Map),
  byTime: React.PropTypes.instanceOf(Immutable.List),
  currentUser: React.PropTypes.instanceOf(Immutable.Map),
  fetching: React.PropTypes.bool,
  filters: React.PropTypes.instanceOf(Immutable.Map),
  location: React.PropTypes.object,
  mapBounds: React.PropTypes.object,
  mapZoom: React.PropTypes.number,
  mapboxActions: React.PropTypes.object,
  params: React.PropTypes.object,
  theme: React.PropTypes.string,
  visitorsActions: React.PropTypes.object
}

AnalyticsTabVisitors.defaultProps = {
  byBrowser: Immutable.Map(),
  byCountry: Immutable.Map(),
  byOS: Immutable.Map(),
  byTime: Immutable.List(),
  filters: Immutable.Map()
}

function mapStateToProps(state) {
  return {
    activeAccount: state.account.get('activeAccount'),
    activeHostConfiguredName: state.host.get('activeHostConfiguredName'),
    byBrowser: state.visitors.get('byBrowser'),
    byCountry: state.visitors.get('byCountry'),
    byCity: state.visitors.get('byCity'),
    byOS: state.visitors.get('byOS'),
    byTime: state.visitors.get('byTime'),
    currentUser: state.user.get('currentUser'),
    fetching: state.visitors.get('fetching'),
    filters: state.filters.get('filters'),
    mapBounds: state.mapbox.get('mapBounds'),
    mapZoom: state.mapbox.get('mapZoom'),
    theme: state.ui.get('theme')
  }
}

function mapDispatchToProps(dispatch) {
  return {
    visitorsActions: bindActionCreators(visitorsActionCreators, dispatch),
    mapboxActions: bindActionCreators(mapboxActionCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticsTabVisitors);
