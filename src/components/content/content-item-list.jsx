import React from 'react'
import Immutable from 'immutable'
import { ButtonToolbar, Col, Row } from 'react-bootstrap'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router'

import AnalysisByTime from '../analysis/by-time'
import IconChart from '../shared/icons/icon-chart.jsx'
import IconConfiguration from '../shared/icons/icon-configuration.jsx'
import { formatBitsPerSecond, formatTime } from '../../util/helpers'
import ContentItemTag from './content-item-tag'
import TruncatedTitle from '../truncated-title'
import { paleblue } from '../../constants/colors'
import LinkWrapper from './link-wrapper'

class ContentItemList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      byLocationWidth: 0,
      byTimeWidth: 0,
      byTimeHeight: 0
    }

    this.measureContainers = this.measureContainers.bind(this)
  }
  componentDidMount() {
    this.measureContainers()
    window.addEventListener('resize', this.measureContainers)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.measureContainers)
  }
  measureContainers() {
    this.setState({
      byTimeWidth: this.refs.byTimeHolder && this.refs.byTimeHolder.clientWidth,
      byTimeHeight: this.refs.byTimeHolder && this.refs.byTimeHolder.clientHeight
    })
  }
  render() {
    const datasets = []
    if (this.props.primaryData.size) {
      datasets.push({
        area: true,
        color: paleblue,
        comparisonData: false,
        data: this.props.primaryData.toJS().reverse(),
        id: '',
        label: '',
        line: true,
        stackedAgainst: false,
        xAxisFormatter: false
      })
    }
    return (
      <div className="content-item-list">
        <div className="content-item-list-section section-lg">
          <LinkWrapper
            className="content-item-list-link"
            disableLinkTo={this.props.disableLinkTo}
            linkTo={this.props.linkTo}
          >
            <div className="content-item-details">
              <TruncatedTitle content={this.props.name} tooltipPlacement="top" className="content-item-list-name"/>
              {/*
                <div className="content-item-list-details text-sm">
                  <p><FormattedMessage id="portal.contentItemList.lastEdited.text"/></p>
                  <p>Yesterday 12:30 pm</p>
                  <p>By John McKinley</p>
                </div>
              */}
            </div>
            {!!this.props.tagText &&
              <ContentItemTag customClass="content-item-list-tag">
                <FormattedMessage id={this.props.tagText}/>
              </ContentItemTag>}
          </LinkWrapper>

          <ButtonToolbar>
            {this.props.configurationLink && this.props.isAllowedToConfigure ?
              <Link to={this.props.configurationLink}
                className="btn btn-icon btn-round edit-content-item">
                <IconConfiguration/>
              </Link> : ''
            }
            {this.props.onConfiguration && this.props.isAllowedToConfigure &&
              <a onClick={this.props.onConfiguration}
                 className="btn btn-icon btn-round edit-content-item">
                <IconConfiguration/>
              </a>
            }
            <Link to={this.props.analyticsLink}
              className="btn btn-icon btn-round">
              <IconChart/>
            </Link>
          </ButtonToolbar>
        </div>

        <LinkWrapper
          className="content-item-list-link"
          disableLinkTo={this.props.disableLinkTo}
          linkTo={this.props.linkTo}>
          <div className="pull-right">
            <div className="content-item-list-section section-sm text-sm">
              <p><FormattedMessage id="portal.analytics.peak.text"/> <b className="pull-right">{this.props.maxTransfer}</b></p>
              <p><FormattedMessage id="portal.analytics.low.text"/> <b className="pull-right">{this.props.minTransfer}</b></p>
              <p><FormattedMessage id="portal.analytics.average.text"/> <b className="pull-right">{this.props.avgTransfer}</b></p>
            </div>

            <div className="content-item-list-section section-lg">
              <Row>
                <Col xs={6}>
                  <h1>{this.props.cacheHitRate || 0}
                    <span className="heading-suffix"> %</span></h1>
                  <p className="text-sm">Avg. Cache Hit Rate</p>
                </Col>
                <Col xs={6}>
                  <h1>
                    {this.props.timeToFirstByte ? formatTime(this.props.timeToFirstByte.split(' ')[0]).split(' ')[0] : 0}
                    <span className="heading-suffix"> {this.props.timeToFirstByte ? formatTime(this.props.timeToFirstByte.split(' ')[0]).split(' ')[1] : 'ms'}</span>
                  </h1>
                  <p className="text-sm"><FormattedMessage id="portal.analytics.avgTtfb.text"/></p>
                </Col>
              </Row>
            </div>
          </div>

          <div className="content-item-list-chart" ref="byTimeHolder">
            <ReactCSSTransitionGroup
              component="div"
              className="content-transition"
              transitionName="content-transition"
              transitionEnterTimeout={250}
              transitionLeaveTimeout={250}>
              {!this.props.fetchingMetrics ?
                <AnalysisByTime
                  axes={false}
                  padding={0}
                  dataKey="bytes"
                  dataSets={datasets}
                  width={this.state.byTimeWidth}
                  height={this.state.byTimeHeight}
                  yAxisCustomFormat={formatBitsPerSecond}/>
              : ''}
            </ReactCSSTransitionGroup>
          </div>
        </LinkWrapper>

      </div>
    )
  }
}

ContentItemList.displayName = 'ContentItemList'
ContentItemList.propTypes = {
  analyticsLink: React.PropTypes.string,
  avgTransfer: React.PropTypes.string,
  cacheHitRate: React.PropTypes.number,
  configurationLink: React.PropTypes.string,
  disableLinkTo: React.PropTypes.bool,
  fetchingMetrics: React.PropTypes.bool,
  isAllowedToConfigure: React.PropTypes.bool,
  linkTo: React.PropTypes.string,
  maxTransfer: React.PropTypes.string,
  minTransfer: React.PropTypes.string,
  name: React.PropTypes.string,
  onConfiguration: React.PropTypes.func,
  primaryData: React.PropTypes.instanceOf(Immutable.List),
  tagText: React.PropTypes.string,
  timeToFirstByte: React.PropTypes.string
}
ContentItemList.defaultProps = {
  primaryData: Immutable.List()
}

module.exports = ContentItemList
