import React from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, change, formValueSelector, propTypes as reduxFormPropTypes } from 'redux-form'
import { Button } from 'react-bootstrap'

import { injectIntl, FormattedMessage } from 'react-intl'

import HelpTooltip from '../../../shared/tooltips/help-tooltip'
import FieldFormGroupNumber from '../../../shared/form-fields/field-form-group-number'
import FieldFormGroupToggle from '../../../shared/form-fields/field-form-group-toggle'
import FieldFormGroupSelect from '../../../shared/form-fields/field-form-group-select'

import FormFooterButtons from '../../../shared/form-elements/form-footer-buttons'

import {
  TOKEN_AUTH_STATIC,
  TOKEN_AUTH_STREAMING,
  TTL_DEFAULT,
  MIN_TTL,
  MAX_TTL,
  STREAMING_ENCRYPTION_OPTIONS,
  STREAMING_ENCRYPTION_DEFAULT
} from '../../../../constants/configuration'

const validate = ({ streamingEnabled, streaming_ttl }) => {
  const errors = {}

  if (streamingEnabled && (!streaming_ttl && streaming_ttl !== null)) {
    errors.streaming_ttl = <FormattedMessage id="portal.policy.edit.tokenauth.streaming_ttl.required.error" />
  }

  return errors
}

export class TokenStreaming extends React.Component {
  constructor(props) {
    super(props)

    this.ttlTimeout = null
    this.setDefaultTtl = this.setDefaultTtl.bind(this)
    this.saveChanges = this.saveChanges.bind(this)
  }

  componentWillMount() {
    this.props.change('streamingEnabled', this.props.streamingEnabled)
    this.props.change('streaming_ttl', this.props.streaming_ttl)
    this.props.change('streaming_add_ip_addr', this.props.streaming_add_ip_addr)
    this.props.change('streaming_encryption', this.props.streaming_encryption || STREAMING_ENCRYPTION_DEFAULT)
  }

  componentDidMount() {
    this.ttlTimeout && clearTimeout(this.ttlTimeout)
  }

  componentWillReceiveProps(nextProps) {
    const { isStreamingEnabled } = nextProps

    if ((typeof this.props.isStreamingEnabled !== 'undefined') && (this.props.isStreamingEnabled !== isStreamingEnabled)) {
      if (!isStreamingEnabled) {
        this.props.change('streaming_ttl', null)
        this.props.change('streaming_add_ip_addr', false)
        this.props.change('streaming_encryption', null)
      } else {
        this.setDefaultTtl()
        this.props.change('streaming_encryption', STREAMING_ENCRYPTION_DEFAULT)
      }
    }
  }

  setDefaultTtl() {
    // This is hack to set default value for the field
    // that is enabled by another option. Seems like redux-form API issue.
    // TODO: UDNP-3073 - Investigate issue in redux-form 'change' API
    this.ttlTimeout = setTimeout(() => {
      this.props.change('streaming_ttl', TTL_DEFAULT)
    }, 5)
  }

  saveChanges({ streaming_ttl, streaming_add_ip_addr, streaming_encryption }) {
    this.props.dispatch(change('token-auth-form', 'type', this.props.isStreamingEnabled ? TOKEN_AUTH_STREAMING : TOKEN_AUTH_STATIC))
    this.props.dispatch(change('token-auth-form', 'streaming_ttl', streaming_ttl))
    this.props.dispatch(change('token-auth-form', 'streaming_add_ip_addr', streaming_add_ip_addr))
    this.props.dispatch(change('token-auth-form', 'streaming_encryption', streaming_encryption))
    this.props.close()
  }

  render() {
    const { close, handleSubmit, isStreamingEnabled, invalid } = this.props

    return (
      <div>
        <form
          className="token-streaming-form"
          onSubmit={handleSubmit(this.saveChanges)}
        >
          <div className="flex-row options-item toggle-box">
            <div className="flex-item options-item--name">
              <FormattedMessage id="portal.policy.edit.tokenauth.streaming_toggle.text" />
            </div>
            <Field
              name="streamingEnabled"
              className="flex-item pull-right toggle-item"
              component={FieldFormGroupToggle}
            />
          </div>

          <hr/>

          <Field
            name="streaming_encryption"
            className="input-select"
            component={FieldFormGroupSelect}
            options={STREAMING_ENCRYPTION_OPTIONS}
            label={<FormattedMessage id="portal.policy.edit.tokenauth.hash_function.text" />}
            disabled={!isStreamingEnabled}
          />

          <div className="flex-row options-item toggle-box">
            <div className="flex-item options-item--name">
              <FormattedMessage id="portal.policy.edit.tokenauth.check_client_ip.text" />
              <span className="tooltip-help">
                <HelpTooltip
                  id="tooltip-help"
                  title={<FormattedMessage id="portal.policy.edit.tokenauth.check_client_ip.text"/>}
                >
                  <FormattedMessage id="portal.policy.edit.tokenauth.check_client_ip.help.text" />
                </HelpTooltip>
              </span>
            </div>
            <Field
              name="streaming_add_ip_addr"
              component={FieldFormGroupToggle}
              className="flex-item pull-right toggle-item"
              readonly={!isStreamingEnabled}
            />
          </div>

          <br/>

          <Field
            name="streaming_ttl"
            disabled={!isStreamingEnabled}
            component={FieldFormGroupNumber}
            label={<FormattedMessage id="portal.policy.edit.tokenauth.streaming_ttl.text" />}
            min={MIN_TTL}
            max={MAX_TTL}
            normalize={value => Number(value)}
          />

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
              disabled={invalid}
            >
              <FormattedMessage id="portal.button.save"/>
            </Button>
          </FormFooterButtons>
        </form>
      </div>
    )
  }
}

TokenStreaming.displayName = 'TokenStreaming'
TokenStreaming.propTypes = {
  close: React.PropTypes.func,
  streamingEnabled: React.PropTypes.bool,
  streaming_add_ip_addr: React.PropTypes.bool,
  streaming_encryption: React.PropTypes.string,
  ...reduxFormPropTypes
}

TokenStreaming.defaultProps = {
  streamingEnabled: false,
  streaming_add_ip_addr: false
}

const form = reduxForm({
  form: 'token-streaming-form',
  validate
})(TokenStreaming)

const selector = formValueSelector('token-auth-form')
const selfSelector = formValueSelector('token-streaming-form')

export default connect(state => ({
  isStreamingEnabled: selfSelector(state, 'streamingEnabled'),
  streamingEnabled: selector(state, 'type') === TOKEN_AUTH_STREAMING,
  streaming_ttl: selector(state, 'streaming_ttl'),
  streaming_add_ip_addr: selector(state, 'streaming_add_ip_addr'),
  streaming_encryption: selector(state, 'streaming_encryption')
}))(injectIntl(form))
