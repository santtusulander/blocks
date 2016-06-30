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

    //REFACTOR: Shared code with file-error.jsx

    //URL filtering
    //by serviceType
    const {serviceTypes, statusCodes, urls} = this.props;

    const filteredUrls = urls.filter( (url) => {
      return serviceTypes.includes(url.get('service_type'))
    })
      //filter by error code
      .filter( (url) => {
        return statusCodes.includes('All') || statusCodes.includes(url.get('status_code'))
      })

    const chartHeight = urls.size * 40 + 40

    return (
      <div className="analysis-url-report">
        <div ref="chartHolder">
          <AnalysisHorizontalBar
            data={filteredUrls.toJS()}
            dataKey="bytes"
            height={chartHeight}
            labelKey="url"
            width={this.state.chartWidth}
            padding={20}
            xAxisCustomFormat={formatBytes}/>
        </div>
        <h3>HEADER</h3>
        <AnalysisURLList
          urls={filteredUrls}
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
