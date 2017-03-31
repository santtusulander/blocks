import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FormattedMessage } from 'react-intl'

import AnalysisURLReport from '../../../components/analysis/url-report.jsx'
import LoadingSpinner from '../../../components/loading-spinner/loading-spinner'

import * as filterActionCreators from '../../../redux/modules/filters'
import * as reportsActionCreators from '../../../redux/modules/reports'
import {buildAnalyticsOpts, changedParamsFiltersQS} from '../../../util/helpers.js'

class AnalyticsTabUrlReport extends React.Component {
  componentDidMount() {
    const {params, filters, activeHostConfiguredName} = this.props

    // activeHostConfiguredName can be null when this container is mounted.
    // In that case, the fetching actually triggers from componentWillReceiveProps.
    // We immediately call startFetching, even though we may not trigger a fetch
    // from componentDidMount. This ensures the loading spinner appears as soon
    // as this container mounts.
    this.props.reportsActions.startFetching()
    activeHostConfiguredName && this.fetchData(
      params,
      filters,
      activeHostConfiguredName
    )
  }

  componentWillReceiveProps(nextProps) {
    if (changedParamsFiltersQS(this.props, nextProps) ||
      this.props.activeHostConfiguredName !== nextProps.activeHostConfiguredName ||
      this.props.filters.get('statusCodes') !== nextProps.filters.get('statusCodes') ||
      this.props.filters.get('serviceTypes') !== nextProps.filters.get('serviceTypes')) {
      this.fetchData(
        nextProps.params,
        nextProps.filters,
        nextProps.activeHostConfiguredName
      )
    }
  }

  componentWillUnmount() {
    this.props.filterActions.resetStatusFilters()
  }

  fetchData(params, filters, hostConfiguredName) {
    if (params.property && hostConfiguredName) {
      params = Object.assign({}, params, {
        property: hostConfiguredName
      })
    }
    const fetchOpts = buildAnalyticsOpts(params, filters, location)
    const {startFetching, finishFetching, fetchURLMetrics} = this.props.reportsActions
    startFetching();
    return fetchURLMetrics(fetchOpts).then(finishFetching, finishFetching)
  }

  render() {
    if (this.props.fetching) {
      return <LoadingSpinner />
    }

    if (this.props.urlMetrics.count() === 0) {
      return <FormattedMessage id="portal.analytics.urlList.noData.text" />
    }

    return (
      <AnalysisURLReport fetching={this.props.fetching}
        urlMetrics={this.props.urlMetrics}/>
    )
  }
}

AnalyticsTabUrlReport.displayName = "AnalyticsTabUrlReport"
AnalyticsTabUrlReport.propTypes = {
  activeHostConfiguredName: React.PropTypes.string,
  fetching: React.PropTypes.bool,
  filterActions: React.PropTypes.object,
  filters: React.PropTypes.instanceOf(Immutable.Map),
  params: React.PropTypes.object,
  reportsActions: React.PropTypes.object,
  urlMetrics: React.PropTypes.instanceOf(Immutable.List)
}

AnalyticsTabUrlReport.defaultProps = {
  filters: Immutable.Map(),
  urlMetrics: Immutable.List()
}

function mapStateToProps(state) {
  return {
    activeHostConfiguredName: state.host.get('activeHostConfiguredName'),
    fetching: state.reports.get('fetching'),
    filters: state.filters.get('filters'),
    urlMetrics: state.reports.get('urlMetrics')

  }
}

function mapDispatchToProps(dispatch) {
  return {
    filterActions: bindActionCreators(filterActionCreators, dispatch),
    reportsActions: bindActionCreators(reportsActionCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticsTabUrlReport);
