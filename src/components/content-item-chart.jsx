import React from 'react'
import Immutable from 'immutable'
import d3 from 'd3'
import { ButtonToolbar, OverlayTrigger, Tooltip } from 'react-bootstrap'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import { Link } from 'react-router'
import IconChart from '../components/icons/icon-chart.jsx'
import IconConfiguration from '../components/icons/icon-configuration.jsx'

class ContentItemChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showDiffLegend: false
    }

    this.differenceHover = this.differenceHover.bind(this)
  }
  differenceHover(hover) {
    return () => {
      this.setState({ showDiffLegend: hover })
    }
  }

  groupData(rawData, groupSize) {

    let groupedData = 0;

    return rawData.reduce((points, data, i) => {

      if(!(i % groupSize || i === 0) ) {
        points.push(groupedData)
        groupedData = 0
      }

      //should this be parsed? Is it possible that data.bytes has NaN -values?
      groupedData += data.bytes;

      //if last group -> push
      if (i === rawData.size - 1) {
        points.push(groupedData);
      }


      return points;
    }, [])
  }

  groupDifferenceData(rawData, groupSize) {
    let groupedData = 0;

    return rawData.reduce((points, data, i) => {


      if(!(i % groupSize || i === 0) ) {
        points.push(groupedData)
        groupedData = 0
      }

      if (data == null) groupedData = null;
      else groupedData += data;

      //if last group -> push
      if (i === rawData.size - 1) {
        points.push(groupedData);
      }

      return points;
    }, [])
  }

  render() {
    if (this.props.fetchingMetrics) {
      return <div id="fetchingMetrics">Loading...</div>
    }

    const primaryData = this.groupData(this.props.primaryData.toJS(), 3);
    const secondaryData = this.groupData(this.props.secondaryData.toJS(), 3);
    const differenceData = this.groupDifferenceData(this.props.differenceData, 24);

    /*const differenceData2 = this.props.differenceData.reduce((points, data, i) => {
      // Group data into chunks of 3 as one data point in the chart = 3 hours
      if(!(i % 24)) {
        points.push(data ? data : data === 0 ? 0 : null)
      } else {
        points[points.length-1] = data ? points[points.length-1] + data : data === 0 ? 0 : null
      }
      return points;
    }, [])

    console.log('data1:', differenceData);
    console.log('data2:', differenceData2);
    */

    const primaryMax = d3.max(primaryData, d => {
      return d || 0
    })
    const secondaryMax = secondaryData.length ?
      d3.max(secondaryData, d => d || 0)
      : primaryMax
    const barMaxHeight = Math.round(this.props.barMaxHeight);
    const normalize = d3.scale.linear()
      .domain([0, Math.max(primaryMax, secondaryMax)])
      .range([0, barMaxHeight]);
    const chartWidth = Math.round(this.props.chartWidth)
    const outerRadius = chartWidth / 2;
    const innerRadius = outerRadius - barMaxHeight;
    // Increment is calculated based on the following formula:
    // 360 degrees / (number of days * (24 hours / hours per bar))
    const increment = 360 / (28 * (24 / 3));
    const radians = Math.PI / 180;
    let primaryAngle = -90;
    let secondaryAngle = -90;
    const differenceArcViewBox = -outerRadius + ' ' + -outerRadius + ' '
      + chartWidth + ' ' + chartWidth
    const primaryLine = d3.svg.line()
      .x(function(d) {
        /* If the value is 'center', set the X point to the center of the chart,
        otherwise the X is calculated with Cos using the known angle, radius
        (radius of the inner circle + bar height) and X of the circle's center */
        let x = d === 'center' ? outerRadius : isNaN(d) ? 0 :
          Math.cos(primaryAngle * radians)
          * (innerRadius + Number(normalize(d))) + outerRadius
        return x
      })
      .y(function(d) {
        /* If the value is 'center', set the Y point to the center of the chart,
        otherwise the Y is calculated with Sin using the known angle, radius
        (radius of the inner circle + bar height) and Y of the circle's center */
        let y = d === 'center' ? outerRadius : isNaN(d) ? 0 :
          Math.sin(primaryAngle * radians)
          * (innerRadius + Number(normalize(d))) + outerRadius
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
          * (innerRadius + Number(normalize(d))) + outerRadius
        return x
      })
      .y(function(d) {
        /* Calculate the Y point with Sin using the known angle, radius (radius
        of the inner circle + bar height) and Y of the circle's center */
        let y = isNaN(d) ? 0 : Math.sin(secondaryAngle * radians)
          * (innerRadius + Number(normalize(d))) + outerRadius
        // Increment the angle for the next point
        secondaryAngle = secondaryAngle + increment
        return y
      })
      .interpolate('basis')
    const pie = d3.layout.pie().sort(null)
    const arc = d3.svg.arc().innerRadius(innerRadius - 9).outerRadius(innerRadius);
    const tooltip =
      (<Tooltip className="content-item-chart-tooltip"
        id={'tooltip-' + (this.props.id)}>
        {this.state.showDiffLegend ?
          <div>
            <div className="tooltip-header">
              <b>TRAFFIC VS 28 DAYS AGO</b>
            </div>
            <div>
              Higher
              <div className="pull-right difference-legend above-avg" />
            </div>
            <div>
              Same
              <div className="pull-right difference-legend avg" />
            </div>
            <div>
              Lower
              <div className="pull-right difference-legend below-avg" />
            </div>
            <div>
              Data Missing
              <div className="pull-right difference-legend no-data" />
            </div>
          </div>
          :
          <div>
            <div className="tooltip-header">
              <b>TRAFFIC (28 days)</b>
            </div>
            <div>
              Peak
              <span className="pull-right">
                {this.props.maxTransfer ? this.props.maxTransfer.split(' ')[0] : ''}
                <span className="data-suffix"> {this.props.maxTransfer ?
                  this.props.maxTransfer.split(' ')[1] : ''}</span>
              </span>
            </div>
            <div>
              Average <span className="pull-right">
                {this.props.avgTransfer ? this.props.avgTransfer.split(' ')[0] : ''}
                <span className="data-suffix"> {this.props.avgTransfer ?
                  this.props.avgTransfer.split(' ')[1] : ''}</span>
              </span>
            </div>
            <div>
              Low <span className="pull-right">
                {this.props.minTransfer ? this.props.minTransfer.split(' ')[0] : ''}
                <span className="data-suffix"> {this.props.minTransfer ?
                  this.props.minTransfer.split(' ')[1] : ''}</span>
              </span>
            </div>
          </div>
        }
        </Tooltip>)
    return (
      <OverlayTrigger placement="top" overlay={tooltip}>
        <div className="content-item-chart grid-item"
          style={{width: chartWidth, height: chartWidth}}
          id={'content-item-chart-' + (this.props.id)}>
          <Link className="content-item-chart-link" to={this.props.linkTo}>
            <div className="glow"></div>
            <ReactCSSTransitionGroup
              component="div"
              className="content-transition"
              transitionName="content-transition"
              transitionEnterTimeout={250}
              transitionLeaveTimeout={250}>
              {!this.props.fetchingMetrics && this.props.secondaryData.size ?
                <svg className="content-item-chart-svg secondary-data">
                  {/* Add center point as last coordinate to close the path */}
                  <path className="content-item-chart-line"
                    d={secondaryLine(secondaryData)
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
              {!this.props.fetchingMetrics && this.props.primaryData.size ?
                <svg className="content-item-chart-svg primary-data">
                  {/* For performance reasons we draw the primary bar chart as a path. We need
                  to add extra points to the array so that the path draws the lines outwards
                  from the center of the graph. Every other value on the array is set to
                  'center', which is translated in the d3 function in to coordinates */}
                  <path className="content-item-chart-line"
                    d={primaryLine(primaryData.reduce(
                      (points, data) => {
                        points.push('center')
                        points.push(data || 0)
                        return points
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
              {this.props.differenceData.size && !this.props.fetchingMetrics ?
                <svg className="content-item-chart-svg difference-arc"
                  viewBox={differenceArcViewBox}>
                  <g onMouseEnter={this.differenceHover(true)}
                    onMouseLeave={this.differenceHover(false)}>
                    {
                      pie(Array(differenceData.length).fill(1)).map((arcs, i) => {
                        let data = differenceData[i]
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
              style={{width: innerRadius * 2 - 20, height: innerRadius * 2 - 20}}>
              <div className="content-item-traffic"
                style={{fontSize: chartWidth / 23}}>
                <div className="content-item-text-bold">
                  {this.props.avgTransfer ? this.props.avgTransfer.split(' ')[0] : ''}
                </div>
                <div className="content-item-text-sm">
                  {this.props.avgTransfer ? this.props.avgTransfer.split(' ')[1] : ''}
                </div>
              </div>
              <div className="content-item-text-centered">
                <div className="content-item-chart-name"
                  style={{fontSize: chartWidth / 16}}>
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
            style={{bottom: barMaxHeight}}>
            <ButtonToolbar>
              {this.props.analyticsLink ?
                <Link to={this.props.analyticsLink}
                  className="btn btn-sm btn-primary btn-icon btn-round invisible">
                  <IconChart/>
                </Link> : ''
              }
              {this.props.configurationLink ?
                <Link to={this.props.configurationLink}
                  className="btn btn-sm edit-content-item btn-primary btn-icon btn-round invisible">
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
  differenceData: React.PropTypes.instanceOf(Immutable.List),
  fetchingMetrics: React.PropTypes.bool,
  id: React.PropTypes.string,
  linkTo: React.PropTypes.string,
  maxTransfer: React.PropTypes.string,
  minTransfer: React.PropTypes.string,
  name: React.PropTypes.string,
  primaryData: React.PropTypes.instanceOf(Immutable.List),
  secondaryData: React.PropTypes.instanceOf(Immutable.List),
  timeToFirstByte: React.PropTypes.string
}
ContentItemChart.defaultProps = {
  differenceData: Immutable.List(),
  primaryData: Immutable.List(),
  secondaryData: Immutable.List()
}

module.exports = ContentItemChart
