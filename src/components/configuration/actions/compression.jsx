import React from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
// import Immutable from 'immutable'

import Toggle from '../../toggle'
import Select from '../../select'

import { FormattedMessage } from 'react-intl'

class Compression extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeFilter: 'both_client_and_origin'
    }

    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.handleToggleChange = this.handleToggleChange.bind(this)
  }
  handleSelectChange(path) {
    return value => {
      this.setState({
        activeFilter: value
      })
      this.props.changeValue(path, value)
    }
  }
  handleToggleChange(path) {
    return value => {
      this.props.changeValue(path, value)
    }
  }
  render() {
    return (
      <div>
        <Modal.Header>
          <h1><FormattedMessage id="portal.policy.edit.compression.header"/></h1>
        </Modal.Header>
        <Modal.Body>

          <div className="form-group">
            <Row className="no-gutters">
              <Col xs={8} className="toggle-label">
                <label><FormattedMessage id="portal.policy.edit.compression.enabledGzip.text"/></label>
              </Col>
              <Col xs={4}>
                <Toggle className="pull-right" value={true}
                  changeValue={this.handleToggleChange(
                    ['edge_configuration', 'cache_rule', 'actions', 'compression_gzip']
                  )}/>
              </Col>
            </Row>
          </div>

          <Select className="input-select"
            onSelect={this.handleSelectChange(
              ['edge_configuration', 'cache_rule', 'actions', 'compression_gzip_value']
            )}
            value={this.state.activeFilter}
            options={[
              ['both_client_and_origin', <FormattedMessage id="portal.policy.edit.compression.bothClieintOrigin.text"/>],
              ['client_only', <FormattedMessage id="portal.policy.edit.compression.clientOnly.text"/>],
              ['origin_only', <FormattedMessage id="portal.policy.edit.compression.originOnly.text"/>]]}/>

        </Modal.Body>
      </div>
    )
  }
}

Compression.displayName = 'Compression'
Compression.propTypes = {
  changeValue: React.PropTypes.func
}

module.exports = Compression
