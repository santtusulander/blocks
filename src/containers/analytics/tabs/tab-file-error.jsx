import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FormattedMessage } from 'react-intl'

import AnalysisFileError from '../../../components/analysis/file-error'

import * as reportsActionCreators from '../../../redux/modules/reports'
import {buildAnalyticsOpts, changedParamsFiltersQS} from '../../../util/helpers.js'

class AnalyticsTabFileError extends React.Component {
  componentDidMount() {
    this.fetchData(
      this.props.params,
      this.props.filters,
      this.props.location,
      this.props.activeHostConfiguredName
    )
  }

  componentWillReceiveProps(nextProps){
    if( this.props.filters !== nextProps.filters ||
      changedParamsFiltersQS(this.props, nextProps) ||
      this.props.activeHostConfiguredName !== nextProps.activeHostConfiguredName) {
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
    this.props.reportsActions.fetchFileErrorsMetrics(fetchOpts)
  }

  render(){
    if ( this.props.fileErrorSummary.count() === 0 || this.props.fileErrorURLs.count() === 0 ) return (
      <FormattedMessage id="portal.analytics.fileErrors.noData.text" />
    )

    return (
      <AnalysisFileError fetching={this.props.fetching}
        summary={this.props.fileErrorSummary}
        statusCodes={this.props.filters.get('statusCodes')}
        serviceTypes={this.props.filters.get('serviceTypes')}
        urls={this.props.fileErrorURLs}/>
    )
  }
}

AnalyticsTabFileError.propTypes = {
  activeHostConfiguredName: React.PropTypes.string,
  fetching: React.PropTypes.bool,
  fileErrorSummary: React.PropTypes.instanceOf(Immutable.Map),
  fileErrorURLs: React.PropTypes.instanceOf(Immutable.List),
  filters: React.PropTypes.instanceOf(Immutable.Map),
  location: React.PropTypes.object,
  params: React.PropTypes.object,
  reportsActions: React.PropTypes.object
}

AnalyticsTabFileError.defaultProps = {
  fileErrorSummary: Immutable.Map(),
  fileErrorURLs: Immutable.List(),
  filters: Immutable.Map()
}

function mapStateToProps(state) {
  return {
    activeHostConfiguredName: state.host.get('activeHostConfiguredName'),
    fetching: state.reports.get('fetching'),
    filters: state.filters.get('filters'),
    fileErrorSummary: state.reports.get('fileErrorSummary'),
    fileErrorURLs: state.reports.get('fileErrorURLs'),
    serviceTypes: state.ui.get('analysisServiceTypes'),
    urlMetrics: state.reports.get('urlMetrics')

  }
}

function mapDispatchToProps(dispatch) {
  return {
    reportsActions: bindActionCreators(reportsActionCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticsTabFileError);
