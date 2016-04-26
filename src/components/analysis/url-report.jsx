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
    const chartHeight = this.props.urls.size * 40 + 40;
    return (
      <div className="analysis-url-report">
        <div ref="chartHolder">
          <AnalysisHorizontalBar
            data={this.props.urls.toJS()}
            dataKey="bytes"
            height={chartHeight}
            width={this.state.chartWidth}
            padding={20}
            xAxisCustomFormat={formatBytes}/>
        </div>
        <h3>HEADER</h3>
        <table className="table table-striped table-analysis">
          <thead>
            <tr>
              <th>URL</th>
              <th width="15%">Bytes</th>
              <th width="15%">Requests</th>
              <th width="15%">Seconds</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>www.domain.com/assets/videos/video.mp4</td>
              <td>
                {formatBytes(123544786367)}
                <div className="table-percentage-line">
                  <div className="line" style={{width: '100%'}} />
                </div>
              </td>
              <td>
                {numeral(213678).format('0,0')}
                <div className="table-percentage-line">
                  <div className="line" style={{width: '90%'}} />
                </div>
              </td>
              <td>
                {numeral(82457).format('0,0')}
                <div className="table-percentage-line">
                  <div className="line" style={{width: '50%'}} />
                </div>
              </td>
            </tr>
            <tr>
              <td>www.foobar.com/assets/images/image.jpg</td>
              <td>
                {formatBytes(6541632)}
                <div className="table-percentage-line">
                  <div className="line" style={{width: '80%'}} />
                </div>
              </td>
              <td>
                {numeral(987).format('0,0')}
                <div className="table-percentage-line">
                  <div className="line" style={{width: '70%'}} />
                </div>
              </td>
              <td>
                {numeral(213678).format('0,0')}
                <div className="table-percentage-line">
                  <div className="line" style={{width: '90%'}} />
                </div>
              </td>
            </tr>
            <tr>
              <td>www.domain.com/favicon.ico</td>
              <td>
                {formatBytes(9871)}
                <div className="table-percentage-line">
                  <div className="line" style={{width: '60%'}} />
                </div>
              </td>
              <td>
                {numeral(987123).format('0,0')}
                <div className="table-percentage-line">
                  <div className="line" style={{width: '50%'}} />
                </div>
              </td>
              <td>
                {numeral(934875).format('0,0')}
                <div className="table-percentage-line">
                  <div className="line" style={{width: '80%'}} />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

AnalysisURLReport.displayName = 'AnalysisURLReport'
AnalysisURLReport.propTypes = {
  fetching: React.PropTypes.bool,
  urls: React.PropTypes.instanceOf(Immutable.List)
}

module.exports = AnalysisURLReport
