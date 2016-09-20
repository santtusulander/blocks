import React from 'react'
import Immutable from 'immutable'

import AnalysisHorizontalBar from './horizontal-bar'
import AnalysisURLList from './url-list'
import {formatBytes} from '../../util/helpers'
import {Input} from 'react-bootstrap'

import { FormattedMessage } from 'react-intl'

class AnalysisURLReport extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chartWidth: 100,
      dataKey: "bytes",
      xAxisCustomFormat: formatBytes
    }

    this.measureContainers = this.measureContainers.bind(this)
    this.selectDataType = this.selectDataType.bind(this)
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
  selectDataType(event) {
    this.setState({
      dataKey: event.target.value,
      xAxisCustomFormat: event.target.value === 'bytes' ? formatBytes : null
    })
  }
  render() {

    //REFACTOR: Shared code with file-error.jsx

    //URL filtering
    //by serviceType
    const {serviceTypes, statusCodes, urls} = this.props;
    const {dataKey, xAxisCustomFormat} = this.state;
    const filteredUrls = urls.filter( (url) => {
      return serviceTypes.includes(url.get('service_type'))
    })
      //filter by error code
      .filter((url, i) => {
        if (i >= 15) {
          return false;
        }

        return statusCodes.includes('All') || statusCodes.includes(url.get('status_code'))
      })

    const chartHeight = filteredUrls.size * 40 + 40

    return (
      <div className="analysis-url-report">
        <div className="chart-holder" ref="chartHolder">
          <header>
            <h3><FormattedMessage id="portal.analytics.urlList.top15.text"/></h3>
            <Input type="radio" label="Bytes" value="bytes" checked={this.state.dataKey === 'bytes'} onChange={this.selectDataType}/>
            <Input type="radio" label="Requests" value="requests" checked={this.state.dataKey === 'requests'} onChange={this.selectDataType}/>
          </header>
          <AnalysisHorizontalBar
            data={filteredUrls.toJS()}
            dataKey={dataKey}
            height={chartHeight}
            labelKey="url"
            width={this.state.chartWidth}
            padding={20}
            xAxisCustomFormat={xAxisCustomFormat}/>
        </div>
        <h3><FormattedMessage id="portal.analytics.urlList.allUrls.text"/></h3>
        <AnalysisURLList
          urls={filteredUrls}
          labelFormat={url => url.get('url')}/>
      </div>
    )
  }
}

AnalysisURLReport.displayName = 'AnalysisURLReport'
AnalysisURLReport.propTypes = {
  serviceTypes: React.PropTypes.instanceOf(Immutable.List),
  statusCodes: React.PropTypes.instanceOf(Immutable.List),
  urls: React.PropTypes.instanceOf(Immutable.List)
}
AnalysisURLReport.defaultProps = {
  urls: Immutable.List()
}

export default AnalysisURLReport
