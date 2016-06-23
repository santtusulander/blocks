import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import AnalysisVisitors from '../../../components/analysis/visitors.jsx'
import * as visitorsActionCreators from '../../../redux/modules/visitors'

import { getDateRange } from '../../../redux/util.js'

class AnalyticsTabVisitors extends React.Component {
  constructor(props){
    super(props)
  }

  componentDidMount(){

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

    this.props.visitorsActions.fetchByBrowser(fetchOpts)
    this.props.visitorsActions.fetchByCountry(fetchOpts)
    this.props.visitorsActions.fetchByTime(fetchOpts)
    this.props.visitorsActions.fetchByOS(fetchOpts)

  }

  render() {
    return (
      <div>
        <AnalysisVisitors
          byBrowser={this.props.byBrowser.get('browsers')}
          byCountry={this.props.byCountry.get('countries')}
          byOS={this.props.byOS.get('os')}
          byTime={this.props.byTime}
          fetching={this.props.fetching}
          serviceTypes={Immutable.fromJS(['http', 'https']) /* TODO: should this be this.props.filters.serviceTypes ? but can we filter visitors by serviceType ?*/}
        />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    metrics: Immutable.List(),
    byBrowser: state.visitors.get('byBrowser'),
    byCountry: state.visitors.get('byCountry'),
    byOS: state.visitors.get('byOS'),
    byTime: state.visitors.get('byTime'),
    fetching: state.visitors.get('fetching'),
    filters: state.filters.get('filters')
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    visitorsActions: bindActionCreators(visitorsActionCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticsTabVisitors);
