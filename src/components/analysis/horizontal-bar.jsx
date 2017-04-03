import React from 'react'
import d3 from 'd3'
import numeral from 'numeral'
import LoadingSpinner from '../loading-spinner/loading-spinner'

class AnalysisHorizontalBar extends React.Component {
  formatX(val) {
    return this.props.xAxisFormat ?
      numeral(val).format(this.props.xAxisFormat)
    : this.props.xAxisCustomFormat ?
      this.props.xAxisCustomFormat(numeral(val).format('0'), null, '0,0.0')
    : numeral(val).format('0 a')
  }
  render() {
    if (!this.props.width || !this.props.data) {
      return <LoadingSpinner/>
    }

    const maxX = d3.max(this.props.data, d => d[this.props.dataKey])

    const yScale = d3.scale.linear()
      .domain([0, this.props.data.length])
      .range([
        this.props.padding * 2,
        this.props.height - this.props.padding * 2
      ]);

    const xScale = d3.scale.linear()
      .domain([0, maxX])
      .range([
        this.props.padding,
        this.props.width - this.props.padding * 3
      ])

    let className = 'analysis-horizontal-bar'
    if (this.props.className) {
      className = className + ' ' + this.props.className
    }

    return (
      <div className={className}>
        <svg
          width={this.props.width}
          height={this.props.height}
          ref='chart'>
          {this.props.data.map((url, i) => <g key={i}>
            <line
              className="url-bar"
              x1={xScale(0)}
              x2={xScale(url[this.props.dataKey])}
              y1={yScale(i)}
              y2={yScale(i)}/>
            <text x={xScale(0)} y={yScale(i) + 4}>
              {url[this.props.labelKey]}
            </text>
          </g>)}
          {xScale.ticks(4).map((tick, i) => {
            if (tick) {
              return (
                <g key={i}>
                  <text x={xScale(tick)}
                    y={this.props.height - this.props.padding}>
                    {this.formatX(tick)}
                  </text>
                </g>
              )
            }  else {
              return null
            }
          })}
        </svg>
      </div>
    )
  }
}

AnalysisHorizontalBar.displayName = 'AnalysisHorizontalBar'
AnalysisHorizontalBar.propTypes = {
  className: React.PropTypes.string,
  data: React.PropTypes.array,
  dataKey: React.PropTypes.string,
  height: React.PropTypes.number,
  labelKey: React.PropTypes.string,
  padding: React.PropTypes.number,
  width: React.PropTypes.number,
  xAxisCustomFormat: React.PropTypes.func,
  xAxisFormat: React.PropTypes.string
}

module.exports = AnalysisHorizontalBar
