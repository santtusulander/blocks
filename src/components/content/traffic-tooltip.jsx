import React from 'react'

function getValue(stat) {
  return stat ? stat.split(' ')[0] : ''
}

function getUnit(stat) {
  return stat ? stat.split(' ')[1] : ''
}

const ContentTrafficTooltip = ({avgTransfer, maxTransfer, minTransfer, date}) => <div>
  <div className="tooltip-header">
    <b>Bandwidth</b> {date}
  </div>
  <div>
    Peak
    <span className="pull-right">
      {getValue(maxTransfer)}
      <span className="data-suffix"> {getUnit(maxTransfer)}</span>
    </span>
  </div>
  <div>
    Average <span className="pull-right">
      {getValue(avgTransfer)}
      <span className="data-suffix"> {getUnit(avgTransfer)}</span>
    </span>
  </div>
  <div>
    Low <span className="pull-right">
      {getValue(minTransfer)}
      <span className="data-suffix"> {getUnit(minTransfer)}</span>
    </span>
  </div>
</div>

ContentTrafficTooltip.displayName = 'ContentTrafficTooltip'
ContentTrafficTooltip.propTypes = {
  avgTransfer: React.PropTypes.string,
  maxTransfer: React.PropTypes.string,
  minTransfer: React.PropTypes.string
}

module.exports = ContentTrafficTooltip
