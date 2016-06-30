import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import AnalysisURLReport from '../../../components/analysis/url-report.jsx'

import * as reportsActionCreators from '../../../redux/modules/reports'
import {buildAnalyticsOpts, changedParamsFiltersQS} from '../../../util/helpers.js'

class AnalyticsTabUrlReport extends React.Component {
  componentDidMount() {
    this.fetchData(this.props.params, this.props.filters)
  }

  componentWillReceiveProps(nextProps){
    if(changedParamsFiltersQS(this.props, nextProps)) {
      this.fetchData(nextProps.params, nextProps.filters)
    }
  }

  fetchData(params, filters){
    const fetchOpts = buildAnalyticsOpts(params, filters)
    this.props.reportsActions.fetchFileErrorsMetrics(fetchOpts)
    this.props.reportsActions.fetchURLMetrics(fetchOpts)
  }

  export(exporters) {
    exporters.urlReport(this.props.urlMetrics)
  }

  render(){
    if ( this.props.fileErrorSummary.count() === 0 || this.props.fileErrorURLs.count() === 0 ) return (
      <p>No error data found.</p>
    )

    return (
      <AnalysisURLReport fetching={this.props.fetching}
        summary={this.props.fileErrorSummary}
        statusCodes={this.props.filters.get('statusCodes')}
        serviceTypes={this.props.filters.get('serviceTypes')}
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
  reportsActions: React.PropTypes.object,
  urlMetrics: React.PropTypes.array
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
    urlMetrics: state.reports.get('urlMetrics'),
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
