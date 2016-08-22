import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import AnalysisServiceProviders from '../../../components/analysis/service-providers.jsx'

import * as trafficActionCreators from '../../../redux/modules/traffic'
import {buildAnalyticsOpts, changedParamsFiltersQS} from '../../../util/helpers.js'

class AnalyticsTabServiceProviders extends React.Component {
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

    this.props.trafficActions.fetchServiceProviders(onOffOpts)
  }

  render(){
    return (
      <AnalysisServiceProviders
        fetching={this.props.fetching}
        stats={this.props.serviceProviders}
      />
    )
  }
}

AnalyticsTabServiceProviders.propTypes = {
  fetching: React.PropTypes.bool,
  filters: React.PropTypes.instanceOf(Immutable.Map),
  location: React.PropTypes.object,
  params: React.PropTypes.object,
  serviceProviders: React.PropTypes.instanceOf(Immutable.List),
  trafficActions: React.PropTypes.object
}

AnalyticsTabServiceProviders.defaultProps = {
  filters: Immutable.Map(),
  serviceProviders: Immutable.Map()
}

function mapStateToProps(state) {
  return {
    fetching: state.traffic.get('fetching'),
    serviceProviders: state.traffic.get('serviceProviders'),
    filters: state.filters.get('filters')
  }
}

function mapDispatchToProps(dispatch) {
  return {
    trafficActions: bindActionCreators(trafficActionCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticsTabServiceProviders);
