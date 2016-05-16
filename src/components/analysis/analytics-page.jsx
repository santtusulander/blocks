import React from 'react'
import Immutable from 'immutable'
import { Nav, NavItem } from 'react-bootstrap'
import moment from 'moment'

import PageContainer from '../layout/page-container'
import Sidebar from '../layout/sidebar'
import Content from '../layout/content'
import Analyses from './analyses'
import AnalysisTraffic from './traffic'
import AnalysisVisitors from './visitors'
import AnalysisSPReport from './sp-report'
import AnalysisFileError from './file-error'
import AnalysisURLReport from './url-report'
import AnalysisStorageUsage from './storage-usage'
import AnalysisPlaybackDemo from './playback-demo'
import { generateCSVFile } from '../../util/helpers'

export class AnalyticsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: 'traffic',
      activeVideo: '/elephant/169ar/elephant_master.m3u8'
    }

    this.changeTab = this.changeTab.bind(this)
    this.changeActiveVideo = this.changeActiveVideo.bind(this)
    this.exportCSV = this.exportCSV.bind(this)
    this.exportEmail = this.exportEmail.bind(this)
    this.exportPDF = this.exportPDF.bind(this)
  }
  changeTab(newTab) {
    this.setState({activeTab: newTab})
  }
  changeActiveVideo(video) {
    this.setState({activeVideo: video})
  }
  exportCSV() {
    switch(this.state.activeTab) {
      case 'traffic':
        generateCSVFile(this.props.trafficByTime.toJS().map(traffic => {
          traffic.timestamp = moment(traffic.timestamp).format()
          return traffic
        }), `Traffic - ${this.props.exportFilenamePart}`)
        break
    }
  }
  exportEmail() {
    // show the send email modal
  }
  exportPDF() {
    // export the pdf based on this.state.activeTab
  }
  render() {
    const metrics = this.props.metrics
    const peakTraffic = metrics.has('transfer_rates') ?
      metrics.get('transfer_rates').get('peak') : '0.0 Gbps'
    const avgTraffic = metrics.has('transfer_rates') ?
      metrics.get('transfer_rates').get('average') : '0.0 Gbps'
    const lowTraffic = metrics.has('transfer_rates') ?
      metrics.get('transfer_rates').get('lowest') : '0.0 Gbps'
    return (
      <PageContainer hasSidebar={true} className="analytics-page">
        <Sidebar>
          <Analyses
            endDate={this.props.endDate}
            startDate={this.props.startDate}
            changeDateRange={this.props.changeDateRange}
            changeSPChartType={this.props.changeSPChartType}
            serviceTypes={this.props.serviceTypes}
            spChartType={this.props.spChartType}
            toggleServiceType={this.props.toggleAnalysisServiceType}
            activeTab={this.state.activeTab}
            type={this.props.type}
            name={this.props.activeName}
            navOptions={this.props.siblings}
            activeVideo={this.state.activeVideo}
            changeVideo={this.changeActiveVideo}
            exportCSV={this.exportCSV}
            exportEmail={this.exportEmail}
            exportPDF={this.exportPDF}/>
        </Sidebar>

        <Content>
          <Nav bsStyle="tabs" activeKey={this.state.activeTab} onSelect={this.changeTab}>
            <NavItem eventKey="traffic">Traffic</NavItem>
            <NavItem eventKey="visitors">Visitors</NavItem>
            <NavItem eventKey="sp-report">SP On/Off Net</NavItem>
            <NavItem eventKey="file-error">File Error</NavItem>
            <NavItem eventKey="url-report">URL Report</NavItem>
            <NavItem eventKey="storage-usage">Storage Usage</NavItem>
            <NavItem eventKey="playback-demo">Playback Demo</NavItem>
          </Nav>

          <div className="container-fluid analysis-container">
            {this.state.activeTab === 'traffic' &&
              <AnalysisTraffic fetching={this.props.trafficFetching}
                byTime={this.props.trafficByTime}
                byCountry={this.props.trafficByCountry}
                serviceTypes={this.props.serviceTypes}
                totalEgress={this.props.totalEgress}
                peakTraffic={!this.props.fetchingMetrics ? peakTraffic : null}
                avgTraffic={!this.props.fetchingMetrics ? avgTraffic : null}
                lowTraffic={!this.props.fetchingMetrics ? lowTraffic : null}
                dateRange={this.props.dateRange}/>
            }
            {this.state.activeTab === 'visitors' &&
              <AnalysisVisitors fetching={this.props.visitorsFetching}
                byTime={this.props.visitorsByTime}
                byCountry={this.props.visitorsByCountry.get('countries')}
                byBrowser={this.props.visitorsByBrowser.get('browsers')}
                byOS={this.props.visitorsByOS.get('os')}/>
            }
            {this.state.activeTab === 'sp-report' &&
              <AnalysisSPReport fetching={this.props.trafficFetching}
                serviceProviderStats={this.props.onOffNet}
                serviceProviderStatsToday={this.props.onOffNetToday}
                spChartType={this.props.spChartType}/>
            }
            {this.state.activeTab === 'file-error' &&
              <AnalysisFileError fetching={this.props.reportsFetching}
                summary={this.props.fileErrorSummary}
                urls={this.props.fileErrorURLs}/>
            }
            {this.state.activeTab === 'url-report' &&
              <AnalysisURLReport fetching={this.props.reportsFetching}
                urls={this.props.urlMetrics}/>
            }
            {this.state.activeTab === 'storage-usage' &&
              <AnalysisStorageUsage fetching={this.props.trafficFetching}
                storageStats={this.props.storageStats}/>
            }
            {this.state.activeTab === 'playback-demo' &&
              <AnalysisPlaybackDemo
                activeVideo={this.state.activeVideo}/>
            }
          </div>
        </Content>
      </PageContainer>
    );
  }
}

AnalyticsPage.displayName = 'AnalyticsPage'
AnalyticsPage.propTypes = {
  activeName: React.PropTypes.string,
  changeDateRange: React.PropTypes.func,
  changeSPChartType: React.PropTypes.func,
  dateRange: React.PropTypes.string,
  endDate: React.PropTypes.instanceOf(moment),
  exportFilenamePart: React.PropTypes.string,
  fetchingMetrics: React.PropTypes.bool,
  fileErrorSummary: React.PropTypes.instanceOf(Immutable.Map),
  fileErrorURLs: React.PropTypes.instanceOf(Immutable.List),
  metrics: React.PropTypes.instanceOf(Immutable.Map),
  onOffNet: React.PropTypes.instanceOf(Immutable.Map),
  onOffNetToday: React.PropTypes.instanceOf(Immutable.Map),
  reportsFetching: React.PropTypes.bool,
  serviceTypes: React.PropTypes.instanceOf(Immutable.List),
  siblings: React.PropTypes.instanceOf(Immutable.List),
  spChartType: React.PropTypes.string,
  startDate: React.PropTypes.instanceOf(moment),
  storageStats: React.PropTypes.instanceOf(Immutable.List),
  toggleAnalysisServiceType: React.PropTypes.func,
  totalEgress: React.PropTypes.number,
  trafficByCountry: React.PropTypes.instanceOf(Immutable.List),
  trafficByTime: React.PropTypes.instanceOf(Immutable.List),
  trafficFetching: React.PropTypes.bool,
  type: React.PropTypes.string,
  urlMetrics: React.PropTypes.instanceOf(Immutable.List),
  visitorsByBrowser: React.PropTypes.instanceOf(Immutable.Map),
  visitorsByCountry: React.PropTypes.instanceOf(Immutable.Map),
  visitorsByOS: React.PropTypes.instanceOf(Immutable.Map),
  visitorsByTime: React.PropTypes.instanceOf(Immutable.List),
  visitorsFetching: React.PropTypes.bool
}

AnalyticsPage.defaultProps = {
  fileErrorSummary: Immutable.Map(),
  fileErrorURLs: Immutable.List(),
  metrics: Immutable.Map(),
  onOffNet: Immutable.Map(),
  onOffNetToday: Immutable.Map(),
  serviceTypes: Immutable.List(),
  siblings: Immutable.List(),
  storageStats: Immutable.List(),
  trafficByCountry: Immutable.List(),
  trafficByTime: Immutable.List(),
  urlMetrics: Immutable.List(),
  visitorsByBrowser: Immutable.Map(),
  visitorsByCountry: Immutable.Map(),
  visitorsByOS: Immutable.Map(),
  visitorsByTime: Immutable.List()
}

module.exports = AnalyticsPage
