import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import AnalysisTraffic from '../../../components/analysis/traffic.jsx'

import * as trafficActionCreators from '../../../redux/modules/traffic'
import * as metricsActionCreators from '../../../redux/modules/metrics'
import {buildAnalyticsOpts, changedParamsFiltersQS} from '../../../util/helpers.js'

class AnalyticsTabTraffic extends React.Component {
  constructor(props){
    super(props)
    this.state = {metricKey: 'account', dataKey: 'accountMetrics'}
  }

  componentDidMount() {
    this.fetchData(this.props.params, this.props.filters, this.props.location)
  }

  componentWillReceiveProps(nextProps){
    if(changedParamsFiltersQS(this.props, nextProps)) {
      this.fetchData(nextProps.params, nextProps.filters, nextProps.location)
    }
  }

  fetchData(params, filters, location){
    const fetchOpts = buildAnalyticsOpts(params, filters, location)
    this.props.trafficActions.fetchByTime(fetchOpts)
    this.props.trafficActions.fetchByCountry(fetchOpts)
    this.props.trafficActions.fetchTotalEgress(fetchOpts)

    //REFACTOR:
    if ( location.query.property) {
      this.setState({metricKey: 'hostMetrics'})
      this.props.metricsActions.fetchHostMetrics({
        account: params.account,
        group: params.group,
        startDate: fetchOpts.startDate,
        endDate: fetchOpts.endDate
      })
    } else if (params.group) {
      this.setState({metricKey: 'groupMetrics'})
      this.props.metricsActions.fetchGroupMetrics({
        account: params.account,
        startDate: fetchOpts.startDate,
        endDate: fetchOpts.endDate
      })
    } else if (params.account) {
      this.setState({metricKey: 'accountMetrics'})
      this.props.metricsActions.fetchAccountMetrics({
        startDate: fetchOpts.startDate,
        endDate: fetchOpts.endDate
      })
    }
  }

  render(){
    // TODO: This should have its own endpoint so we don't have to fetch info
    // for all accounts

    let metrics = Immutable.Map()
    if ( this.props.metrics.has(this.state.metricKey) ) {
      metrics = this.props.metrics.get(this.state.metricKey).find( (val) => {
        return (
          this.props.params.account && val.get('account') === parseInt(this.props.params.account) ||
          this.props.params.group && val.get('group') === parseInt(this.props.params.group) ||
          this.props.location.query.property && val.get('property') === this.props.location.query.property
        )
      })
    }

    const peakTraffic = metrics && metrics.has('transfer_rates') ?
      metrics.getIn(['transfer_rates','peak']) : '0.0 Gbps'
    const avgTraffic = metrics && metrics.has('transfer_rates') ?
      metrics.getIn(['transfer_rates','average']) : '0.0 Gbps'
    const lowTraffic = metrics && metrics.has('transfer_rates') ?
      metrics.getIn(['transfer_rates','lowest']) : '0.0 Gbps'

    return (
      <AnalysisTraffic
        avgTraffic={avgTraffic}
        byCountry={this.props.trafficByCountry}
        byTime={this.props.trafficByTime}
        dateRange={this.props.filters.get('dateRangeLabel')}
        fetching={false}
        lowTraffic={lowTraffic}
        peakTraffic={peakTraffic}
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
  trafficActions: React.PropTypes.object,
  trafficByCountry: React.PropTypes.instanceOf(Immutable.List),
  trafficByTime: React.PropTypes.instanceOf(Immutable.List)
}

AnalyticsTabTraffic.defaultProps = {
  filters: Immutable.Map(),
  metrics: Immutable.Map(),
  trafficByCountry: Immutable.List(),
  trafficByTime: Immutable.List()
}

function mapStateToProps(state) {
  return {
    metrics: state.metrics,
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
