import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import AnalysisServiceProviders from '../../../components/analysis/contribution.jsx'

import * as trafficActionCreators from '../../../redux/modules/traffic'
import {buildAnalyticsOpts, changedParamsFiltersQS} from '../../../util/helpers.js'

class AnalyticsTabContribution extends React.Component {
  componentDidMount() {
    this.fetchData(
      this.props.params,
      this.props.filters,
      this.props.location,
      this.props.activeHostConfiguredName
    )
  }

  componentWillReceiveProps(nextProps){
    if (changedParamsFiltersQS(this.props, nextProps) ||
      this.props.activeHostConfiguredName !== nextProps.activeHostConfiguredName ||
      this.props.filters.get('onOffNet') !== nextProps.filters.get('onOffNet') ||
      this.props.filters.get('serviceTypes') !== nextProps.filters.get('serviceTypes')
    ) {
      this.fetchData(
        nextProps.params,
        nextProps.filters,
        nextProps.location,
        nextProps.activeHostConfiguredName
      )
    }
  }

  fetchData(params, filters, location, hostConfiguredName){
    if(params.property && hostConfiguredName) {
      params = Object.assign({}, params, {
        property: hostConfiguredName
      })
    }
    const fetchOpts = buildAnalyticsOpts(params, filters, location)

    const queryOpts = Object.assign({}, fetchOpts)
    queryOpts.granularity = 'day'

    this.props.trafficActions.startFetching()
    this.props.trafficActions.fetchServiceProviders(queryOpts)
      .then(this.props.trafficActions.finishFetching, this.props.trafficActions.finishFetching)
  }

  render(){
    return (
      <AnalysisServiceProviders
        fetching={this.props.fetching}
        stats={this.props.serviceProviders}
        serviceProviders={this.props.allServiceProviders}
        serviceProviderFilter={this.props.filters.get('serviceProviders')}
        onOffFilter={this.props.filters.get('onOffNet')}
        serviceTypes={this.props.filters.get('serviceTypes')}
      />
    )
  }
}

AnalyticsTabContribution.propTypes = {
  activeHostConfiguredName: React.PropTypes.string,
  allServiceProviders: React.PropTypes.instanceOf(Immutable.List),
  fetching: React.PropTypes.bool,
  filterOptions: React.PropTypes.instanceOf(Immutable.Map),
  filters: React.PropTypes.instanceOf(Immutable.Map),
  location: React.PropTypes.object,
  params: React.PropTypes.object,
  serviceProviders: React.PropTypes.instanceOf(Immutable.List),
  trafficActions: React.PropTypes.object
}

AnalyticsTabContribution.defaultProps = {
  filters: Immutable.Map(),
  serviceProviders: Immutable.Map()
}

function mapStateToProps(state) {
  return {
    activeHostConfiguredName: state.host.get('activeHostConfiguredName'),
    fetching: state.traffic.get('fetching'),
    serviceProviders: state.traffic.get('serviceProviders'),
    allServiceProviders: state.filters.get('filterOptions').get('serviceProviders'),
    filters: state.filters.get('filters')
  }
}

function mapDispatchToProps(dispatch) {
  return {
    trafficActions: bindActionCreators(trafficActionCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticsTabContribution);
