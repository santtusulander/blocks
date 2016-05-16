import React from 'react'
import Immutable from 'immutable'

import AnalysisHorizontalBar from './horizontal-bar'
import AnalysisURLList from './url-list'
import {formatBytes} from '../../util/helpers'

class AnalysisURLReport extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chartWidth: 100
    }

    this.measureContainers = this.measureContainers.bind(this)
  }
  componentDidMount() {
    this.measureContainers()
    setTimeout(() => {this.measureContainers()}, 500)
    window.addEventListener('resize', this.measureContainers)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.measureContainers)
  }
  measureContainers() {
    this.setState({
      chartWidth: this.refs.chartHolder.clientWidth
    })
  }
  render() {
    const chartHeight = this.props.urls.size * 40 + 40
    return (
      <div className="analysis-url-report">
        <div ref="chartHolder">
          <AnalysisHorizontalBar
            data={this.props.urls.toJS()}
            dataKey="bytes"
            height={chartHeight}
            labelKey="url"
            width={this.state.chartWidth}
            padding={20}
            xAxisCustomFormat={formatBytes}/>
        </div>
        <h3>HEADER</h3>
        <AnalysisURLList
          urls={this.props.urls}
          labelFormat={url => url.get('url')}/>
      </div>
    )
  }
}

AnalysisURLReport.displayName = 'AnalysisURLReport'
AnalysisURLReport.propTypes = {
  urls: React.PropTypes.instanceOf(Immutable.List)
}
AnalysisURLReport.defaultProps = {
  urls: Immutable.List()
}

module.exports = AnalysisURLReport
