import React from 'react'
import { Col, Input, Modal, Row } from 'react-bootstrap'

import Toggle from '../../toggle'

class MimeType extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this)
    this.handleToggleChange = this.handleToggleChange.bind(this)
  }
  handleChange(path) {
    return e => {
      this.props.changeValue(path, e.target.value)
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
          <h1>MIME Type</h1>
          <p>Match one or more MIME types like text/html, application/javascript</p>
        </Modal.Header>
        <Modal.Body>

          <Input type="textarea" label="Media Type"
            placeholder="text/html, application/javascript"
            id="matches_mime-type"
            onChange={this.handleChange(
              ['edge_configuration', 'cache_rule', 'matches', 'mime_types_value']
            )}/>

          <hr />

          <Row className="no-gutters">
            <Col xs={8} className="toggle-label">
              <label>Matches Media type</label>
            </Col>
            <Col xs={4}>
              <Toggle className="pull-right" value={true}
                changeValue={this.handleToggleChange(
                  ['edge_configuration', 'cache_rule', 'matches', 'mime_types']
                )}/>
            </Col>
          </Row>

        </Modal.Body>
      </div>
    )
  }
}

MimeType.displayName = 'MimeType'
MimeType.propTypes = {
  changeValue: React.PropTypes.func
}

module.exports = MimeType
