import React from 'react'
import { Col, Input, Modal, Row } from 'react-bootstrap'

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
              <Toggle className="pull-right" value={true}
                changeValue={this.handleToggleChange(
                  ['edge_configuration', 'cache_rule', 'actions', 'cache_no_store']
                )}/>
            </Col>
          </Row>

          <hr />

          <Row className="no-gutters">
            <Col xs={8} className="toggle-label">
              <label>Honor Origin Cache Control</label>
            </Col>
            <Col xs={4}>
              <Toggle className="pull-right" value={true}
                changeValue={this.handleToggleChange(
                  ['edge_configuration', 'cache_rule', 'actions', 'cache_honor_origin_cache']
                )}/>
            </Col>
          </Row>

          <hr />

          <Row className="no-gutters">
            <Col xs={8} className="toggle-label">
              <label>Honor e-Tag Values</label>
            </Col>
            <Col xs={4}>
              <Toggle className="pull-right" value={true}
                changeValue={this.handleToggleChange(
                  ['edge_configuration', 'cache_rule', 'actions', 'cache_honor_e_tag']
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
                  onChange={this.handleChange(
                    ['edge_configuration', 'cache_rule', 'actions', 'cache_ttl_value']
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
  changeValue: React.PropTypes.func
}

module.exports = Cache
