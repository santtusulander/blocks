import React, {PropTypes} from 'react'
import { paleblue } from '../../constants/colors'

import {AreaChart /*, ResponsiveContainer, XAxis, YAxis, */ , Tooltip, Area} from 'recharts'

const TinyAreaChart = ({data, dataKey}) => {
  //if No data found
  if (!data || !data[0][dataKey]) return <div>-</div>

  return (
    <AreaChart width={200} height={60} data={data} >
      <Area type='monotone' dataKey={dataKey} stroke={paleblue} fill={paleblue} />
      <Tooltip/>
    </AreaChart>
  )
}

TinyAreaChart.displayName = 'TinyAreaChart'

TinyAreaChart.propTypes = {
  data: PropTypes.array,
  dataKey: PropTypes.string
}

export default TinyAreaChart
