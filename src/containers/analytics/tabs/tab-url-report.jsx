import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import AnalysisURLReport from '../../../components/analysis/url-report.jsx'

import * as reportsActionCreators from '../../../redux/modules/reports'
import {buildAnalyticsOpts, changedParamsFiltersQS} from '../../../util/helpers.js'

class AnalyticsTabUrlReport extends React.Component {
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
    this.props.reportsActions.fetchURLMetrics(fetchOpts)
  }

  export(exporters) {
    exporters.urlReport(this.props.urlMetrics)
  }

  render(){
    return (
      <AnalysisURLReport fetching={this.props.fetching}
        summary={this.props.fileErrorSummary}
        statusCodes={Immutable.List()}
        serviceTypes={Immutable.fromJS(['http', 'https'])}
        urls={this.props.fileErrorURLs}/>
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

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(AnalyticsTabUrlReport);
