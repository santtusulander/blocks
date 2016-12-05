import React, {PropTypes} from 'react'
import {AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Area, Legend} from 'recharts'
import AreaTooltip from './area-tooltip'
import CustomLegend from './custom-legend'


import { formatBitsPerSecond, formatUnixTimestamp } from '../../util/helpers'

import { paleblue, green, darkblue, darkgreen } from '../../constants/colors'
import './stacked-area-chart.scss'

const AREA_COLORS = {
  http: paleblue,
  https: green,
  comparison_http: darkblue,
  comparison_https: darkgreen,

  odd: paleblue,
  even: green,

  fallback: paleblue
}

/**
 * getAreaColor
 * Checks for area key/type and returns color for it
 * if type is not matched tries to check if itetarion is even/odd, else return fallback color
 * @param  {[type]} key [description]
 * @param  {[type]} i   [description]
 * @return {[type]}     [description]
 */
const getAreaColor = (key, i) => {
  let colorKey = 'fallback'

  if ( key.includes('comparison_https') ) colorKey = 'comparison_https'
  else if ( key.includes('comparison_http') ) colorKey = 'comparison_http'
  else if ( key.includes('https')) colorKey = 'https'
  else if ( key.includes('http')) colorKey = 'http'
  else if ( i % 2) colorKey = 'odd'
  else colorKey = 'even'

  const color = AREA_COLORS[colorKey]

  return color

}

const StackedAreaChart = ({data, areas, valueFormatter = formatBitsPerSecond}) => {
  let dateFormat, /*xTickCount,*/ timeRange;

  const firstItem = data && data[0]
  const lastItem = data && data[data.length - 1]

  if (lastItem && lastItem.timestamp && firstItem && firstItem.timestamp) {
    timeRange = lastItem.timestamp - firstItem.timestamp
  }

  //TODO: Fix X-axis time ranges
  //if less than 24h, show HH:MM
  if (timeRange <= 60 * 60 * 24) {
    //xTickCount=24
    dateFormat = "HH:mm"
  } else {
    //xTickCount = Math.ceil(timeRange / (60 * 60 * 24))
    dateFormat = "DD"
  }

  const renderGradients = (areas) => {
    return areas.map( (area,i) => {
      let opacity = 0.8
      const {dataKey} = area
      //if ( key.includes('comparison')) { opacity = 0.5 }

      return (
        <linearGradient key={i} id={`color-${dataKey}`} x1="0" y1="0" x2="0" y2="100%">
          <stop offset="0%" stopColor={getAreaColor(dataKey, i)} stopOpacity={opacity}/>
          <stop offset="100%" stopColor={getAreaColor(dataKey, i)} stopOpacity={0}/>
        </linearGradient>
      )
    })
  }

  const renderAreas = (areas) => {
    return areas.map((area, i) =>
      <Area
        key={i}
        isAnimationActive={false}
        stroke={getAreaColor(area.dataKey, i)}
        strokeWidth='2'
        fill={`url(#color-${area.dataKey})`}
        {...area}
      />
    ).reverse()
  }

  return (
    <ResponsiveContainer minHeight={200} aspect={2.5} className='stacked-area-chart-container'>
      <AreaChart data={data} >

        <defs>
          { renderGradients(areas) }
        </defs>

        { renderAreas(areas) }

        <XAxis dataKey="timestamp" tickFormatter={(ts) => formatUnixTimestamp(ts, dateFormat)}/>
        <YAxis tickFormatter={(val) => valueFormatter(val, true)}/>

        <Legend
          wrapperStyle={{top: 0, right: 0, left: 'auto', width: 'auto'}}
          margin={{top: 0, left: 0, right: 0, bottom: 0}}
          content={<CustomLegend data={areas}/>}
        />

        <Tooltip
          animationEasing="linear"
          content={
            <AreaTooltip
              iconClass={() => 'tooltip-class'}
              valueFormatter={valueFormatter}
            />
          }
        />
      </AreaChart>
  </ResponsiveContainer>
  )
}

StackedAreaChart.propTypes = {
  areas: PropTypes.array,
  data: PropTypes.array,
  dataKeys: PropTypes.array,
  valueFormatter: PropTypes.func
}

export default StackedAreaChart
