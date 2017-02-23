import React, { PropTypes } from 'react'
import { PieChart, Pie } from 'recharts'
import { ButtonToolbar, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Link } from 'react-router'
import { FormattedMessage } from 'react-intl'

import IconConfiguration from '../icons/icon-configuration'
import IconChart from '../icons/icon-chart'
import { formatBytes, separateUnit } from '../../util/helpers'

import { black, paleblue, yellow } from '../../constants/colors'

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
    [{value: currentUsage, fill: paleblue },
     {value: estimate - currentUsage, fill: black }],
    [{value: peak - (estimate / 360), fill:"transparent"},
     {value: estimate / 360, fill: peak < estimate ? paleblue : yellow },
     {value: estimate - peak, fill:"transparent" }],
    [{value: lastMonthUsage, fill: paleblue, className: 'last-month' },
     {value: lastMonthEstimate - lastMonthUsage, fill: "transparent" }],
    [{value: lastMonthPeak - (estimate / 360), fill:"transparent"},
     {value: lastMonthEstimate / 360, fill: lastMonthPeak < lastMonthEstimate ? paleblue : yellow, className: 'last-month'},
     {value: lastMonthEstimate - lastMonthPeak, fill:"transparent" }]]

  const tooltip = (<Tooltip className="storage-item-tooltip"
    id={'tooltip-' + 'name'}>
      <h3>{name}</h3>
      <div className="storage-month-info">
        <FormattedMessage id="portal.account.storage.tooltip.currentUsage"/>
        <span className="tooltip-storage-value">{formatBytes(currentUsage, null, FORMAT)}</span>
        <br />
        <FormattedMessage id="portal.account.storage.tooltip.peakThisMonth"/>
        <span className="tooltip-storage-value">{formatBytes(peak, null, FORMAT)}</span>
      </div>
      <div className="storage-month-info">
        <FormattedMessage id="portal.account.storage.tooltip.endOfLastMonth"/>
        <span className="tooltip-storage-value">{formatBytes(currentUsage, null, FORMAT)}</span>
        <br />
        <FormattedMessage id="portal.account.storage.tooltip.peakLastMonth"/>
        <span className="tooltip-storage-value">{formatBytes(lastMonthPeak, null, FORMAT)}</span>
      </div>
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

        <div className="location">{location}</div>
        <div className="info">
          <div className="title">{name}</div>
          <div className="usage">
            <span className="usage-value">
              {separateUnit(formatBytes(currentUsage, null, FORMAT)).value}
            </span>
            <span className="usage-unit">
              {separateUnit(formatBytes(currentUsage, null, FORMAT)).unit}
            </span>
          </div>
          <div className="estimate">of 250</div>
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
