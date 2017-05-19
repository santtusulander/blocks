import React, {PropTypes, Component} from 'react';
import Immutable from 'immutable'
import { ResponsiveContainer, Area, AreaChart } from 'recharts'

export default class MiniAreaChart extends Component {
  constructor() {
    super()

    this.renderAreas = this.renderAreas.bind(this)
  }

  renderAreas() {
    return this.props.areas.map((area, i) =>
      <Area
        key={i}
        isAnimationActive={false}
        fillOpacity={0}
        {...area}
      />
    ).reverse()
  }

  render() {
    const { chartLabel, data, className } = this.props

    return (
      <div className="mini-area-chart">
        <span className="mini-area-chart-label">{chartLabel}</span>
        <ResponsiveContainer minHeight={50} aspect={2}>
          <AreaChart data={data} className={className}>
            { this.renderAreas() }
          </AreaChart>
      </ResponsiveContainer>
      </div>);
  }
}

MiniAreaChart.displayName = 'MiniAreaChart'
MiniAreaChart.propTypes = {
  areas: PropTypes.object,
  chartLabel: PropTypes.string,
  className: PropTypes.string,
  data: PropTypes.instanceOf(Immutable.List)
};
