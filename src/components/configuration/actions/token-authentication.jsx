import React from 'react'
import { reduxForm } from 'redux-form'
import { Button, ButtonToolbar, ControlLabel, FormControl, FormGroup, Modal } from 'react-bootstrap'
import Immutable from 'immutable'

import { checkForErrors } from '../../../util/helpers'
import { isBase64 } from '../../../util/validators'
import Select from '../../select'

import { injectIntl, FormattedMessage } from 'react-intl'

const placeholderEncryptionOptions = [{label: "SHA1", value: "HMAC-SHA1"}]
const placeholderEncryptionValue = placeholderEncryptionOptions[0].value
const placeholderSchemaOptions = [{label: "URL", value: "url"}]
const placeholderSchemaValue = placeholderSchemaOptions[0].value

const validate = ({ sharedKey }) => {
  const conditions = {
    sharedKey: [
      {
        condition: ! isBase64(sharedKey),
        errorText: (
          <div>
            <FormattedMessage id="portal.policy.edit.policies.url.validation.base64" />
          </div>
        )
      }
    ]
  }
  return checkForErrors({ sharedKey }, conditions)
}

export class TokenAuthentication extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeFilter: 'tokenauth'
    }

    this.saveChanges = this.saveChanges.bind(this)
  }

  componentWillMount() {
    const { fields: { sharedKey }, set } = this.props
    sharedKey.onChange(set.get('shared_key'))
  }

  saveChanges() {
    const { close, invalid, changeValue, path, fields: { sharedKey } } = this.props

    if (!invalid) {
      const newSet = Immutable.fromJS({ shared_key: sharedKey.value })
      changeValue(path, newSet)
      close()
    }
  }

  render() {
    const { close, fields: { sharedKey }, intl: { formatMessage } } = this.props

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
          <FormGroup>
            <ControlLabel>
              <FormattedMessage id="portal.policy.edit.tokenauth.encryption.text" />
            </ControlLabel>
            <Select className="input-select"
              disabled={true}
              onSelect={() => {/* no-op */}}
              options={placeholderEncryptionOptions}
              value={placeholderEncryptionValue} />
          </FormGroup>

          {/* This component is mostly for display purposes only until this functionality
            * is flushed out on the backend. The backend doesn't currently support
            * user-configuration of this value. */}
          <FormGroup>
            <ControlLabel>
              <FormattedMessage id="portal.policy.edit.tokenauth.schema.text" />
            </ControlLabel>
            <Select className="input-select"
              disabled={true}
              onSelect={() => {/* no-op */}}
              options={placeholderSchemaOptions}
              value={placeholderSchemaValue} />
          </FormGroup>

          <FormGroup>
            <ControlLabel>
              <FormattedMessage id="portal.policy.edit.tokenauth.secret.text" />
            </ControlLabel>
            <FormControl
              type="text"
              {...sharedKey}
              placeholder={formatMessage({id: 'portal.policy.edit.tokenauth.secret.placeholder'})} />
              {sharedKey.touched && sharedKey.error &&
                <div className='error-msg'>{sharedKey.error}</div>
              }
          </FormGroup>

          <ButtonToolbar className="text-right">
            <Button className="btn-secondary" onClick={close}>
              <FormattedMessage id="portal.button.cancel"/>
            </Button>
            <Button bsStyle="primary" disabled={this.props.invalid} onClick={this.saveChanges}>
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
  fields: React.PropTypes.object,
  intl: React.PropTypes.object,
  invalid: React.PropTypes.bool,
  path: React.PropTypes.instanceOf(Immutable.List),
  set: React.PropTypes.instanceOf(Immutable.Map)
}

export default reduxForm({
  fields: ['sharedKey'],
  form: 'token-authentication',
  validate
})(injectIntl(TokenAuthentication))
