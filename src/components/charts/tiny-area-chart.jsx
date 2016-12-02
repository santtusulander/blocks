import React, {PropTypes} from 'react'
import { paleblue } from '../../constants/colors'

import {AreaChart /*, ResponsiveContainer, XAxis, YAxis, Tooltip, */, Area} from 'recharts'

const TinyAreaChart = ({data, dataKey}) => {
  if (!data || data.length === 0 || !dataKey) return <div/>

  return (
    <AreaChart width={200} height={60} data={data}
        margin={{top: 5, right: 0, left: 0, bottom: 5}}>
        <Area type='monotone' dataKey={dataKey} stroke={paleblue} fill={paleblue} />
    </AreaChart>
  )
}



export default TinyAreaChart
