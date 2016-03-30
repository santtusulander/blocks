import React from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import Immutable from 'immutable'

import Toggle from '../../toggle'
import Select from '../../select'

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
          <h1>Compression</h1>
        </Modal.Header>
        <Modal.Body>

          <div className="form-group">
            <Row className="no-gutters">
              <Col xs={8} className="toggle-label">
                <label>Enable GZIP</label>
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
              ['both_client_and_origin', 'To Both Client and Origin'],
              ['client_only', 'To Client Only'],
              ['origin_only', 'To Origin Only']]}/>

        </Modal.Body>
      </div>
    )
  }
}

Compression.displayName = 'Compression'
Compression.propTypes = {
  changeValue: React.PropTypes.func,
  path: React.PropTypes.array,
  set: React.PropTypes.instanceOf(Immutable.Map)
}

module.exports = Compression
