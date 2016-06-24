import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import AnalysisURLReport from '../../../components/analysis/url-report.jsx'

import * as reportsActionCreators from '../../../redux/modules/reports'
import { getDateRange } from '../../../redux/util.js'

class AnalyticsTabUrlReport extends React.Component {
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

    this.props.reportsActions.fetchURLMetrics(fetchOpts)

  }

  render(){
    this.props.setDataToExport(this.props.urlMetrics)
    return (
      <div>
        <AnalysisURLReport fetching={this.props.fetching}
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

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticsTabUrlReport);
