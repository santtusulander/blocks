import React from 'react'
import d3 from 'd3'
import moment from 'moment'
import numeral from 'numeral'
import Immutable from 'immutable'

import Tooltip from '../tooltip'

const closestDate = d3.bisector(d => d.timestamp).left

class AnalysisStacked extends React.Component {
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
      const i = closestDate(data, xDate, 1)
      const d0 = data[i - 1]
      const d1 = data[i]
      let d = d0;
      if(d1) {
        d = xDate - d0.timestamp.getTime() > d1.timestamp.getTime() - xDate ? d1 : d0
      }
      if(d) {
        this.setState({
          tooltipText: `${moment(d.timestamp).format('MMM D')} ${numeral(d.total).format('0,0')}`,
          tooltipX: xScale(d.timestamp),
          tooltipY: yScale(d.total)
        })
      }
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

    const yExtent = this.props.data && this.props.data.length ?
      d3.extent(this.props.data, d => d.total)
      : [0,0]
    const xExtent =  this.props.data && this.props.data.length ?
      d3.extent(this.props.data, d => d.timestamp)
      : [new Date(), new Date()]

    const yScale = d3.scale.linear()
      .domain([0, yExtent[1]])
      .range([
        this.props.height - this.props.padding * 2,
        this.props.padding
      ]);

    const xScale = d3.time.scale()
      .domain([xExtent[0], xExtent[1]])
      .range([
        this.props.padding * 2,
        this.props.width - this.props.padding
      ])
      .nice(d3.time.day, 1);

    let className = 'analysis-by-time analysis-stacked'
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
          {this.props.data ? this.props.data.map((day, i) => {
            return (
              <g key={i}>
                <line className="on-net"
                  x1={xScale(day.timestamp)}
                  x2={xScale(day.timestamp)}
                  y1={yScale(day.net_on.bytes)}
                  y2={yScale(0)}/>
                <line className="off-net"
                  x1={xScale(day.timestamp)}
                  x2={xScale(day.timestamp)}
                  y1={yScale(day.total)}
                  y2={yScale(day.net_on.bytes)}/>
              </g>
            )
          }) : null}
          {this.state.tooltipText ?
            <g>
              <circle r="5"
                cx={this.state.tooltipX}
                cy={this.state.tooltipY}/>
              <line className="crosshair"
                x1={this.state.tooltipX} x2={this.state.tooltipX}
                y1={0} y2={this.props.height}/>
            </g>
            : null}
          {xScale.ticks(d3.time.day, 1).map((tick, i) => {
            return (
              <g key={i}>
                <text x={xScale(tick)} y={this.props.height - this.props.padding}>
                  {moment(tick).format('D')}
                </text>
              </g>
            )
          })}
          {yScale.ticks(4).reduce((axes, tick, i) => {
            if(i) {
              axes.push(
                <g key={i}>
                  <text x={this.props.padding} y={yScale(tick)}>
                    {numeral(tick).format('0 a')}
                  </text>
                </g>
              );
            }
            return axes
          }, [])}
        </svg>
        <Tooltip x={this.state.tooltipX} y={this.state.tooltipY}
          hidden={!this.state.tooltipText}>
          {this.state.tooltipText}
        </Tooltip>
      </div>
    )
  }
}

AnalysisStacked.displayName = 'AnalysisStacked'
AnalysisStacked.propTypes = {
  className: React.PropTypes.string,
  data: React.PropTypes.array,
  height: React.PropTypes.number,
  padding: React.PropTypes.number,
  width: React.PropTypes.number
}

module.exports = AnalysisStacked
