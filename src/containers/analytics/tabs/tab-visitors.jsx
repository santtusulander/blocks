import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import AnalysisVisitors from '../../../components/analysis/visitors.jsx'
import * as visitorsActionCreators from '../../../redux/modules/visitors'
import {buildAnalyticsOpts, changedParamsFiltersQS} from '../../../util/helpers.js'

class AnalyticsTabVisitors extends React.Component {
  componentDidMount(){
    this.fetchData(this.props.params, this.props.filters, this.props.location)
  }

  componentWillReceiveProps(nextProps){
    if(changedParamsFiltersQS(this.props, nextProps)) {
      this.fetchData(nextProps.params, nextProps.filters, nextProps.location)
    }
  }

  fetchData(params, filters, location){
    const fetchOpts = buildAnalyticsOpts(params, filters, location)
    this.props.visitorsActions.fetchByBrowser(fetchOpts)
    this.props.visitorsActions.fetchByCountry(fetchOpts)
    this.props.visitorsActions.fetchByTime(fetchOpts)
    this.props.visitorsActions.fetchByOS(fetchOpts)
  }

  export(exporters) {
    exporters.visitors(this.props.byTime)
  }

  render() {
    return (
      <AnalysisVisitors
        byBrowser={this.props.byBrowser.get('browsers')}
        byCountry={this.props.byCountry.get('countries')}
        byOS={this.props.byOS.get('os')}
        byTime={this.props.byTime}
        fetching={this.props.fetching}
        serviceTypes={Immutable.fromJS(['http', 'https'])
        /* TODO: should this be this.props.filters.serviceTypes ? but can we
        filter visitors by serviceType ?*/}
      />
    )
  }
}

AnalyticsTabVisitors.propTypes = {
  byBrowser: React.PropTypes.instanceOf(Immutable.Map),
  byCountry: React.PropTypes.instanceOf(Immutable.Map),
  byOS: React.PropTypes.instanceOf(Immutable.Map),
  byTime: React.PropTypes.instanceOf(Immutable.List),
  fetching: React.PropTypes.bool,
  filters: React.PropTypes.instanceOf(Immutable.Map),
  location: React.PropTypes.object,
  params: React.PropTypes.object,
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
    metrics: Immutable.List(),
    byBrowser: state.visitors.get('byBrowser'),
    byCountry: state.visitors.get('byCountry'),
    byOS: state.visitors.get('byOS'),
    byTime: state.visitors.get('byTime'),
    fetching: state.visitors.get('fetching'),
    filters: state.filters.get('filters')
  }
}

function mapDispatchToProps(dispatch) {
  return {
    visitorsActions: bindActionCreators(visitorsActionCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(AnalyticsTabVisitors);
