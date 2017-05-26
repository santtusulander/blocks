import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FormattedMessage } from 'react-intl'

import AnalysisFileError from '../../../components/analysis/file-error'
import LoadingSpinner from '../../../components/loading-spinner/loading-spinner'

import { fetchFileErrorMetrics } from '../../../redux/modules/entities/file-error-report/actions'
import { getFileErrorURLs, getFileErrorSummary } from '../../../redux/modules/entities/file-error-report/selectors'

import { getFetchingByTag } from '../../../redux/modules/fetching/selectors'

import * as filterActionCreators from '../../../redux/modules/filters'
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

  componentWillReceiveProps(nextProps) {
    if (changedParamsFiltersQS(this.props, nextProps) ||
        this.props.activeHostConfiguredName !== nextProps.activeHostConfiguredName ||
        this.props.filters.get('serviceTypes') !== nextProps.filters.get('serviceTypes') ||
        this.props.filters.get('errorCodes') !== nextProps.filters.get('errorCodes')
    ) {
      this.fetchData(
        nextProps.params,
        nextProps.filters,
        nextProps.location,
        nextProps.activeHostConfiguredName
      )
    }
  }

  componentWillUnmount() {
    this.props.filterActions.resetErrorFilters()
  }

  fetchData(params, filters, location, hostConfiguredName) {
    if (params.property && hostConfiguredName) {
      params = Object.assign({}, params, {
        property: hostConfiguredName
      })
    }
    const fetchOpts = buildAnalyticsOpts(params, filters, location)
    this.props.fetchFileErrorsMetrics(fetchOpts)
  }

  render() {
    if (this.props.fetching) {
      return <LoadingSpinner />
    }
    if (this.props.fileErrorSummary.count() === 0 || this.props.fileErrorURLs.count() === 0) {
      return (
      <FormattedMessage id="portal.analytics.fileErrors.noData.text" />
      )
    }

    return (
      <AnalysisFileError
        summary={this.props.fileErrorSummary}
        statusCodes={this.props.filters.get('errorCodes')}
        serviceTypes={this.props.filters.get('serviceTypes')}
        urls={this.props.fileErrorURLs}/>
    )
  }
}

AnalyticsTabFileError.displayName = "AnalyticsTabFileError"
AnalyticsTabFileError.propTypes = {
  activeHostConfiguredName: React.PropTypes.string,
  fetchFileErrorsMetrics: React.PropTypes.func,
  fetching: React.PropTypes.bool,
  fileErrorSummary: React.PropTypes.instanceOf(Immutable.Map),
  fileErrorURLs: React.PropTypes.instanceOf(Immutable.List),
  filterActions: React.PropTypes.object,
  filters: React.PropTypes.instanceOf(Immutable.Map),
  location: React.PropTypes.object,
  params: React.PropTypes.object
}

AnalyticsTabFileError.defaultProps = {
  fileErrorSummary: Immutable.Map(),
  fileErrorURLs: Immutable.List(),
  filters: Immutable.Map()
}

function mapStateToProps(state) {
  return {
    activeHostConfiguredName: state.host.get('activeHostConfiguredName'),
    filters: state.filters.get('filters'),
    fetching: getFetchingByTag(state, 'fileErrorMetrics'),
    fileErrorSummary: getFileErrorSummary(state),
    fileErrorURLs: getFileErrorURLs(state),
    serviceTypes: state.ui.get('analysisServiceTypes'),
    urlMetrics: state.reports.get('urlMetrics')

  }
}

function mapDispatchToProps(dispatch) {
  return {
    filterActions: bindActionCreators(filterActionCreators, dispatch),
    fetchFileErrorsMetrics: (fetchOpts) => dispatch(fetchFileErrorMetrics(fetchOpts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticsTabFileError);
