import React from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, propTypes as reduxFormPropTypes } from 'redux-form'
import { Button, Modal } from 'react-bootstrap'
import Immutable from 'immutable'

import { injectIntl, FormattedMessage } from 'react-intl'

import HasServicePermission from '../../has-service-permission'

import SidePanel from '../../side-panel'
import TokenSchema from './token-auth-forms/token-schema'
import TokenStreaming from './token-auth-forms/token-streaming'
import IconChevronRight from '../../icons/icon-chevron-right'
import FieldFormGroup from '../../form/field-form-group'
import FieldFormGroupSelect from '../../form/field-form-group-select'
import FormFooterButtons from '../../form/form-footer-buttons'

import { ENCRYPTION_OPTIONS, SCHEMA_DEFAULT, ENCRYPTION_DEFAULT } from '../../../constants/configuration'
import { VOD_STREAMING_TOKEN_AUTH } from '../../../constants/service-permissions'

const validate = ({ shared_key }) => {
  let errors = {}

  if (!shared_key) {
    errors.shared_key = <FormattedMessage id="portal.policy.edit.tokenauth.shared_key.required.error" />
  }

  return errors
}

export class TokenAuth extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      detailForm: null
    }

    this.saveChanges = this.saveChanges.bind(this)
    this.closeDetailForm = this.closeDetailForm.bind(this)
  }

  componentWillMount() {
    const { set } = this.props

    this.props.change('shared_key', set.get('shared_key'))
    this.props.change('schema', set.get('schema') || Immutable.List(SCHEMA_DEFAULT))
    this.props.change('encryption', set.get('encryption') || ENCRYPTION_DEFAULT)
    this.props.change('type', set.get('type'))
    this.props.change('streaming_ttl', set.get('streaming_ttl'))
    this.props.change('streaming_add_ip_addr', set.get('streaming_add_ip_addr'))
    this.props.change('streaming_encryption', set.get('streaming_encryption'))
  }

  saveChanges(values) {
    const { close, invalid, changeValue, path} = this.props
    const { type, shared_key, encryption, streaming_ttl, streaming_add_ip_addr, schema, streaming_encryption } = values
    const setPath = path.slice(0, -1)

    if (!invalid) {
      const newSet = Immutable.fromJS({tokenauth: {
        type,
        shared_key,
        schema,
        streaming_ttl,
        streaming_add_ip_addr,
        encryption,
        streaming_encryption
      }})

      changeValue(setPath, newSet)
      close()
    }
  }

  closeDetailForm() {
    this.setState({detailForm: null})
  }

  renderAdvancedOptions() {
    return (
      <div>
        <div className="flex-row options-item">
          <div className="flex-item options-item--name">{<FormattedMessage id="portal.policy.edit.tokenauth.schema.text" />}</div>
          <div className="flex-item arrow-right">
            <a
              className="btn btn-icon btn-transparent"
              onClick={(e) => {
                e.stopPropagation()
                this.setState({detailForm: 'schema'})
              }}
            >
              <IconChevronRight />
            </a>
          </div>
        </div>
        <HasServicePermission allOf={[VOD_STREAMING_TOKEN_AUTH]}>
          <div className="flex-row options-item">
            <div className="flex-item options-item--name">{<FormattedMessage id="portal.policy.edit.tokenauth.streaming_options.text" />}</div>
            <div className="flex-item arrow-right">
              <a
                className="btn btn-icon btn-transparent"
                onClick={(e) => {
                  e.stopPropagation()
                  this.setState({detailForm: 'streaming'})
                }}
              >
                <IconChevronRight />
              </a>
            </div>
          </div>
        </HasServicePermission>
      </div>
    )
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
      streaming_encryption,
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
              options={ENCRYPTION_OPTIONS}
              label={<FormattedMessage id="portal.policy.edit.tokenauth.hash_function.text" />}
            />

            <Field
              type="text"
              name="shared_key"
              component={FieldFormGroup}
              label={<FormattedMessage id="portal.policy.edit.tokenauth.secret.text" />}
              required={true}
            />

            <hr/>
            
            <h5>
              <FormattedMessage id="portal.policy.edit.tokenauth.advanced_options.text" />
            </h5>

            <br/>

            {this.renderAdvancedOptions()}

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
              streaming_encryption={streaming_encryption}
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

const form = reduxForm({
  form: 'token-auth-form',
  validate
})(TokenAuth)

export default connect()(injectIntl(form))
