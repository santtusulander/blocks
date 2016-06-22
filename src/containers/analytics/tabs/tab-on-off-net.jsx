import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import AnalysisOnOffNetReport from '../../../components/analysis/on-off-net-report.jsx'

import * as trafficActionCreators from '../../../redux/modules/traffic'
import { getDateRange } from '../../../redux/util.js'

class AnalyticsTabOnOffNet extends React.Component {
  constructor(props){
    super(props)
  }

  componentDidMount() {
    console.log("AnalyticsTabOnOffNet - componentDidMount()")

    this.fetchData(this.props.params, this.props.filters)
  }

  componentWillReceiveProps(nextProps){

    console.log('AnalyticsTabOnOffNet() - componentWillReceiveProps()')

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

    const onOffOpts = Object.assign({}, fetchOpts)
    onOffOpts.granularity = 'day'

    const onOffTodayOpts = Object.assign({}, onOffOpts)
    onOffTodayOpts.startDate = moment().utc().startOf('day').format('X'),
    onOffTodayOpts.endDate = moment().utc().format('X')

    this.props.trafficActions.fetchOnOffNet(onOffOpts)
    this.props.trafficActions.fetchOnOffNetToday(onOffTodayOpts)

    /*
    this.props.trafficActions.fetchServiceProviders(onOffOpts)
    this.props.trafficActions.fetchStorage()
    */
  }

  render(){
    return (
      <div>
        <AnalysisOnOffNetReport
          fetching={this.props.fetching}
          onOffNetChartType={this.props.onOffNetChartType}
          onOffStats={this.props.onOffStats}
          onOffStatsToday={this.props.onOffStatsToday}
        />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    fetching: state.traffic.get('fetching'),
    onOffNetChartType: state.ui.get('analysisOnOffNetChartType'),
    onOffStats: state.traffic.get('onOffNet'),
    onOffStatsToday: state.traffic.get('onOffNetToday'),
    filters: state.filters.get('filters')
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    trafficActions: bindActionCreators(trafficActionCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticsTabOnOffNet);
