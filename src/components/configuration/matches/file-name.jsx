import React from 'react'
import { Col, Input, Modal, Row } from 'react-bootstrap'
import Immutable from 'immutable'

import Toggle from '../../toggle'

class Filename extends React.Component {
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
          <h1>File Name</h1>
          <p>Match one or more file names like index.html, home.htm</p>
        </Modal.Header>
        <Modal.Body>

          <Input type="text" label="File Name"
            placeholder="index.html, home.htm"
            id="matches_file-name"
            value={this.props.match.get('cases').get(0).get(0)}
            onChange={this.handleChange(
              this.props.path.concat(['cases', 0, 0])
            )}/>

          <hr />

          <Row className="no-gutters">
            <Col xs={8} className="toggle-label">
              <label>Matches File name</label>
            </Col>
            <Col xs={4}>
              <Toggle className="pull-right" value={true}
                changeValue={this.handleToggleChange(
                  ['edge_configuration', 'cache_rule', 'matches', 'file_name']
                )}/>
            </Col>
          </Row>

        </Modal.Body>
      </div>
    )
  }
}

Filename.displayName = 'Filename'
Filename.propTypes = {
  changeValue: React.PropTypes.func,
  match: React.PropTypes.instanceOf(Immutable.Map),
  path: React.PropTypes.array
}

module.exports = Filename
