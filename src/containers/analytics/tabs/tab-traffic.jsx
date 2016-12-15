import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import numeral from 'numeral'
import moment from 'moment'

import AnalysisTraffic from '../../../components/analysis/traffic.jsx'

import * as trafficActionCreators from '../../../redux/modules/traffic'

import { buildAnalyticsOpts, formatBitsPerSecond, changedParamsFiltersQS } from '../../../util/helpers.js'
import DateRanges from '../../../constants/date-ranges'

class AnalyticsTabTraffic extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      metricKey: 'account'
    }

    this.fetchData = this.fetchData.bind(this)
    this.formatTotals = this.formatTotals.bind(this)
    this.getCitiesWithinBounds = this.getCitiesWithinBounds.bind(this)
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

  fetchData(params, filters, location, hostConfiguredName) {
    if(params.property && hostConfiguredName) {
      params = Object.assign({}, params, {
        property: hostConfiguredName
      })
    }

    const { fetchOpts, byTimeOpts } = this.buildOpts()

    this.props.trafficActions.fetchByTime(byTimeOpts)
    this.props.trafficActions.fetchByCountry(fetchOpts)
    this.props.trafficActions.fetchTotalEgress(fetchOpts)

    //REFACTOR:
    if (params.property) {
      this.setState({metricKey: 'hostMetrics'})
      this.props.trafficActions.fetchTotals({
        account: params.account,
        group: params.group,
        property: params.property,
        startDate: fetchOpts.startDate,
        endDate: fetchOpts.endDate,
        service_type: fetchOpts.service_type
      })
    } else if(params.group) {
      this.setState({ metricKey: 'groupMetrics' })
      this.props.trafficActions.fetchTotals({
        account: params.account,
        group: params.group,
        startDate: fetchOpts.startDate,
        endDate: fetchOpts.endDate,
        service_type: fetchOpts.service_type
      })
    } else if(params.account) {
      this.setState({ metricKey: 'accountMetrics' })
      this.props.trafficActions.fetchTotals({
        account: params.account,
        startDate: fetchOpts.startDate,
        endDate: fetchOpts.endDate,
        service_type: fetchOpts.service_type
      })
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

  buildOpts(coordinates = {}) {
    const { params, filters, location } = this.props

    const fetchOpts = buildAnalyticsOpts(params, filters, location)
    const startDate  = filters.getIn(['dateRange', 'startDate'])
    const endDate    = filters.getIn(['dateRange', 'endDate'])
    const rangeDiff  = startDate && endDate ? endDate.diff(startDate, 'month') : 0
    const byTimeOpts = Object.assign({
      granularity: rangeDiff >= 2 ? 'day' : 'hour'
    }, fetchOpts)

    const byCityOpts = Object.assign({
      max_cities: 999,
      latitude_south: coordinates.south || null,
      longitude_west: coordinates.west || null,
      latitude_north: coordinates.north || null,
      longitude_east: coordinates.east || null
    }, byTimeOpts)

    return { byTimeOpts, fetchOpts, byCityOpts }
  }

  getCitiesWithinBounds(south, west, north, east) {
    const { byCityOpts } = this.buildOpts({
      south: south,
      west: west,
      north: north,
      east: east
    })

    this.props.trafficActions.startFetching()
    this.props.trafficActions.fetchByCity(byCityOpts).then(
      this.props.trafficActions.finishFetching()
    )
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
        getCityData={this.getCitiesWithinBounds}
        theme={this.props.theme}
      />
    )
  }
}

AnalyticsTabTraffic.propTypes = {
  activeHostConfiguredName: React.PropTypes.string,
  filters: React.PropTypes.instanceOf(Immutable.Map),
  location: React.PropTypes.object,
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
    trafficByTime: state.traffic.get('byTime'),
    trafficByTimeComparison: state.traffic.get('byTimeComparison'),
    trafficByCity: state.traffic.get('byCity'),
    trafficByCountry: state.traffic.get('byCountry'),
    totalEgress: state.traffic.get('totalEgress'),
    theme: state.ui.get('theme')
  }
}

function mapDispatchToProps(dispatch) {
  return {
    trafficActions: bindActionCreators(trafficActionCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticsTabTraffic);
