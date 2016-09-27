import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FormattedMessage } from 'react-intl'

import AnalysisURLReport from '../../../components/analysis/url-report.jsx'

import * as reportsActionCreators from '../../../redux/modules/reports'
import {buildAnalyticsOpts, changedParamsFiltersQS} from '../../../util/helpers.js'

class AnalyticsTabUrlReport extends React.Component {
  componentDidMount() {
    this.fetchData(
      this.props.params,
      this.props.filters,
      this.props.activeHostConfiguredName
    )
  }

  componentWillReceiveProps(nextProps){
    if(changedParamsFiltersQS(this.props, nextProps) ||
      this.props.activeHostConfiguredName !== nextProps.activeHostConfiguredName ||
      this.props.filters.get('serviceTypes') !== nextProps.filters.get('serviceTypes')) {
      this.fetchData(
        nextProps.params,
        nextProps.filters,
        nextProps.activeHostConfiguredName
      )
    }
  }

  fetchData(params, filters, hostConfiguredName){
    if(params.property && hostConfiguredName) {
      params = Object.assign({}, params, {
        property: hostConfiguredName
      })
    }
    const fetchOpts = buildAnalyticsOpts(params, filters)
    this.props.reportsActions.fetchURLMetrics(fetchOpts)
  }

  render(){
    if (this.props.urlMetrics.count() === 0) {
      return <FormattedMessage id="portal.analytics.urlList.noData.text" />
    }

    return (
      <AnalysisURLReport fetching={this.props.fetching}
        statusCodes={this.props.filters.get('statusCodes')}
        serviceTypes={this.props.filters.get('serviceTypes')}
        urlMetrics={this.props.urlMetrics}/>
    )
  }
}

AnalyticsTabUrlReport.propTypes = {
  activeHostConfiguredName: React.PropTypes.string,
  fetching: React.PropTypes.bool,
  filters: React.PropTypes.instanceOf(Immutable.Map),
  location: React.PropTypes.object,
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
    reportsActions: bindActionCreators(reportsActionCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticsTabUrlReport);
