import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import AnalysisTraffic from '../../../components/analysis/traffic.jsx'

import * as trafficActionCreators from '../../../redux/modules/traffic'
import * as metricsActionCreators from '../../../redux/modules/metrics'
import { getDateRange } from '../../../redux/util.js'

class AnalyticsTabTraffic extends React.Component {
  constructor(props){
    super(props)
  }

  componentDidMount() {
    console.log("AnalyticsTabTraffic - componentDidMount()")

    this.fetchData(this.props.params, this.props.filters)
  }

  componentWillReceiveProps(nextProps){

    console.log('AnalyticsTabTraffic() - componentWillReceiveProps()')

    const params = JSON.stringify(this.props.params)
    const prevParams = JSON.stringify(nextProps.params)
    const filters = JSON.stringify(this.props.filters)
    const prevFilters = JSON.stringify(nextProps.filters)

    console.log('props', params, prevParams, filters,prevFilters)

    if ( !( params === prevParams && filters === prevFilters) ) this.fetchData(nextProps.params, nextProps.filters)

  }

  fetchData(params, filters){
    const {startDate, endDate} = getDateRange( filters )

    const fetchOpts = {
      account: params.account,
      brand: params.brand,
      group: params.group,
      host: params.property,

      startDate: startDate.format('X'),
      endDate: endDate.format('X')
    }

    this.props.trafficActions.fetchByTime(fetchOpts)
    this.props.trafficActions.fetchByCountry(fetchOpts)
    this.props.trafficActions.fetchTotalEgress(fetchOpts)

    //TODO: fetchMetrics !!!!

  }

  render(){
    // TODO: This should have its own endpoint so we don't have to fetch info
    // for all accounts
    const metrics    = this.props.metrics.find(metric => metric.get('account') + "" === this.props.params.account) || Immutable.Map()


    const peakTraffic = metrics.has('transfer_rates') ?
      metrics.get('transfer_rates').get('peak') : '0.0 Gbps'
    const avgTraffic = metrics.has('transfer_rates') ?
      metrics.get('transfer_rates').get('average') : '0.0 Gbps'
    const lowTraffic = metrics.has('transfer_rates') ?
      metrics.get('transfer_rates').get('lowest') : '0.0 Gbps'


    return (
      <div>
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
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    metrics: Immutable.List(),
    trafficByTime: state.traffic.get('byTime'),
    trafficByCountry: state.traffic.get('byCountry'),
    totalEgress: state.traffic.get('totalEgress'),
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    trafficActions: bindActionCreators(trafficActionCreators, dispatch),
    metricsActions: bindActionCreators(metricsActionCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticsTabTraffic);
