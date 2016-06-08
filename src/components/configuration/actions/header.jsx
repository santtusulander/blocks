import React from 'react'
import { Button, ButtonToolbar, Col, Input, Modal, Panel, Row } from 'react-bootstrap'
import Immutable from 'immutable'

import Select from '../../select'
import InputConnector from '../../input-connector'

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeActivity: 'add',
      activeDirection: 'to_origin'
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
  }
  handleChange(path) {
    return e => {
      this.props.changeValue(path, e.target.value)
    }
  }
  handleSelectChange(key, path) {
    return key, value => {
      if (key === 'activeActivity') {
        this.setState({
          activeActivity: value
        })
      } else if (key === 'activeDirection') {
        this.setState({
          activeDirection: value
        })
      }
      this.props.changeValue(path, value)
    }
  }
  render() {
    return (
      <div>
        <Modal.Header>
          <h1>Header</h1>
        </Modal.Header>
        <Modal.Body>

          <div className="form-groups">

            <InputConnector show={true}
              hasTwoEnds={this.state.activeActivity !== 'remove'}/>

            <div className="form-group">
              <label className="control-label">Activity</label>
              <Select className="input-select"
                onSelect={this.handleSelectChange('activeActivity',
                  ['edge_configuration', 'cache_rule', 'actions', 'header']
                )}
                value={this.state.activeActivity}
                options={[
                  ['add', 'Add'],
                  ['modify', 'Modify'],
                  ['remove', 'Remove']]}/>
            </div>

            <Panel className="form-panel" collapsible={true}
              expanded={this.state.activeActivity !== 'modify'}>
              <Input type="text" label="Name"
                placeholder="Enter Header Name"
                onChange={this.handleChange(
                  ['edge_configuration', 'cache_rule', 'actions', 'header_name']
                )}/>
            </Panel>

            <Panel className="form-panel" collapsible={true}
              expanded={this.state.activeActivity === 'add'}>
              <Input type="text" label="Value"
                placeholder="Enter Header Value"
                onChange={this.handleChange(
                  ['edge_configuration', 'cache_rule', 'actions', 'header_value']
                )}/>
            </Panel>

            <Panel className="form-panel" collapsible={true}
              expanded={this.state.activeActivity === 'modify'}>
              <Row>
                <Col xs={6}>
                  <Input type="text" label="FROM Name"
                    placeholder="Enter Header Name"
                    onChange={this.handleChange(
                      ['edge_configuration', 'cache_rule', 'actions', 'header_name_from']
                    )}/>
                </Col>
                <Col xs={6}>
                  <Input type="text" label="TO Name"
                    placeholder="Enter Header Name"
                    onChange={this.handleChange(
                      ['edge_configuration', 'cache_rule', 'actions', 'header_name_to']
                    )}/>
                </Col>
                <Col xs={6}>
                  <Input type="text" label="FROM Value"
                    placeholder="Enter Header Value"
                    onChange={this.handleChange(
                      ['edge_configuration', 'cache_rule', 'actions', 'header_value_from']
                    )}/>
                </Col>
                <Col xs={6}>
                  <Input type="text" label="TO Value"
                    placeholder="Enter Header Value"
                    onChange={this.handleChange(
                      ['edge_configuration', 'cache_rule', 'actions', 'header_value_to']
                    )}/>
                </Col>
              </Row>
            </Panel>

          </div>

          <hr />

          <div className="form-group">
            <label className="control-label">Direction</label>
            <Select className="input-select"
              onSelect={this.handleSelectChange('activeDirection',
                ['edge_configuration', 'cache_rule', 'actions', 'header_direction']
              )}
              value={this.state.activeDirection}
              options={[
                ['to_origin', 'To Origin'],
                ['to_client', 'To Client'],
                ['to_both', 'To Both']]}/>
          </div>

          <ButtonToolbar className="text-right">
            <Button bsStyle="default" onClick={this.props.close}>
              Cancel
            </Button>
            <Button bsStyle="primary" onClick={this.props.close}>
              Save Match
            </Button>
          </ButtonToolbar>

        </Modal.Body>
      </div>
    )
  }
}

Header.displayName = 'Header'
Header.propTypes = {
  changeValue: React.PropTypes.func,
  close: React.PropTypes.func,
  path: React.PropTypes.array,
  set: React.PropTypes.instanceOf(Immutable.Map)
}

module.exports = Header
