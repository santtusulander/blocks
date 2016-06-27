import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import AnalysisServiceProviders from '../../../components/analysis/service-providers.jsx'

import * as trafficActionCreators from '../../../redux/modules/traffic'
import { getDateRange } from '../../../redux/util.js'

class AnalyticsTabServiceProviders extends React.Component {
  constructor(props){
    super(props)
  }

  componentDidMount() {
    this.fetchData(this.props.params, this.props.filters, this.props.location)
  }

  componentWillReceiveProps(nextProps){

    const params = JSON.stringify(this.props.params)
    const prevParams = JSON.stringify(nextProps.params)
    const filters = JSON.stringify(this.props.filters)
    const prevFilters = JSON.stringify(nextProps.filters)

    if (!( params === prevParams &&
           filters === prevFilters &&
           nextProps.location.search === this.props.location.search) ) {
      this.fetchData(nextProps.params, nextProps.filters, nextProps.location)
    }
  }

  fetchData(params, filters, location){
    const {startDate, endDate} = getDateRange( filters )

    const fetchOpts = {
      account: params.account,
      brand: params.brand,
      group: params.group,
      property: location.query.property,

      startDate: startDate.format('X'),
      endDate: endDate.format('X')
    }

    const onOffOpts = Object.assign({}, fetchOpts)
    onOffOpts.granularity = 'day'

    const onOffTodayOpts = Object.assign({}, onOffOpts)
    onOffTodayOpts.startDate = moment().utc().startOf('day').format('X'),
    onOffTodayOpts.endDate = moment().utc().format('X')

    this.props.trafficActions.fetchServiceProviders(onOffOpts)
    /*this.props.trafficActions.fetchStorage()
    */
  }

  export(exporters) {
    exporters.serviceProviders(this.props.serviceProviders.get('detail'))
  }

  render(){
    return (
      <div>
        <AnalysisServiceProviders
          fetching={this.props.fetching}
          stats={this.props.serviceProviders}
        />
      </div>
    )
  }
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

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(AnalyticsTabServiceProviders);
