import React, { PropTypes } from 'react'
import { paleblue, black } from '../../constants/colors'
import CustomTooltip from './line-chart-tooltip'
import { formatBitsPerSecond } from '../../util/helpers.js'
import { FormattedMessage } from 'react-intl'

import { LineChart as ReactLineCharts, ResponsiveContainer, Tooltip, Line } from 'recharts'

const LineChart = ({data, height = 50, dataKey, showTooltip = true, valueFormatter = formatBitsPerSecond}) => {
  //if No data found
  if (!data || typeof data[0][dataKey] !== 'number') {
    return <div><FormattedMessage id="portal.dash"/></div>
  }

  return (
    <ResponsiveContainer height={height} width='100%'>
      <ReactLineCharts data={data} >
        {showTooltip &&
          <Tooltip
            cursor={{stroke: black}}
            content={<CustomTooltip valueFormatter={valueFormatter} />}
            />}

        <Line type="monotone"
          dataKey={dataKey}
          stroke={paleblue}
          isAnimationActive={false}
          strokeWidth="2"
          dot={false}
        />

      </ReactLineCharts>
    </ResponsiveContainer>
  )
}

LineChart.displayName = 'LineChart'

LineChart.propTypes = {
  data: PropTypes.array,
  dataKey: PropTypes.string,
  height: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
  showTooltip: PropTypes.boolean,
  valueFormatter: PropTypes.func
}

export default LineChart
