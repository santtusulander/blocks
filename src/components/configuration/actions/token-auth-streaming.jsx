import React from 'react'
import { connect } from 'react-redux'
import { Field, Fields, reduxForm, formValueSelector, propTypes as reduxFormPropTypes } from 'redux-form'
import { Button, Modal } from 'react-bootstrap'
import Immutable from 'immutable'

import { checkForErrors } from '../../../util/helpers'
import { isBase64 } from '../../../util/validators'

import { injectIntl, FormattedMessage } from 'react-intl'

import FieldFormGroup from '../../form/field-form-group'
import FieldFormGroupSelect from '../../form/field-form-group-select'
import FormFooterButtons from '../../form/form-footer-buttons'


const staticEncryptionOptions = [
  {label: 'HMAC-SHA1', value: 'HMAC_SHA1'},
  {label: 'HMAC-SHA256', value: 'HMAC_SHA256'},
  {label: 'HMAC-MD5', value: 'HMAC_MD5'},
  {label: 'MD5', value: 'MD5'}
]
const streamingEncryptionOptions = [
  {label: 'HMAC-SHA1', value: 'HMAC_SHA1'},
  {label: 'HMAC-SHA256', value: 'HMAC_SHA256'}
]
// const placeholderEncryptionValue = placeholderEncryptionOptions[0].value
//const placeholderSchemaOptions = [{label: "URL", value: "url"}]
// const placeholderSchemaValue = placeholderSchemaOptions[0].value

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

export class TokenAuthStreaming extends React.Component {
  constructor(props) {
    super(props);

    // this.state = {
    //   activeFilter: 'tokenauth'
    // }

    this.saveChanges = this.saveChanges.bind(this)
  }

  componentWillMount() {
    const { set } = this.props

    this.props.change('sharedKey', set.get('shared_key'))
    // this.props.change('schema', placeholderSchemaValue)
    // this.props.change('encryption', placeholderEncryptionValue)
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
    const { close, intl: { formatMessage }, invalid, submitting, type } = this.props

    return (
      <div>
        <Modal.Header>
          <h1><FormattedMessage id="portal.policy.edit.tokenauth.header"/></h1>
          <p><FormattedMessage id="portal.policy.edit.tokenauth.subheader"/></p>
        </Modal.Header>
        <Modal.Body>



         <Field
            required={false}
            disabled={true}
            name="schema"
            className="input-select"
            component={FieldFormGroupSelect}
            options={staticEncryptionOptions}
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

TokenAuthStreaming.displayName = 'TokenAuthStreaming'
TokenAuthStreaming.propTypes = {
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
  form: 'token-auth-streaming',
  validate
})(TokenAuthStreaming)

const selector = formValueSelector('token-auth-streaming')
export default connect(state => ({
  type: selector(state, 'type')
}))(injectIntl(form))
