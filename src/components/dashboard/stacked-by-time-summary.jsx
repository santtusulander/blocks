import React from 'react'
import {injectIntl} from 'react-intl'
import numeral from 'numeral'

import AnalysisByTime from '../analysis/by-time'
import { paleblue, yellow } from '../../constants/colors'
import { formatBytes, separateUnit } from '../../util/helpers'

class StackedByTimeSummary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      byTimeWidth: 100
    }

    this.measureContainers = this.measureContainers.bind(this)
    this.measureContainersTimeout = null
  }

  componentDidMount() {
    this.measureContainers()
    this.measureContainersTimeout = setTimeout(() => {this.measureContainers()}, 500)
    window.addEventListener('resize', this.measureContainers)
  }

  componentWillReceiveProps() {
    this.measureContainers()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.measureContainers)
    clearTimeout(this.measureContainersTimeout)
  }

  measureContainers() {
    this.setState({
      byTimeWidth: this.refs.byTimeHolder.clientWidth
    })
  }

  render() {
    const { data, dataKey, datasetALabel, datasetAUnit, datasetBLabel, datasetBUnit } = this.props

    const datasetA = data['traffic']['detail'].map(datapoint => {
      return {
        bytes: datapoint['bytes_net_on'] || 0,
        timestamp: datapoint['timestamp']
      }
    })

    const datasetB = data['traffic']['detail'].map(datapoint => {
      return {
        bytes: datapoint['bytes_net_off'] || 0,
        timestamp: datapoint['timestamp']
      }
    })

    let datasets = []
    datasets.push({
      area: true,
      color: paleblue,
      comparisonData: false,
      data: datasetA,
      id: 'datasetA',
      label: '',
      line: true,
      stackedAgainst: 'datasetB',
      xAxisFormatter: false
    })

    datasets.push({
      area: true,
      color: yellow,
      comparisonData: false,
      data: datasetB,
      id: 'datasetB',
      label: '',
      line: true,
      stackedAgainst: false,
      xAxisFormatter: false
    })

    let totalDatasetValueOutput = separateUnit(formatBytes(data['traffic']['bytes']))
    let totalDatasetValue = totalDatasetValueOutput.value
    let totalDatasetUnit = totalDatasetValueOutput.unit

    let datasetAValue = numeral((data['traffic']['bytes_net_on'] / data['traffic']['bytes']) * 100).format('0,0')
    let datasetBValue = numeral((data['traffic']['bytes_net_off'] / data['traffic']['bytes']) * 100).format('0,0')

    return (
      <div className="stacked-by-time-summary">
        <div className="dataset-label">Total</div>

        <div className="stacked-by-time-summary-container">
          <div className="dataset-col total">
            <span className="value">{totalDatasetValue}</span>
            <span className="suffix">{totalDatasetUnit}</span>
          </div>

          <div ref="byTimeHolder" className="dataset-col chart">
            <AnalysisByTime
              dataKey={dataKey}
              dataSets={datasets}
              className="bg-transparent"
              padding={2}
              width={this.state.byTimeWidth}
              height={72}
              showTooltip={false}
              showLegend={false}
              noHover={true}
              noXNice={true} />
          </div>

          <div className="dataset-col">
            <div className="dataset-label dataset-a">{datasetALabel}</div>
            <span className="value">{datasetAValue}</span>
            <span className="suffix">{datasetAUnit}</span>
          </div>

          <div className="dataset-col">
            <div className="dataset-label dataset-b">{datasetBLabel}</div>
            <span className="value">{datasetBValue}</span>
            <span className="suffix">{datasetBUnit}</span>
          </div>
        </div>
      </div>
    )
  }
}

StackedByTimeSummary.displayName = 'StackedByTimeSummary'
StackedByTimeSummary.propTypes = {
  data: React.PropTypes.object,
  dataKey: React.PropTypes.string,
  datasetALabel: React.PropTypes.string,
  datasetAUnit: React.PropTypes.string,
  datasetAValue: React.PropTypes.number,
  datasetBLabel: React.PropTypes.string,
  datasetBUnit: React.PropTypes.string,
  datasetBValue: React.PropTypes.number,
  intl: React.PropTypes.object
}

module.exports = injectIntl(StackedByTimeSummary)
