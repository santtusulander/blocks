import React, {PropTypes} from 'react'
import { List } from 'immutable'
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

class StorageItemList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      name,
      locations,
      storageContentLink,
      configurationLink,
      onConfigurationClick,
      analyticsLink,
      peak,
      low,
      average,
      currentUsage,
      estimate,
      fetchingMetrics,
      chartData
    } = this.props

    return (
      <div className="content-item-list storage-item-list">
        <div className="content-item-list-section section-lg">
          <LinkWrapper className="content-item-list-link" disableLinkTo={!storageContentLink} linkTo={storageContentLink}>
            <div className="content-item-details">
              <TruncatedTitle content={name} tooltipPlacement="top" className="content-item-list-name"/>
              {locations.join(', ')}
            </div>
          </LinkWrapper>

          <ButtonToolbar>
            {configurationLink &&
              <Link to={configurationLink} className="btn btn-icon btn-round edit-content-item">
                <IconConfiguration/>
              </Link>
            }

            {onConfigurationClick &&
              <a onClick={onConfigurationClick} className="btn btn-icon btn-round edit-content-item">
                <IconConfiguration/>
              </a>
            }
            <Link to={analyticsLink}
              className="btn btn-icon btn-round">
              <IconChart/>
            </Link>
          </ButtonToolbar>
        </div>

        <LinkWrapper className="content-item-list-link" disableLinkTo={!storageContentLink} linkTo={storageContentLink}>
          <div className="pull-right">
            <div className="content-item-list-section section-sm text-sm">
              <p><FormattedMessage id="portal.analytics.peak.text"/> <b className="pull-right">{formatBitsPerSecond(peak)}</b></p>
              <p><FormattedMessage id="portal.analytics.low.text"/> <b className="pull-right">{formatBitsPerSecond(low)}</b></p>
              <p><FormattedMessage id="portal.analytics.average.text"/> <b className="pull-right">{formatBitsPerSecond(average)}</b></p>
            </div>

            <div className="content-item-list-section section-lg">
              <Row>
                <h1>{formatBitsPerSecond(currentUsage)}<span className="heading-suffix">/ {formatBitsPerSecond(estimate)}</span></h1>
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

              {!fetchingMetrics &&
                <LineAreaComposedChart
                  isMiniChart={true}
                  data={chartData}
                  dataKey='bytes'
                  valueFormatter={formatBitsPerSecond}
                />
              }

            </ReactCSSTransitionGroup>
          </div>
        </LinkWrapper>

      </div>
    )
  }
}

StorageItemList.displayName = 'StorageItemList'
StorageItemList.propTypes = {
  analyticsLink: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  average: PropTypes.number,
  chartData: PropTypes.array,
  configurationLink: PropTypes.string,
  currentUsage:  PropTypes.number,

  estimate: PropTypes.number,
  fetchingMetrics: PropTypes.bool,

  locations: PropTypes.instanceOf(List),
  low:PropTypes.number,

  name: PropTypes.string,

  onConfigurationClick: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  peak:PropTypes.number,
  storageContentLink: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])

}

StorageItemList.defaultProps = {
  locations: [],
  chartData: []
}

export default StorageItemList
