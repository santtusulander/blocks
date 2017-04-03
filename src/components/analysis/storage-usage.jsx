import React from 'react'
import Immutable from 'immutable'

import AnalysisStackedByTime from './stacked-by-time'
import {FormattedMessage} from 'react-intl'

class AnalysisStorageUsageReport extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chartWidth: 100
    }

    this.measureContainers = this.measureContainers.bind(this)

    this.measureContainersTimeout = null
  }
  componentDidMount() {
    this.measureContainers()
    // TODO: remove this timeout as part of UDNP-1426
    this.measureContainersTimeout = setTimeout(() => {
      this.measureContainers()
    }, 500)
    window.addEventListener('resize', this.measureContainers)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.measureContainers)
    clearTimeout(this.measureContainersTimeout)
  }
  measureContainers() {
    this.setState({
      chartWidth: this.refs.chartHolder && this.refs.chartHolder.clientWidth
    })
  }
  render() {
    const stats = this.props.storageStats
    return (
      <div className="analysis-storage-usage">
        <h3>Storage Volume Reporting</h3>
        <div ref="chartHolder">
          {this.props.fetching ?
            <div><FormattedMessage id="portal.loading.text"/></div> :
            <AnalysisStackedByTime padding={40}
              dataSets={[stats.toJS()]}
              width={this.state.chartWidth} height={this.state.chartWidth / 3}/>}
        </div>
      </div>
    )
  }
}

AnalysisStorageUsageReport.displayName = 'AnalysisStorageUsageReport'
AnalysisStorageUsageReport.propTypes = {
  fetching: React.PropTypes.bool,
  storageStats: React.PropTypes.instanceOf(Immutable.List)
}

AnalysisStorageUsageReport.defaultProps = {
  storageStats: Immutable.List()
}

module.exports = AnalysisStorageUsageReport
