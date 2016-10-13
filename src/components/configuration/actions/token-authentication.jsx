import React from 'react'
import { Modal, Input, ButtonToolbar, Button } from 'react-bootstrap'
import Immutable from 'immutable'

import Select from '../../select'

import { injectIntl, FormattedMessage } from 'react-intl'

const placeholderEncryptionOptions = [{label: "SHA1", value: "HMAC-SHA1"}]
const placeholderEncryptionValue = placeholderEncryptionOptions[0].value
const placeholderSchemaOptions = [{label: "URL", value: "url"}]
const placeholderSchemaValue = placeholderSchemaOptions[0].value

class TokenAuthentication extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeFilter: 'tokenauth',
      shared_key: props.set.get('shared_key')
    }

    this.saveChanges = this.saveChanges.bind(this)
  }
  saveChanges() {
    this.props.changeValue(
      this.props.path,
      Immutable.fromJS({ shared_key: this.state.shared_key })
    )
    this.props.close()
  }
  render() {
    const { shared_key } = this.state
    const { close, intl: { formatMessage } } = this.props

    return (
      <div>
        <Modal.Header>
          <h1><FormattedMessage id="portal.policy.edit.tokenauth.header"/></h1>
          <p><FormattedMessage id="portal.policy.edit.tokenauth.subheader"/></p>
        </Modal.Header>
        <Modal.Body>

          {/* This component is mostly for display purposes only until this functionality
            * is flushed out on the backend. The backend doesn't currently support
            * user-configuration of this value. */}
          <div className="form-group">
            <label className="control-label">
              <FormattedMessage id="portal.policy.edit.tokenauth.encryption.text" />
            </label>
            <Select className="input-select"
              disabled={true}
              onSelect={() => { /* no-op */ }}
              options={placeholderEncryptionOptions}
              value={placeholderEncryptionValue} />
          </div>

          {/* This component is mostly for display purposes only until this functionality
            * is flushed out on the backend. The backend doesn't currently support
            * user-configuration of this value. */}
          <div className="form-group">
            <label className="control-label">
              <FormattedMessage id="portal.policy.edit.tokenauth.schema.text" />
            </label>
            <Select className="input-select"
              disabled={true}
              onSelect={() => { /* no-op */ }}
              options={placeholderSchemaOptions}
              value={placeholderSchemaValue} />
          </div>

          <div className="form-group">
              <Input type="text"
                label={<FormattedMessage id="portal.policy.edit.tokenauth.secret.text" />}
                placeholder={formatMessage({id: 'portal.policy.edit.tokenauth.secret.placeholder'})}
                value={shared_key}
                onChange={(e) => this.setState({
                  shared_key: e.target.value
                })}/>
          </div>

          <ButtonToolbar className="text-right">
            <Button bsStyle="default" onClick={close}>
              <FormattedMessage id="portal.button.cancel"/>
            </Button>
            <Button bsStyle="primary" onClick={this.saveChanges}>
              <FormattedMessage id="portal.button.saveAction"/>
            </Button>
          </ButtonToolbar>

        </Modal.Body>
      </div>
    )
  }
}

TokenAuthentication.displayName = 'TokenAuthentication'
TokenAuthentication.propTypes = {
  changeValue: React.PropTypes.func,
  close: React.PropTypes.func,
  intl: React.PropTypes.object,
  path: React.PropTypes.instanceOf(Immutable.List),
  set: React.PropTypes.instanceOf(Immutable.Map)
}

module.exports = injectIntl(TokenAuthentication)
