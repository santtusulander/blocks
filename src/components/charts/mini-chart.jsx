import React, { PropTypes } from 'react'
import classNames from 'classnames'
import { FormattedMessage } from 'react-intl'

import MiniAreaChart from './mini-area-chart'

class MiniChart extends React.Component {
  render() {
    const { className, data, dataKey, kpiRight, kpiUnit, kpiValue, label } = this.props

    const area = [
      {"dataKey": dataKey}
    ]
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
            <MiniAreaChart data={data} areas={area} height={32} />
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
