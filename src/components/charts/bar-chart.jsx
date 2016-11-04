import React, { Component } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'

import CustomTooltip from './custom-tooltip'
import CustomLegend from './custom-legend'

import { formatBytes } from '../../util/helpers'

class UDNBarChart extends Component {
  constructor(props) {
    super(props)
    this.state = { showTooltip: props.tooltipAlwaysActive }
  }

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
    return this.props.barModels.map(barProps =>
      <Bar
        {...this.getBarProps(barProps)}
        isAnimationActive={false}/>
    )
  }

  render() {
    const { props: { chartData, barModels, chartLabel }, state: { showTooltip } } = this
    const tooltipIconClass = key => barModels.find(({ dataKey }) => dataKey === key).className
    return (
        <div className="analysis-by-time analysis-stacked">
          <span className="stacked-chart-label">{chartLabel}</span>
          <ResponsiveContainer>
            <BarChart
              data={chartData}
              maxBarSize={80}
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
                  offset={40}
                  payload={[]}
                  content={<CustomTooltip iconClass={tooltipIconClass}/>}/>}
              <Legend
                verticalAlign="top"
                wrapperStyle={{ top: 25 }}
                align="right"
                content={<CustomLegend data={barModels}/>}
                layout="vertical"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
    );
  }
}

UDNBarChart.defaultProps = {
  tooltipAlwaysActive: true
}

export default UDNBarChart
