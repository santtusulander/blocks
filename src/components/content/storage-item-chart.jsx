import React, { PropTypes } from 'react'
import { PieChart, Pie } from 'recharts'
import { ButtonToolbar, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Link } from 'react-router'
import classNames from 'classnames'
import { FormattedMessage } from 'react-intl'

import StorageItemTooltip from './storage-item-tooltip'
import IconConfiguration from '../icons/icon-configuration'
import IconChart from '../icons/icon-chart'
import { formatBytes, separateUnit } from '../../util/helpers'

const FORMAT = '0,0.0'
const defaultDiameter = 240

const StorageItemChart = (
  { analyticsLink,
    configurationLink,
    diameter,
    name,
    locations,
    estimate,
    currentUsage,
    peak,
    lastMonthEstimate,
    lastMonthUsage,
    lastMonthPeak }) => {

  /* The following data sets represent the pie charts, there are two overlapping
  charts for each month one of them shows the usage and the other shows the peak,
  the peaks occupy one-degree sectors */
  const dataSets = [
    /****** This Month Chart ******/
    // ↓         ↓
    // ⫴⫴⫴⫴⫴⫴⫴⫴⫴⫴⫴⫴⫴⫴⫴⫴⫴⫴⫴⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐
    [{value: currentUsage,                       className: 'current-month current-month-usage'},
    //            ↓             ↓
    // ⫴⫴⫴⫴⫴⫴⫴⫴⫴⫴⫴⫴⫴⫴⫴⫴⫴⫴⫴⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐
     {value: estimate - currentUsage,            className: classNames('current-month current-month-background', {exceeded: currentUsage > estimate})}],
     /****** This Month's Peak Chart ******/
    // ↓        ↓
    // ⊏⊏⊏⊏⊏⊏⊏⊏⊏⊏⫴⫴⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐
    [{value: peak - (estimate / 360),            className: 'current-month'},
    //           ↓
    // ⊏⊏⊏⊏⊏⊏⊏⊏⊏⊏⫴⫴⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐
     {value: estimate / 360,                     className: classNames('current-month current-month-peak', {exceeded: peak >= estimate})},
    //            ↓             ↓
    // ⊏⊏⊏⊏⊏⊏⊏⊏⊏⊏⫴⫴⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐
     {value: estimate - peak,                    className: 'current-month'}],
     /****** Last Month Chart ******/
    // ↓         ↓
    // ⫴⫴⫴⫴⫴⫴⫴⫴⫴⫴⫴⫴⫴⫴⫴⫴⫴⫴⫴⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐
    [{value: lastMonthUsage,                     className: 'last-month last-month-usage'},
    //            ↓             ↓
    // ⫴⫴⫴⫴⫴⫴⫴⫴⫴⫴⫴⫴⫴⫴⫴⫴⫴⫴⫴⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐
     {value: lastMonthEstimate - lastMonthUsage, className: 'last-month'}],
     /****** Last Month's Peak Chart ******/
    // ↓        ↓
    // ⊏⊏⊏⊏⊏⊏⊏⊏⊏⊏⫴⫴⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐
    [{value: lastMonthPeak - (estimate / 360),   className: 'last-month'},
    //           ↓
    // ⊏⊏⊏⊏⊏⊏⊏⊏⊏⊏⫴⫴⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐
     {value: lastMonthEstimate / 360,            className: classNames('last-month last-month-peak', {exceeded: lastMonthPeak >= lastMonthEstimate})},
    //            ↓             ↓
    // ⊏⊏⊏⊏⊏⊏⊏⊏⊏⊏⫴⫴⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐⊐
     {value: lastMonthEstimate - lastMonthPeak,  className: 'last-month'}]]

  const minDiameter = diameter > defaultDiameter ? diameter : defaultDiameter

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
      //The width of the outer chart is 10 the padding between the outer and the inner charts is 3
      //hence we subtract 13 from the minDiameter.
      //The width of the inner chart is 5
      innerRadius={i < 2? (minDiameter / 2) - 10: (minDiameter / 2) - 18}
      outerRadius={i < 2? (minDiameter / 2)     : (minDiameter / 2) - 13} />
  )

  //TODO: replace storageLocations when the api is ready
  const storageLocations = locations.length === 1 ?
    <span>{locations[0]}</span> :
    locations.map((location, i) => (
      <span key={i}>{location.slice(0, 2)}{(i + 1) !== locations.length ? ', ' : ''}</span>
    ))

  return (
    <OverlayTrigger placement="top" overlay={tooltip}>
      <div className="storage-item-chart" style={{width: minDiameter, height: minDiameter}}>
        <PieChart width={minDiameter} height={minDiameter} >
          {pies}
        </PieChart>

        <div className="storage-item-chart-location">
          {storageLocations}
        </div>

        <div className="storage-item-chart-info">
          <div className="title" >{name}</div>
          <div className="usage">
            <span className="usage-value">
              {!isNaN(currentUsage) && separateUnit(formatBytes(currentUsage, null, FORMAT)).value}
            </span>
            <span className="usage-unit">
              {!isNaN(currentUsage) && separateUnit(formatBytes(currentUsage, null, FORMAT)).unit}
            </span>
          </div>
        </div>

        <div className="usage-estimate">
          {<FormattedMessage id="portal.common.of.value.text"
            values={{ value: formatBytes(estimate, null) }}/>}
        </div>

        <div className="content-item-chart content-item-toolbar">
          <ButtonToolbar>
            {analyticsLink &&
                <Link to={analyticsLink}
                  className="btn btn-icon btn-round invisible">
                  <IconChart/>
              </Link>
            }
            {configurationLink &&
              <Link to={configurationLink}
                className="btn btn-icon btn-round invisible">
                <IconConfiguration/>
            </Link>}
          </ButtonToolbar>
        </div>
      </div>
    </OverlayTrigger>
  )
}

StorageItemChart.displayName = 'StorageItemChart'
StorageItemChart.propTypes = {
  analyticsLink: PropTypes.string,
  configurationLink: PropTypes.string,
  currentUsage: PropTypes.number,
  diameter: PropTypes.number,
  estimate: PropTypes.number,
  lastMonthEstimate: PropTypes.number,
  lastMonthPeak: PropTypes.number,
  lastMonthUsage: PropTypes.number,
  locations: PropTypes.array.isRequired,
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  peak: PropTypes.number
};

export default StorageItemChart
