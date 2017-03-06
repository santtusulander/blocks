import React, {PropTypes} from 'react'
import { paleblue, black } from '../../constants/colors'
import CustomTooltip from './line-chart-tooltip'
import { formatBitsPerSecond } from '../../util/helpers.js'

import {LineChart as ReactLineCharts, ResponsiveContainer, Tooltip, Line} from 'recharts'

const LineChart = ({data, dataKey, valueFormatter = formatBitsPerSecond}) => {
  //if No data found
  if (!data || !data[0][dataKey]) {
    return <div>-</div>
  }
  return (
    <ResponsiveContainer height={50} width={'100%'}>
      <ReactLineCharts data={data} >
        <Tooltip
        cursor={{stroke: black}}
        content={
            <CustomTooltip valueFormatter={valueFormatter} />}
          />
        <Line type="monotone" dataKey={dataKey} stroke={paleblue} isAnimationActive={false} strokeWidth="2" dot={false} />
      </ReactLineCharts>
    </ResponsiveContainer>
  )
}

LineChart.displayName = 'LineChart'

LineChart.propTypes = {
  data: PropTypes.array,
  dataKey: PropTypes.string,
  valueFormatter: PropTypes.func
}

export default LineChart
