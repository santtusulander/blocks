import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import AnalysisPlaybackDemo from '../../../components/analysis/playback-demo.jsx'
import * as visitorsActionCreators from '../../../redux/modules/visitors'

class AnalyticsTabPlaybackDemo extends React.Component {
  constructor(props){
    super(props)
  }

  /*componentDidMount(){
    console.log("AnalyticsTabVisitors - componentDidMount()")
    console.log(this.props.params);

    this.fetchData(this.props.params, this.props.filters)

  }

  componentWillReceiveProps(nextProps){

    console.log('TabVisitors() - componentWillReceiveProps()')

    const params = JSON.stringify(this.props.params)
    const prevParams = JSON.stringify(nextProps.params)
    const filters = JSON.stringify(this.props.filters)
    const prevFilters = JSON.stringify(nextProps.filters)

    console.log('props', params, prevParams, filters,prevFilters)

    if ( !( params === prevParams && filters === prevFilters) ) this.fetchData(nextProps.params, nextProps.filters)

  }

  fetchData(params, filters){
    const endDate = filters.get('dateRange').endDate || moment().utc().endOf('day')
    const startDate = filters.get('dateRange').startDate || moment().utc().startOf('month')

    const fetchOpts = {
      account: params.account,
      brand: params.brand,
      group: params.group,
      host: params.property,

      startDate: startDate.format('X'),
      endDate: endDate.format('X')
    }

    this.props.visitorsActions.fetchByBrowser(fetchOpts)
    this.props.visitorsActions.fetchByCountry(fetchOpts)
    this.props.visitorsActions.fetchByTime(fetchOpts)
    this.props.visitorsActions.fetchByOS(fetchOpts)

  }*/

  render() {
    return (
      <div>
        <AnalysisPlaybackDemo
          activeVideo={'/elephant/169ar/elephant_master.m3u8'}
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

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticsTabPlaybackDemo);

