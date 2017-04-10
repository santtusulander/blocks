import React, { PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'

import { formatBytes } from '../../util/helpers'

const CustomTooltip = ({ payload = [], iconClass, valueFormatter = formatBytes }) => {
  const total = valueFormatter(payload.reduce((sum, { value }) => {
    const result = sum + value
    return result
  }, 0))
  return (
    <div className="bar-chart-tooltip">

      {payload.map(({ name, value, dataKey, payload: { formattedDate } }, i) =>

        <div key={i} className="tooltip-item">
          <span className="legend-label">
            <span className={`legend-icon ${iconClass(dataKey)}`}><FormattedMessage id="portal.mdashWithSpace"/></span>
            {formattedDate || name}
          </span>
          <span className='legend-value'>{valueFormatter(value)}</span>
        </div>
      )}

      {payload.length > 1 && [
        <hr key="hr" style={{ margin: '7px 0' }}/>,
        <div key="totalRow" className="tooltip-item">
          <span className="legend-label">
            <FormattedMessage id="portal.common.total.text"/>
          </span>
          <span id="tooltip-total" className="legend-value">{total}</span>
        </div>]}
    </div>
  )
}

CustomTooltip.displayName = "CustomTooltip"
CustomTooltip.propTypes = {
  iconClass: PropTypes.func,
  payload: PropTypes.array,
  valueFormatter: PropTypes.func
}

export default CustomTooltip
