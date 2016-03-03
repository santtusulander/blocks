import React from 'react'
import { Col, Modal, Row } from 'react-bootstrap'

import Toggle from '../../toggle'

class PostSupport extends React.Component {
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
          <h1>POST Support</h1>
          <p>Lorem ipsum dolor sit amet</p>
        </Modal.Header>
        <Modal.Body>

          <div className="form-group">
            <Row className="no-gutters">
              <Col xs={8} className="toggle-label">
                <label>Enable POST</label>
              </Col>
              <Col xs={4}>
                <Toggle className="pull-right" value={true}
                  changeValue={this.handleToggleChange(
                    ['edge_configuration', 'cache_rule', 'actions', 'post_support']
                  )}/>
              </Col>
            </Row>
          </div>

        </Modal.Body>
      </div>
    )
  }
}

PostSupport.displayName = 'PostSupport'
PostSupport.propTypes = {
  changeValue: React.PropTypes.func
}

module.exports = PostSupport
