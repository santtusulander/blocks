import React from 'react'

import { FormattedMessage } from 'react-intl';

function getValue(stat) {
  return stat ? stat.split(' ')[0] : ''
}

function getUnit(stat) {
  return stat ? stat.split(' ')[1] : ''
}

const ContentTrafficTooltip = ({name, avgTransfer, maxTransfer, minTransfer, date}) => <div>
  <div className="tooltip-header">
    <h3>{name}</h3>
    <b><FormattedMessage id="portal.content.tooltip.badwith.text" values={{date: date}}/></b>
  </div>
  <div className="clearfix">
    <FormattedMessage id="portal.analytics.peak.text"/>
    <span className="pull-right">
      {getValue(maxTransfer)}
      <span className="data-suffix"> {getUnit(maxTransfer)}</span>
    </span>
  </div>
  <div className="clearfix">
    <FormattedMessage id="portal.analytics.average.text"/>
    <span className="pull-right">
      {getValue(avgTransfer)}
      <span className="data-suffix"> {getUnit(avgTransfer)}</span>
    </span>
  </div>
  <div className="clearfix">
    <FormattedMessage id="portal.analytics.low.text"/>
    <span className="pull-right">
      {getValue(minTransfer)}
      <span className="data-suffix"> {getUnit(minTransfer)}</span>
    </span>
  </div>
</div>

ContentTrafficTooltip.displayName = 'ContentTrafficTooltip'
ContentTrafficTooltip.propTypes = {
  avgTransfer: React.PropTypes.string,
  date: React.PropTypes.string,
  maxTransfer: React.PropTypes.string,
  minTransfer: React.PropTypes.string,
  name: React.PropTypes.string
}

module.exports = ContentTrafficTooltip
