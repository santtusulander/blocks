import React from 'react'
import { Button, ButtonToolbar, Col, Input, Modal, Row } from 'react-bootstrap'
import Immutable from 'immutable'

import Toggle from '../../toggle'
import Select from '../../select'

class Cache extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      checkEtag: props.set.get('check_etag'),
      honorOrigin: props.set.get('honor_origin'),
      maxAge: props.set.get('max_age'),
      noStore: props.set.get('no_store'),
      ttlType: 'seconds'
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleTTLTypeChange = this.handleTTLTypeChange.bind(this)
    this.handleToggleChange = this.handleToggleChange.bind(this)
    this.saveChanges = this.saveChanges.bind(this)
  }
  handleChange(key) {
    return e => {
      let stateObj = {}
      stateObj[key] = e.target.value
      this.setState(stateObj)
    }
  }
  handleTTLTypeChange(value) {
    this.setState({ttlType: value})
  }
  handleToggleChange(key) {
    return value => {
      let stateObj = {}
      stateObj[key] = value
      this.setState(stateObj)
    }
  }
  saveChanges() {
    this.props.changeValue(
      this.props.path,
      this.props.set.merge({
        check_etag: this.state.checkEtag,
        max_age: parseInt(this.state.maxAge),
        no_store: this.state.noStore,
        honor_origin: this.state.honorOrigin
      })
    )
    this.props.close()
  }
  render() {
    return (
      <div>
        <Modal.Header>
          <h1>Cache</h1>
        </Modal.Header>
        <Modal.Body>

          <Row className="no-gutters">
            <Col xs={8} className="toggle-label">
              <label>No-Store</label>
            </Col>
            <Col xs={4}>
              <Toggle className="pull-right"
                value={this.state.noStore}
                changeValue={this.handleToggleChange('noStore')}/>
            </Col>
          </Row>

          <hr />

          <Row className="no-gutters">
            <Col xs={8} className="toggle-label">
              <label>Honor Origin Cache Control</label>
            </Col>
            <Col xs={4}>
              <Toggle className="pull-right"
                value={this.state.honorOrigin}
                changeValue={this.handleToggleChange('honorOrigin')}/>
            </Col>
          </Row>

          <hr />

          <Row className="no-gutters">
            <Col xs={8} className="toggle-label">
              <label>Honor e-Tag Values</label>
            </Col>
            <Col xs={4}>
              <Toggle className="pull-right"
                value={this.state.checkEtag}
                changeValue={this.handleToggleChange('checkEtag')}/>
            </Col>
          </Row>

          <hr />

          <Input label="TTL Value">
            <Row>
              <Col xs={6}>
                <Input type="number"
                  id="actions_ttl-value-number"
                  placeholder="Enter TTL Value"
                  value={this.state.maxAge}
                  onChange={this.handleChange('maxAge')}/>
              </Col>
              <Col xs={6}>
                <Select className="input-select"
                  onSelect={this.handleTTLTypeChange}
                  value={this.state.ttlType}
                  options={[
                    ['seconds', 'Seconds'],
                    ['minutes', 'Minutes'],
                    ['hours', 'Hours'],
                    ['days', 'Days']]}/>
              </Col>
            </Row>
          </Input>

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

Cache.displayName = 'Cache'
Cache.propTypes = {
  changeValue: React.PropTypes.func,
  close: React.PropTypes.func,
  path: React.PropTypes.array,
  set: React.PropTypes.instanceOf(Immutable.Map)
}

module.exports = Cache
