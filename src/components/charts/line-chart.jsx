import React, {PropTypes} from 'react'
import { paleblue } from '../../constants/colors'

import {LineChart as ReactLineCharts, ResponsiveContainer, /* XAxis, YAxis, */ Tooltip, Line} from 'recharts'

const LineChart = ({data, dataKey}) => {
  //if No data found
  if (!data || !data[0][dataKey]) return <div>-</div>
  return (
    <ResponsiveContainer height={50} width={'100%'}>
      <ReactLineCharts data={data} >
        <Tooltip/>
        <Line type="monotone" dataKey={dataKey} stroke={paleblue} strokeWidth="2" dot={false} />
      </ReactLineCharts>
    </ResponsiveContainer>
  )
}

LineChart.displayName = 'LineChart'

LineChart.propTypes = {
  data: PropTypes.array,
  dataKey: PropTypes.string
}

export default LineChart
