import React from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector, propTypes as reduxFormPropTypes } from 'redux-form'
import { Button, Modal } from 'react-bootstrap'
import Immutable from 'immutable'

// import { checkForErrors } from '../../../util/helpers'
// import { isBase64 } from '../../../util/validators'

import { injectIntl, FormattedMessage } from 'react-intl'

import SidePanel from '../../side-panel'
import TokenSchema from './token-auth-forms/token-schema'
import TokenStreaming from './token-auth-forms/token-streaming'
import IconChevronRight from '../../icons/icon-chevron-right'
import FieldFormGroup from '../../form/field-form-group'
import FieldFormGroupSelect from '../../form/field-form-group-select'
import FormFooterButtons from '../../form/form-footer-buttons'

const encryptionOptions = [
  {label: 'HMAC-SHA1', value: 'HMAC_SHA1'},
  {label: 'HMAC-SHA256', value: 'HMAC_SHA256'},
  {label: 'HMAC-MD5', value: 'HMAC_MD5'},
  {label: 'MD5', value: 'MD5'}
]

const advancedOptions = [
  {label: <FormattedMessage id="portal.policy.edit.tokenauth.schema.text" />, form: 'schema'},
  {label: <FormattedMessage id="portal.policy.edit.tokenauth.streaming_options.text" />, form: 'streaming'}
]

// const validate = ({ sharedKey }) => {
//   const conditions = {
//     sharedKey: [
//       {
//         condition: ! isBase64(sharedKey),
//         errorText: (
//           <div>
//             <FormattedMessage id="portal.policy.edit.policies.url.validation.base64" />
//           </div>
//         )
//       }
//     ]
//   }
//   return checkForErrors({ sharedKey }, conditions)
// }

export class TokenAuth extends React.Component {
  constructor(props) {
    super(props)

    this. state = {
      detailForm: null
    }

    this.saveChanges = this.saveChanges.bind(this)
    this.closeDetailForm = this.closeDetailForm.bind(this)
    this.encriptionChanged = this.encriptionChanged.bind(this)
  }

  componentWillMount() {
    const { set } = this.props

    this.props.change('shared_key', set.get('shared_key'))
    this.props.change('schema', set.get('schema') || Immutable.List())
    this.props.change('encryption', set.get('encryption'))
    this.props.change('type', set.get('type'))
    this.props.change('streaming_ttl', set.get('streaming_ttl'))
    this.props.change('streaming_add_ip_addr', set.get('streaming_add_ip_addr'))
  }

  encriptionChanged(value) {
    if (!this.props.isMd5) {
      this.props.change('shared_key', null)
    }

    //this.props.change('encryption', value)
  }

  saveChanges(values) {
    const { close, invalid, changeValue, path} = this.props
    const { type, shared_key, encryption, streaming_ttl, streaming_add_ip_addr, schema } = values
    const setPath = path.slice(0, -1)

    if (!invalid) {
      const newSet = Immutable.fromJS({tokenauth: {
        type,
        shared_key,
        schema,
        streaming_ttl,
        streaming_add_ip_addr,
        encryption
      }})

      changeValue(setPath, newSet)
      close()
    }
  }

  closeDetailForm() {
    this.setState({detailForm: null})
  }

  render() {
    const {
      close,
      invalid,
      submitting,
      schema,
      type,
      streaming_ttl,
      streaming_add_ip_addr,
      isMd5,
      handleSubmit
    } = this.props

    let sidePanelTitle = ''

    if (this.state.detailForm === 'schema') sidePanelTitle = <FormattedMessage id="portal.policy.edit.tokenauth.schema.text" />
    if (this.state.detailForm === 'streaming') sidePanelTitle = <FormattedMessage id="portal.policy.edit.tokenauth.streaming.text" />

    return (
      <div>
        <Modal.Header>
          <h1><FormattedMessage id="portal.policy.edit.tokenauth.header"/></h1>
          <p><FormattedMessage id="portal.policy.edit.tokenauth.subheader"/></p>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(this.saveChanges)}>
            <Field
              name="encryption"
              className="input-select"
              component={FieldFormGroupSelect}
              onChange={this.encriptionChanged}
              options={encryptionOptions}
              label={<FormattedMessage id="portal.policy.edit.tokenauth.hash_function.text" />}
            />

            <Field
              type="text"
              name="shared_key"
              disabled={isMd5}
              placeholder={this.props.intl.formatMessage({id: 'portal.policy.edit.tokenauth.secret.placeholder'})}
              component={FieldFormGroup}
              label={<FormattedMessage id="portal.policy.edit.tokenauth.secret.text" />}
            />

            {advancedOptions.map((option, i) => {
              return (
                <div
                  key={`option-${i}`}
                  className="flex-row options-item"
                >
                  <div className="flex-item options-item--name">{option.label}</div>
                  <div className="flex-item arrow-right">
                    <a
                      className="btn btn-icon btn-transparent"
                      onClick={(e) => {
                        e.stopPropagation()
                        this.setState({detailForm: option.form})
                      }}
                    >
                      <IconChevronRight />
                    </a>
                  </div>
                </div>
              )
            })}

            <FormFooterButtons>
              <Button
                id="cancel-btn"
                className="btn-secondary"
                onClick={close}
              >
                <FormattedMessage id="portal.button.cancel"/>
              </Button>

              <Button
                type="submit"
                bsStyle="primary"
                disabled={invalid || submitting}
              >
                <FormattedMessage id="portal.button.saveAction"/>
              </Button>
            </FormFooterButtons>
          </form>
        </Modal.Body>

        <SidePanel
          show={!!this.state.detailForm}
          className='narrow'
          title={sidePanelTitle}
          cancel={this.closeDetailForm}
          overlapping={true}
        >
          {this.state.detailForm === 'schema' &&
            <TokenSchema 
              schema={schema}
              close={this.closeDetailForm}
            />
          }
          {this.state.detailForm === 'streaming' &&
            <TokenStreaming 
              type={type}
              streaming_ttl={streaming_ttl}
              streaming_add_ip_addr={streaming_add_ip_addr}
              close={this.closeDetailForm}
            />
          }
        </SidePanel>
      </div>
    )
  }
}

TokenAuth.displayName = 'TokenAuth'
TokenAuth.propTypes = {
  changeValue: React.PropTypes.func,
  close: React.PropTypes.func,
  intl: React.PropTypes.object,
  invalid: React.PropTypes.bool,
  path: React.PropTypes.instanceOf(Immutable.List),
  set: React.PropTypes.instanceOf(Immutable.Map),
  shared_key: React.PropTypes.string,
  ...reduxFormPropTypes
}

const selector = formValueSelector('token-auth-form')
const form = reduxForm({
  form: 'token-auth-form'
})(TokenAuth)

export default connect(state => ({
  isMd5: selector(state, 'encryption') === 'MD5'
}))(injectIntl(form))
