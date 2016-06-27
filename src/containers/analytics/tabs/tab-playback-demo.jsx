import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'

import AnalysisPlaybackDemo from '../../../components/analysis/playback-demo.jsx'

class AnalyticsTabPlaybackDemo extends React.Component {

  export() {
    // export analytics
  }

  render() {
    return <AnalysisPlaybackDemo activeVideo={this.props.filters.get('video')}/>
  }
}

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

export default connect(mapStateToProps, null, null, { withRef: true })(AnalyticsTabPlaybackDemo);
