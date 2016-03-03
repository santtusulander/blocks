import React from 'react'
import { Col, Modal, Row } from 'react-bootstrap'

import Toggle from '../../toggle'

class RemoveVary extends React.Component {
  constructor(props) {
    super(props);

    this.handleToggleChange = this.handleToggleChange.bind(this)
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
          <h1>Remove Vary</h1>
          <p>Lorem ipsum dolor sit amet</p>
        </Modal.Header>
        <Modal.Body>

          <div className="form-group">
            <Row className="no-gutters">
              <Col xs={8} className="toggle-label">
                <label>Remove Vary Header</label>
              </Col>
              <Col xs={4}>
                <Toggle className="pull-right" value={true}
                  changeValue={this.handleToggleChange(
                    ['edge_configuration', 'cache_rule', 'actions', 'remove_vary']
                  )}/>
              </Col>
            </Row>
          </div>

        </Modal.Body>
      </div>
    )
  }
}

RemoveVary.displayName = 'RemoveVary'
RemoveVary.propTypes = {
  changeValue: React.PropTypes.func
}

module.exports = RemoveVary
