import React from 'react'
import { Button, ButtonToolbar, Col, Input, Modal, Panel, Row } from 'react-bootstrap'
import Immutable from 'immutable'

import Select from '../../select'
import InputConnector from '../../input-connector'

class Header extends React.Component {
  constructor(props) {
    super(props);

    const value = props.set.get('value')

    this.state = {
      activeActivity: props.set.get('action') || 'set',
      activeDirection: 'to_origin',
      from_header: '',
      from_value: '',
      to_header: props.set.get('header'),
      to_value: value && value.size ? value.get(0).get('field_detail') : ''
    }

    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.saveChanges = this.saveChanges.bind(this)
  }
  handleSelectChange(key) {
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
    }
  }
  saveChanges() {
    let newSet
    if(this.state.activeActivity === 'unset') {
      newSet = this.props.set.merge({
        action: "unset",
        header: this.state.to_header
      })
      // If there was perviously a value, be sure to delete it
      if(newSet.has('value')) {
        newSet = newSet.delete('value')
      }
    }
    else if(this.state.activeActivity === 'set') {
      newSet = this.props.set.merge({
        action: "set",
        header: this.state.to_header,
        value: Immutable.fromJS([{
          field: "text",
          field_detail: this.state.to_value
        }])
      })
    }
    this.props.changeValue(
      this.props.path,
      newSet
    )
    this.props.close()
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
              hasTwoEnds={this.state.activeActivity !== 'unset'}/>

            <div className="form-group">
              <label className="control-label">Activity</label>
              <Select className="input-select"
                onSelect={this.handleSelectChange('activeActivity')}
                value={this.state.activeActivity}
                options={[
                  ['set', 'Add'],
                  /*['modify', 'Modify'],*/
                  ['unset', 'Remove']]}/>
            </div>

            <Panel className="form-panel" collapsible={true}
              expanded={this.state.activeActivity !== 'modify'}>
              <Input type="text" label="Name"
                placeholder="Enter Header Name"
                value={this.state.to_header}
                onChange={(e) => {this.setState({
                  to_header: e.target.value
                })}}/>
            </Panel>

            <Panel className="form-panel" collapsible={true}
              expanded={this.state.activeActivity === 'set'}>
              <Input type="text" label="Value"
                placeholder="Enter Header Value"
                value={this.state.to_value}
                onChange={(e) => {this.setState({
                  to_value: e.target.value
                })}}/>
            </Panel>

            <Panel className="form-panel" collapsible={true}
              expanded={this.state.activeActivity === 'modify'}>
              <Row>
                <Col xs={6}>
                  <Input type="text" label="FROM Name"
                    placeholder="Enter Header Name"
                    value={this.state.from_header}
                    onChange={(e) => {this.setState({
                      from_header: e.target.value
                    })}}/>
                </Col>
                <Col xs={6}>
                  <Input type="text" label="TO Name"
                    placeholder="Enter Header Name"
                    value={this.state.to_header}
                    onChange={(e) => {this.setState({
                      to_header: e.target.value
                    })}}/>
                </Col>
                <Col xs={6}>
                  <Input type="text" label="FROM Value"
                    placeholder="Enter Header Value"
                    value={this.state.from_value}
                    onChange={(e) => {this.setState({
                      from_value: e.target.value
                    })}}/>
                </Col>
                <Col xs={6}>
                  <Input type="text" label="TO Value"
                    placeholder="Enter Header Value"
                    value={this.state.to_value}
                    onChange={(e) => {this.setState({
                      to_value: e.target.value
                    })}}/>
                </Col>
              </Row>
            </Panel>

          </div>

          <hr />

          <div className="form-group">
            <label className="control-label">Direction</label>
            <Select className="input-select"
              onSelect={this.handleSelectChange('activeDirection')}
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
            <Button bsStyle="primary" onClick={this.saveChanges}>
              Save Action
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
