import React from 'react'
import Immutable from 'immutable'
import { FormControl, FormGroup, Radio } from 'react-bootstrap'
import { injectIntl, FormattedMessage } from 'react-intl'

import SectionHeader from '../layout/section-header'
import SectionContainer from '../layout/section-container'
import AnalysisHorizontalBar from './horizontal-bar'
import AnalysisURLList from './url-list'
import {getTopURLs, formatBytes} from '../../util/helpers'

import { TOP_URLS_CHART_MINIMUM_HEIGHT, BAR_HEIGHT } from '../../constants/url-report.js'

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
    this.topURLs = Immutable.List()
  }
  componentWillMount() {
    this.topURLs = getTopURLs(this.props.urlMetrics, this.state.dataKey)
  }
  componentDidMount() {
    this.measureContainers()
    // TODO: remove this timeout as part of UDNP-1426
    this.measureContainersTimeout = setTimeout(() => {this.measureContainers()}, 500)
    window.addEventListener('resize', this.measureContainers)
  }
  componentWillUpdate(nextProps, nextState) {
    this.topURLs = getTopURLs(nextProps.urlMetrics, nextState.dataKey)
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

    const topURLsCount = this.topURLs.size
    const chartHeight = (topURLsCount * BAR_HEIGHT) + TOP_URLS_CHART_MINIMUM_HEIGHT

    return (
      <div>
        <SectionHeader sectionHeaderTitle={<FormattedMessage id="portal.analytics.urlList.top15.text" values={{urlCount: topURLsCount}}/>}>
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
              data={this.topURLs.toJS()}
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
