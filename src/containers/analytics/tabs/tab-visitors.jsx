import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import AnalysisVisitors from '../../../components/analysis/visitors.jsx'
import * as visitorsActionCreators from '../../../redux/modules/visitors'
import * as mapboxActionCreators from '../../../redux/modules/mapbox'
import { changedParamsFiltersQS } from '../../../util/helpers.js'
import { buildOpts } from '../../../util/mapbox-helpers.js'

class AnalyticsTabVisitors extends React.Component {
  componentDidMount(){
    this.fetchData(
      this.props.params,
      this.props.filters,
      this.props.location,
      this.props.activeHostConfiguredName
    )
  }

  componentWillReceiveProps(nextProps){
    if(changedParamsFiltersQS(this.props, nextProps) ||
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

    const { startDate, endDate } = filters.get('customDateRange').toJS()
    const { fetchOpts } = buildOpts({ params, filters, location, coordinates: this.props.mapBounds })
    const duration = endDate.diff(startDate, 'days')
    const aggregateGranularity = duration ? 'month' : 'day'

    this.props.visitorsActions.fetchByBrowser({...fetchOpts, aggregate_granularity: aggregateGranularity})
    this.props.visitorsActions.fetchByCountry({...fetchOpts, aggregate_granularity: aggregateGranularity})
    this.props.visitorsActions.fetchByTime(fetchOpts)
    this.props.visitorsActions.fetchByOS({...fetchOpts, aggregate_granularity: aggregateGranularity})
  }

  render() {
    return (
      <AnalysisVisitors
        byBrowser={this.props.byBrowser.get('browsers')}
        byCountry={this.props.byCountry.get('countries')}
        byCity={this.props.byCity}
        byOS={this.props.byOS.get('os')}
        byTime={this.props.byTime}
        fetching={this.props.fetching}
        mapBounds={this.props.mapBounds}
        theme={this.props.theme}
        mapboxActions={this.props.mapboxActions}
      />
    )
  }
}

AnalyticsTabVisitors.displayName = "AnalyticsTabVisitors"
AnalyticsTabVisitors.propTypes = {
  activeHostConfiguredName: React.PropTypes.string,
  byBrowser: React.PropTypes.instanceOf(Immutable.Map),
  byCity: React.PropTypes.instanceOf(Immutable.List),
  byCountry: React.PropTypes.instanceOf(Immutable.Map),
  byOS: React.PropTypes.instanceOf(Immutable.Map),
  byTime: React.PropTypes.instanceOf(Immutable.List),
  fetching: React.PropTypes.bool,
  filters: React.PropTypes.instanceOf(Immutable.Map),
  location: React.PropTypes.object,
  mapBounds: React.PropTypes.object,
  mapZoom: React.PropTypes.number,
  mapboxActions: React.PropTypes.object,
  params: React.PropTypes.object,
  theme: React.PropTypes.string,
  visitorsActions: React.PropTypes.object
}

AnalyticsTabVisitors.defaultProps = {
  byBrowser: Immutable.Map(),
  byCountry: Immutable.Map(),
  byOS: Immutable.Map(),
  byTime: Immutable.List(),
  filters: Immutable.Map()
}

function mapStateToProps(state) {
  return {
    activeHostConfiguredName: state.host.get('activeHostConfiguredName'),
    byBrowser: state.visitors.get('byBrowser'),
    byCountry: state.visitors.get('byCountry'),
    byCity: state.visitors.get('byCity'),
    byOS: state.visitors.get('byOS'),
    byTime: state.visitors.get('byTime'),
    fetching: state.visitors.get('fetching'),
    filters: state.filters.get('filters'),
    mapBounds: state.mapbox.get('mapBounds'),
    mapZoom: state.mapbox.get('mapZoom'),
    theme: state.ui.get('theme')
  }
}

function mapDispatchToProps(dispatch) {
  return {
    visitorsActions: bindActionCreators(visitorsActionCreators, dispatch),
    mapboxActions: bindActionCreators(mapboxActionCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticsTabVisitors);
