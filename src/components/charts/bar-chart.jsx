import React, { Component, PropTypes } from 'react'
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'

import CustomTooltip from './custom-tooltip'
import CustomLegend from './custom-legend'
import CustomXAxisTick from './custom-xaxis-tick'

import { formatBytes } from '../../util/helpers'

export default class BarChart extends Component {
  constructor(props) {
    super(props)
    this.state = { showTooltip: props.tooltipAlwaysActive }
  }

  /**
   * Attach mouse-event handlers to a bar if tooltip is desired to be shown only on bar hover.
   * If no stackId is present, default all bars to the same stack.
   */
  getBarProps(bar) {
    if (!this.props.tooltipAlwaysActive) {
      bar.onMouseEnter = () => this.setState({ showTooltip: true })
      bar.onMouseLeave = () => this.setState({ showTooltip: false })
    }
    bar.stackId = bar.stackId || 0
    return bar
  }

  renderBars() {
    return this.props.barModels.map((bar, index) =>
      <Bar
        key={index}
        isAnimationActive={false}
        {...this.getBarProps(bar)}/>
    )
  }

  render() {
    const {
      props: { chartData, barModels, chartLabel, maxBarSize, toolTipOffset, valueFormatter, hasLegend, secondaryXAxisTick },
      state: { showTooltip } } = this

    const tooltipIconClass = key => barModels.find(({ dataKey }) => dataKey === key).className

    return (
      <div className="bar-chart-container">
        <span id="bar-chart-label" className="bar-chart-label">{chartLabel}</span>
        <ResponsiveContainer>
          <RechartsBarChart
            data={chartData}
            maxBarSize={maxBarSize}
            margin={{top: 100, right: 54, left: 70, bottom: 54}}>
            <XAxis
              tick={secondaryXAxisTick && <CustomXAxisTick secondaryXAxisTick={secondaryXAxisTick} />}
              padding={{ right: 50 }}
              tickLine={false}
              axisLine={false}
              dataKey="name"/>
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={valueFormatter}/>
            {showTooltip &&
              <Tooltip
                content={<CustomTooltip/>}
                cursor={{ fill: 'rgba(0,0,0,0.1)' }}
                offset={toolTipOffset}
                animationDuration={0}
                valueFormatter={valueFormatter}
                iconClass={tooltipIconClass}/>}
            {hasLegend &&
              <Legend
                verticalAlign="top"
                wrapperStyle={{ top: 25 }}
                align="right"
                content={<CustomLegend data={barModels}/>}
                layout="vertical"/>}
            {this.renderBars()}
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

BarChart.displayName = "BarChart"

BarChart.defaultProps = {
  valueFormatter: formatBytes,
  tooltipAlwaysActive: true,
  toolTipOffset: 0,
  maxBarSize: 80
}

BarChart.propTypes = {
  barModels: PropTypes.arrayOf(
    PropTypes.shape({
      className: PropTypes.string,
      name: PropTypes.string.isRequired,
      dataKey: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]).isRequired,
      stackId: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])
    })).isRequired,
  chartData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
      formattedDate: PropTypes.string
    })
  ),
  chartLabel: PropTypes.oneOfType([ PropTypes.string, PropTypes.object ]),
  hasLegend: PropTypes.bool,
  maxBarSize: PropTypes.number,
  secondaryXAxisTick: PropTypes.array,
  toolTipOffset: PropTypes.number,
  tooltipAlwaysActive: PropTypes.bool,
  valueFormatter: PropTypes.func
}
