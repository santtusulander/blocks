import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'

import AnalysisPlaybackDemo from '../../../components/analysis/playback-demo.jsx'

const AnalyticsTabPlaybackDemo = ({ filters }) => {

  return (<AnalysisPlaybackDemo activeVideo={filters.get('video')}/>)
}

AnalyticsTabPlaybackDemo.displayName = "AnalyticsTabPlaybackDemo"
AnalyticsTabPlaybackDemo.propTypes = {
  filters: React.PropTypes.instanceOf(Immutable.Map)
}

AnalyticsTabPlaybackDemo.defaultProps = {
  filters: Immutable.Map()
}

function mapStateToProps(state) {
  return {
    filters: state.filters.get('filters')
  }
}

export default connect(mapStateToProps)(AnalyticsTabPlaybackDemo);
