import React from 'react'
import { Col, Input, Modal, Row } from 'react-bootstrap'
import Immutable from 'immutable'

import Toggle from '../../toggle'

class Hostname extends React.Component {
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
          <h1>Hostname</h1>
          <p>Match a hostname like www.foobar.com</p>
        </Modal.Header>
        <Modal.Body>

          <Input type="text" label="Hostname"
            placeholder="www.foobar.com"
            id="matches_hostname"
            value={this.props.match.get('cases').get(0).get(0)}
            onChange={this.handleChange(
              this.props.path.concat(['cases', 0, 0])
            )}/>

          <hr />

          <Row className="no-gutters">
            <Col xs={8} className="toggle-label">
              <label>Matches Hostname</label>
            </Col>
            <Col xs={4}>
              <Toggle className="pull-right" value={true}
                changeValue={this.handleToggleChange(
                  ['edge_configuration', 'cache_rule', 'matches', 'hostname']
                )}/>
            </Col>
          </Row>

        </Modal.Body>
      </div>
    )
  }
}

Hostname.displayName = 'Hostname'
Hostname.propTypes = {
  changeValue: React.PropTypes.func,
  match: React.PropTypes.instanceOf(Immutable.Map),
  path: React.PropTypes.array
}

module.exports = Hostname
