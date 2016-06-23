import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import AnalysisURLReport from '../../../components/analysis/url-report.jsx'

import * as reportsActionCreators from '../../../redux/modules/reports'
import { getDateRange } from '../../../redux/util.js'

class AnalyticsTabUrlReport extends React.Component {
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

    this.props.reportsActions.fetchURLMetrics(fetchOpts)

  }

  render(){
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

AnalyticsTabUrlReport.propTypes = {
  fetching: React.PropTypes.bool,
  fileErrorSummary: React.PropTypes.instanceOf(Immutable.Map),
  fileErrorURLs: React.PropTypes.instanceOf(Immutable.List),
  filters: React.PropTypes.instanceOf(Immutable.Map),
  location: React.PropTypes.object,
  params: React.PropTypes.object,
  reportsActions: React.PropTypes.object
}

AnalyticsTabUrlReport.defaultProps = {
  fileErrorSummary: Immutable.Map(),
  fileErrorURLs: Immutable.List(),
  filters: Immutable.Map()
}

function mapStateToProps(state) {
  return {
    fetching: state.reports.get('fetching'),
    filters: state.filters.get('filters'),
    fileErrorSummary: state.reports.get('fileErrorSummary'),
    fileErrorURLs: state.reports.get('fileErrorURLs')

  }
}

function mapDispatchToProps(dispatch) {
  return {
    reportsActions: bindActionCreators(reportsActionCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticsTabUrlReport);
