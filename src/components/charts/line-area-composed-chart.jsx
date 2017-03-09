import React, {PropTypes} from 'react';
import { ComposedChart, Line, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import d3 from 'd3'
import classNames from 'classnames'

import AreaTooltip from './area-tooltip'
import CustomLegend from './custom-legend'
import { black } from '../../constants/colors'
import { defaultTickDateFormat, dayInMilliSeconds } from '../../constants/chart'
import StackAreaCustomTick from './stacked-area-chart-tick'

import {formatUnixTimestamp, unixTimestampToDate, formatBitsPerSecond } from '../../util/helpers'

const LineAreaComposedChart = ({chartLabel, data, valueFormatter = formatBitsPerSecond, isMiniChart = false, width, height}) => {
  let dateFormat = defaultTickDateFormat
  const haveEstimate = data && data[0] && data[0].estimate
  const isComparison = data && data[0] && data[0].comparison_storage
  const containerProps = isMiniChart ? { width: width, height: height} : { minHeight: 300, aspect: 2}
  const getTicks = (data) => {
    if (!data || !data.length || isMiniChart ) {return [];}

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
    <div className="line-area-composed-chart-container">
      <span id="line-area-composed-chart-label" className="line-area-composed-chart-label">
        {chartLabel}
      </span>
        <ResponsiveContainer {...containerProps}>
          <ComposedChart
              data={data}
              margin={isMiniChart ? {} : {left:50, bottom: 30, top: 100}}
              className={classNames({'comparison': isComparison}, {'non-stacked': !isComparison})}
          >
            <Area
              isAnimationActive={false}
              fillOpacity={0.9}
              dataKey="storage"
              stackId="1"
              name="Storage"
              className="storage"
            />
            { isComparison &&
              <Area
                isAnimationActive={false}
                fillOpacity={0.9}
                dataKey="comparison_storage"
                stackId="2"
                name="Comparison Storage"
                className="comparison_storage"
              />
            }
            { haveEstimate &&
              <Line dataKey="estimate" name="Estimate" isAnimationActive={false} className="estimate" dot={false} />
            }
            { !isMiniChart &&
              <XAxis dataKey='timestamp'
                     ticks={getTicks(data)}
                     tickFormatter={(val)=>formatUnixTimestamp(val, dateFormat)}
                     tickLine={false}
                     tick={{ transform: 'translate(0, 20)' }}
                     axisLine={false}
                     scale="point"
                    />
            }
            {
              isMiniChart &&
              <XAxis hide={true} scale="point" />
            }
            { !isMiniChart &&
              <YAxis tickLine={false} axisLine={false} tick={<StackAreaCustomTick />}/>
            }

            { !isMiniChart &&
              <Legend
                wrapperStyle={{top: 20, right: 20, left: 'auto', width: 'auto'}}
                margin={{top: 0, left: 0, right: 0, bottom: 0}}
                content={<CustomLegend />}
              />
            }

            <Tooltip
              cursor={{stroke: black}}
              content={
                <AreaTooltip
                  iconClass={() => 'tooltip-class'}
                  valueFormatter={valueFormatter}
                />
              }
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
  );
}

LineAreaComposedChart.displayName = "LineAreaComposedChart"
LineAreaComposedChart.propTypes = {
  chartLabel: PropTypes.string,
  data: PropTypes.array,
  height: PropTypes.number,
  isMiniChart: PropTypes.bool,
  valueFormatter: PropTypes.func,
  width: PropTypes.number
};

export default LineAreaComposedChart
