import React, { PropTypes } from 'react'
import classNames from 'classnames'
import { FormattedMessage } from 'react-intl'
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
    this.measureContainersTimeout = setTimeout(() => {
      this.measureContainers()
    }, 500)
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
      byTimeWidth: this.refs.byTimeHolder && this.refs.byTimeHolder.clientWidth
    })
  }
  render() {
    const { className, data, dataKey, kpiRight, kpiUnit, kpiValue, label } = this.props
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
    if (!data.length) {
      return (
        <div className={classNames({ 'mini-chart': true, className })}>
          {label && <div className="mini-chart-label">{label}</div>}
            <div className="mini-chart-container no-data">
              <FormattedMessage id='portal.common.no-data.text'/>
            </div>
        </div>
      )
    }
    return (
      <div className={classNames({
        'mini-chart': true,
        className})}>
        {label ?
          <div className="mini-chart-label">{label}</div>
        : null}
        <div className="mini-chart-container">
          {kpiValue || parseInt(kpiValue, 10) === 0 ?
            <div className={classNames({
              'mini-chart-col': true,
              'mini-chart-kpi': true,
              'text-right': kpiRight
            })}>
              <span className="value">{kpiValue}</span>
              <span className="suffix">{kpiUnit}</span>
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
  kpiRight: PropTypes.bool,
  kpiUnit: PropTypes.string,
  kpiValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.string
}

export default MiniChart
