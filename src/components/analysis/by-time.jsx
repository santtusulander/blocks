import React from 'react'
import d3 from 'd3'
import moment from 'moment'
import numeral from 'numeral'

import Tooltip from '../tooltip'

const closestDate = d3.bisector(d => new Date(d.timestamp)).left

class AnalysisByTime extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      tooltipText: null,
      tooltipX: 0,
      tooltipY: 0
    }

    this.moveMouse = this.moveMouse.bind(this)
    this.deactivateTooltip = this.deactivateTooltip.bind(this)
  }
  moveMouse(xScale, yScale, data) {
    return e => {
      const bounds = this.refs.chart.getBoundingClientRect()
      const xDate = xScale.invert(e.pageX - bounds.left)
      const i = closestDate(data, (new Date(xDate)), 1)
      const d0 = data[i - 1]
      const d1 = data[i]
      let d = d0;
      if(d1) {
        d = xDate - (new Date(d0.timestamp).getTime()) > (new Date(d1.timestamp).getTime()) - xDate ? d1 : d0
      }
      this.setState({
        tooltipText: `${moment(d.timestamp).format('MMM D')} ${numeral(d[this.props.dataKey]).format('0,0')}`,
        tooltipX: xScale(new Date(d.timestamp)),
        tooltipY: yScale(d[this.props.dataKey])
      })
    }
  }
  deactivateTooltip() {
    this.setState({
      tooltipText: null
    })
  }
  render() {
    if(!this.props.width || !this.props.data) {
      return <div>Loading...</div>
    }

    const yExtent = d3.extent(this.props.data, d => d[this.props.dataKey])
    const xExtent = d3.extent(this.props.data, d => new Date(d.timestamp))

    const yScale = d3.scale.linear()
      .domain([0, yExtent[1]])
      .range([
        this.props.height - this.props.padding * (this.props.axes ? 2 : 1),
        this.props.padding
      ]);

    const xScale = d3.scale.linear()
      .domain([xExtent[0], xExtent[1]])
      .range([
        this.props.padding * (this.props.axes ? 2 : 1),
        this.props.width - this.props.padding
      ]);

    const trafficLine = d3.svg.line()
      .y(d => yScale(d[this.props.dataKey]))
      .x(d => xScale(new Date(d.timestamp)))
      .interpolate('cardinal-closed');

    let className = 'analysis-by-time'
    if(this.props.className) {
      className = className + ' ' + this.props.className
    }
    return (
      <div className={className}>
        <svg
          width={this.props.width}
          height={this.props.height}
          ref='chart'
          onMouseMove={this.moveMouse(xScale, yScale, this.props.data)}
          onMouseOut={this.deactivateTooltip}>
          <path d={trafficLine(this.props.data)}/>
          {this.props.axes ?
            xScale.ticks(4).reduce((axes, tick, i) => {
              if(axes.length < xScale.ticks(4).length-1) {
                axes.push(
                  <g key={i}>
                    <text x={xScale(tick)} y={this.props.height - this.props.padding}>
                      {moment(tick).format('MMM D')}
                    </text>
                  </g>
                );
              }
              return axes;
            }, [])
            : null
          }
          {this.props.axes ?
            yScale.ticks(4).reduce((axes, tick, i) => {
              if(i) {
                axes.push(
                  <g key={i}>
                    <text x={this.props.padding} y={yScale(tick)}>
                      {numeral(tick).format('0a')}
                    </text>
                  </g>
                );
              }
              return axes
            }, [])
            : null
          }
          <defs>
            <linearGradient id="dt-svg-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00a9d4" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#00a9d4" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        <Tooltip x={this.state.tooltipX} y={this.state.tooltipY}
          hidden={!this.state.tooltipText}>
          {this.state.tooltipText}
        </Tooltip>
      </div>
    )
  }
}

AnalysisByTime.displayName = 'AnalysisByTime'
AnalysisByTime.propTypes = {
  axes: React.PropTypes.bool,
  className: React.PropTypes.string,
  data: React.PropTypes.array,
  dataKey: React.PropTypes.string,
  height: React.PropTypes.number,
  padding: React.PropTypes.number,
  width: React.PropTypes.number
}

module.exports = AnalysisByTime
