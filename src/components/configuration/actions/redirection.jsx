import React from 'react'
import { Col, Input, Modal, Row } from 'react-bootstrap'
import Immutable from 'immutable'

import Toggle from '../../toggle'
import Select from '../../select'

class Redirection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeProtocol: 'http',
      activeRedirectionType: '301'
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.handleToggleChange = this.handleToggleChange.bind(this)
  }
  handleChange(path) {
    return e => {
      this.props.changeValue(path, e.target.value)
    }
  }
  handleSelectChange(key, path) {
    return key, value => {
      if (key === 'activeProtocol') {
        this.setState({
          activeProtocol: value
        })
      } else if (key === 'activeRedirectionType') {
        this.setState({
          activeRedirectionType: value
        })
      }
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
          <h1>Redirection</h1>
        </Modal.Header>
        <Modal.Body>

          <div className="form-group">
            <Row className="no-gutters">
              <Col xs={8} className="toggle-label">
                <label>Change Protocol</label>
              </Col>
              <Col xs={4}>
                <Toggle className="pull-right" value={true}
                  changeValue={this.handleToggleChange(
                    ['edge_configuration', 'cache_rule', 'actions', 'redirection_change_protocol']
                  )}/>
              </Col>
            </Row>
          </div>

          <Select className="input-select"
            onSelect={this.handleSelectChange('activeProtocol',
              ['edge_configuration', 'cache_rule', 'actions', 'redirection_protocol']
            )}
            value={this.state.activeProtocol}
            options={[
              ['http', 'HTTP'],
              ['https', 'HTTPS']]}/>

          <hr />

          <div className="form-group">
            <Row className="no-gutters">
              <Col xs={8} className="toggle-label">
                <label>Change Domain</label>
              </Col>
              <Col xs={4}>
                <Toggle className="pull-right" value={true}
                  changeValue={this.handleToggleChange(
                    ['edge_configuration', 'cache_rule', 'actions', 'redirection_change_domain']
                  )}/>
              </Col>
            </Row>
          </div>

          <Input type="text"
            id="actions_domain"
            placeholder="Enter Domain"
            onChange={this.handleChange(
              ['edge_configuration', 'cache_rule', 'actions', 'redirection_domain']
            )}/>

          <hr />

          <div className="form-group">
            <Row className="no-gutters">
              <Col xs={8} className="toggle-label">
                <label>Change Path</label>
              </Col>
              <Col xs={4}>
                <Toggle className="pull-right" value={true}
                  changeValue={this.handleToggleChange(
                    ['edge_configuration', 'cache_rule', 'actions', 'redirection_change_path']
                  )}/>
              </Col>
            </Row>
          </div>

          <Input type="text"
            id="actions_path"
            placeholder="Enter Path"
            onChange={this.handleChange(
              ['edge_configuration', 'cache_rule', 'actions', 'redirection_path']
            )}/>

          <hr />

          <div className="form-group">
            <label className="control-label">Redirection Type</label>
            <Select className="input-select"
              onSelect={this.handleSelectChange('activeRedirectionType',
                ['edge_configuration', 'cache_rule', 'actions', 'redirection_type']
              )}
              value={this.state.activeRedirectionType}
              options={[
                ['301', '301 Permanently moved'],
                ['302', '302 Found'],
                ['307', '307 Temporarily moved'],
                ['410', '410 Gone'],
                ['418', '418 I`m a little tea pot']]}/>
          </div>

        </Modal.Body>
      </div>
    )
  }
}

Redirection.displayName = 'Redirection'
Redirection.propTypes = {
  changeValue: React.PropTypes.func,
  path: React.PropTypes.array,
  set: React.PropTypes.instanceOf(Immutable.Map)
}

module.exports = Redirection
