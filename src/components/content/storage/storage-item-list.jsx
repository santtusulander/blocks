import React, {PropTypes} from 'react'
import Immutable from 'immutable'
import { ButtonToolbar, Row } from 'react-bootstrap'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router'

import LineAreaComposedChart from '../../charts/line-area-composed-chart'
import IconChart from '../../icons/icon-chart.jsx'
import IconConfiguration from '../../icons/icon-configuration.jsx'
import { formatBitsPerSecond } from '../../../util/helpers'
import TruncatedTitle from '../../truncated-title'
import LinkWrapper from '../link-wrapper'

import { composedChartData as fakeData } from '../../../containers/__mocks__/chart-data'
class StorageItemList extends React.Component {
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
    const {
      name,
      location,
      linkTo,
      disableLinkTo,
      configurationLink,
      onConfiguration,
      isAllowedToConfigure,
      analyticsLink,
      maxTransfer,
      minTransfer,
      avgTransfer,
      currentUsage,
      usageQuota,
      fetchingMetrics
    } = this.props

    return (
      <div className="content-item-list storage-item-list">
        <div className="content-item-list-section section-lg">
          <LinkWrapper className="content-item-list-link" disableLinkTo={disableLinkTo} linkTo={linkTo}>
            <div className="content-item-details">
              <TruncatedTitle content={name} tooltipPlacement="top" className="content-item-list-name"/>
              {location}
            </div>
          </LinkWrapper>

          <ButtonToolbar>
            {configurationLink && isAllowedToConfigure ?
              <Link to={configurationLink} className="btn btn-icon btn-round edit-content-item">
                <IconConfiguration/>
              </Link> : ''
            }
            {onConfiguration && isAllowedToConfigure &&
              <a onClick={onConfiguration} className="btn btn-icon btn-round edit-content-item">
                <IconConfiguration/>
              </a>
            }
            <Link to={analyticsLink}
              className="btn btn-icon btn-round">
              <IconChart/>
            </Link>
          </ButtonToolbar>
        </div>

        <LinkWrapper className="content-item-list-link" disableLinkTo={disableLinkTo} linkTo={linkTo}>
          <div className="pull-right">
            <div className="content-item-list-section section-sm text-sm">
              <p><FormattedMessage id="portal.analytics.peak.text"/> <b className="pull-right">{maxTransfer}</b></p>
              <p><FormattedMessage id="portal.analytics.low.text"/> <b className="pull-right">{minTransfer}</b></p>
              <p><FormattedMessage id="portal.analytics.average.text"/> <b className="pull-right">{avgTransfer}</b></p>
            </div>

            <div className="content-item-list-section section-lg">
              <Row>
                <h1>{currentUsage}<span className="heading-suffix">/ {usageQuota}</span></h1>
                <p className="text-sm"><FormattedMessage id="portal.common.current" /></p>
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
              {!fetchingMetrics ?
                // TODO : UDNP-2938 | replace storage mock data with redux
                <LineAreaComposedChart isMiniChart={true} data={fakeData} valueFormatter={formatBitsPerSecond} width={this.state.byTimeWidth} height={this.state.byTimeHeight}/>
              : ''}
            </ReactCSSTransitionGroup>
          </div>
        </LinkWrapper>

      </div>
    )
  }
}

StorageItemList.displayName = 'StorageItemList'
StorageItemList.propTypes = {
  analyticsLink: PropTypes.string,
  configurationLink: PropTypes.string,
  currentUsage: PropTypes.number,
  diameter: PropTypes.number,
  estimate: PropTypes.number,
  lastMonthEstimate: PropTypes.number,
  lastMonthPeak: PropTypes.number,
  lastMonthUsage: PropTypes.number,
  locations: PropTypes.array,
  name: PropTypes.string,
  peak: PropTypes.number,
  storageContentLink: PropTypes.string
}
StorageItemList.defaultProps = {
  primaryData: Immutable.List()
}

module.exports = StorageItemList
