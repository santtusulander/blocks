import React from 'react'
import { Col, Input, Modal, Row } from 'react-bootstrap'

import Toggle from '../../toggle'

class DirectoryPath extends React.Component {
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
          <h1>Directory Path</h1>
          <p>Match a directory path like /wp-admin/</p>
        </Modal.Header>
        <Modal.Body>

          <Input type="text" label="Path"
            placeholder="/wp-admin/"
            id="matches_directory-path"
            onChange={this.handleChange(
              ['edge_configuration', 'cache_rule', 'matches', 'path_value']
            )}/>

          <hr />

          <Row className="no-gutters">
            <Col xs={8} className="toggle-label">
              <label>Matches Directory path</label>
            </Col>
            <Col xs={4}>
              <Toggle className="pull-right" value={true}
                changeValue={this.handleToggleChange(
                  ['edge_configuration', 'cache_rule', 'matches', 'path']
                )}/>
            </Col>
          </Row>

        </Modal.Body>
      </div>
    )
  }
}

DirectoryPath.displayName = 'DirectoryPath'
DirectoryPath.propTypes = {
  changeValue: React.PropTypes.func
}

module.exports = DirectoryPath
