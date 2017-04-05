import React from 'react'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { ControlLabel, FormControl, FormGroup, Modal, Panel } from 'react-bootstrap'

import Select from '../../shared/form-elements/select'
import InputConnector from '../../input-connector'

import { getPickedResponseCodes } from '../../../util/status-codes'


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
          <h1><FormattedMessage id="portal.configuration.policies.allowBlock.text" /></h1>
        </Modal.Header>
        <Modal.Body>

          <FormGroup>
            <ControlLabel>
              <FormattedMessage id="portal.configuration.policies.accessControl.text" />
            </ControlLabel>
            <Select className="input-select"
              onSelect={this.handleSelectChange('activeAccessControl',
                ['edge_configuration', 'cache_rule', 'actions', 'allow_block_access_control']
              )}
              value={this.state.activeAccessControl}
              options={[
                ['allow', <FormattedMessage id="portal.policy.edit.allowBlock.allow.text"/>],
                ['deny', <FormattedMessage id="portal.policy.edit.allowBlock.deny.text"/>]]}/>
          </FormGroup>

          <hr />

          <div className="form-groups">
            <InputConnector
              show={requiresInput} />
            <FormGroup>
              <ControlLabel>
                <FormattedMessage id="portal.configuration.policies.errorResponse.text" />
              </ControlLabel>
              <Select className="input-select"
                      onSelect={this.handleSelectChange('activeErrorResponse',
                        ['edge_configuration', 'cache_rule', 'actions', 'allow_block_error_response']
                      )}
                      value={this.state.activeErrorResponse}
                      options={getPickedResponseCodes([301, 302, 307, 404, 410, 418, 503], false).map(response => [response.code, response.message])}/>
            </FormGroup>

            <Panel className="form-panel" collapsible={true}
              expanded={requiresInput}>
              <FormGroup>
                <ControlLabel>
                  <FormattedMessage id="portal.policy.edit.allowBlock.redirectUrl.text" />
                </ControlLabel>
                <FormControl
                  placeholder={this.props.intl.formatMessage({id: 'portal.policy.edit.allowBlock.redirectUrl.placeholder'})}
                  onChange={this.handleChange(
                    ['edge_configuration', 'cache_rule', 'actions', 'allow_block_redirect_url']
                  )}/>
              </FormGroup>
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
  intl: intlShape.isRequired
}

module.exports = injectIntl(AllowBlock)
