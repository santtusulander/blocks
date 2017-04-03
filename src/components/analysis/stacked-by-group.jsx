import React from 'react'
import d3 from 'd3'
import Immutable from 'immutable'

import Tooltip from '../tooltip'
import { formatBytes } from '../../util/helpers'
import {FormattedMessage} from 'react-intl'

const maxStrokeWidth = 100
const minStrokeWidth = 20
// const closestGroup = d3.bisector(d => d.groupIndex).left

class AnalysisStackedByGroup extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      tooltipText: null,
      tooltipX: 0,
      tooltipY: 0
    }

  }
  render() {
    if (!this.props.width || !this.props.datasets) {
      return <div><FormattedMessage id="portal.loading.text"/></div>
    }

    const totals = this.props.datasets.map(dataSet => {
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
        this.props.padding * 2
      ])

    const xMinPx = this.props.padding * 2
    const xMaxPx = this.props.width - this.props.padding

    const xScale = d3.scale.linear()
      .domain([0, this.props.datasets.size])
      .range([xMinPx, xMaxPx])

    let className = 'analysis-by-time analysis-stacked'
    if (this.props.className) {
      className = className + ' ' + this.props.className
    }
    const columnHeights = []

    let strokeWidth = (xMaxPx - xMinPx) / this.props.datasets.size - this.props.padding
    strokeWidth = Math.max(strokeWidth, minStrokeWidth)
    strokeWidth = Math.min(strokeWidth, maxStrokeWidth)

    // If last bar isn't at edge of chart, add padding to center bars
    let centerPad = 0
    const lastBarEdge = xScale(this.props.datasets.size - 1) + strokeWidth / 2
    if (lastBarEdge < xMaxPx) {
      centerPad = (xMaxPx - lastBarEdge) / 2 - this.props.padding
    }
    const xOffset = strokeWidth / 2 + this.props.padding / 2 + centerPad

    return (
      <div className={className}>
        <svg
          viewBox={'0 0 ' + this.props.width + ' ' + this.props.height}
          width={this.props.width}
          height={this.props.height}
          ref='chart' >
          {this.props.datasets ? this.props.datasets.map((dataset, dataSetIndex) => {
            const xPos = xScale(dataSetIndex) + xOffset
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
          {yScale.ticks(4).map((tick, i) => {
            return (
              <g key={i}>
                <text x={this.props.padding*1.5} y={yScale(tick)}
                  className="y-axis">
                  {formatBytes(tick)}
                </text>
              </g>
            )
          })}
          {this.props.chartLabel &&
            <text x={this.props.padding} y={this.props.padding}
              className="chart-label">
              {this.props.chartLabel}
            </text>
          }
        </svg>
        <Tooltip x={this.state.tooltipX} y={this.state.tooltipY}
          hidden={!this.state.tooltipText}>
          {this.state.tooltipText}
        </Tooltip>
        {this.props.datasetLabels && this.props.datasetLabels.length ?
          <div className="dataset-labels">
            {this.props.datasetLabels.map((label, i) => (
              <span key={i} className="chart-label-container">
                <svg width={20} height={20}>
                  <circle r={10} cx={10} cy={10} className={`line-${i}`} />
                </svg> <span className="chart-label">{label}</span>
              </span>
            ))}
          </div>
          : null
        }
      </div>
    )
  }
}

AnalysisStackedByGroup.displayName = 'AnalysisStackedByGroup'
AnalysisStackedByGroup.propTypes = {
  chartLabel: React.PropTypes.string,
  className: React.PropTypes.string,
  datasetLabels: React.PropTypes.array,
  datasets: React.PropTypes.instanceOf(Immutable.List),
  height: React.PropTypes.number,
  padding: React.PropTypes.number,
  width: React.PropTypes.number
}

AnalysisStackedByGroup.defaultProps = {
  datasets: Immutable.List()
}

module.exports = AnalysisStackedByGroup
