import React, { PropTypes } from 'react'

const ContentDifferenceTooltip = ({name}) => <div>
  <div className="tooltip-header">
    <h3>{name}</h3>
    <b>Bandwidth</b> vs 28 days ago
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
    Comparison Data Missing
    <div className="pull-right difference-legend no-data" />
  </div>
</div>

ContentDifferenceTooltip.displayName = 'ContentDifferenceTooltip'
ContentDifferenceTooltip.propTypes = {
  name: PropTypes.string
}

module.exports = ContentDifferenceTooltip
