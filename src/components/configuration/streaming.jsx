import React, { Component } from 'react'
import { Row, Col, ControlLabel, FormGroup } from 'react-bootstrap'
import { Map } from 'immutable'
import { FormattedMessage } from 'react-intl'
import Toggle from '../toggle'
import LoadingSpinner from '../loading-spinner/loading-spinner'

class ConfigurationStreaming extends Component {
  constructor(props) {
    super(props)

    this.toggleVodStreaming = this.toggleVodStreaming.bind(this)
  }

  toggleVodStreaming(val) {
    /* TODO: UDNP-2819 - Update Streaming tab once API is ready */
    this.props.changeValue(['edge_configuration', 'msd_enabled'], val)
  }

  render() {
    const { config, readOnly } = this.props;

    if (!config || !config.size) {
      return (
        <LoadingSpinner />
      )
    }

    return (
      <div className="configuration-details">
        <Row>
          <FormGroup>
            <Col xs={3}>
              <ControlLabel>
                <FormattedMessage id="portal.configuration.streaming.VOD.label"/>
              </ControlLabel>
            </Col>
            <Col xs={9}>
              {/* TODO: UDNP-2819 - Update Streaming tab once API is ready */}
              <Toggle
                readonly={readOnly}
                value={config.getIn(['edge_configuration', 'msd_enabled'])}
                changeValue={(val) => this.toggleVodStreaming(val)}/>
            </Col>
          </FormGroup>
        </Row>
      </div>
    )
  }
}

ConfigurationStreaming.displayName = 'ConfigurationStreaming'
ConfigurationStreaming.propTypes = {
  changeValue: React.PropTypes.func,
  config: React.PropTypes.instanceOf(Map),
  readOnly: React.PropTypes.bool
}

ConfigurationStreaming.defaultProps = {
  config: Map()
}

export default ConfigurationStreaming
