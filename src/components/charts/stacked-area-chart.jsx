import React, {PropTypes} from 'react'
import {AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Area} from 'recharts'
import { formatBitsPerSecond, formatUnixTimestamp } from '../../util/helpers'

const AREA_COLORS = [
  "#00a9d4",
  "#89ba17",
  "#00a9d4",
  "#89ba17"
]

const StackedAreaChart = ({data, dataKeys}) => {

  // try to get dataKeys from 1st object keys
  if (!dataKeys && data && data[0]) {
    dataKeys = Object
                .keys(data[0])
                .filter( item => item !== 'timestamp')
  }

  const firstItem = data && data[0]
  const lastItem = data && data[data.length - 1]

  const timeRange = lastItem.timestamp - firstItem.timestamp
  let dateFormat, xTickCount;

  //if less than 24h, show HH:MM
  if (timeRange <= 60 * 60 * 24) {
    xTickCount=24
    dateFormat = "HH:mm"
  }
  else {
    xTickCount = Math.ceil(timeRange / (60 * 60 * 24))
    dateFormat = "DD"
  }

  return (
    <ResponsiveContainer minHeight={200} aspect={2.5} >

    { !dataKeys || data.length === 0
      ? <div/>
      :
      <AreaChart data={data} >

        {/*<defs>
        {
          dataKeys.map( (key, i) => {
            let opacity = 0.8
            if ( key.includes('comparison')) { opacity = 0.5 }

            return (
              <linearGradient key={i} id={`color-${key}`} x1="0" y1="0" x2="0" y2="100%">
                <stop offset="0%" stopColor={AREA_COLORS[i]} stopOpacity={opacity}/>
                <stop offset="100%" stopColor={AREA_COLORS[i]} stopOpacity={0}/>
              </linearGradient>
            )
          })
        }
        </defs>
        */}

        <XAxis dataKey="timestamp" tickFormatter={(ts) => formatUnixTimestamp(ts, dateFormat)}/>
        <YAxis tickFormatter={(val) => formatBitsPerSecond(val, true)}/>

        <Tooltip/>

        {
          dataKeys.map( (key,i) => {
            let stackId = "data"
            if ( key.includes('comparison')) { stackId = "comparison" }
            return <Area type='monotone' key={i} stackId={stackId} dataKey={key} stroke={AREA_COLORS[i]} strokeWidth='2' fill={`url(#color-${key})`} />
          }).reverse()
        }

      </AreaChart>
    }

  </ResponsiveContainer>
  )
}

StackedAreaChart.propTypes = {
  data: PropTypes.array,
  dataKeys: PropTypes.array
}

export default StackedAreaChart
