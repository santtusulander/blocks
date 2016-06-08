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
import AnalysisOnOffNetReport from './on-off-net-report'
import AnalysisServiceProviders from './service-providers'
import AnalysisFileError from './file-error'
import AnalysisURLReport from './url-report'
import AnalysisStorageUsage from './storage-usage'
import AnalysisPlaybackDemo from './playback-demo'
import { createCSVExporters } from '../../util/analysis-csv-export'

import { ExportPanel }from '../export-panel'

import TabTitles from '../../constants/report-tab-titles'

const handleReportTitleChange = (tab) => {
  if(TabTitles.hasOwnProperty(tab)) {
    return `${TabTitles[tab]}`
  } else {
    return `${tab}`
  }
}


let exporters = createCSVExporters('')

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
    this.onDownload = this.onDownload.bind(this)
    this.onSend = this.onSend.bind(this)

    this.showExportPanel = this.showExportPanel.bind(this);
    this.hideExportPanel = this.hideExportPanel.bind(this);

    exporters = createCSVExporters(props.exportFilenamePart)
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.exportFilenamePart !== this.props.exportFilenamePart) {
      exporters = createCSVExporters(nextProps.exportFilenamePart)
    }
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
        exporters.traffic(this.props.trafficByTime, this.props.serviceTypes)
        break
      case 'visitors':
        exporters.visitors(this.props.visitorsByTime)
        break
      case 'on-off-net-report':
        exporters.onOffNet(this.props.onOffNet.get('detail'))
        break
      case 'service-providers':
        exporters.serviceProviders(this.props.serviceProviders.get('detail'))
        break
      case 'file-error':
        exporters.fileError(this.props.fileErrorURLs, this.props.serviceTypes)
        break
      case 'url-report':
        exporters.urlReport(this.props.urlMetrics)
        break
      case 'storage-usage':
        exporters.storageUsage(this.props.storageStats)
        break
    }
  }
  showExportPanel( exportType ){
    this.props.exportsActions.exportsShowDialog({
      exportType: exportType
    });
  }

  hideExportPanel(){
    this.props.exportsActions.exportsHideDialog();
  }

  onDownload( fileType ) {

    switch( fileType ) {
      case 'export_pdf':

        this.props.exportsActions.exportsDownloadFile({
          exportType: fileType,
          reportType: this.state.activeTab,
          startDate:  this.props.startDate,
          endDate:    this.props.endDate
        })

        break;
      case 'export_csv':
        this.exportCSV();
        break;
      default:
        console.log('--- Download file type: DEFAULT ---')
        break;
    }

    this.hideExportPanel();
  }

  onSend( formValues ){
    this.props.exportsActions.exportsSendEmail({
      formValues: formValues,
      reportType: this.state.activeTab,
      startDate:  this.props.startDate,
      endDate:    this.props.endDate
    })

    this.hideExportPanel();
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

        <ExportPanel
          show={this.props.exportsDialogState.dialogVisible}
          exportType={this.props.exportsDialogState.exportType}
          onDownload={this.onDownload}
          onSend={this.onSend}
          onCancel={this.hideExportPanel}
          showExportPanel={this.showExportPanel}
          panelTitle={handleReportTitleChange(this.state.activeTab)}/>

        <Sidebar>
          <Analyses
            activeTab={this.state.activeTab}
            activeVideo={this.state.activeVideo}
            endDate={this.props.endDate}
            changeDateRange={this.props.changeDateRange}
            changeOnOffNetChartType={this.props.changeOnOffNetChartType}
            changeSPChartType={this.props.changeSPChartType}
            changeVideo={this.changeActiveVideo}
            name={this.props.activeName}
            navOptions={this.props.siblings}
            onOffNetChartType={this.props.onOffNetChartType}
            serviceTypes={this.props.serviceTypes}
            showExportPanel={this.showExportPanel}
            startDate={this.props.startDate}
            toggleServiceType={this.props.toggleAnalysisServiceType}
            type={this.props.type}
          />

        </Sidebar>

        <Content>
          <Nav bsStyle="tabs" className="analysis-nav" activeKey={this.state.activeTab} onSelect={this.changeTab}>
            <NavItem eventKey="traffic">Traffic</NavItem>
            <NavItem eventKey="visitors">Visitors</NavItem>
            <NavItem eventKey="on-off-net-report">On/Off Net</NavItem>
            <NavItem eventKey="service-providers">Service Providers</NavItem>
            <NavItem eventKey="file-error">File Error</NavItem>
            <NavItem eventKey="url-report">URL Report</NavItem>
            {/* Not in 0.0.52 <NavItem eventKey="storage-usage">Storage Usage</NavItem>*/}
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
            {this.state.activeTab === 'on-off-net-report' &&
              <AnalysisOnOffNetReport fetching={this.props.trafficFetching}
                onOffStats={this.props.onOffNet}
                onOffStatsToday={this.props.onOffNetToday}
                onOffNetChartType={this.props.onOffNetChartType}/>
            }
            {this.state.activeTab === 'service-providers' &&
              <AnalysisServiceProviders fetching={this.props.trafficFetching}
                stats={this.props.serviceProviders}/>
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
  changeOnOffNetChartType: React.PropTypes.func,
  changeSPChartType: React.PropTypes.func,
  dateRange: React.PropTypes.string,
  endDate: React.PropTypes.instanceOf(moment),
  exportFilenamePart: React.PropTypes.string,
  exportsActions: React.PropTypes.object,
  exportsDialogState: React.PropTypes.instanceOf(Object),
  fetchingMetrics: React.PropTypes.bool,
  fileErrorSummary: React.PropTypes.instanceOf(Immutable.Map),
  fileErrorURLs: React.PropTypes.instanceOf(Immutable.List),
  metrics: React.PropTypes.instanceOf(Immutable.Map),
  onOffNet: React.PropTypes.instanceOf(Immutable.Map),
  onOffNetChartType: React.PropTypes.string,
  onOffNetToday: React.PropTypes.instanceOf(Immutable.Map),
  reportsFetching: React.PropTypes.bool,
  serviceProviders: React.PropTypes.instanceOf(Immutable.List),
  serviceTypes: React.PropTypes.instanceOf(Immutable.List),
  siblings: React.PropTypes.instanceOf(Immutable.List),
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
  exportsDialogState: {},
  exportFilenamePart: '',
  fileErrorSummary: Immutable.Map(),
  fileErrorURLs: Immutable.List(),
  metrics: Immutable.Map(),
  onOffNet: Immutable.Map(),
  onOffNetToday: Immutable.Map(),
  serviceProviders: Immutable.List(),
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
