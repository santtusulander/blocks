import React from 'react'
import d3 from 'd3'
import moment from 'moment'
import numeral from 'numeral'

import Tooltip from '../tooltip'

const closestDate = d3.bisector(d => d.timestamp).left

class AnalysisStackedByTime extends React.Component {
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
          tooltipText: `${moment(d.timestamp).format('MMM D')} ${numeral(d.bytes).format('0,0')}`,
          tooltipX: xScale(d.timestamp),
          tooltipY: yScale(d.bytes)
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
    if(!this.props.width || !this.props.dataSets) {
      return <div>Loading...</div>
    }

    const totals = this.props.dataSets.reduce((total, dataSet) => {
      return dataSet.map((datapoint, i) => {
        const bytes = total[i] ? total[i].bytes : 0
        return {
          bytes: datapoint.bytes + bytes,
          timestamp: datapoint.timestamp
        }
      })
    }, [])

    const yExtent = totals && totals.length ?
      d3.extent(totals, d => d.bytes)
      : [0,0]
    const xExtent =  totals && totals.length ?
      d3.extent(totals, d => d.timestamp)
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
    let columnHeights = []
    return (
      <div className={className}>
        <svg
          viewBox={'0 0 ' + this.props.width + ' ' + this.props.height}
          width={this.props.width}
          height={this.props.height}
          ref='chart'
          onMouseMove={this.moveMouse(xScale, yScale, totals)}
          onMouseOut={this.deactivateTooltip}>
          {this.props.dataSets ? this.props.dataSets.map((dataset, dataSetIndex) => {
            return dataset.map((day, i) => {
              const newTotal = columnHeights[i] ? columnHeights[i] + day.bytes : day.bytes
              const line = (
                <line key={i} className={`line-${dataSetIndex}`}
                  x1={xScale(day.timestamp)}
                  x2={xScale(day.timestamp)}
                  y1={yScale(columnHeights[i] || 0)}
                  y2={yScale(newTotal)}/>
              )
              columnHeights[i] = newTotal
              return line
            })
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

AnalysisStackedByTime.displayName = 'AnalysisStackedByTime'
AnalysisStackedByTime.propTypes = {
  className: React.PropTypes.string,
  dataSets: React.PropTypes.array,
  height: React.PropTypes.number,
  padding: React.PropTypes.number,
  width: React.PropTypes.number
}

module.exports = AnalysisStackedByTime
