import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import numeral from 'numeral'
import moment from 'moment'

import AnalysisTraffic from '../../../components/analysis/traffic.jsx'

import * as trafficActionCreators from '../../../redux/modules/traffic'
import * as mapboxActionCreators from '../../../redux/modules/mapbox'

import { formatBitsPerSecond, changedParamsFiltersQS, buildFetchOpts } from '../../../util/helpers.js'
import { getCitiesWithinBounds } from '../../../util/mapbox-helpers'
import DateRanges from '../../../constants/date-ranges'
import { MAPBOX_CITY_LEVEL_ZOOM } from '../../../constants/mapbox'

class AnalyticsTabTraffic extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      metricKey: 'account'
    }

    this.fetchData = this.fetchData.bind(this)
    this.formatTotals = this.formatTotals.bind(this)
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
    if( this.props.filters !== nextProps.filters ||
        changedParamsFiltersQS(this.props, nextProps) ||
        this.props.activeHostConfiguredName !== nextProps.activeHostConfiguredName) {
      this.fetchData(
        nextProps.params,
        nextProps.filters,
        nextProps.location,
        nextProps.activeHostConfiguredName
      )
    }
  }

  fetchData(params, filters, location, activeHostConfiguredName) {
    const { fetchOpts, byTimeOpts, byCityOpts } = buildFetchOpts({
      params,
      filters,
      location,
      activeHostConfiguredName,
      coordinates: this.props.mapBounds.toJS()
    })

    this.props.trafficActions.fetchByTime(byTimeOpts)
    this.props.trafficActions.fetchByCountry(fetchOpts)
    this.props.trafficActions.fetchTotalEgress(fetchOpts)

    if (this.props.mapZoom >= MAPBOX_CITY_LEVEL_ZOOM && this.props.mapBounds.size) {
      this.props.trafficActions.startFetching()
      this.props.trafficActions.fetchByCity(byCityOpts).then(() =>
        this.props.trafficActions.finishFetching()
      )
    }

    let totalsOpts

    //REFACTOR:
    if (params.property) {
      this.setState({metricKey: 'hostMetrics'})
      totalsOpts = {
        account: params.account,
        group: params.group,
        property: params.property,
        startDate: fetchOpts.startDate,
        endDate: fetchOpts.endDate,
        service_type: fetchOpts.service_type
      }
      if (activeHostConfiguredName) {
        totalsOpts.property = activeHostConfiguredName
      }
    } else if(params.group) {
      this.setState({ metricKey: 'groupMetrics' })
      totalsOpts = {
        account: params.account,
        group: params.group,
        startDate: fetchOpts.startDate,
        endDate: fetchOpts.endDate,
        service_type: fetchOpts.service_type
      }
    } else if(params.account) {
      this.setState({ metricKey: 'accountMetrics' })
      totalsOpts = {
        account: params.account,
        startDate: fetchOpts.startDate,
        endDate: fetchOpts.endDate,
        service_type: fetchOpts.service_type
      }
    }

    if (totalsOpts) {
      this.props.trafficActions.fetchTotals(totalsOpts)
    }

    if (filters.getIn(['includeComparison'])) {
      const dateRangeLabel = filters.get('dateRangeLabel')
      const dateSpan = fetchOpts.endDate - fetchOpts.startDate + 1
      let startDate = fetchOpts.startDate - dateSpan
      let endDate = fetchOpts.endDate - dateSpan
      if(dateRangeLabel === DateRanges.LAST_MONTH || dateRangeLabel === DateRanges.MONTH_TO_DATE) {
        startDate = Number(moment(fetchOpts.startDate * 1000).subtract(1, 'months').format('X'))
        endDate = startDate + dateSpan
      }
      const comparisonByTimeOpts = Object.assign({}, byTimeOpts, {
        startDate: startDate,
        endDate: endDate
      })
      this.props.trafficActions.fetchByTimeComparison(comparisonByTimeOpts)
    }

  }

  formatTotals(value) {
    if(this.props.filters.get('recordType') === 'transfer_rates') {
      return formatBitsPerSecond(value, 2)
    } else if(this.props.filters.get('recordType') === 'requests') {
      return numeral(value).format('0,0')
    }
  }

  getCityData(south, west, north, east) {
    const { params, filters, location } = this.props
    return getCitiesWithinBounds({
      params,
      filters,
      location,
      coordinates: { south, west, north, east },
      activeHostConfiguredName: this.props.activeHostConfiguredName,
      actions: this.props.trafficActions
    })
  }

  render() {

    const {filters, totals} = this.props
    const recordType = filters.get('recordType')
    const peakTraffic = totals.size ?
      totals.getIn([recordType, 'peak']) : 0
    const avgTraffic  = totals.size ?
      totals.getIn([recordType, 'average']) : 0
    const lowTraffic  = totals.size ?
      totals.getIn([recordType, 'low']) : 0

    return (
      <AnalysisTraffic
        avgTraffic={this.formatTotals(avgTraffic)}
        byCountry={this.props.trafficByCountry}
        byCity={this.props.trafficByCity}
        byTime={this.props.trafficByTime}
        byTimeComparison={filters.getIn(['includeComparison']) ? this.props.trafficByTimeComparison : Immutable.List()}
        fetching={false}
        lowTraffic={this.formatTotals(lowTraffic)}
        peakTraffic={this.formatTotals(peakTraffic)}
        recordType={this.props.filters.get('recordType')}
        serviceTypes={this.props.filters.get('serviceTypes')}
        totalEgress={this.props.totalEgress}
        getCityData={this.getCityData}
        theme={this.props.theme}
        mapBounds={this.props.mapBounds}
        mapboxActions={this.props.mapboxActions}
      />
    )
  }
}

AnalyticsTabTraffic.displayName = "AnalyticsTabTraffic"
AnalyticsTabTraffic.propTypes = {
  activeHostConfiguredName: React.PropTypes.string,
  filters: React.PropTypes.instanceOf(Immutable.Map),
  location: React.PropTypes.object,
  mapBounds: React.PropTypes.instanceOf(Immutable.Map),
  mapZoom: React.PropTypes.number,
  mapboxActions: React.PropTypes.object,
  params: React.PropTypes.object,
  theme: React.PropTypes.string,
  totalEgress: React.PropTypes.number,
  totals: React.PropTypes.instanceOf(Immutable.Map),
  trafficActions: React.PropTypes.object,
  trafficByCity: React.PropTypes.instanceOf(Immutable.List),
  trafficByCountry: React.PropTypes.instanceOf(Immutable.List),
  trafficByTime: React.PropTypes.instanceOf(Immutable.List),
  trafficByTimeComparison: React.PropTypes.instanceOf(Immutable.List)
}

AnalyticsTabTraffic.defaultProps = {
  filters: Immutable.Map(),
  mapBounds: Immutable.Map(),
  totals: Immutable.Map(),
  trafficByCity: Immutable.List(),
  trafficByCountry: Immutable.List(),
  trafficByTime: Immutable.List(),
  trafficByTimeComparison: Immutable.List(),
  theme: 'dark'
}

function mapStateToProps(state) {
  return {
    activeHostConfiguredName: state.host.get('activeHostConfiguredName'),
    totals: state.traffic.get('totals'),
    trafficByTime: state.traffic.getIn(['byTime', 'details']),
    trafficByTimeComparison: state.traffic.getIn(['byTimeComparison', 'details']),
    trafficByCity: state.traffic.get('byCity'),
    trafficByCountry: state.traffic.get('byCountry'),
    totalEgress: state.traffic.get('totalEgress'),
    theme: state.ui.get('theme'),
    mapBounds: state.mapbox.get('mapBounds'),
    mapZoom: state.mapbox.get('mapZoom')
  }
}

function mapDispatchToProps(dispatch) {
  return {
    trafficActions: bindActionCreators(trafficActionCreators, dispatch),
    mapboxActions: bindActionCreators(mapboxActionCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticsTabTraffic);
