import React, {PropTypes} from 'react'
import {AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Area, Legend} from 'recharts'

import d3 from 'd3'
import { orderBy, get } from 'lodash'
import AreaTooltip from './area-tooltip'
import CustomLegend from './custom-legend'
import StackAreaCustomTick from './stacked-area-chart-tick'

import { formatBitsPerSecond, formatUnixTimestamp, unixTimestampToDate } from '../../util/helpers'

import { paleblue, green, black } from '../../constants/colors'

const AREA_COLORS = {
  odd: paleblue,
  even: green,

  fallback: paleblue
}

/**
 * getAreaColor
 * Checks for area key/type and returns color for it
 * if type is not matched tries to check if itetarion is even/odd, else return fallback color
 * @param  {[type]} areaBackground   [description]
 * @param  {[type]} i   [description]
 * @return {[type]}     [description]
 */
const getAreaColor = (areaBackground, i) => {
  let colorKey = 'fallback'

  if(areaBackground) return areaBackground

  if ( i % 2) colorKey = 'odd'
  else colorKey = 'even'

  return AREA_COLORS[colorKey]
}

/**
 * getStrokeColor
 * Checks for area key/type and returns stroke color for it
 * if no defined stroke color, there will be no stroke, return false string
 * @param  {[type]} color [Stroke color hex code]
 * @return {[type]}     [description]
 */

const getStrokeColor = (color) => {
  return color ? color : "false"
}

/**
 * renderAreas
 * Populate Rechart areas with stroke and area
 * @param  {[type]} areas [Area datasets]
 * @param  {[type]} customAreaColors [custom area colors]
 * @return {[type]}     [description]
 */

const renderAreas = (areas, areaColors) => {
  return areas.map((area, i) =>
    <Area
      key={i}
      isAnimationActive={false}
      stroke={getStrokeColor(get(areaColors, `${area.dataKey}.stroke`))}
      strokeWidth='2'
      fillOpacity={0.9}
      fill={getAreaColor(get(areaColors, `${area.dataKey}.background`), i)}
      {...area}
    />
  ).reverse()
}

const StackedAreaChart = ({data, areas, valueFormatter = formatBitsPerSecond, chartLabel, areaColors}) => {

  let dateFormat = "MM/DD"
  const customLegendAreas = orderBy(areas, 'stackId', 'asc')
  const getTicks = (data) => {
    if (!data || !data.length ) {return [];}

    const start = unixTimestampToDate(data[0].timestamp).valueOf()
    const end = unixTimestampToDate(data[data.length - 1].timestamp).valueOf()

    const steps = ( (end - start) <= 60 * 60 * 24 * 1000 ) ? d3.time.hour.utc : d3.time.day.utc

    dateFormat = ( (end - start) <= 60 * 60 * 24 * 1000 ) ? dateFormat = "HH:mm" : "MMM DD"

    const scale = d3.time
                    .scale
                    .utc()
                    .domain([start, end])
                    .range([0,1])


    const ticks = scale.ticks(steps, 1);
    return ticks.map(entry => +(entry/1000) );
  };

  return (
    <div className="stacked-area-chart-container">
      <span id="stacked-area-chart-label" className="stacked-area-chart-label">{chartLabel}</span>
      <ResponsiveContainer minHeight={300} aspect={2}>
        <AreaChart data={data} margin={{left:50, bottom: 30, top: 100}}>
          { renderAreas(areas, areaColors) }

          <XAxis dataKey='timestamp' ticks={getTicks(data)} tickFormatter={(val)=>formatUnixTimestamp(val, dateFormat)} tickLine={false} tick={{ transform: 'translate(0, 20)' }} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} tick={<StackAreaCustomTick />}/>

          <Legend
            wrapperStyle={{top: 0, right: 0, left: 'auto', width: 'auto'}}
            margin={{top: 0, left: 0, right: 0, bottom: 0}}
            content={<CustomLegend data={customLegendAreas}/>}
          />

          <Tooltip
            animationEasing="linear"
            cursor={{stroke: black}}
            content={
              <AreaTooltip
                iconClass={() => 'tooltip-class'}
                valueFormatter={valueFormatter}
              />
            }
          />
        </AreaChart>
    </ResponsiveContainer>
  </div>
  )
}

StackedAreaChart.displayName = 'StackedAreaChart'

StackedAreaChart.propTypes = {
  areaColors: PropTypes.object,
  areas: PropTypes.array,
  chartLabel: PropTypes.string,
  data: PropTypes.array,
  valueFormatter: PropTypes.func
}

export default StackedAreaChart
