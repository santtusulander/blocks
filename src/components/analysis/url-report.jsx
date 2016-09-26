import React from 'react'
import Immutable from 'immutable'
import {Input} from 'react-bootstrap'
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

    const chartHeight = filteredUrls.size * 36 + 72

    return (
      <div>
        <SectionHeader sectionHeaderTitle={<FormattedMessage id="portal.analytics.urlList.top15.text"/>}>
          <Input type="radio" label="Bytes" value="bytes" groupClassName="inline" checked={this.state.dataKey === 'bytes'} onChange={this.selectDataType}/>
          <Input type="radio" label="Requests" value="requests" groupClassName="inline" checked={this.state.dataKey === 'requests'} onChange={this.selectDataType}/>
        </SectionHeader>
        <SectionContainer>
          <div ref="chartHolder">
            <AnalysisHorizontalBar
              data={filteredUrls.toJS()}
              dataKey={dataKey}
              height={chartHeight}
              labelKey="url"
              width={this.state.chartWidth}
              padding={20}
              xAxisCustomFormat={xAxisCustomFormat}/>
          </div>
        </SectionContainer>
        <SectionHeader sectionHeaderTitle={<FormattedMessage id="portal.analytics.urlList.allUrls.text"/>}>
          <Input
            type="text"
            className="search-input"
            groupClassName="search-input-group"
            placeholder={this.props.intl.formatMessage({id: 'portal.analytics.urlList.searchForUrl.text'})}
            value={this.state.search}
            onChange={this.changeSearch}/>
        </SectionHeader>
        <SectionContainer>
          <AnalysisURLList
            urls={filteredUrls}
            labelFormat={url => url.get('url')}
            searchState={this.state.search} />
        </SectionContainer>
      </div>
    )
  }
}

AnalysisURLReport.displayName = 'AnalysisURLReport'
AnalysisURLReport.propTypes = {
  intl: React.PropTypes.object,
  serviceTypes: React.PropTypes.instanceOf(Immutable.List),
  statusCodes: React.PropTypes.instanceOf(Immutable.List),
  urls: React.PropTypes.instanceOf(Immutable.List)
}
AnalysisURLReport.defaultProps = {
  urls: Immutable.List()
}

module.exports = injectIntl(AnalysisURLReport)
