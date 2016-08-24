import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import numeral from 'numeral'

import AnalysisTraffic from '../../../components/analysis/traffic.jsx'

import * as trafficActionCreators from '../../../redux/modules/traffic'
import * as metricsActionCreators from '../../../redux/modules/metrics'

import { buildAnalyticsOpts, formatBitsPerSecond, changedParamsFiltersQS } from '../../../util/helpers.js'

class AnalyticsTabTraffic extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      metricKey: 'account'
    }

    this.fetchData = this.fetchData.bind(this)
    this.formatTotals = this.formatTotals.bind(this)
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
    const fetchOpts  = buildAnalyticsOpts(params, filters, location)
    const startDate  = filters.getIn(['dateRange', 'startDate'])
    const endDate    = filters.getIn(['dateRange', 'endDate'])
    const rangeDiff  = startDate && endDate ? endDate.diff(startDate, 'month') : 0
    const byTimeOpts = Object.assign({
      granularity: rangeDiff >= 2 ? 'day' : 'hour'
    }, fetchOpts)

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
  }

  formatTotals(value) {
    if(this.props.filters.get('recordType') === 'transfer_rates') {
      return formatBitsPerSecond(value, 2)
    } else if(this.props.filters.get('recordType') === 'requests') {
      return numeral(value).format('0,0')
    }
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
        byTime={this.props.trafficByTime}
        dateRange={this.props.filters.get('dateRangeLabel')}
        fetching={false}
        lowTraffic={this.formatTotals(lowTraffic)}
        peakTraffic={this.formatTotals(peakTraffic)}
        recordType={this.props.filters.get('recordType')}
        serviceTypes={this.props.filters.get('serviceTypes')}
        totalEgress={this.props.totalEgress}
      />
    )
  }
}

AnalyticsTabTraffic.propTypes = {
  activeHostConfiguredName: React.PropTypes.string,
  filters: React.PropTypes.instanceOf(Immutable.Map),
  location: React.PropTypes.object,
  metrics: React.PropTypes.instanceOf(Immutable.Map),
  metricsActions: React.PropTypes.object,
  params: React.PropTypes.object,
  totalEgress: React.PropTypes.number,
  totals: React.PropTypes.instanceOf(Immutable.Map),
  trafficActions: React.PropTypes.object,
  trafficByCountry: React.PropTypes.instanceOf(Immutable.List),
  trafficByTime: React.PropTypes.instanceOf(Immutable.List)
}

AnalyticsTabTraffic.defaultProps = {
  filters: Immutable.Map(),
  metrics: Immutable.Map(),
  totals: Immutable.Map(),
  trafficByCountry: Immutable.List(),
  trafficByTime: Immutable.List()
}

function mapStateToProps(state) {
  return {
    activeHostConfiguredName: state.host.get('activeHostConfiguredName'),
    metrics: state.metrics,
    totals: state.traffic.get('totals'),
    trafficByTime: state.traffic.get('byTime'),
    trafficByCountry: state.traffic.get('byCountry'),
    totalEgress: state.traffic.get('totalEgress')
  }
}

function mapDispatchToProps(dispatch) {
  return {
    trafficActions: bindActionCreators(trafficActionCreators, dispatch),
    metricsActions: bindActionCreators(metricsActionCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticsTabTraffic);
