import React from 'react'
import { Row, Col, ControlLabel, FormGroup } from 'react-bootstrap'
import { Map } from 'immutable'
import { FormattedMessage } from 'react-intl'
import Toggle from '../toggle'
import LoadingSpinner from '../loading-spinner/loading-spinner'

const ConfigurationStreaming = ({config, serviceType, hasVODSupport}) => {
  let isVODEnabled = false

  if (!config || !config.size) {
    return (
      <LoadingSpinner />
    )
  }

  // Service type msd means that VOD is enabled.
  // Please check CS-666 for more details
  if (serviceType === "msd") {
    isVODEnabled = true
  }

  return (
      <div className="configuration-details">
        { hasVODSupport &&
          <Row>
            <FormGroup>
              <Col xs={3}>
                <ControlLabel>
                  <FormattedMessage id="portal.configuration.streaming.VOD.label"/>
                </ControlLabel>
              </Col>
              <Col xs={9}>
                <Toggle
                  readonly={true}
                  value={isVODEnabled}
                  changeValue={() => {}}/>
              </Col>
            </FormGroup>
          </Row>
        }
      </div>
  )
}

ConfigurationStreaming.displayName = 'ConfigurationStreaming'
ConfigurationStreaming.propTypes = {
  config: React.PropTypes.instanceOf(Map),
  hasVODSupport: React.PropTypes.bool,
  serviceType: React.PropTypes.string
}

ConfigurationStreaming.defaultProps = {
  config: Map(),
  hasVODSupport: false
}

export default ConfigurationStreaming
