import React from 'react'
import { Row } from 'react-bootstrap'

import { FormattedMessage } from 'react-intl'

const ColorLegend = () =>
<Row>
  <div className="pull-right color-legend-container col-xs-2">
    <div>
      <div className="pull-left color-legend media-delivery" />
      <span className="pull-left"> <FormattedMessage id='portal.configuration.details.serviceType.large' /> </span>
    </div>
    <div>
      <div className="pull-left color-legend vod-streaming" />
      <span className="pull-left"> <FormattedMessage className="pull-left" id='portal.configuration.details.serviceType.msd' /> </span>
    </div>
    <div>
      <div className="pull-left color-legend live-streaming" />
      <span className="pull-left" >Live Streaming</span>
    </div>
  </div>
</Row>

ColorLegend.displayName = 'ColorLegend'

module.exports = ColorLegend
