import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { bindActionCreators } from 'redux'

import AnalysisCacheHitRate from '../../../components/analysis/cache-hit-rate.jsx'

import * as trafficActionCreators from '../../../redux/modules/traffic'

import { buildAnalyticsOpts, formatBitsPerSecond, changedParamsFiltersQS } from '../../../util/helpers.js'

class AnalyticsTabCacheHitRate extends React.Component {
  constructor(props) {
    super(props)
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

    //REFACTOR:
    if (params.property) {
      this.props.trafficActions.fetchTraffic({
        account: params.account,
        group: params.group,
        property: params.property,
        startDate: fetchOpts.startDate,
        endDate: fetchOpts.endDate,
        service_type: fetchOpts.service_type,
        field_filter: 'chit_ratio',
        granularity: 'day'
      })
    } else if(params.group) {
      this.props.trafficActions.fetchTraffic({
        account: params.account,
        group: params.group,
        startDate: fetchOpts.startDate,
        endDate: fetchOpts.endDate,
        service_type: fetchOpts.service_type,
        field_filter: 'chit_ratio',
        granularity: 'day'
      })
    } else if(params.account) {
      this.props.trafficActions.fetchTraffic({
        account: params.account,
        startDate: fetchOpts.startDate,
        endDate: fetchOpts.endDate,
        service_type: fetchOpts.service_type,
        field_filter: 'chit_ratio',
        granularity: 'day'
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
  params: React.PropTypes.object,
  traffic: React.PropTypes.instanceOf(Immutable.List),
  trafficActions: React.PropTypes.object,
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
  }
}

export default withRouter( connect(mapStateToProps, mapDispatchToProps)(AnalyticsTabCacheHitRate) );
