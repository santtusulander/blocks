import React from 'react'
import Immutable from 'immutable'
import { ButtonToolbar, Col, Row, OverlayTrigger, Tooltip } from 'react-bootstrap'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import { Link } from 'react-router'
import AnalysisByTime from '../analysis/by-time'
import IconChart from '../icons/icon-chart.jsx'
import IconConfiguration from '../icons/icon-configuration.jsx'
import { formatBitsPerSecond, formatTime } from '../../util/helpers'

class ContentItemList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      byLocationWidth: 0,
      byTimeWidth: 0,
      byTimeHeight: 0,
      isTitleTruncated: false
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
      byTimeWidth: this.refs.byTimeHolder.clientWidth,
      byTimeHeight: this.refs.byTimeHolder.clientHeight,
      isTitleTruncated: this.refs.contentItemName.scrollWidth > this.refs.contentItemName.clientWidth
    })
  }
  render() {
    const tooltip = (<Tooltip className="content-item-chart-tooltip display-long-name-tooltip"><h3>{this.props.name}</h3></Tooltip>)
    return (
      <div className="content-item-list">
        <div className="content-item-list-section section-lg">
          <Link className="content-item-list-link" to={this.props.linkTo}>
            <div className="content-item-details">
              {this.state.isTitleTruncated ?
                <OverlayTrigger placement="top" overlay={tooltip}>
                  <div className="content-item-list-name" ref="contentItemName">{this.props.name}</div>
                </OverlayTrigger> :
                <div className="content-item-list-name" ref="contentItemName">{this.props.name}</div>
              }

              <div className="content-item-list-details text-sm">
                <p>Last Edited</p>
                <p>Yesterday 12:30 pm</p>
                <p>By John McKinley</p>
              </div>
            </div>
          </Link>

          <ButtonToolbar className="pull-right">
            {this.props.configurationLink ?
              <Link to={this.props.configurationLink}
                className="btn btn-sm edit-content-item btn-primary btn-icon btn-round">
                <IconConfiguration/>
              </Link> : ''
            }
            {this.props.onConfiguration &&
            <a onClick={this.props.onConfiguration}
               className="btn btn-sm edit-content-item btn-primary btn-icon btn-round">
              <IconConfiguration/>
            </a>
            }
            <Link to={this.props.analyticsLink}
              className="btn btn-sm btn-primary btn-icon btn-round">
              <IconChart/>
            </Link>
          </ButtonToolbar>
        </div>

        <Link className="content-item-list-link" to={this.props.linkTo}>
          <div className="pull-right">
            <div className="content-item-list-section section-sm text-sm">
              <p>Peak <b className="pull-right">{this.props.maxTransfer}</b></p>
              <p>Lowest <b className="pull-right">{this.props.minTransfer}</b></p>
              <p>Average <b className="pull-right">{this.props.avgTransfer}</b></p>
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
                  <p className="text-sm">Avg. TTFB</p>
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
                <AnalysisByTime axes={false} padding={0} className="bg-transparent"
                  dataKey="bytes"
                  primaryData={this.props.primaryData.toJS().reverse()}
                  width={this.state.byTimeWidth}
                  height={this.state.byTimeHeight}
                  yAxisCustomFormat={formatBitsPerSecond}/>
              : ''}
            </ReactCSSTransitionGroup>
          </div>
        </Link>

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
  onConfiguration: React.PropTypes.func,
  delete: React.PropTypes.func,
  description: React.PropTypes.string,
  fetchingMetrics: React.PropTypes.bool,
  id: React.PropTypes.string,
  linkTo: React.PropTypes.string,
  maxTransfer: React.PropTypes.string,
  minTransfer: React.PropTypes.string,
  name: React.PropTypes.string,
  primaryData: React.PropTypes.instanceOf(Immutable.List),
  timeToFirstByte: React.PropTypes.string,
  toggleActive: React.PropTypes.func
}
ContentItemList.defaultProps = {
  primaryData: Immutable.List()
}

module.exports = ContentItemList
