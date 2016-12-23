import React from 'react'
import Immutable from 'immutable'
import { FormControl, FormGroup, Radio } from 'react-bootstrap'
import { injectIntl, FormattedMessage } from 'react-intl'

import SectionHeader from '../layout/section-header'
import SectionContainer from '../layout/section-container'
import AnalysisHorizontalBar from './horizontal-bar'
import AnalysisURLList from './url-list'
import {formatBytes} from '../../util/helpers'

class AnalysisURLReport extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chartWidth: 100,
      dataKey: "bytes",
      search: '',
      xAxisCustomFormat: formatBytes
    }

    this.changeSearch = this.changeSearch.bind(this)
    this.measureContainers = this.measureContainers.bind(this)
    this.selectDataType = this.selectDataType.bind(this)

    this.measureContainersTimeout = null
  }
  componentDidMount() {
    this.measureContainers()
    // TODO: remove this timeout as part of UDNP-1426
    this.measureContainersTimeout = setTimeout(() => {this.measureContainers()}, 500)
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
  changeSearch(event) {
    this.setState({
      search: event.target.value
    })
  }
  selectDataType(event) {
    this.setState({
      dataKey: event.target.value,
      xAxisCustomFormat: event.target.value === 'bytes' ? formatBytes : null
    })
  }
  render() {
    const { urlMetrics, intl } = this.props;
    const {dataKey, xAxisCustomFormat} = this.state;

    const uniqueURLMetrics = urlMetrics.groupBy(urlMatrix => urlMatrix.get('url'))
    const byBytes = uniqueURLMetrics.map(urlArray => urlArray.reduce((prevVal, url) => (prevVal + url.get('bytes')), 0))
    const byRequests = uniqueURLMetrics.map(urlArray => urlArray.reduce((prevVal, url) => (prevVal + url.get('requests')), 0))

    let aggregatedByBytes = Immutable.List()
    byBytes.map(url => {
      aggregatedByBytes = aggregatedByBytes.push({
        url: byBytes.keyOf(url),
        bytes: url
      })
    })

    let aggregatedByRequests = Immutable.List([])
    byRequests.map(url => {
      aggregatedByRequests = aggregatedByRequests.push({
        url: byRequests.keyOf(url),
        requests: url
      })
    })

    const aggregatedData = this.state.dataKey === 'bytes' ? aggregatedByBytes : aggregatedByRequests
    const topURLsCount = aggregatedData.size < 15 ? aggregatedData.size : 15
    const topURLs = aggregatedData.filter((metric, i) => i < topURLsCount)
    const chartHeight = topURLsCount * 36 + 72

    return (
      <div>
        <SectionHeader sectionHeaderTitle={<FormattedMessage id="portal.analytics.urlList.top15.text" values={{urlCout: topURLsCount}}/>}>
          <Radio inline={true} value="bytes" checked={this.state.dataKey === 'bytes'} onChange={this.selectDataType}>
            <span>Bytes</span>
          </Radio>
          <Radio inline={true} value="requests" checked={this.state.dataKey === 'requests'} onChange={this.selectDataType}>
            <span>Requests</span>
          </Radio>
        </SectionHeader>
        <SectionContainer>
          <div ref="chartHolder">
            <AnalysisHorizontalBar
              data={topURLs.toJS()}
              dataKey={dataKey}
              height={chartHeight}
              labelKey="url"
              width={this.state.chartWidth}
              padding={20}
              xAxisCustomFormat={xAxisCustomFormat}/>
          </div>
        </SectionContainer>
        <SectionHeader sectionHeaderTitle={<FormattedMessage id="portal.analytics.urlList.allUrls.text"/>}>
          <FormGroup className="search-input-group">
            <FormControl
              className="search-input"
              placeholder={intl.formatMessage({id: 'portal.analytics.urlList.searchForUrl.text'})}
              value={this.state.search}
              onChange={this.changeSearch}/>
          </FormGroup>
        </SectionHeader>
        <SectionContainer>
          <AnalysisURLList
            urls={urlMetrics}
            labelFormat={metric => metric.get('url')}
            searchState={this.state.search} />
        </SectionContainer>
      </div>
    )
  }
}

AnalysisURLReport.displayName = 'AnalysisURLReport'
AnalysisURLReport.propTypes = {
  intl: React.PropTypes.object,
  urlMetrics: React.PropTypes.instanceOf(Immutable.List)
}
AnalysisURLReport.defaultProps = {
  urlMetrics: Immutable.List()
}

module.exports = injectIntl(AnalysisURLReport)
