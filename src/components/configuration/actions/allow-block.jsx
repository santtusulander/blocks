import React from 'react'
import { Input, Modal, Panel } from 'react-bootstrap'
import Immutable from 'immutable'

import Select from '../../select'
import InputConnector from '../../input-connector'

import {FormattedMessage, formatMessage, injectIntl} from 'react-intl'

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
          activeAccessControl: value
        })
      } else if (key === 'activeErrorResponse') {
        this.setState({
          activeErrorResponse: value
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
                ['allow', <FormattedMessage id="portal.policy.edit.allowBlock.allow.text"/>],
                ['deny', <FormattedMessage id="portal.policy.edit.allowBlock.deny.text"/>]]}/>
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
                  ['301', <FormattedMessage id="portal.policy.edit.allowBlock.301.text"/>],
                  ['302', <FormattedMessage id="portal.policy.edit.allowBlock.302.text"/>],
                  ['307', <FormattedMessage id="portal.policy.edit.allowBlock.307.text"/>],
                  ['404', <FormattedMessage id="portal.policy.edit.allowBlock.404.text"/>],
                  ['410', <FormattedMessage id="portal.policy.edit.allowBlock.410.text"/>],
                  ['418', <FormattedMessage id="portal.policy.edit.allowBlock.418.text"/>],
                  ['503', <FormattedMessage id="portal.policy.edit.allowBlock.503.text"/>]]}/>
            </div>

            <Panel className="form-panel" collapsible={true}
              expanded={requiresInput}>
              <Input type="text" label={this.props.intl.formatMessage({id: 'portal.policy.edit.allowBlock.redirectUrl.text'})}
                placeholder={this.props.intl.formatMessage({id: 'portal.policy.edit.allowBlock.redirectUrl.placeholder'})}
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
  changeValue: React.PropTypes.func,
  path: React.PropTypes.array,
  set: React.PropTypes.instanceOf(Immutable.Map)
}

module.exports = injectIntl(AllowBlock)
