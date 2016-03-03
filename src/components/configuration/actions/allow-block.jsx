import React from 'react'
import { Input, Modal, Panel } from 'react-bootstrap'

import Select from '../../select'
import InputConnector from '../../input-connector'

class AllowBlock extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeAccessControl: 'allow',
      activeErrorResponse: '301'
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
      if (key === 'activeAccessControl') {
        this.setState({
          activeActivity: value
        })
      } else if (key === 'activeErrorResponse') {
        this.setState({
          activeDirection: value
        })
      }
      this.props.changeValue(path, value)
    }
  }
  render() {
    const requiresInput = this.state.activeErrorResponse === '301' ||
      this.state.activeErrorResponse === '302'
    return (
      <div>
        <Modal.Header>
          <h1>Allow/Block</h1>
          <p>Lorem ipsum dolor sit amet</p>
        </Modal.Header>
        <Modal.Body>

          <div className="form-group">
            <label className="control-label">Access Control</label>
            <Select className="input-select"
              onSelect={this.handleSelectChange('activeAccessControl',
                ['edge_configuration', 'cache_rule', 'actions', 'allow_block_access_control']
              )}
              value={this.state.activeAccessControl}
              options={[
                ['allow', 'Allow'],
                ['deny', 'Deny']]}/>
          </div>

          <hr />

          <div className="form-groups">
            <InputConnector
              show={requiresInput} />
            <div className="form-group">
              <label className="control-label">Error Response</label>
              <Select className="input-select"
                onSelect={this.handleSelectChange('activeErrorResponse',
                  ['edge_configuration', 'cache_rule', 'actions', 'allow_block_error_response']
                )}
                value={this.state.activeErrorResponse}
                options={[
                  ['301', '301 Permanently moved'],
                  ['302', '302 Found'],
                  ['307', '307 Temporarily moved'],
                  ['404', '404 Not Found'],
                  ['410', '410 Gone'],
                  ['418', '418 I`m a little tea pot'],
                  ['503', '503 Service Unavailable']]}/>
            </div>

            <Panel className="form-panel" collapsible={true}
              expanded={requiresInput}>
              <Input type="text" label="Redirect URL"
                placeholder="http://origin.foobar.com"
                onChange={this.handleChange(
                  ['edge_configuration', 'cache_rule', 'actions', 'allow_block_redirect_url']
                )}/>
            </Panel>
          </div>

        </Modal.Body>
      </div>
    )
  }
}

AllowBlock.displayName = 'AllowBlock'
AllowBlock.propTypes = {
  changeValue: React.PropTypes.func
}

module.exports = AllowBlock
