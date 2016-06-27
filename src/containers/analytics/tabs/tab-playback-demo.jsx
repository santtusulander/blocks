import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import AnalysisPlaybackDemo from '../../../components/analysis/playback-demo.jsx'
import * as visitorsActionCreators from '../../../redux/modules/visitors'

class AnalyticsTabPlaybackDemo extends React.Component {

  export() {
    // export analytics
  }

  render() {
    return (
      <div>
        <AnalysisPlaybackDemo
          activeVideo={this.props.filters.get('video')}
        />
      </div>
    )
  }
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

function mapDispatchToProps(dispatch, ownProps) {
  return {
    visitorsActions: bindActionCreators(visitorsActionCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(AnalyticsTabPlaybackDemo);
