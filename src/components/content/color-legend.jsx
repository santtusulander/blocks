import React from 'react'
import { Row } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

import { HOST_SERVICE_TYPES } from '../../constants/configuration'

const ColorLegend = ({ serviceTypes }) => {
  if (serviceTypes && serviceTypes.length > 0) {
    return (<Row>
      <div className="pull-right color-legend-container col-xs-2">
        {serviceTypes.includes(HOST_SERVICE_TYPES.MEDIA_DELIVERY) && <div>
          <div className="pull-left color-legend media-delivery" />
          <span className="pull-left"> <FormattedMessage id='portal.configuration.details.serviceType.large' /> </span>
        </div>}
        {serviceTypes.includes(HOST_SERVICE_TYPES.VOD_STREAMING) && <div>
          <div className="pull-left color-legend vod-streaming" />
          <span className="pull-left"> <FormattedMessage className="pull-left" id='portal.configuration.details.serviceType.msd' /> </span>
        </div>}
        {serviceTypes.includes(HOST_SERVICE_TYPES.LIVE_STREAMING) && <div>
          <div className="pull-left color-legend live-streaming" />
          <span className="pull-left"> <FormattedMessage className="pull-left" id='portal.configuration.details.serviceType.livestream' /> </span>
        </div>}
      </div>
    </Row>)
  }
  return null
}

ColorLegend.displayName = 'ColorLegend'
ColorLegend.propTypes = {
  serviceTypes: React.PropTypes.array
}


module.exports = ColorLegend
