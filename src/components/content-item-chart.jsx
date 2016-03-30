import React from 'react'
import d3 from 'd3'
import { ButtonToolbar, OverlayTrigger, Tooltip } from 'react-bootstrap'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import { Link } from 'react-router'
import IconChart from '../components/icons/icon-chart.jsx'
import IconConfiguration from '../components/icons/icon-configuration.jsx'

class ContentItemChart extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    if (!this.props.primaryData) {
      return <div>Loading...</div>
    }
    const primaryMax = d3.max(this.props.primaryData, d => {
      return d.bytes || 0
    })
    const secondaryMax = this.props.secondaryData.length ?
      d3.max(this.props.secondaryData, d => d.bytes || 0)
      : primaryMax
    const barMaxHeight = this.props.barMaxHeight;
    const normalize = d3.scale.linear()
      .domain([0, Math.max(primaryMax, secondaryMax)])
      .range([0, barMaxHeight]);
    const outerRadius = this.props.chartWidth / 2;
    const innerRadius = outerRadius - this.props.barMaxHeight;
    // Increment is calculated based on the following formula:
    // 360 degrees / (number of days * (24 hours / hours per bar))
    const increment = 360 / (28 * (24 / 3));
    const radians = Math.PI / 180;
    let primaryAngle = -90;
    let secondaryAngle = -90;
    const differenceArcStyle = {
      transform: 'translate(' + outerRadius + 'px, ' + outerRadius + 'px)'
    }
    const primaryLine = d3.svg.line()
      .x(function(d) {
        /* If the value is 'center', set the X point to the center of the chart,
        otherwise the X is calculated with Cos using the known angle, radius
        (radius of the inner circle + bar height) and X of the circle's center */
        return d === 'center' ? outerRadius : isNaN(d) ? 0 :
          Math.cos(primaryAngle * radians)
          * (innerRadius + Number(d)) + outerRadius
      })
      .y(function(d) {
        /* If the value is 'center', set the Y point to the center of the chart,
        otherwise the Y is calculated with Sin using the known angle, radius
        (radius of the inner circle + bar height) and Y of the circle's center */
        let y = d === 'center' ? outerRadius : isNaN(d) ? 0 :
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
        let x = isNaN(d) ? 0 : Math.cos(secondaryAngle * radians)
          * (innerRadius + Number(normalize(d.bytes))) + outerRadius
        return x
      })
      .y(function(d) {
        /* Calculate the Y point with Sin using the known angle, radius (radius
        of the inner circle + bar height) and Y of the circle's center */
        let y = isNaN(d) ? 0 : Math.sin(secondaryAngle * radians)
          * (innerRadius + Number(normalize(d.bytes))) + outerRadius
        // Increment the angle for the next point
        secondaryAngle = secondaryAngle + increment
        return y
      })
      .interpolate('basis')
    const pie = d3.layout.pie().sort(null)
    const arc = d3.svg.arc().innerRadius(innerRadius - 9).outerRadius(innerRadius);
    const tooltip = (
      <Tooltip className="content-item-chart-tooltip"
        id={'tooltip-' + (this.props.id)}>
        <div className="tooltip-header">
          <b>TRAFFIC <span className="pull-right">28 days</span></b>
        </div>
        <div>
          Peak
          <span className="pull-right">
            {this.props.maxTransfer ? this.props.maxTransfer.split(' ')[0] : ''}
            <span className="data-suffix"> {this.props.maxTransfer ? this.props.maxTransfer.split(' ')[1] : ''}</span>
          </span>
        </div>
        <div>
          Average <span className="pull-right">
            {this.props.avgTransfer ? this.props.avgTransfer.split(' ')[0] : ''}
            <span className="data-suffix"> {this.props.avgTransfer ? this.props.avgTransfer.split(' ')[1] : ''}</span>
          </span>
        </div>
        <div>
          Low <span className="pull-right">
            {this.props.minTransfer ? this.props.minTransfer.split(' ')[0] : ''}
            <span className="data-suffix"> {this.props.minTransfer ? this.props.minTransfer.split(' ')[1] : ''}</span>
          </span>
        </div>
      </Tooltip>
    )
    return (
      <OverlayTrigger placement="top" overlay={tooltip}>
        <div className="content-item-chart grid-item"
          style={{width: this.props.chartWidth, height: this.props.chartWidth}}
          id={'content-item-chart-' + (this.props.id)}>
          <Link className="content-item-chart-link" to={this.props.linkTo}>
            <div className="glow"></div>
            <ReactCSSTransitionGroup
              component="div"
              className="content-transition"
              transitionName="content-transition"
              transitionEnterTimeout={250}
              transitionLeaveTimeout={250}>
              {!this.props.fetchingMetrics && this.props.secondaryData.length ?
                <svg className="content-item-chart-svg secondary-data">
                  {/* Add center point as last coordinate to close the path */}
                  <path className="content-item-chart-line"
                    d={secondaryLine(this.props.secondaryData)
                      + 'L' + outerRadius + ' ' + outerRadius} />
                </svg>
              : ''}
            </ReactCSSTransitionGroup>
            <ReactCSSTransitionGroup
              component="div"
              className="content-transition"
              transitionName="content-transition"
              transitionEnterTimeout={250}
              transitionLeaveTimeout={250}>
              {!this.props.fetchingMetrics ?
                <svg className="content-item-chart-svg primary-data">
                  {/* For performance reasons we draw the primary bar chart as a path. We need
                  to add extra points to the array so that the path draws the lines outwards
                  from the center of the graph. Every other value on the array is set to
                  'center', which is translated in the d3 function in to coordinates */}
                  <path className="content-item-chart-line"
                    d={primaryLine(this.props.primaryData.reduce(
                      (points, data, i) => {
                        if(!(i % 3)) {
                          points.push('center')
                          points.push(normalize(data.bytes || 0))
                        }
                        else {
                          points[points.length-1] =
                            parseInt(points[points.length-1]) +
                            parseInt(normalize(data.bytes || 0))
                        }
                        return points;
                      }, [])
                  )} />
                </svg>
              : ''}
            </ReactCSSTransitionGroup>
            <div className="circle-base"
              style={{width: innerRadius * 2, height: innerRadius * 2,
              marginTop: -innerRadius, marginLeft: -innerRadius}}>
              <div className="circle-gradient"></div>
            </div>
            <ReactCSSTransitionGroup
              component="div"
              className="content-transition"
              transitionName="content-transition"
              transitionEnterTimeout={250}
              transitionLeaveTimeout={250}>
              {this.props.differenceData && !this.props.fetchingMetrics ?
                <svg className="content-item-chart-svg difference-arc">
                  <g style={differenceArcStyle}>
                    {
                      pie(Array(this.props.differenceData.length).fill(1)).map((arcs, i) => {
                        let data = this.props.differenceData[i]
                        let style = data < 0 ? 'below-avg' :
                          data === 0 ? 'avg' :
                          data > 0 ? 'above-avg' : ''
                        return (
                          <path key={i} d={arc(arcs)} className={style} />
                        )
                      })
                    }
                  </g>
                </svg>
              : ''}
            </ReactCSSTransitionGroup>
            <div className="text-content"
              style={{width: innerRadius * 2, height: innerRadius * 2}}>
              <div className="content-item-traffic"
                style={{fontSize: this.props.chartWidth / 23}}>
                <div className="content-item-text-bold">
                  {this.props.avgTransfer ? this.props.avgTransfer.split(' ')[0] : ''}
                </div>
                <div className="content-item-text-sm">
                  {this.props.avgTransfer ? this.props.avgTransfer.split(' ')[1] : ''}
                </div>
              </div>
              <div className="content-item-text-centered">
                <div className="content-item-chart-name"
                  style={{fontSize: this.props.chartWidth / 16}}>
                  {this.props.name}
                </div>
                <div className="content-item-text-sm">
                  <p>{this.props.cacheHitRate}% Avg. Cache Hitrate</p>
                  <p>
                    {this.props.timeToFirstByte ? this.props.timeToFirstByte.split(' ')[0] : 0} {this.props.timeToFirstByte ? this.props.timeToFirstByte.split(' ')[1] : 'ms'} TTFB
                  </p>
                </div>
              </div>
            </div>
          </Link>
          <div className="content-item-toolbar"
            style={{bottom: this.props.barMaxHeight}}>
            <ButtonToolbar>
              {this.props.analyticsLink ?
                <Link to={this.props.analyticsLink}
                  className="btn btn-sm btn-primary btn-icon btn-round invisible">
                  <IconChart/>
                </Link> : ''
              }
              {this.props.configurationLink ?
                <Link to={this.props.configurationLink}
                  className="btn btn-sm edit-content-item btn-primary btn-icon
                  btn-round invisible">
                  <IconConfiguration/>
                </Link> : ''
              }
            </ButtonToolbar>
          </div>
        </div>
      </OverlayTrigger>
    )
  }
}

ContentItemChart.displayName = 'ContentItemChart'
ContentItemChart.propTypes = {
  analyticsLink: React.PropTypes.string,
  avgTransfer: React.PropTypes.string,
  barMaxHeight: React.PropTypes.string,
  barWidth: React.PropTypes.string,
  cacheHitRate: React.PropTypes.number,
  chartWidth: React.PropTypes.string,
  configurationLink: React.PropTypes.string,
  delete: React.PropTypes.func,
  description: React.PropTypes.string,
  differenceData: React.PropTypes.array,
  fetchingMetrics: React.PropTypes.bool,
  id: React.PropTypes.string,
  linkTo: React.PropTypes.string,
  maxTransfer: React.PropTypes.string,
  minTransfer: React.PropTypes.string,
  name: React.PropTypes.string,
  primaryData: React.PropTypes.array,
  secondaryData: React.PropTypes.array,
  timeToFirstByte: React.PropTypes.string
}

module.exports = ContentItemChart
