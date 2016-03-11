import React from 'react'
import { Col, Input, Modal, Row } from 'react-bootstrap'
import Immutable from 'immutable'

import Toggle from '../../toggle'
import Select from '../../select'

class Cache extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeFilter: 'seconds'
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
  }
  handleChange(path) {
    return e => {
      this.props.changeValue(path, e.target.value)
    }
  }
  handleSelectChange(path) {
    return value => {
      this.setState({
        activeFilter: value
      })
      this.props.changeValue(path, value)
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
          <h1>Cache</h1>
          <p>Lorem ipsum dolor sit amet</p>
        </Modal.Header>
        <Modal.Body>

          <Row className="no-gutters">
            <Col xs={8} className="toggle-label">
              <label>No-Store</label>
            </Col>
            <Col xs={4}>
              <Toggle className="pull-right"
                value={this.props.set.get('no_store')}
                changeValue={this.handleToggleChange(
                  this.props.path.concat(['no_store'])
                )}/>
            </Col>
          </Row>

          <hr />

          <Row className="no-gutters">
            <Col xs={8} className="toggle-label">
              <label>Honor Origin Cache Control</label>
            </Col>
            <Col xs={4}>
              <Toggle className="pull-right"
                value={this.props.set.get('honor_origin')}
                changeValue={this.handleToggleChange(
                  this.props.path.concat(['honor_origin'])
                )}/>
            </Col>
          </Row>

          <hr />

          <Row className="no-gutters">
            <Col xs={8} className="toggle-label">
              <label>Honor e-Tag Values</label>
            </Col>
            <Col xs={4}>
              <Toggle className="pull-right"
                value={this.props.set.get('check_etag')}
                changeValue={this.handleToggleChange(
                  this.props.path.concat(['check_etag'])
                )}/>
            </Col>
          </Row>

          <hr />

          <Input label="TTL Value">
            <Row>
              <Col xs={6}>
                <Input type="number"
                  id="actions_ttl-value-number"
                  placeholder="number"
                  value={this.props.set.get('max_age')}
                  onChange={this.handleChange(
                    this.props.path.concat(['max_age'])
                  )}/>
              </Col>
              <Col xs={6}>
                <Select className="input-select"
                  onSelect={this.handleSelectChange(
                    ['edge_configuration', 'cache_rule', 'actions', 'ttl_type']
                  )}
                  value={this.state.activeFilter}
                  options={[
                    ['seconds', 'Seconds'],
                    ['minutes', 'Minutes'],
                    ['hours', 'Hours'],
                    ['days', 'Days']]}/>
              </Col>
            </Row>
          </Input>

        </Modal.Body>
      </div>
    )
  }
}

Cache.displayName = 'Cache'
Cache.propTypes = {
  changeValue: React.PropTypes.func,
  path: React.PropTypes.array,
  set: React.PropTypes.instanceOf(Immutable.Map)
}

module.exports = Cache
