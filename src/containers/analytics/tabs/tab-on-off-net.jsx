import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import AnalysisOnOffNetReport from '../../../components/analysis/on-off-net-report.jsx'

import * as trafficActionCreators from '../../../redux/modules/traffic'
import {buildAnalyticsOpts, changedParamsFiltersQS} from '../../../util/helpers.js'

class AnalyticsTabOnOffNet extends React.Component {
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

    const onOffOpts = Object.assign({}, fetchOpts)
    onOffOpts.granularity = 'day'

    const onOffTodayOpts = Object.assign({}, onOffOpts)
    onOffTodayOpts.startDate = moment().utc().startOf('day').format('X'),
    onOffTodayOpts.endDate = moment().utc().format('X')

    this.props.trafficActions.fetchOnOffNet(onOffOpts)
    this.props.trafficActions.fetchOnOffNetToday(onOffTodayOpts)
  }

  export(exporters) {
    exporters.onOffNet(this.props.onOffStats.get('detail'))
  }

  render(){
    return (
      <AnalysisOnOffNetReport
        fetching={this.props.fetching}
        onOffNetChartType={this.props.onOffNetChartType}
        onOffStats={this.props.onOffStats}
        onOffStatsToday={this.props.onOffStatsToday}
        onOffFilter={this.props.filters.get('onOffNet')}
      />
    )
  }
}

AnalyticsTabOnOffNet.propTypes = {
  fetching: React.PropTypes.bool,
  filters: React.PropTypes.instanceOf(Immutable.Map),
  location: React.PropTypes.object,
  onOffNetChartType: React.PropTypes.string,
  onOffStats: React.PropTypes.instanceOf(Immutable.Map),
  onOffStatsToday: React.PropTypes.instanceOf(Immutable.Map),
  params: React.PropTypes.object,
  trafficActions: React.PropTypes.object
}

AnalyticsTabOnOffNet.defaultProps = {
  filters: Immutable.Map(),
  onOffStats: Immutable.Map(),
  onOffStatsToday: Immutable.Map()
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

function mapDispatchToProps(dispatch) {
  return {
    trafficActions: bindActionCreators(trafficActionCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(AnalyticsTabOnOffNet);
