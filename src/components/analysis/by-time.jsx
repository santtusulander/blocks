import React from 'react'
import d3 from 'd3'
import moment from 'moment'
import numeral from 'numeral'

class AnalysisByTime extends React.Component {
  render() {
    if(!this.props.width || !this.props.primaryData) {
      return <div>Loading...</div>
    }

    const yPrimaryExtent = d3.extent(this.props.primaryData, d => d.bytes)
    const xPrimaryExtent = d3.extent(this.props.primaryData, d => d.epoch_start)
    const ySecondayExtent = d3.extent(this.props.secondaryData, d => d.bytes)
    const xSecondayExtent = d3.extent(this.props.secondaryData, d => d.epoch_start)

    const yScale = d3.scale.linear()
      .domain([0, Math.max(yPrimaryExtent[1], ySecondayExtent[1])])
      .range([
        this.props.height - this.props.padding * (this.props.axes ? 2 : 1),
        this.props.padding
      ]);

    const xScale = d3.scale.linear()
      .domain([
        Math.min(xPrimaryExtent[0], xSecondayExtent[0]),
        Math.max(xPrimaryExtent[1], xSecondayExtent[1])
      ])
      .range([
        this.props.padding * (this.props.axes ? 2 : 1),
        this.props.width - this.props.padding
      ]);

    const trafficLine = d3.svg.line()
      .y(d => yScale(d.bytes))
      .x(d => xScale(d.epoch_start))
      .interpolate('cardinal');

    return (
      <svg
        className='analysis-by-time'
        width={this.props.width}
        height={this.props.height}>
        <path d={trafficLine(this.props.primaryData)} className="primary"/>
        <path d={trafficLine(this.props.secondaryData)} className="secondary"/>
        {this.props.axes ?
          xScale.ticks(4).reduce((axes, tick, i) => {
            if(axes.length < xScale.ticks(4).length-1) {
              axes.push(
                <g key={i}>
                  <text x={xScale(tick)} y={this.props.height - this.props.padding}>
                    {moment(tick, 'X').format('MMM D')}
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
                  <line
                    x1={this.props.padding*2} y1={yScale(tick)}
                    x2={this.props.width - this.props.padding} y2={yScale(tick)}
                    className="axis-tick"/>
                  <text x={0} y={yScale(tick)}>
                    {numeral(tick).format('0a')}
                  </text>
                </g>
              );
            }
            return axes
          }, [])
          : null
        }
      </svg>
    )
  }
}

AnalysisByTime.displayName = 'AnalysisByTime'
AnalysisByTime.propTypes = {
  axes: React.PropTypes.bool,
  height: React.PropTypes.number,
  padding: React.PropTypes.number,
  primaryData: React.PropTypes.array,
  secondaryData: React.PropTypes.array,
  width: React.PropTypes.number
}

module.exports = AnalysisByTime
