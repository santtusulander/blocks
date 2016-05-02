import React from 'react'
import numeral from 'numeral'
import Immutable from 'immutable'

import AnalysisHorizontalBar from './horizontal-bar'
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
    const maxBytes = Math.max(...this.props.urls.toJS().map(url => url.bytes))
    const maxReqs = Math.max(...this.props.urls.toJS().map(url => url.requests))
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
        <table className="table table-striped table-analysis">
          <thead>
            <tr>
              <th>URL</th>
              <th width="20%">Bytes</th>
              <th width="20%">Requests</th>
            </tr>
          </thead>
          <tbody>
            {this.props.urls.map((url, i) => {
              const bytesOfMax = (url.get('bytes') / maxBytes) * 100
              const reqsOfMax = (url.get('requests') / maxReqs) * 100
              return (
                <tr key={i}>
                  <td>{url.get('url')}</td>
                  <td>
                    {formatBytes(url.get('bytes'))}
                    <div className="table-percentage-line">
                      <div className="line" style={{width: `${bytesOfMax}%`}} />
                    </div>
                  </td>
                  <td>
                    {numeral(url.get('requests')).format('0,0')}
                    <div className="table-percentage-line">
                      <div className="line" style={{width: `${reqsOfMax}%`}} />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
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
