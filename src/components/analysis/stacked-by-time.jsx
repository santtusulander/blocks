import React from 'react'
import d3 from 'd3'
import numeral from 'numeral'

import TimeAxisLabels from './time-axis-labels'
import {FormattedMessage} from 'react-intl'

class AnalysisStackedByTime extends React.Component {
  formatY(data) {
    if (this.props.yAxisCustomFormat) {
      return this.props.yAxisCustomFormat(data)
    } else {
      return numeral(data).format('0 a')
    }
  }
  render() {
    const dataKey = this.props.dataKey

    if (!this.props.width || !this.props.dataSets) {
      return <div><FormattedMessage id="portal.loading.text"/></div>
    }
    const totals = this.props.dataSets.reduce((total, dataSet) => {
      return dataSet.map((datapoint, i) => {
        const value = total[i] ? total[i].value : 0
        return {
          value: datapoint[dataKey] + value,
          timestamp: datapoint.timestamp
        }
      })
    }, [])

    const yExtent = totals && totals.length ?
      d3.extent(totals, d => d.value)
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
    if (this.props.className) {
      className = className + ' ' + this.props.className
    }
    const columnHeights = []
    return (
      <div className={className}>
        <svg
          viewBox={'0 0 ' + this.props.width + ' ' + this.props.height}
          width={this.props.width}
          height={this.props.height}
          ref='chart'>
          {this.props.dataSets ? this.props.dataSets.map((dataset, dataSetIndex) => {
            const strokeWidth = Math.min(
              (this.props.width - this.props.padding * 10) / dataset.length,
              30
            )
            return dataset.map((day, i) => {
              const newTotal = columnHeights[i] ? columnHeights[i] + day[dataKey] : day[dataKey]
              const line = (
                <line key={i} className={`line-${dataSetIndex}`}
                  x1={xScale(day.timestamp)}
                  x2={xScale(day.timestamp)}
                  y1={yScale(columnHeights[i] || 0)}
                  y2={yScale(newTotal)}
                  style={{strokeWidth: strokeWidth}}/>
              )
              columnHeights[i] = newTotal
              return line
            })
          }) : null}
          {<TimeAxisLabels
            xScale={xScale}
            padding={this.props.padding}
            height={this.props.height}
            showHours={this.props.dontShowHours ? false : xExtent[1] - xExtent[0] <= 24*60*60*1000}
            />}
          {yScale.ticks(4).reduce((axes, tick, i) => {
            if (i) {
              axes.push(
                <g key={i}>
                  <text x={this.props.padding*1.5} y={yScale(tick)}
                    className="y-axis">
                    {this.formatY(tick)}
                  </text>
                </g>
              );
            }
            return axes
          }, [])}
        </svg>
      </div>
    )
  }
}

AnalysisStackedByTime.displayName = 'AnalysisStackedByTime'
AnalysisStackedByTime.defaultProps = {
  dataKey: 'bytes'
}

AnalysisStackedByTime.propTypes = {
  className: React.PropTypes.string,
  dataKey: React.PropTypes.string,
  dataSets: React.PropTypes.array,
  dontShowHours: React.PropTypes.bool,
  height: React.PropTypes.number,
  padding: React.PropTypes.number,
  width: React.PropTypes.number,
  yAxisCustomFormat: React.PropTypes.func
}

module.exports = AnalysisStackedByTime
