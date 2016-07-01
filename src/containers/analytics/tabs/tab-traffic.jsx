import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import AnalysisTraffic from '../../../components/analysis/traffic.jsx'

import * as trafficActionCreators from '../../../redux/modules/traffic'
import * as metricsActionCreators from '../../../redux/modules/metrics'

import { buildAnalyticsOpts, formatBitsPerSecond, changedParamsFiltersQS } from '../../../util/helpers.js'

class AnalyticsTabTraffic extends React.Component {
  constructor(props) {
    super(props)
    this.state = { metricKey: 'account' }
  }

  componentDidMount() {
    this.fetchData(this.props.params, this.props.filters, this.props.location)
  }

  componentWillReceiveProps(nextProps) {
    if( changedParamsFiltersQS(this.props, nextProps) ) {
      this.fetchData(nextProps.params, nextProps.filters, nextProps.location)
    }
  }

  fetchData(params, filters, location) {
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
      this.props.trafficActions.fetchTraffic({
        account: params.account,
        group: params.group,
        property: params.property,
        startDate: fetchOpts.startDate,
        endDate: fetchOpts.endDate,
        service_type: fetchOpts.service_type
      })
    } else if(params.group) {
      this.setState({ metricKey: 'groupMetrics' })
      this.props.trafficActions.fetchTraffic({
        account: params.account,
        group: params.group,
        startDate: fetchOpts.startDate,
        endDate: fetchOpts.endDate,
        service_type: fetchOpts.service_type
      })
    } else if(params.account) {
      this.setState({ metricKey: 'accountMetrics' })
      this.props.trafficActions.fetchTraffic({
        account: params.account,
        startDate: fetchOpts.startDate,
        endDate: fetchOpts.endDate,
        service_type: fetchOpts.service_type
      })
    }
  }

  export(exporters) {
    exporters.traffic(this.props.trafficByTime, this.props.serviceTypes)
  }

  render() {
    const {traffic} = this.props
    const peakTraffic = !!traffic.size && traffic.first().has('totals') ?
      traffic.first().getIn(['totals', 'transfer_rates', 'peak']) : 0
    const avgTraffic  = !!traffic.size && traffic.first().has('totals') ?
      traffic.first().getIn(['totals', 'transfer_rates', 'average']) : 0
    const lowTraffic  = !!traffic.size && traffic.first().has('totals') ?
      traffic.first().getIn(['totals', 'transfer_rates', 'low']) : 0

    return (
      <AnalysisTraffic
        avgTraffic={formatBitsPerSecond(avgTraffic, 2)}
        byCountry={this.props.trafficByCountry}
        byTime={this.props.trafficByTime}
        dateRange={this.props.filters.get('dateRangeLabel')}
        fetching={false}
        lowTraffic={formatBitsPerSecond(lowTraffic, 2)}
        peakTraffic={formatBitsPerSecond(peakTraffic, 2)}
        serviceTypes={this.props.filters.get('serviceTypes')}
        totalEgress={this.props.totalEgress}
      />
    )
  }
}

AnalyticsTabTraffic.propTypes = {
  filters: React.PropTypes.instanceOf(Immutable.Map),
  history: React.PropTypes.object,
  location: React.PropTypes.object,
  metrics: React.PropTypes.instanceOf(Immutable.Map),
  metricsActions: React.PropTypes.object,
  params: React.PropTypes.object,
  totalEgress: React.PropTypes.number,
  traffic: React.PropTypes.instanceOf(Immutable.List),
  trafficActions: React.PropTypes.object,
  trafficByCountry: React.PropTypes.instanceOf(Immutable.List),
  trafficByTime: React.PropTypes.instanceOf(Immutable.List)
}

AnalyticsTabTraffic.defaultProps = {
  filters: Immutable.Map(),
  metrics: Immutable.Map(),
  traffic: Immutable.List(),
  trafficByCountry: Immutable.List(),
  trafficByTime: Immutable.List()
}

function mapStateToProps(state) {
  return {
    serviceTypes: state.ui.get('analysisServiceTypes'),
    metrics: state.metrics,
    traffic: state.traffic.get('traffic'),
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

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(AnalyticsTabTraffic);
