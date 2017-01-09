import React, {PropTypes} from 'react'
import { paleblue } from '../../constants/colors'

import {LineChart , ResponsiveContainer, /* XAxis, YAxis, */ Tooltip, Line} from 'recharts'

const TinyLineChart = ({data, dataKey}) => {
  //if No data found
  if (!data || !data[0][dataKey]) return <div>-</div>
  return (
    <ResponsiveContainer height={50} width={'100%'}>
      <LineChart data={data} >
        <Tooltip/>
        <Line type="monotone" dataKey={dataKey} stroke={paleblue} strokeWidth="2" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

TinyLineChart.displayName = 'TinyLineChart'

TinyLineChart.propTypes = {
  data: PropTypes.array,
  dataKey: PropTypes.string
}

export default TinyLineChart
