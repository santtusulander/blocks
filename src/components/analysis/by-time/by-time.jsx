import React from 'react'
import { findDOMNode } from 'react-dom'
import d3 from 'd3'
import moment from 'moment'
import numeral from 'numeral'

import Tooltip from '../../tooltip'
import Legend from './legend'

const closestDate = d3.bisector(d => d.timestamp).left

const configureTooltip = (date, val, height, formatY, xScale, yScale) => {
  const formattedDate = moment(date).format('MMM D H:mm')
  const formattedValue = formatY(val)
  return {
    text: `${formattedDate} ${formattedValue}`,
    x: xScale(date),
    y: yScale(val),
    top: yScale(val) + 50 > height
  }
}

class AnalysisByTime extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      primaryTooltipText: null,
      primaryTooltipX: 0,
      primaryTooltipY: 0,
      primaryTooltipOffsetTop: false,
      primaryLabelWidth: 0,

      secondaryTooltipText: null,
      secondaryTooltipX: 0,
      secondaryTooltipY: 0,
      secondaryTooltipOffsetTop: false,
      secondaryLabelWidth: 0
    }

    this.moveMouse = this.moveMouse.bind(this)
    this.deactivateTooltip = this.deactivateTooltip.bind(this)

    this.measureChartLabels = this.measureChartLabels.bind(this)
    this.formatY = this.formatY.bind(this)
  }
  componentDidMount() {
    this.measureChartLabels()
  }
  measureChartLabels() {
    this.setState({
      primaryLabelWidth: this.refs.primaryLabel ? findDOMNode(this.refs.primaryLabel).getBBox().width : 0,
      secondaryLabelWidth: this.refs.secondaryLabel ? findDOMNode(this.refs.secondaryLabel).firstElementChild.getBBox().width : 0
    })
  }

  moveMouse(xScale, yScale, primaryData, secondaryData) {
    const configTooltip = (time, date) => configureTooltip(
      time,
      date,
      this.props.height,
      this.formatY,
      xScale,
      yScale
    )
    return e => {
      const sourceData = primaryData && primaryData.length ? primaryData : secondaryData
      const bounds = this.refs.chart.getBoundingClientRect()
      const xDate = xScale.invert(e.pageX - bounds.left)
      let i = closestDate(sourceData, xDate, 1)
      const d0 = sourceData[i - 1]
      const d1 = sourceData[i]
      if(d1 && xDate - d0.timestamp.getTime() <= d1.timestamp.getTime() - xDate) {
        i = i -1
      }
      if(primaryData && primaryData.length && primaryData[i]) {
        const tooltipConfig = configTooltip(
          primaryData[i].timestamp,
          primaryData[i][this.props.dataKey]
        )
        this.setState({
          primaryTooltipText: tooltipConfig.text,
          primaryTooltipX: tooltipConfig.x,
          primaryTooltipY: tooltipConfig.y,
          primaryTooltipOffsetTop: tooltipConfig.top
        })
      }
      if(secondaryData && secondaryData.length && secondaryData[i]) {
        const tooltipConfig = configTooltip(
          secondaryData[i].timestamp,
          secondaryData[i][this.props.dataKey]
        )
        this.setState({
          secondaryTooltipText: tooltipConfig.text,
          secondaryTooltipX: tooltipConfig.x,
          secondaryTooltipY: tooltipConfig.y,
          secondaryTooltipOffsetTop: tooltipConfig.top
        })
      }
    }
  }

  deactivateTooltip() {
    if (this.props.showTooltip) {
      this.setState({
        primaryTooltipText: null,
        secondaryTooltipText: null
      })
    }
  }

  formatY(val) {
    return this.props.yAxisFormat ?
      numeral(val).format(this.props.yAxisFormat)
    : this.props.yAxisCustomFormat ?
      this.props.yAxisCustomFormat(numeral(val).format('0'))
    : numeral(val).format('0 a')
  }
  render() {
    if(!this.props.width || (!this.props.primaryData && !this.props.secondaryData)) {
      return <div>Loading...</div>
    }
    const primaryData = this.props.primaryData || []
    let secondaryData = this.props.secondaryData || []
    if(!primaryData.length && !secondaryData.length) {
      return <div>No data found.</div>
    }
    if(this.props.stacked && primaryData && primaryData.length &&
      secondaryData && secondaryData.length) {
      secondaryData = secondaryData.map((data, i) => {
        const newData = Object.assign({}, data)
        newData.bits_per_second += primaryData[i].bits_per_second
        newData.bytes += primaryData[i].bytes
        return newData
      })
    }

    const yPrimaryExtent = primaryData && primaryData.length ?
      d3.extent(primaryData, d => d[this.props.dataKey])
      : [0,0]
    const xPrimaryExtent =  primaryData && primaryData.length ?
      d3.extent(primaryData, d => d.timestamp)
      : d3.extent(secondaryData, d => d.timestamp)
    const ySecondayExtent = secondaryData && secondaryData.length ?
      d3.extent(secondaryData, d => d[this.props.dataKey])
      : yPrimaryExtent
    const xSecondayExtent = secondaryData && secondaryData.length ?
      d3.extent(secondaryData, d => d.timestamp)
      : d3.extent(primaryData, d => d.timestamp)

    const yScale = d3.scale.linear()
      .domain([0, Math.max(yPrimaryExtent[1], ySecondayExtent[1])])
      .range([
        this.props.height - this.props.padding * (this.props.axes ? 2 : 1),
        this.props.padding * (this.props.primaryLabel || this.props.secondaryLabel ? 2 : 1)
      ]);

    const xScale = d3.time.scale.utc()
      .domain([
        Math.min(xPrimaryExtent[0], xSecondayExtent[0]),
        Math.max(xPrimaryExtent[1], xSecondayExtent[1])
      ])
      .range([
        this.props.padding * (this.props.axes ? 3 : 1),
        this.props.width - this.props.padding * (this.props.axes ? 2 : 1)
      ])
      .nice(d3.time.day.utc, 1);

    const trafficLine = d3.svg.line()
      .y(d => yScale(d[this.props.dataKey]))
      .x(d => xScale(d.timestamp))
      .interpolate('monotone')

    const trafficArea = d3.svg.area()
      .y(d => yScale(d[this.props.dataKey]))
      .y0(yScale(0))
      .x(d => xScale(d.timestamp))
      .interpolate('monotone')

    let className = 'analysis-by-time'
    if(this.props.className) {
      className = className + ' ' + this.props.className
    }
    let dayTicks = xScale.ticks(d3.time.day.utc, this.props.xAxisTickFrequency || 1)
    if (dayTicks.length > 12) {
      dayTicks = xScale.ticks(12)
    }
    let monthTicks = xScale.ticks(d3.time.month.utc, this.props.xAxisTickFrequency || 1)
    if (monthTicks.length > 3) {
      monthTicks = xScale.ticks(3)
    }
    /* Display the start month even if the date range doesn't start on the 1st
       but only if it's not so close to the end of the month that it'll overlap
       the next month's label */
    const dayTicksStartDate = this.props.axes ? moment(dayTicks[0]).date() : 1
    if(dayTicksStartDate < 25 && dayTicksStartDate > 1) {
      monthTicks.unshift(dayTicks[0])
    }
    return (
      <div className={className}
      onMouseMove={this.moveMouse(xScale, yScale, primaryData, secondaryData)}
      onMouseOut={this.deactivateTooltip}>
        <svg
          viewBox={'0 0 ' + this.props.width + ' ' + this.props.height}
          width={this.props.width}
          height={this.props.height}
          ref='chart'>
          {primaryData && primaryData.length ? <g>
            <path d={trafficLine(primaryData)}
              className="line primary"/>
            {typeof this.props.area !== 'undefined' && !this.props.area ? null :
              <path d={trafficArea(primaryData)}
                className="area primary"
                fill="url(#dt-primary-gradient)" />
            }
          </g> : null}
          {secondaryData && secondaryData.length ? <g>
            <path d={trafficLine(secondaryData)}
              className="line secondary"/>
            {typeof this.props.area !== 'undefined' && !this.props.area ? null :
              <path d={trafficArea(secondaryData)}
                className="area secondary"
                fill="url(#dt-secondary-gradient)" />
            }
          </g> : null}

          {this.state.primaryTooltipText ?
            <g>
              <circle r="5"
                cx={this.state.primaryTooltipX}
                cy={this.state.primaryTooltipY}/>
              <line className="crosshair"
                x1={this.state.primaryTooltipX} x2={this.state.primaryTooltipX}
                y1={0} y2={this.props.height}/>
            </g>
            : null}
          {this.state.secondaryTooltipText ?
            <g>
              <circle r="5"
                cx={this.state.secondaryTooltipX}
                cy={this.state.secondaryTooltipY}/>
              <line className="crosshair"
                x1={this.state.secondaryTooltipX}
                x2={this.state.secondaryTooltipX}
                y1={0} y2={this.props.height}/>
            </g>
            : null}
          {this.props.axes ?
            dayTicks.map((tick, i) => {
              return (
                <g key={i}>
                  <text x={xScale(tick)} y={this.props.height - this.props.padding}>
                    {moment.utc(tick).format('D')}
                  </text>
                </g>
              )
            })
            : null
          }
          {this.props.axes ?
            monthTicks.map((tick, i) => {
              if(tick) {
                return (
                  <g key={i}>
                    <text x={xScale(tick)}
                      y={this.props.height - (this.props.padding / 2)}>
                      {moment.utc(tick).format('MMMM')}
                    </text>
                  </g>
                )
              }
              else {
                return null
              }
            })
            : null
          }
          {this.props.axes ?
            yScale.ticks(4).reduce((axes, tick, i) => {
              if(i) {
                axes.push(
                  <g key={i}>
                    <text x={this.props.padding} y={yScale(tick)}>
                      {/* Numeral.js doesn't offer all needed formats, e.g. (bps),
                      so we can use custom formatter for those cases */}
                      {this.formatY(tick)}
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

      {this.props.showTooltip && <div className='tooltips'>
          <Tooltip
            x={this.state.primaryTooltipX}
            y={this.state.primaryTooltipY}
            hidden={!this.state.primaryTooltipText}
            offsetTop={this.state.primaryTooltipOffsetTop}
          >
              {this.state.primaryTooltipText}
          </Tooltip>

          <Tooltip
            x={this.state.secondaryTooltipX}
            y={this.state.secondaryTooltipY}
            hidden={!this.state.secondaryTooltipText}
            offsetTop={this.state.secondaryTooltipOffsetTop}
          >
            {this.state.secondaryTooltipText}
          </Tooltip>
      </div>}

      {this.props.showLegend && <Legend
          primaryLabel={this.props.primaryLabel}
          primaryValue={this.state.primaryTooltipText}
          secondaryLabel={this.props.secondaryLabel}
          secondaryValue={this.state.primaryTooltipText}
      />}
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
  showLegend: React.PropTypes.bool,
  showTooltip: React.PropTypes.bool,
  stacked: React.PropTypes.bool,
  width: React.PropTypes.number,
  xAxisTickFrequency: React.PropTypes.number,
  yAxisCustomFormat: React.PropTypes.func,
  yAxisFormat: React.PropTypes.string
}

AnalysisByTime.defaultProps = {
  showTooltip: true,
  showLegend: false
}

module.exports = AnalysisByTime
