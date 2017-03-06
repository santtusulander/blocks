import React from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector, propTypes as reduxFormPropTypes } from 'redux-form'
import { Button, Modal } from 'react-bootstrap'
import Immutable from 'immutable'

import { checkForErrors } from '../../../util/helpers'
import { isBase64 } from '../../../util/validators'

import { injectIntl, FormattedMessage } from 'react-intl'

import FieldSortableMultiSelector from '../../form/field-sortable-multi-selector'
import FieldFormGroup from '../../form/field-form-group'
import FieldFormGroupSelect from '../../form/field-form-group-select'
import FormFooterButtons from '../../form/form-footer-buttons'

const staticEncryptionOptions = [
  {label: 'HMAC-SHA1', value: 'HMAC-SHA1'},
  {label: 'HMAC-SHA256', value: 'HMAC-SHA256'},
  {label: 'HMAC-MD5', value: 'HMAC-MD5'},
  {label: 'MD5', value: 'MD5'}
]
const schemaOptions = [
  {label: 'IP address', value: 'IP'},
  {label: 'URL', value: 'URL'},
  {label: 'Referrer', value: 'REFERRER'},
  {label: 'User agent', value: 'USER_AGENT'},
  {label: 'Expires', value: 'EXPIRES'}
]

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

export class TokenAuthStatic extends React.Component {
  constructor(props) {
    super(props)

    this.saveChanges = this.saveChanges.bind(this)
  }

  componentWillMount() {
    const { set } = this.props

    this.props.change('sharedKey', set.get('shared_key'))
    this.props.change('schema', set.get('schema') || Immutable.List())
    this.props.change('encryption', set.get('encryption'))
  }

  saveChanges() {
    const { close, invalid, changeValue, path, sharedKey, schema, encryption } = this.props
    if (!invalid) {
      const newSet = Immutable.fromJS({
        shared_key: sharedKey,
        schema,
        encryption
      })
      changeValue(path, newSet)
      close()
    }
  }

  render() {
    const { close, intl: { formatMessage }, invalid, submitting } = this.props

    return (
      <div>
        <Modal.Header>
          <h1><FormattedMessage id="portal.policy.edit.tokenauthStatic.header"/></h1>
          <p><FormattedMessage id="portal.policy.edit.tokenauthStatic.subheader"/></p>
        </Modal.Header>
        <Modal.Body>

          <Field
            name="encryption"
            className="input-select"
            component={FieldFormGroupSelect}
            options={staticEncryptionOptions}
            label={'Hash function'}
          />

          <Field
            type="text"
            name="sharedKey"
            placeholder={formatMessage({id: 'portal.policy.edit.tokenauth.secret.placeholder'})}
            component={FieldFormGroup}
            label={<FormattedMessage id="portal.policy.edit.tokenauth.secret.text" />}
          />

          <Field
            name="schema"
            className="input-select"
            component={FieldSortableMultiSelector}
            options={schemaOptions}
            label={<FormattedMessage id="portal.policy.edit.tokenauth.schema.text" />}
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
                disabled={invalid || submitting}>
                <FormattedMessage id="portal.button.saveAction"/>
              </Button>
            </FormFooterButtons>
        </Modal.Body>
      </div>
    )
  }
}

TokenAuthStatic.displayName = 'TokenAuthStatic'
TokenAuthStatic.propTypes = {
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
  form: 'token-auth-static',
  validate
})(TokenAuthStatic)

const selector = formValueSelector('token-auth-static')
export default connect(state => ({
  sharedKey: selector(state, 'sharedKey'),
  schema: selector(state, 'schema'),
  encryption: selector(state, 'encryption')
}))(injectIntl(form))
