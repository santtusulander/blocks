import React, {PropTypes} from 'react'
import {AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Area, Legend} from 'recharts'

import d3 from 'd3'
import AreaTooltip from './area-tooltip'
import CustomLegend from './custom-legend'
import StackAreaCustomTick from './stacked-area-chart-tick'

import { black } from '../../constants/colors'
import { defaultTickDateFormat, dayInMilliSeconds } from '../../constants/chart'
import { formatBitsPerSecond, formatUnixTimestamp, unixTimestampToDate } from '../../util/helpers'


const renderAreas = (areas) => {
  return areas.map((area, i) =>
    <Area
      key={i}
      isAnimationActive={false}
      fillOpacity={0.9}
      {...area}
    />
  ).reverse()
}

const getChartClassName = (areas) => {
  if(areas.length === 4) {
    return 'two-stacked-comparison'
  }
  if(areas.length > 1 ) {
    return areas.find(area => area.className.includes('comparison_')) ? 'comparison' : 'stacked'
  }

  return 'non-stacked'
}

const StackedAreaChart = ({data, areas, valueFormatter = formatBitsPerSecond, chartLabel}) => {

  let dateFormat = defaultTickDateFormat
  const customLegendAreas = areas.length > 1 ? areas.concat().sort((area1, area2) => area1.stackId - area2.stackId) : areas
  const chartClassName = getChartClassName(areas)
  const getTicks = (data) => {
    if (!data || !data.length ) {return [];}

    const start = unixTimestampToDate(data[0].timestamp).valueOf()
    const end = unixTimestampToDate(data[data.length - 1].timestamp).valueOf()

    const steps = ( (end - start) <= dayInMilliSeconds ) ? d3.time.hour.utc : d3.time.day.utc

    dateFormat = ( (end - start) <= dayInMilliSeconds ) ? dateFormat = "HH:mm" : "MMM DD"

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
        <AreaChart data={data} margin={{left:50, bottom: 30, top: 100}} className={chartClassName}>
          { renderAreas(areas) }

          <XAxis dataKey='timestamp' ticks={getTicks(data)} tickFormatter={(val)=>formatUnixTimestamp(val, dateFormat)} tickLine={false} tick={{ transform: 'translate(0, 20)' }} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} tick={<StackAreaCustomTick />}/>

          <Legend
            wrapperStyle={{top: 20, right: 20, left: 'auto', width: 'auto'}}
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
                className={chartClassName}
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
  areas: PropTypes.array,
  chartLabel: PropTypes.string,
  data: PropTypes.array,
  valueFormatter: PropTypes.func
}

export default StackedAreaChart
