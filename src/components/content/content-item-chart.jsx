import React from 'react'
import Immutable from 'immutable'
import { FormattedMessage } from 'react-intl'
import d3 from 'd3'
import classnames from 'classnames'
import { ButtonToolbar, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Link } from 'react-router'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import moment from 'moment'

import IconChart from '../shared/icons/icon-chart'
import IconConfiguration from '../shared/icons/icon-configuration'
import IconQuestionMark from '../shared/icons/icon-question-mark'

import LoadingSpinner from '../loading-spinner/loading-spinner'
import DifferenceTooltip from './difference-tooltip'
import ContentItemTag from './content-item-tag'
import TrafficTooltip from './traffic-tooltip'
import { formatBitsPerSecond } from '../../util/helpers'

import { startOfLast28 } from '../../constants/date-ranges.js'

import LinkWrapper from './link-wrapper'
import { HOST_SERVICE_TYPES } from '../../constants/configuration'

const dayHours = 24
const rayHours = 3

function groupData(rawData, groupSize, key) {
  return rawData.reduce((points, data, i) => {

    let val

    if (key) {
      val = data[key] || 0
    } else {
      val = typeof data !== 'undefined' ? data : 0
    }

    if (!(i % groupSize)) {
      points.push(val)
    } else {
      points[points.length - 1] = parseInt(points[points.length - 1]) + parseInt(val)
    }

    return points

  }, [])
}

const determineLineColor = (serviceType) => {
  switch (serviceType) {
    case HOST_SERVICE_TYPES.MEDIA_DELIVERY: return 'media-delivery-line'
    case HOST_SERVICE_TYPES.VOD_STREAMING: return 'vod-streaming-line'
    case HOST_SERVICE_TYPES.LIVE_STREAMING: return 'live-streaming-line'
    default: return 'content-item-chart-line'
  }
}

class ContentItemChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeSlice: false,
      showDiffLegend: false
    }

    this.differenceHover = this.differenceHover.bind(this)
    this.sliceHover = this.sliceHover.bind(this)
  }

  differenceHover(hover) {
    return () => {
      this.setState({ showDiffLegend: hover })
    }
  }

  sliceHover(sliceData) {
    return () => {
      this.setState({ activeSlice: sliceData })
    }
  }

  render() {
    if (this.props.fetchingMetrics) {
      return <LoadingSpinner />
    }
    const primaryData = groupData(this.props.primaryData.toJS(), rayHours, 'bits_per_second');
    const secondaryData = groupData(this.props.secondaryData.toJS(), rayHours, 'bits_per_second');
    const differenceData = groupData(this.props.differenceData.toJS(), dayHours);
    const daySlices = this.props.dailyTraffic.toJS().reduce(slices => {
      slices.push((dayHours/rayHours)*2)
      slices.push(1)
      return slices
    }, [])

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
        const x = d === 'center' ? outerRadius : isNaN(d) ? 0 :
          Math.cos(primaryAngle * radians)
          * (innerRadius + Number(normalize(d))) + outerRadius
        return x
      })
      .y(function(d) {
        /* If the value is 'center', set the Y point to the center of the chart,
        otherwise the Y is calculated with Sin using the known angle, radius
        (radius of the inner circle + bar height) and Y of the circle's center */
        const y = d === 'center' ? outerRadius : isNaN(d) ? 0 :
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
        const x = isNaN(d) ? 0 : Math.cos(secondaryAngle * radians)
          * (innerRadius + Number(normalize(d))) + outerRadius
        return x
      })
      .y(function(d) {
        /* Calculate the Y point with Sin using the known angle, radius (radius
        of the inner circle + bar height) and Y of the circle's center */
        const y = isNaN(d) ? 0 : Math.sin(secondaryAngle * radians)
          * (innerRadius + Number(normalize(d))) + outerRadius
        // Increment the angle for the next point
        secondaryAngle = secondaryAngle + increment
        return y
      })
      .interpolate('basis')
    const pie = d3.layout.pie().sort(null)
    const differenceArc = d3.svg.arc()
      .innerRadius(innerRadius - 9)
      .outerRadius(innerRadius);
    const dayArc = d3.svg.arc()
      .innerRadius(innerRadius)
      .outerRadius(innerRadius + parseInt(this.props.barMaxHeight));
    let { avgTransfer, maxTransfer, minTransfer } = this.props
    const { tagText } = this.props
    const endDate = moment.utc().format('MMM D')
    const startDate = startOfLast28().format('MMM D')
    // TODO: UDNP-3770: Replace all date and time with FormattedDate and FormattedTime from React-intl
    let tooltipDate = `${startDate} - ${endDate}`
    let link = this.props.linkTo
    const activeSlice = this.state.activeSlice
    if (activeSlice) {
      avgTransfer = formatBitsPerSecond(activeSlice.get('transfer_rates').get('average'), true)
      maxTransfer = formatBitsPerSecond(activeSlice.get('transfer_rates').get('peak'), true)
      minTransfer = formatBitsPerSecond(activeSlice.get('transfer_rates').get('low'), true)
      const sliceStart = moment.utc(activeSlice.get('timestamp'), 'X')
      tooltipDate = sliceStart.format('MMM D')
      if (this.props.showSlices) {
        link = `${this.props.linkTo}?startDate=${activeSlice.get('timestamp')}&endDate=${sliceStart.endOf('day').format('X')}`
      }
    }
    const tooltip = (<Tooltip className="content-item-chart-tooltip"
      id={'tooltip-' + (this.props.id)}>
        {this.state.showDiffLegend ?
          <DifferenceTooltip
            name={this.props.name}/>
          : <TrafficTooltip
            name={this.props.name}
            date={tooltipDate}
            avgTransfer={avgTransfer}
            maxTransfer={maxTransfer}
            minTransfer={minTransfer}/>
        }
      </Tooltip>)
    const { serviceType } = this.props
    return (
      <OverlayTrigger placement="top" overlay={tooltip}>
        <div
          className={classnames({ 'content-item-chart': true, bright: this.props.brightMode, 'grid-item': true })}
          style={{width: chartWidth, height: chartWidth}}
          id={'content-item-chart-' + (this.props.id)}
          onClick={this.props.onClick}
          >
          <LinkWrapper
            className="content-item-chart-link"
            disableLinkTo={this.props.disableLinkTo}
            linkTo={link}
          >
            <ReactCSSTransitionGroup
              component="div"
              className="content-transition"
              transitionName="content-transition"
              transitionEnterTimeout={250}
              transitionLeaveTimeout={250}>
              {!this.props.fetchingMetrics && this.props.secondaryData.size ?
                <svg className="content-item-chart-svg secondary-data">
                  {/* Add center point as last coordinate to close the path */}
                  <path className={determineLineColor(serviceType)}
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
                  <path className={determineLineColor(serviceType)}
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
              style={{
                width: innerRadius * 2, height: innerRadius * 2,
                marginTop: -innerRadius, marginLeft: -innerRadius
              }}>
              <div className="circle-gradient" />
            </div>
            <ReactCSSTransitionGroup
              component="div"
              className="content-transition"
              transitionName="content-transition"
              transitionEnterTimeout={250}
              transitionLeaveTimeout={250}>
              <svg className="content-item-chart-svg difference-arc"
                viewBox={differenceArcViewBox}>
                <g className={this.props.showSlices ? 'hover-info' : 'hidden-slices'}>
                  {pie(daySlices).reduce((slices, arc, i) => {
                    if (!(i % 2)) {
                      const data = this.props.dailyTraffic.get(Math.floor(i / 2))
                      if (data && data.get('transfer_rates') && data.get('transfer_rates').get('total')) {
                        slices.push(
                          <path key={i} className="day-arc" d={dayArc(arc)}
                            onMouseEnter={this.sliceHover(data)}
                            onMouseLeave={this.sliceHover(null)}/>
                        )
                      }
                    }
                    return slices
                  }, [])}
                </g>
                {this.props.differenceData.size && !this.props.fetchingMetrics ?
                  <g onMouseEnter={this.differenceHover(true)}
                    onMouseLeave={this.differenceHover(false)}>
                    {
                      pie(Array(differenceData.length).fill(1)).map((arcs, i) => {
                        const data = differenceData[i]
                        const style = data < 0 ? 'below-avg' :
                          data === 0 ? 'avg' :
                          data > 0 ? 'above-avg' : ''
                        return (
                          <path key={i} d={differenceArc(arcs)}
                            className={style} />
                        )
                      })
                    }
                  </g>
                : ''}
              </svg>
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
                  <p>{this.props.cacheHitRate}<FormattedMessage id="portal.content.avgHitRateWithPercentage.text"/></p>
                  <p>
                    {this.props.timeToFirstByte ? this.props.timeToFirstByte.split(' ')[0] : 0} {this.props.timeToFirstByte ? this.props.timeToFirstByte.split(' ')[1] : 'ms'}<FormattedMessage id="portal.content.TTFB.text"/>
                  </p>
                </div>
              </div>
              {!!tagText &&
                <ContentItemTag customClass="content-item-chart-tag">
                  <FormattedMessage id={tagText}/>
                </ContentItemTag>}
            </div>
          </LinkWrapper>
          <div className="content-item-toolbar">
            <ButtonToolbar>
              {this.props.analyticsLink &&
                <Link to={this.props.analyticsLink}
                  className="btn btn-icon btn-round invisible">
                  <IconChart/>
                </Link>
              }
              {this.props.configurationLink && this.props.isAllowedToConfigure &&
                <Link to={this.props.configurationLink}
                  className="btn btn-icon btn-round invisible">
                  <IconConfiguration/>
                </Link>
              }
              {this.props.onConfiguration && this.props.isAllowedToConfigure &&
                <a onClick={this.props.onConfiguration}
                  className="btn btn-icon btn-round invisible">
                  <IconConfiguration/>
                </a>
              }
              <Link to="/starburst-help"
                className="btn btn-icon btn-round invisible">
                <IconQuestionMark/>
              </Link>
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
  brightMode: React.PropTypes.bool,
  cacheHitRate: React.PropTypes.number,
  chartWidth: React.PropTypes.string,
  configurationLink: React.PropTypes.string,
  dailyTraffic: React.PropTypes.instanceOf(Immutable.List),
  differenceData: React.PropTypes.instanceOf(Immutable.List),
  disableLinkTo: React.PropTypes.bool,
  fetchingMetrics: React.PropTypes.bool,
  id: React.PropTypes.oneOfType([ React.PropTypes.string, React.PropTypes.number ]),
  isAllowedToConfigure: React.PropTypes.bool,
  linkTo: React.PropTypes.string,
  maxTransfer: React.PropTypes.string,
  minTransfer: React.PropTypes.string,
  name: React.PropTypes.string,
  onClick: React.PropTypes.func,
  onConfiguration: React.PropTypes.func,
  primaryData: React.PropTypes.instanceOf(Immutable.List),
  secondaryData: React.PropTypes.instanceOf(Immutable.List),
  serviceType: React.PropTypes.string,
  showSlices: React.PropTypes.bool,
  tagText: React.PropTypes.string,
  timeToFirstByte: React.PropTypes.string
}
ContentItemChart.defaultProps = {
  dailyTraffic: Immutable.List(),
  differenceData: Immutable.List(),
  primaryData: Immutable.List(),
  secondaryData: Immutable.List()
}

export default ContentItemChart
