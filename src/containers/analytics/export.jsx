import React, {PropTypes} from 'react'
import {Map, List} from 'immutable'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'

import { getByAccountId, getByGroupId, getByStorageId } from '../../redux/modules/entities/storage-metrics/selectors'
import { createCSVExporters } from '../../util/analysis-csv-export'
import IconExport from '../../components/icons/icon-export.jsx'

import { FormattedMessage } from 'react-intl'

class AnalyticsExport extends React.Component {
  constructor(props){
    super(props)
    this.getExportData = this.getExportData.bind(this)
    this.exportCSV = this.exportCSV.bind(this)
  }

  getExportData(activeTab) {
    let exportData = []
    switch(activeTab) {
      case 'traffic':
        exportData = [this.props.trafficByTime, this.props.serviceTypes]
        break
      case 'visitors':
        exportData = [this.props.visitorsByTime]
        break
      case 'on-off-net':
        exportData = [this.props.onOffStats]
        break
      case 'contribution':
        exportData = [this.props.contribution]
        break
      case 'file-error':
        exportData = [this.props.fileErrorURLs, this.props.serviceTypes]
        break
      case 'cache-hit-rate':
        exportData = [this.props.traffic]
        break
      case 'url-report':
        exportData = [this.props.urlMetrics]
        break
    }
    const hasAllData = exportData.every(data => typeof data !== 'undefined' && data.size)
    return hasAllData ? exportData : []
  }

  exportCSV() {
    const {
      activeAccount, activeGroup, activeTab,
      params: {group, property}
    } = this.props
    const groupPart = group ? ` - ${activeGroup.get('name')}` : ''
    const propertyPart = property ? ` - ${property}` : ''
    const fileName = `${activeAccount.get('name')}${groupPart}${propertyPart}`
    const exporters = createCSVExporters(fileName)
    const exportData = this.getExportData(activeTab)

    if(exportData.length) {
      exporters[activeTab](...exportData)
    }
  }

  render() {
    const { activeTab } = this.props
    const exportData = this.getExportData(activeTab)
    return (
      <Button
        bsStyle="primary"
        className="has-icon"
        disabled={!exportData.length || activeTab === 'playback-demo'}
        onClick={this.exportCSV}>
        <IconExport />
        <FormattedMessage id="portal.button.export"/>
      </Button>
    )
  }
}

AnalyticsExport.displayName = "AnalyticsExport"
AnalyticsExport.propTypes = {
  activeAccount: PropTypes.instanceOf(Map),
  activeGroup: PropTypes.instanceOf(Map),
  activeTab: PropTypes.string,
  contribution: PropTypes.instanceOf(List),
  fileErrorURLs: PropTypes.instanceOf(List),
  onOffStats: PropTypes.instanceOf(List),
  params: PropTypes.object,
  serviceTypes: PropTypes.instanceOf(List),
  storageUsage: PropTypes.instanceOf(List),
  traffic: PropTypes.instanceOf(List),
  trafficByTime: PropTypes.instanceOf(List),
  urlMetrics: PropTypes.instanceOf(List),
  visitorsByTime: PropTypes.instanceOf(List)
}

AnalyticsExport.defaultProps = {
  activeAccount: Map(),
  activeGroup: Map(),
  contribution: List(),
  fileErrorURLs: List(),
  onOffStats: List(),
  serviceTypes: List(),
  storageUsage: List(),
  trafficByTime: List(),
  urlMetrics: List(),
  visitorsByTime: List()
}

function mapStateToProps(state, { params: { account, group, storage } }) {
  let getStorageByParent

  if(storage) {
    getStorageByParent = getByStorageId(state, storage)
  } else if(group) {
    getStorageByParent = getByGroupId(state, group)
  } else {
    getStorageByParent = getByAccountId(state, account)
  }

  return {
    activeAccount: state.account.get('activeAccount'),
    activeGroup: state.group.get('activeGroup'),
    contribution: state.traffic.getIn(['contribution', 'details']),
    fileErrorURLs: state.reports.get('fileErrorURLs'),
    onOffStats: state.traffic.get('onOffNet').get('detail'),
    serviceTypes: state.ui.get('analysisServiceTypes'),
    storageUsage: getStorageByParent && getStorageByParent.get('detail'),
    trafficByTime: state.traffic.getIn(['byTime', 'details']),
    traffic: state.traffic.getIn(['traffic', 0, 'detail']),
    urlMetrics: state.reports.get('urlMetrics'),
    visitorsByTime: state.visitors.get('byTime')
  }
}

export default connect(mapStateToProps)(AnalyticsExport)
