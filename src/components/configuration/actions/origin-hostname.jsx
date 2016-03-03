import React from 'react'
import { Input, Modal, Panel } from 'react-bootstrap'

import Select from '../../select'
import InputConnector from '../../input-connector'

class OriginHostname extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeFilter: 'other_origin_hostname'
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
  render() {
    const isOtherHostHeader = this.state.activeFilter === 'other_origin_hostname'
    return (
      <div>
        <Modal.Header>
          <h1>Origin Hostname</h1>
          <p>Lorem ipsum dolor sit amet</p>
        </Modal.Header>
        <Modal.Body>

          <div className="form-group">
            <label className="control-label">Origin Hostname</label>
            <p>origin.foo.com</p>
          </div>

          <hr />

          <Input type="number" label="Origin Port"
            placeholder="80"
            id="actions_origin-port"
            onChange={this.handleChange(
              ['edge_configuration', 'cache_rule', 'actions', 'origin_hostname_port']
            )}/>

          <hr />

          <div className="form-groups">
            <InputConnector show={isOtherHostHeader} />
            <div className="form-group">
              <label className="control-label">Origin Hostname Value</label>
              <Select className="input-select"
                onSelect={this.handleSelectChange(
                  ['edge_configuration', 'cache_rule', 'actions', 'origin_hostname']
                )}
                value={this.state.activeFilter}
                options={[
                  ['other_origin_hostname', 'Use Other Hostname Value'],
                  ['origin_hostname', 'Use Origin Hostname'],
                  ['published_name', 'Use Published Hostname']]}/>
            </div>

            <Panel className="form-panel" collapsible={true}
              expanded={isOtherHostHeader}>
              <Input type="text"
                placeholder="origin.foobar.com"
                onChange={this.handleChange(
                  ['edge_configuration', 'cache_rule', 'actions', 'origin_hostname_value']
                )}/>
            </Panel>
          </div>

        <hr />

        <Input type="text" label="Origin Forward Path (optional)"
          placeholder="/"
          id="actions_origin-forward-path"
          onChange={this.handleChange(
            ['edge_configuration', 'cache_rule', 'actions', 'origin_hostname_forward_path']
          )}/>

        </Modal.Body>
      </div>
    )
  }
}

OriginHostname.displayName = 'OriginHostname'
OriginHostname.propTypes = {
  changeValue: React.PropTypes.func
}

module.exports = OriginHostname
