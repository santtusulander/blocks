import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import AnalysisFileError from '../../../components/analysis/file-error'

import * as reportsActionCreators from '../../../redux/modules/reports'

class AnalyticsTabFileError extends React.Component {
  constructor(props){
    super(props)
  }

  componentDidMount() {
    console.log("AnalyticsTabFileError - componentDidMount()")

    this.fetchData(this.props.params, this.props.filters)
  }

  componentWillReceiveProps(nextProps){

    console.log('AnalyticsTabFileError() - componentWillReceiveProps()')

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

    /*const onOffOpts = Object.assign({}, fetchOpts)
    onOffOpts.granularity = 'day'

    const onOffTodayOpts = Object.assign({}, onOffOpts)
    onOffTodayOpts.startDate = moment().utc().startOf('day').format('X'),
    onOffTodayOpts.endDate = moment().utc().format('X')
    */
    //this.props.trafficActions.fetchOnOffNet(onOffOpts)
    //this.props.trafficActions.fetchOnOffNetToday(onOffTodayOpts)

    /*
    this.props.trafficActions.fetchServiceProviders(onOffOpts)
    this.props.trafficActions.fetchStorage()

     */

    this.props.reportsActions.fetchFileErrorsMetrics(fetchOpts);

  }

  render(){
    return (
      <div>
        <AnalysisFileError fetching={this.props.fetching}
          summary={this.props.fileErrorSummary}
          statusCodes={Immutable.List()}
          serviceTypes={Immutable.fromJS(['http', 'https'])}
          urls={this.props.fileErrorURLs}/>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    fetching: state.reports.get('fetching'),
    filters: state.filters.get('filters'),
    fileErrorSummary: state.reports.get('fileErrorSummary'),
    fileErrorURLs: state.reports.get('fileErrorURLs'),
    urlMetrics: state.reports.get('urlMetrics')

  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    reportsActions: bindActionCreators(reportsActionCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticsTabFileError);
