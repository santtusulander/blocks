import React from 'react'
import { Col, Modal, Row } from 'react-bootstrap'

import Toggle from '../../shared/form-elements/toggle'

import { FormattedMessage } from 'react-intl'

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
          <h1><FormattedMessage id="portal.policy.edit.removeVary.header"/></h1>
        </Modal.Header>
        <Modal.Body>

          <div className="form-group">
            <Row className="no-gutters">
              <Col xs={8} className="toggle-label">
                <label><FormattedMessage id="portal.policy.edit.removeVary.text"/></label>
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
