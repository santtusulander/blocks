import React from 'react'
import moment from 'moment'
import d3 from 'd3'
import { formatDate } from '../../util/helpers'

const TimeAxisLabels = ({xScale, height, padding, xAxisTickFrequency, showHours}) => {
  const hourTicks = showHours ? xScale.ticks(9) : []
  let dayTicks = xScale.ticks(d3.time.day, xAxisTickFrequency || 1)

  if (dayTicks.length > 35) {
    dayTicks = xScale.ticks(35)
  }

  let monthTicks = xScale.ticks(d3.time.month, xAxisTickFrequency || 1)
  if (monthTicks.length > 3) {
    monthTicks = xScale.ticks(3)
  }
  /* Display the start month even if the date range doesn't start on the 1st
     but only if it's not so close to the end of the month that it'll overlap
     the next month's label */
  const dayTicksStartDate = moment(dayTicks[0]).date()
  if (dayTicksStartDate < 25 && dayTicksStartDate > 1) {
    monthTicks.unshift(dayTicks[0])
  }
  return (
    <g>
      {hourTicks.map((tick, i) => {
        return (
          <g key={i}>
            <text x={xScale(tick)} y={height -  1.5 * padding} className="x-axis">
              {formatDate(tick, 'HH[:]mm')}
            </text>
          </g>
        )
      })}
      {dayTicks.map((tick, i) => {
        return (
          <g key={i}>
            <text x={xScale(tick)} y={height - padding} className="x-axis">
              {formatDate(tick, 'D')}
            </text>
          </g>
        )
      })}
      {monthTicks.map((tick, i) => {
        if (tick) {
          return (
            <g key={i}>
              <text x={xScale(tick)}
                y={height - (padding / 2)}>
                {formatDate(tick, 'MMMM')}
              </text>
            </g>
          )
        } else {
          return null
        }
      })}
    </g>
  )
}

TimeAxisLabels.displayName = 'TimeAxisLabels'
TimeAxisLabels.propTypes = {
  height: React.PropTypes.number,
  padding: React.PropTypes.number,
  showHours: React.PropTypes.bool,
  xAxisTickFrequency: React.PropTypes.number,
  xScale: React.PropTypes.func
}

export default TimeAxisLabels
