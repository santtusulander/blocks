import React, { PropTypes } from 'react'
import classNames from 'classnames'
import { paleblue } from '../../constants/colors'

import AnalysisByTime from '../analysis/by-time'

class MiniChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      byTimeWidth: 72
    }

    this.measureContainers = this.measureContainers.bind(this)
    this.measureContainersTimeout = null
  }
  componentDidMount() {
    this.measureContainers()
    this.measureContainersTimeout = setTimeout(() => {this.measureContainers()}, 300)
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
    const { className, data, dataKey, kpi, label } = this.props
    const dataSets = [{
      area: true,
      comparisonData: false,
      data: data,
      color: paleblue,
      id: 'minichart',
      label: '',
      line: true,
      stackedAgainst: false,
      xAxisFormatter: false
    }]
    return (
      <div className={classNames({
        'mini-chart': true,
        className})}>
        {label ?
          <div className="mini-chart-label">{label}</div>
        : null}
        <div className="mini-chart-container">
          {kpi && kpi.length === 2 ?
            <div className={classNames({
              'mini-chart-col': true,
              'mini-chart-kpi': true,
              'text-right': this.props.kpiRight
            })}>
              <span className="value">{kpi[0]}</span>
              <span className="suffix">{kpi[1]}</span>
            </div>
          : null}
          <div ref="byTimeHolder" className="mini-chart-col mini-chart-graph">
            <AnalysisByTime
              dataKey={dataKey}
              dataSets={dataSets}
              className="bg-transparent"
              height={32}
              noHover={true}
              noXNice={true}
              padding={2}
              showTooltip={false}
              width={this.state.byTimeWidth}/>
          </div>
        </div>
      </div>
    )
  }
}

MiniChart.displayName = 'MiniChart'
MiniChart.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array.isRequired,
  dataKey: PropTypes.string.isRequired,
  kpi: PropTypes.array,
  kpiRight: PropTypes.bool,
  label: PropTypes.string
}

export default MiniChart
