import React from 'react'
import {injectIntl} from 'react-intl'
import numeral from 'numeral'

import AnalysisByTime from '../analysis/by-time'
import { paleblue, yellow } from '../../constants/colors'
import { formatBytes, formatOutput } from '../../util/helpers'

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
    const { data, dataKey } = this.props

    const onNet = data['traffic']['detail'].map(datapoint => {
      return {
        bytes: datapoint['bytes_net_on'] || 0,
        timestamp: datapoint['timestamp']
      }
    })

    const offNet = data['traffic']['detail'].map(datapoint => {
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
      data: onNet,
      id: 'onNet',
      label: '',
      line: true,
      stackedAgainst: 'offNet',
      xAxisFormatter: false
    })

    datasets.push({
      area: true,
      color: yellow,
      comparisonData: false,
      data: offNet,
      id: 'offNet',
      label: '',
      line: true,
      stackedAgainst: false,
      xAxisFormatter: false
    })

    let totalTrafficValueOutput = formatOutput(formatBytes(data['traffic']['bytes']))
    let totalTrafficValue = totalTrafficValueOutput.value
    let totalTrafficUnit = totalTrafficValueOutput.unit

    let onNetValue = numeral((data['traffic']['bytes_net_on'] / data['traffic']['bytes']) * 100).format('0,0')
    let offNetValue = numeral((data['traffic']['bytes_net_off'] / data['traffic']['bytes']) * 100).format('0,0')

    return (
      <div className="stacked-by-time-summary">
        <div className="traffic-label">Total</div>

        <div className="stacked-by-time-summary-container">
          <div className="traffic-amount-col total">
            <span className="value">{totalTrafficValue}</span>
            <span className="suffix">{totalTrafficUnit}</span>
          </div>

          <div ref="byTimeHolder" className="traffic-amount-col chart">
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

          <div className="traffic-amount-col">
            <div className="traffic-label on-net">On-Net</div>
            <span className="value">{onNetValue}</span>
            <span className="suffix">%</span>
          </div>

          <div className="traffic-amount-col">
            <div className="traffic-label off-net">Off-Net</div>
            <span className="value">{offNetValue}</span>
            <span className="suffix">%</span>
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
  intl: React.PropTypes.object,
  offNetValue: React.PropTypes.number,
  onNetValue: React.PropTypes.number
}

module.exports = injectIntl(StackedByTimeSummary)
