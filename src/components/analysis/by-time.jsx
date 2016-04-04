import React from 'react'
import d3 from 'd3'
import moment from 'moment'
import numeral from 'numeral'

import Tooltip from '../tooltip'

const closestDate = d3.bisector(d => d.timestamp).left

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
      const i = closestDate(data, xDate, 1)
      const d0 = data[i - 1]
      const d1 = data[i]
      let d = d0;
      if(d1) {
        d = xDate - d0.timestamp.getTime() > d1.timestamp.getTime() - xDate ? d1 : d0
      }
      if(d) {
        this.setState({
          tooltipText: `${moment(d.timestamp).format('MMM D')} ${numeral(d[this.props.dataKey]).format('0,0')}`,
          tooltipX: xScale(d.timestamp),
          tooltipY: yScale(d[this.props.dataKey])
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
    if(!this.props.width || (!this.props.primaryData && !this.props.secondaryData)) {
      return <div>Loading...</div>
    }

    const yPrimaryExtent = this.props.primaryData && this.props.primaryData.length ?
      d3.extent(this.props.primaryData, d => d[this.props.dataKey])
      : [0,0]
    const xPrimaryExtent =  this.props.primaryData && this.props.primaryData.length ?
      d3.extent(this.props.primaryData, d => d.timestamp)
      : [new Date(), new Date()]
    const ySecondayExtent = this.props.secondaryData && this.props.secondaryData.length ?
      d3.extent(this.props.secondaryData, d => d[this.props.dataKey])
      : yPrimaryExtent
    const xSecondayExtent = this.props.secondaryData && this.props.secondaryData.length ?
      d3.extent(this.props.secondaryData, d => d.timestamp)
      : [new Date(), new Date()]

    const yScale = d3.scale.linear()
      .domain([0, Math.max(yPrimaryExtent[1], ySecondayExtent[1])])
      .range([
        this.props.height - this.props.padding * (this.props.axes ? 2 : 1),
        this.props.padding * (this.props.primaryLabel || this.props.secondaryLabel ? 2 : 1)
      ]);

    const xScale = d3.time.scale()
      .domain([
        Math.min(xPrimaryExtent[0], xSecondayExtent[0]),
        Math.max(xPrimaryExtent[1], xSecondayExtent[1])
      ])
      .range([
        this.props.padding * (this.props.axes ? 2 : 1),
        this.props.width - this.props.padding
      ])
      .nice(d3.time.day, 1);

    const trafficLine = d3.svg.line()
      .y(d => yScale(d[this.props.dataKey]))
      .x(d => xScale(d.timestamp))
      .interpolate('cardinal')
      .tension(0.9);

    const trafficArea = d3.svg.area()
      .y(d => yScale(d[this.props.dataKey]))
      .y0(yScale(0))
      .x(d => xScale(d.timestamp))
      .interpolate('cardinal')
      .tension(0.9);

    const secondaryLabelX = this.props.width - (this.props.padding * 1.5) -
      (this.refs.secondaryLabel ? this.refs.secondaryLabel.getBBox().width : 0)

    const primaryLabelX = secondaryLabelX -
      (this.refs.primaryLabel ? this.refs.primaryLabel.getBBox().width : 0) -
      (this.props.secondaryLabel ? this.props.padding * 1.5 : 0)

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
          onMouseMove={this.moveMouse(xScale, yScale, this.props.primaryData)}
          onMouseOut={this.deactivateTooltip}>
          {this.props.primaryData ? <g>
            <path d={trafficLine(this.props.primaryData)}
              className="line primary"/>
            {typeof this.props.area !== 'undefined' && !this.props.area ? null :
              <path d={trafficArea(this.props.primaryData)}
                className="area primary"
                fill="url(#dt-primary-gradient)" />
            }
          </g> : null}
          {this.props.secondaryData ? <g>
            <path d={trafficLine(this.props.secondaryData)}
              className="line secondary"/>
            {typeof this.props.area !== 'undefined' && !this.props.area ? null :
              <path d={trafficArea(this.props.secondaryData)}
                className="area secondary"
                fill="url(#dt-secondary-gradient)" />
            }
          </g> : null}
          {this.props.primaryLabel ?
            <g>
              <svg x={primaryLabelX} y={this.props.padding} ref="primaryLabel">
                <path className="line primary" d="M0 5L25 5" />
                <text x={35} y={10}>{this.props.primaryLabel}</text>
              </svg>
            </g>
          : null}
          {this.props.secondaryLabel ?
            <g>
              <svg x={secondaryLabelX} y={this.props.padding} ref="secondaryLabel">
                <path className="line secondary" d="M0 5L25 5" />
                <text x={35} y={10}>{this.props.secondaryLabel}</text>
              </svg>
            </g>
          : null}
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
          {this.props.axes ?
            xScale.ticks(d3.time.day, 1).map((tick, i) => {
              return (
                <g key={i}>
                  <text x={xScale(tick)} y={this.props.height - this.props.padding}>
                    {moment(tick).format('D')}
                  </text>
                </g>
              )
            })
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
            <linearGradient id="dt-primary-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00a9d4" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#00a9d4" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="dt-secondary-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#89ba17" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#89ba17" stopOpacity="0" />
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
  area: React.PropTypes.bool,
  axes: React.PropTypes.bool,
  className: React.PropTypes.string,
  dataKey: React.PropTypes.string,
  height: React.PropTypes.number,
  padding: React.PropTypes.number,
  primaryData: React.PropTypes.array,
  primaryLabel: React.PropTypes.string,
  secondaryData: React.PropTypes.array,
  secondaryLabel: React.PropTypes.string,
  width: React.PropTypes.number
}

module.exports = AnalysisByTime
