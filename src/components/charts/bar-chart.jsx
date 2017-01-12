import React, { Component, PropTypes } from 'react'
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'

import CustomTooltip from './custom-tooltip'
import CustomLegend from './custom-legend'

import { formatBytes } from '../../util/helpers'

export default class BarChart extends Component {
  constructor(props) {
    super(props)
    this.state = { showTooltip: props.tooltipAlwaysActive }
    this.bars = props.barModels.map(barModel => this.getBarProps(barModel))
  }

  /**
   * Attach mouse-event handlers to a bar if tooltip is desired to be shown only on bar hover.
   * If there are multiple bars to display per dataset, add stackId-prop that defines which stack
   * each bar belongs in. Otherwise delete the property as Recharts throws an error.
   * Defaulting all bars representing data for one entity to one stack.
   */
  getBarProps(bar) {
    if (!this.props.tooltipAlwaysActive) {
      bar.onMouseEnter = () => this.setState({ showTooltip: true })
      bar.onMouseLeave = () => this.setState({ showTooltip: false })
    }
    if (this.props.barModels.length > 1) {
      bar.stackId = bar.stackId || 0
    } else if (bar.stackId) {
      delete bar.stackId
    }
    return bar
  }

  renderBars() {
    return this.bars.map((bar, index) =>
      <Bar
        key={index}
        isAnimationActive={false}
        {...bar}/>
    )
  }

  render() {
    const {
      props: { chartData, barModels, chartLabel, maxBarSize, toolTipOffset, valueFormatter, hasLegend },
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
  toolTipOffset: PropTypes.number,
  tooltipAlwaysActive: PropTypes.bool,
  valueFormatter: PropTypes.func
}
