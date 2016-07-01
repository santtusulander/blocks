import React from 'react'

const ContentDifferenceTooltip = () => <div>
  <div className="tooltip-header">
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
ContentDifferenceTooltip.propTypes = {}

module.exports = ContentDifferenceTooltip
