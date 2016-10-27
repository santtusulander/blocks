import React from 'react'
import {injectIntl} from 'react-intl'

import AnalysisByTime from '../analysis/by-time'
import { paleblue, yellow } from '../../constants/colors'

class OnOffNetTraffic extends React.Component {
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
    const { data, dataKey, totalTrafficUnit, totalTrafficValue, onNetValue, offNetValue } = this.props

    const onNet = data.map(datapoint => {
      return {
        bytes: datapoint['net_on']['bytes'] || 0,
        timestamp: datapoint['timestamp']
      }
    })

    const offNet = data.map(datapoint => {
      return {
        bytes: datapoint['net_off']['bytes'] || 0,
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

    return (
      <div className="on-off-net-traffic">
        <div className="traffic-label">Total</div>

        <div className="on-off-net-traffic-container">
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

OnOffNetTraffic.displayName = 'OnOffNetTraffic'
OnOffNetTraffic.propTypes = {
  data: React.PropTypes.array,
  dataKey: React.PropTypes.string,
  intl: React.PropTypes.object,
  offNetValue: React.PropTypes.number,
  onNetValue: React.PropTypes.number,
  totalTrafficUnit: React.PropTypes.string,
  totalTrafficValue: React.PropTypes.number
}

module.exports = injectIntl(OnOffNetTraffic)
