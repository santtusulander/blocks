import React from 'react'
import { Col, Input, Modal, Row } from 'react-bootstrap'

import Toggle from '../../toggle'

class FileExtension extends React.Component {
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
          <h1>File Extension</h1>
          <p>Match one or more file extensions like .GIF, JPG, .MOV, .MP3</p>
        </Modal.Header>
        <Modal.Body>

          <Input type="text" label="File extension"
            placeholder="png, gif, jpg"
            id="matches_file-extension"
            onChange={this.handleChange(
              ['edge_configuration', 'cache_rule', 'matches', 'file_extension_value']
            )}/>

          <Input type="checkbox" label="Ignore case"
            onChange={this.handleChange(
              ['edge_configuration', 'cache_rule', 'matches', 'file_extension_ignore_case']
            )}/>

          <hr />

          <Row className="no-gutters">
            <Col xs={8} className="toggle-label">
              <label>Matches File extension</label>
            </Col>
            <Col xs={4}>
              <Toggle className="pull-right" value={true}
                changeValue={this.handleToggleChange(
                  ['edge_configuration', 'cache_rule', 'matches', 'file_extension']
                )}/>
            </Col>
          </Row>

        </Modal.Body>
      </div>
    )
  }
}

FileExtension.displayName = 'FileExtension'
FileExtension.propTypes = {
  changeValue: React.PropTypes.func
}

module.exports = FileExtension
