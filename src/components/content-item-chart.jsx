import React from 'react'
import d3 from 'd3'
import { ButtonToolbar, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';

import IconChart from '../components/icons/icon-chart.jsx'
import IconConfiguration from '../components/icons/icon-configuration.jsx'

class ContentItemChart extends React.Component {
  constructor(props) {
    super(props);

    this.deleteAccount = this.deleteAccount.bind(this)
  }
  deleteAccount(e) {
    e.stopPropagation()
    e.preventDefault()
    this.props.delete(this.props.id)
  }
  render() {
    if (!this.props.primaryData) {
      return <div>Loading...</div>
    }
    const primaryMax = d3.max(this.props.primaryData, d => d.bytes)
    const secondaryMax = d3.max(this.props.secondaryData, d => d.bytes)
    const barMaxHeight = this.props.barMaxHeight;
    const normalize = d3.scale.linear()
      .domain([0, Math.max(primaryMax, secondaryMax)])
      .range([0, barMaxHeight]);
    const outerRadius = this.props.chartWidth / 2;
    const innerRadius = outerRadius - this.props.barMaxHeight;
    const increment = 1.5;
    const radians = Math.PI / 180;
    let primaryAngle = -90;
    let secondaryAngle = -90;
    const primaryLine = d3.svg.line()
      .x(function(d) {
        /* If the value is 'center', set the X point to the center of the chart,
        otherwise the X is calculated with Cos using the known angle, radius
        (radius of the inner circle + bar height) and X of the circle's center */
        return d === 'center' ? outerRadius :
          Math.cos(primaryAngle * radians)
          * (innerRadius + Number(d)) + outerRadius
      })
      .y(function(d) {
        /* If the value is 'center', set the Y point to the center of the chart,
        otherwise the Y is calculated with Sin using the known angle, radius
        (radius of the inner circle + bar height) and Y of the circle's center */
        let y = d === 'center' ? outerRadius :
          Math.sin(primaryAngle * radians)
          * (innerRadius + Number(d)) + outerRadius
        // Increment the angle for the next point
        primaryAngle = primaryAngle + (increment / 2)
        return y
      })
      .interpolate('linear')
    const secondaryLine = d3.svg.line()
      .x(function(d) {
        /* Calculate the X point with Cos using the known angle, radius (radius
        of the inner circle + bar height) and X of the circle's center */
        return Math.cos(secondaryAngle * radians)
          * (innerRadius + Number(normalize(d.bytes))) + outerRadius
      })
      .y(function(d) {
        /* Calculate the Y point with Sin using the known angle, radius (radius
        of the inner circle + bar height) and Y of the circle's center */
        let y = Math.sin(secondaryAngle * radians)
          * (innerRadius + Number(normalize(d.bytes))) + outerRadius
        // Increment the angle for the next point
        secondaryAngle = secondaryAngle + increment
        return y
      })
      .interpolate('basis')
    const differenceArc = d3.svg.arc()
      .innerRadius(innerRadius - 10)
      .outerRadius(innerRadius)
      .startAngle(0)
      .endAngle(45 * radians)
    const tooltip = (
      <Tooltip className="content-item-chart-tooltip"
        id={'tooltip-' + (this.props.id)}>
        <div className="tooltip-header">
          <b>TRAFFIC <span className="pull-right">30 days</span></b>
        </div>
        <div>
          High
          <span className="pull-right">
            12.34
            <span className="data-suffix"> Gb/d</span>
          </span>
        </div>
        <div>
          Average <span className="pull-right">
            10.34
            <span className="data-suffix"> Gb/d</span>
          </span>
        </div>
        <div>
          Low <span className="pull-right">
            8.34
            <span className="data-suffix"> Gb/d</span>
          </span>
        </div>
      </Tooltip>
    );
    return (
      <OverlayTrigger placement="top" overlay={tooltip}>
        <div className="content-item-chart grid-item"
          style={{width: outerRadius * 2, height: outerRadius * 2}}
           id={'content-item-chart-' + (this.props.id)}>
          <div className="glow"></div>
          <svg className="content-item-chart-svg secondary-data">
            {/* Add center point as last coordinate to close the path */}
            <path className="content-item-chart-line"
              d={secondaryLine(this.props.secondaryData)
                + 'L' + outerRadius + ' ' + outerRadius} />
          </svg>
          <svg className="content-item-chart-svg primary-data">
            {/* For performance reasons we draw the primary bar chart as a path. We need
            to add extra points to the array so that the path draws the lines outwards
            from the center of the graph. Every other value on the array is set to
            'center', which is translated in the d3 function in to coordinates */}
            <path className="content-item-chart-line"
              d={primaryLine(this.props.primaryData.reduce(
                (points, data) => {
                  points.push(normalize(data.bytes))
                  points.push('center')
                  return points;
                }, [])
            )} />
          </svg>
          <div className="circle-base"
            style={{width: innerRadius * 2, height: innerRadius * 2,
            marginTop: -innerRadius, marginLeft: -innerRadius}}>
            <div className="circle-gradient"></div>
          </div>
          <svg className="content-item-chart-svg difference-arc">
            <g>
              <path className="content-item-chart-line"
                d={differenceArc()} />
            </g>
          </svg>
          <div className="text-content"
            style={{width: innerRadius * 2, height: innerRadius * 2}}>
            <div className="content-item-traffic">
              <div className="content-item-text-bold">37.0</div>
              <div className="content-item-text-sm">Gbps</div>
            </div>
            <div className="content-item-text-centered">
              <div className="content-item-chart-name">{this.props.name}</div>
              <div className="content-item-text-sm">
                <p>95% Avg. Cache Hitrate</p>
                <p>42 ms TTFB</p>
              </div>
            </div>
            <div className="content-item-toolbar">
              <ButtonToolbar>
                <Button bsSize="small"
                   className="btn-tertiary btn-icon btn-round invisible">
                  <IconChart/>
                </Button>
                <Button bsSize="small"
                   className="edit-content-item btn-tertiary btn-icon
                   btn-round invisible" onClick={this.props.toggleActive}>
                  <IconConfiguration/>
                </Button>
              </ButtonToolbar>
            </div>
          </div>
        </div>
      </OverlayTrigger>
    )
  }
}

ContentItemChart.displayName = 'ContentItemChart'
ContentItemChart.propTypes = {
  barMaxHeight: React.PropTypes.string,
  barWidth: React.PropTypes.string,
  chartWidth: React.PropTypes.string,
  delete: React.PropTypes.func,
  description: React.PropTypes.string,
  id: React.PropTypes.string,
  name: React.PropTypes.string,
  primaryData: React.PropTypes.array,
  secondaryData: React.PropTypes.array,
  toggleActive: React.PropTypes.func
}

module.exports = ContentItemChart
