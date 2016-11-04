import React, { Component, PropTypes } from 'react'
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'

import CustomTooltip from './custom-tooltip'
import CustomLegend from './custom-legend'

import { formatBytes } from '../../util/helpers'

export default class BarChart extends Component {
  constructor(props) {
    super(props)
    this.state = { showTooltip: props.tooltipAlwaysActive }
  }

  /**
   * Attach mouse-event handlers to a bar if tooltip is desired to be shown only on bar hover.
   * If there are multiple bars to display per dataset, add stackId-prop that defines which stack
   * each bar belongs in. Defaulting all bars representing data for one entity to one stack.
   */
  getBarProps(props) {
    if (!this.props.tooltipAlwaysActive) {
      props.onMouseEnter = () => this.setState({ showTooltip: true })
      props.onMouseLeave = () => this.setState({ showTooltip: false })
    }
    if (this.props.barModels.length > 1) {
      props.stackId = props.stackId || 0
    }
    return props
  }

  renderBars() {
    return this.props.barModels.map((barProps, index) =>
      <Bar
        key={index}
        isAnimationActive={false}
        {...this.getBarProps(barProps)}/>
    )
  }

  render() {
    const { props: { chartData, barModels, chartLabel, maxBarSize, toolTipOffset }, state: { showTooltip } } = this
    const tooltipIconClass = key => barModels.find(({ dataKey }) => dataKey === key).className
    return (
        <div className="bar-chart-container">
          <span className="bar-chart-label">{chartLabel}</span>
          <ResponsiveContainer>
            <RechartsBarChart
              data={chartData}
              maxBarSize={maxBarSize}
              margin={{top: 100, right: 30, left: 20, bottom: 20}}>
              {this.renderBars()}
              <XAxis
                padding={{ right: 50 }}
                tickLine={false}
                axisLine={false}
                dataKey="name"/>
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={formatBytes}/>
              {showTooltip &&
                <Tooltip
                  animationDelay={500}
                  animationEase="linear"
                  offset={toolTipOffset}
                  content={<CustomTooltip iconClass={tooltipIconClass}/>}/>}
              <Legend
                verticalAlign="top"
                wrapperStyle={{ top: 25 }}
                align="right"
                content={<CustomLegend data={barModels}/>}
                layout="vertical"/>
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
    );
  }
}

BarChart.defaultProps = {
  tooltipAlwaysActive: true,
  toolTipOffset: 40,
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
  chartData: PropTypes.arrayOf(PropTypes.object),
  chartLabel: PropTypes.string,
  maxBarSize: PropTypes.number,
  toolTipOffset: PropTypes.number,
  tooltipAlwaysActive: PropTypes.bool
}
