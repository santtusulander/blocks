import React, {PropTypes, Component} from 'react';
import { ResponsiveContainer, Area, AreaChart } from 'recharts'

import { paleblue, orange } from '../../constants/colors'

const colors = [ paleblue, orange ]
const mockEmptyArea = [
  {emptyDatakey: 0},
  {emptyDatakey: 0},
  {emptyDatakey: 0},
  {emptyDatakey: 0},
  {emptyDatakey: 0}
]
export default class MiniAreaChart extends Component {
  constructor() {
    super()

    this.renderAreas = this.renderAreas.bind(this)
    this.renderGradients = this.renderGradients.bind(this)
  }

  renderAreas() {
    return this.props.areas.map((area, i) =>
      <Area
        key={i}
        isAnimationActive={false}
        stroke={colors[i]}
        strokeWidth="2"
        fillOpacity="1"
        fill={`url(#color-${area.dataKey})`}
        {...area}
      />
    ).reverse()
  }

  renderGradients() {
    const { areas, noGradient } = this.props

    return areas.map((area,i) => {
      const opacity = 0.5
      const {dataKey} = area

      return (
        <linearGradient key={i} id={`color-${dataKey}`}
            x1="0" y1="0"
            x2="0" y2="100%">
          <stop offset="0%" stopColor={colors[i]} stopOpacity={noGradient ? 0 : opacity}/>
          <stop offset="100%" stopColor={colors[i]} stopOpacity={0}/>
        </linearGradient>
      )
    })
  }

  render() {
    const { chartLabel, data, className } = this.props
    return (
      <div className="mini-area-chart">
        <span className="mini-area-chart-label">{chartLabel}</span>
        <ResponsiveContainer minHeight={50} aspect={2}>
          { !!data && !!data.length ?
            <AreaChart data={data} className={className}>
              <defs>
                { this.renderGradients() }
              </defs>
              { this.renderAreas() }
            </AreaChart>

            :<AreaChart data={mockEmptyArea} className={className}>
                <Area
                  isAnimationActive={false}
                  stroke={colors[0]}
                  strokeWidth="2"
                  dataKey="emptyDatakey"
                />
              </AreaChart>
          }
      </ResponsiveContainer>
      </div>);
  }
}

MiniAreaChart.displayName = 'MiniAreaChart'
MiniAreaChart.defaultProps = {
  noGradient: false,
  data: []
}
MiniAreaChart.propTypes = {
  areas: PropTypes.array,
  chartLabel: PropTypes.string,
  className: PropTypes.string,
  data: PropTypes.array,
  noGradient: PropTypes.bool
};
