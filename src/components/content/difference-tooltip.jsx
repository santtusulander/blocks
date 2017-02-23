import React, { PropTypes } from 'react'

import { FormattedMessage } from 'react-intl';

const ContentDifferenceTooltip = ({name}) => <div>
  <div className="tooltip-header">
    <h3>{name}</h3>
    <FormattedMessage id="portal.content.tooltip.bandwidthVsLast28.text" values={{bandwidth: <b><FormattedMessage id="portal.content.tooltip.bandwidth.text"/></b>}}/>
  </div>
  <div>
    <FormattedMessage id="portal.content.tooltip.higher.text"/>
    <div className="pull-right difference-legend above-avg" />
  </div>
  <div>
    <FormattedMessage id="portal.content.tooltip.same.text"/>
    <div className="pull-right difference-legend avg" />
  </div>
  <div>
    <FormattedMessage id="portal.content.tooltip.lower.text"/>
    <div className="pull-right difference-legend below-avg" />
  </div>
  <div>
    <FormattedMessage id="portal.content.tooltip.compDataMissing.text"/>
    <div className="pull-right difference-legend no-data" />
  </div>
</div>

ContentDifferenceTooltip.displayName = 'ContentDifferenceTooltip'
ContentDifferenceTooltip.propTypes = {
  name: PropTypes.string
}

module.exports = ContentDifferenceTooltip
