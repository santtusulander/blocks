import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { bindActionCreators } from 'redux'

import AnalysisCacheHitRate from '../../../components/analysis/cache-hit-rate.jsx'

import * as trafficActionCreators from '../../../redux/modules/traffic'
import * as metricsActionCreators from '../../../redux/modules/metrics'

import { buildAnalyticsOpts, formatBitsPerSecond, changedParamsFiltersQS } from '../../../util/helpers.js'

class AnalyticsTabCacheHitRate extends React.Component {
  constructor(props) {
    super(props)
    this.state = { metricKey: 'account' }
  }

  componentDidMount() {
    this.fetchData(this.props.params, this.props.filters, this.props.location)
  }

  componentWillReceiveProps(nextProps) {
    if( this.props.filters !== nextProps.filters || changedParamsFiltersQS(this.props, nextProps) ) {
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

    //this.props.trafficActions.fetchByTime(byTimeOpts)
    //this.props.trafficActions.fetchByCountry(fetchOpts)
    //this.props.trafficActions.fetchTotalEgress(fetchOpts)

    //REFACTOR:
    if (params.property) {
      this.setState({metricKey: 'hostMetrics'})
      this.props.trafficActions.fetchTraffic({
        account: params.account,
        group: params.group,
        property: params.property,
        startDate: fetchOpts.startDate,
        endDate: fetchOpts.endDate,
        service_type: fetchOpts.service_type,
        field_filter: 'chit_ratio'
      })
    } else if(params.group) {
      this.setState({ metricKey: 'groupMetrics' })
      this.props.trafficActions.fetchTraffic({
        account: params.account,
        group: params.group,
        startDate: fetchOpts.startDate,
        endDate: fetchOpts.endDate,
        service_type: fetchOpts.service_type,
        field_filter: 'chit_ratio'
      })
    } else if(params.account) {
      this.setState({ metricKey: 'accountMetrics' })
      this.props.trafficActions.fetchTraffic({
        account: params.account,
        startDate: fetchOpts.startDate,
        endDate: fetchOpts.endDate,
        service_type: fetchOpts.service_type,
        field_filter: 'chit_ratio'
      })
    }
  }

  render() {
    const {traffic} = this.props

    return (
      <div>
        <AnalysisCacheHitRate
          traffic={ traffic }
          dateRange={this.props.filters.get('dateRangeLabel')}
          fetching={this.props.fetching}
          serviceTypes={this.props.filters.get('serviceTypes')}
        />
      </div>
    )
  }
}

AnalyticsTabCacheHitRate.propTypes = {
  filters: React.PropTypes.instanceOf(Immutable.Map),
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

AnalyticsTabCacheHitRate.defaultProps = {
  filters: Immutable.Map(),
  traffic: Immutable.List()
}

const mapStateToProps = (state) => ({
  fetching: state.traffic.get('fetching'),
  filters: state.filters.get('filters'),
  traffic: state.traffic.get('traffic'),
  trafficByTime: state.traffic.get('byTime')
})

function mapDispatchToProps(dispatch) {
  return {
    trafficActions: bindActionCreators(trafficActionCreators, dispatch),
    metricsActions: bindActionCreators(metricsActionCreators, dispatch)
  }
}

export default withRouter( connect(mapStateToProps, mapDispatchToProps)(AnalyticsTabCacheHitRate) );
