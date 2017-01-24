import React from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector, propTypes as reduxFormPropTypes } from 'redux-form'
import { Button, Modal } from 'react-bootstrap'
import Immutable from 'immutable'

import { checkForErrors } from '../../../util/helpers'
import { isBase64 } from '../../../util/validators'

import { injectIntl, FormattedMessage } from 'react-intl'

import FieldFormGroup from '../../form/field-form-group'
import FieldFormGroupSelect from '../../form/field-form-group-select'
import FormFooterButtons from '../../form/form-footer-buttons'

const placeholderEncryptionOptions = [{label: "SHA1", value: "HMAC-SHA1", selected: "true"}]
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
    const { set } = this.props

    this.props.change('sharedKey', set.get('shared_key'))
    this.props.change('schema', placeholderSchemaValue)
    this.props.change('encryption', placeholderEncryptionValue)
  }

  saveChanges() {
    const { close, invalid, changeValue, path, sharedKey } = this.props
    if (!invalid) {
      const newSet = Immutable.fromJS({ shared_key: sharedKey })
      changeValue(path, newSet)
      close()
    }
  }

  render() {
    const { close, intl: { formatMessage }, invalid, submitting } = this.props

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
          <Field
            required={false}
            disabled={true}
            name="encryption"
            className="input-select"
            component={FieldFormGroupSelect}
            options={placeholderEncryptionOptions}
            label={<FormattedMessage id="portal.policy.edit.tokenauth.encryption.text" />}
          />

          {/* This component is mostly for display purposes only until this functionality
            * is flushed out on the backend. The backend doesn't currently support
            * user-configuration of this value. */}
          <Field
            required={false}
            disabled={true}
            name="schema"
            className="input-select"
            component={FieldFormGroupSelect}
            options={placeholderSchemaOptions}
            label={<FormattedMessage id="portal.policy.edit.tokenauth.schema.text" />}
          />

          <Field
            type="text"
            name="sharedKey"
            placeholder={formatMessage({id: 'portal.policy.edit.tokenauth.secret.placeholder'})}
            component={FieldFormGroup}
            label={<FormattedMessage id="portal.policy.edit.tokenauth.secret.text" />}
          />

          <FormFooterButtons>
              <Button
                id="cancel-btn"
                className="btn-secondary"
                onClick={close}>
                <FormattedMessage id="portal.button.cancel"/>
              </Button>

              <Button
                type="submit"
                bsStyle="primary"
                onClick={this.saveChanges}
                disabled={invalid||submitting}>
                <FormattedMessage id="portal.button.saveAction"/>
              </Button>
            </FormFooterButtons>
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
  invalid: React.PropTypes.bool,
  path: React.PropTypes.instanceOf(Immutable.List),
  set: React.PropTypes.instanceOf(Immutable.Map),
  sharedKey: React.PropTypes.string,
  ...reduxFormPropTypes
}

const form = reduxForm({
  form: 'token-authentication',
  validate
})(TokenAuthentication)

const selector = formValueSelector('token-authentication')
export default connect(state => ({
  sharedKey: selector(state, 'sharedKey')
}))(injectIntl(form))
