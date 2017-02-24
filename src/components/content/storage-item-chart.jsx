import React, { PropTypes } from 'react'
import { PieChart, Pie } from 'recharts'
import { ButtonToolbar, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Link } from 'react-router'
import classNames from 'classnames'

import StorageItemTooltip from './storage-item-tooltip'
import IconConfiguration from '../icons/icon-configuration'
import IconChart from '../icons/icon-chart'
import { formatBytes, separateUnit } from '../../util/helpers'

const FORMAT = '0,0.0'

const StorageItemChart = (
  { name,
    location,
    estimate,
    currentUsage,
    peak,
    lastMonthEstimate,
    lastMonthUsage,
    lastMonthPeak }) => {

  const dataSets = [
    [{value: currentUsage, className: 'current-month current-month-usage' },
     {value: estimate - currentUsage, className: 'current-month current-month-background' }],
    [{value: peak - (estimate / 360), className: 'current-month'},
     {value: estimate / 360, className: classNames('current-month current-month-peak', {exceeded: peak >= estimate}) },
     {value: estimate - peak, className: 'current-month' }],
    [{value: lastMonthUsage, className: 'last-month last-month-usage' },
     {value: lastMonthEstimate - lastMonthUsage, className: 'last-month' }],
    [{value: lastMonthPeak - (estimate / 360), className: 'last-month'},
     {value: lastMonthEstimate / 360, className: classNames('last-month last-month-peak', {exceeded: lastMonthPeak >= lastMonthEstimate})},
     {value: lastMonthEstimate - lastMonthPeak, className: 'last-month' }]]

  const tooltip = (<Tooltip id='tooltip-storage' className="storage-item-tooltip">
      <StorageItemTooltip
        name={name}
        currentUsage={currentUsage}
        peak={peak}
        lastMonthUsage={lastMonthUsage}
        lastMonthPeak={lastMonthPeak}
        lastMonthEstimate={lastMonthEstimate}
        valuesFormat={FORMAT} />
    </Tooltip>)

  const pies = dataSets.map((dataSet, i) =>
    <Pie
      key={i}
      data={dataSet}
      cx="50%"
      cy="50%"
      startAngle={90}
      endAngle={-270}
      innerRadius={i < 2? 92: 86}
      outerRadius={i < 2? 100: 90} />
  )

  return (
    <OverlayTrigger placement="top" overlay={tooltip}>
        <div className="storage-item-chart">
        <PieChart width={200} height={200} >
          {pies}
        </PieChart>

        <div className="storage-item-chart-location">{location}</div>
        <div className="storage-item-chart-info">
          <div className="title">{name}</div>
          <div className="usage">
            <span className="usage-value">
              {currentUsage && separateUnit(formatBytes(currentUsage, null, FORMAT)).value}
            </span>
            <span className="usage-unit">
              {currentUsage && separateUnit(formatBytes(currentUsage, null, FORMAT)).unit}
            </span>
          </div>
          <div className="usage-estimate">of 250</div>
        </div>

        <ButtonToolbar>
          <Link to='#'
            className="btn btn-icon btn-round invisible">
            <IconChart/>
          </Link>
          <Link to='#'
            className="btn btn-icon btn-round invisible">
            <IconConfiguration/>
          </Link>
        </ButtonToolbar>

      </div>
    </OverlayTrigger>
  )
}

StorageItemChart.displayName = 'StorageItemChart'
StorageItemChart.propTypes = {
  currentUsage: PropTypes.number,
  estimate: PropTypes.number,
  lastMonthEstimate: PropTypes.number,
  lastMonthPeak: PropTypes.number,
  lastMonthUsage: PropTypes.number,
  location: PropTypes.string,
  name: PropTypes.string,
  peak: PropTypes.number
};

export default StorageItemChart
