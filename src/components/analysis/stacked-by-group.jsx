import React from 'react'
import d3 from 'd3'
import numeral from 'numeral'
import Immutable from 'immutable'

import Tooltip from '../tooltip'

const maxStrokeWidth = 100
const minStrokeWidth = 20
const closestGroup = d3.bisector(d => d.groupIndex).left

class AnalysisStackedByGroup extends React.Component {
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
      const xGroup = xScale.invert(e.pageX - bounds.left)
      const i = closestGroup(data, xGroup, 1)
      const d0 = data[i - 1]
      const d1 = data[i]
      let d = d0;
      if(d1) {
        d = xGroup - d0.timestamp.getTime() > d1.timestamp.getTime() - xGroup ? d1 : d0
      }
      if(d) {
        this.setState({
          tooltipText: `${d.group} ${numeral(d.bytes).format('0,0')}`,
          tooltipX: xScale(d.groupIndex),
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

    const totals = this.props.dataSets.map(dataSet => {
      const bytes = dataSet.get('data').reduce((total, data) => total + data, 0)
      return {
        bytes: bytes,
        group: dataSet.get('group'),
        groupIndex: dataSet.get('groupIndex')
      }
    }).toJS()

    const yExtent = totals && totals.length ?
      d3.extent(totals, d => d.bytes)
      : [0,0]

    const yMinPx = this.props.height - this.props.padding * 2

    const yScale = d3.scale.linear()
      .domain([0, yExtent[1]])
      .range([
        yMinPx,
        this.props.padding
      ])

    const xMinPx = this.props.padding * 2
    const xMaxPx = this.props.width - this.props.padding

    const xScale = d3.scale.linear()
      .domain([0, this.props.dataSets.size])
      .range([xMinPx, xMaxPx])

    let className = 'analysis-by-time analysis-stacked'
    if(this.props.className) {
      className = className + ' ' + this.props.className
    }
    let columnHeights = []

    let strokeWidth = (xMaxPx - xMinPx) / this.props.dataSets.size - this.props.padding
    strokeWidth = Math.max(strokeWidth, minStrokeWidth)
    strokeWidth = Math.min(strokeWidth, maxStrokeWidth)

    // If last bar isn't at edge of chart, add padding to center bars
    let centerPad = 0
    const lastBarEdge = xScale(this.props.dataSets.size - 1) + strokeWidth / 2
    if(lastBarEdge < xMaxPx) {
      centerPad = (xMaxPx - lastBarEdge) / 2 - this.props.padding
    }

    return (
      <div className={className}>
        <svg
          viewBox={'0 0 ' + this.props.width + ' ' + this.props.height}
          width={this.props.width}
          height={this.props.height}
          ref='chart'>
          {this.props.dataSets ? this.props.dataSets.map((dataset, dataSetIndex) => {
            const xPos = xScale(dataSetIndex) +
              strokeWidth / 2  +
              this.props.padding / 2 +
              centerPad
            return (
              <g key={dataSetIndex}>
                {dataset.get('data').map((data, i) => {
                  const newTotal = columnHeights[dataSetIndex] ? columnHeights[dataSetIndex] + data : data
                  const line = (
                    <line key={`${i} ${dataSetIndex}`} className={`line-${i}`}
                      style={{strokeWidth: `${strokeWidth}px`}}
                      x1={xPos}
                      x2={xPos}
                      y1={yScale(columnHeights[dataSetIndex] || 0)}
                      y2={yScale(newTotal)}/>
                  )
                  columnHeights[dataSetIndex] = newTotal
                  return line
                })}
                <text x={xPos} y={yMinPx + this.props.padding}
                  textAnchor="middle">
                  {dataset.get('group')}
                </text>
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
          {yScale.ticks(4).reduce((axes, tick, i) => {
            if(i) {
              axes.push(
                <g key={i}>
                  <text x={this.props.padding * 2} y={yScale(tick)}
                    textAnchor="end">
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

AnalysisStackedByGroup.displayName = 'AnalysisStackedByGroup'
AnalysisStackedByGroup.propTypes = {
  className: React.PropTypes.string,
  dataSets: React.PropTypes.instanceOf(Immutable.List),
  height: React.PropTypes.number,
  padding: React.PropTypes.number,
  width: React.PropTypes.number
}

module.exports = AnalysisStackedByGroup
