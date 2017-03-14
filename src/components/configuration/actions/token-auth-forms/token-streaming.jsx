import React from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, change, formValueSelector, propTypes as reduxFormPropTypes } from 'redux-form'
import { Button } from 'react-bootstrap'

import { injectIntl, FormattedMessage } from 'react-intl'

import HelpTooltip from '../../../help-tooltip'
import FieldFormGroupNumber from '../../../form/field-form-group-number'
import FieldFormGroupToggle from '../../../form/field-form-group-toggle'
import FormFooterButtons from '../../../form/form-footer-buttons'

import { TOKEN_AUTH_STATIC, TOKEN_AUTH_STREAMING, TTL_DEFAULT, MIN_TTL, MAX_TTL } from '../../../../constants/configuration'

const validate = ({ streamingEnabled, streaming_ttl }) => {
  let errors = {}

  if (streamingEnabled && !streaming_ttl) {
    errors.streaming_ttl = <FormattedMessage id="portal.policy.edit.tokenauth.streaming_ttl.required.error" />
  }

  return errors
}

export class TokenStreaming extends React.Component {
  constructor(props) {
    super(props)

    this.saveChanges = this.saveChanges.bind(this)
  }

  componentWillMount() {
    this.props.change('streamingEnabled', this.props.streamingEnabled)
    this.props.change('streaming_ttl', this.props.streaming_ttl)
    this.props.change('streaming_add_ip_addr', this.props.streaming_add_ip_addr)
  }

  componentWillReceiveProps(nextProps) {
    const { isStreamingEnabled } = nextProps

    if ((typeof this.props.isStreamingEnabled !== 'undefined') && (this.props.isStreamingEnabled !== isStreamingEnabled)) {
      if ( !isStreamingEnabled ) {
        this.props.change('streamingEnabled', false)
        this.props.change('streaming_ttl', null)
        this.props.change('streaming_add_ip_addr', false)
      } else {
        this.props.change('streaming_ttl', TTL_DEFAULT)
      }
    }
  }

  saveChanges({ streaming_ttl, streaming_add_ip_addr }) {
    this.props.dispatch(change('token-auth-form', 'type', this.props.isStreamingEnabled ? TOKEN_AUTH_STREAMING : TOKEN_AUTH_STATIC))
    this.props.dispatch(change('token-auth-form', 'streaming_ttl', streaming_ttl))
    this.props.dispatch(change('token-auth-form', 'streaming_add_ip_addr', streaming_add_ip_addr))
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
          <div className="flex-row options-item">
            <div className="flex-item options-item--name">
              <FormattedMessage id="portal.policy.edit.tokenauth.streaming_toggle.text" />
            </div>
            <Field
              name="streamingEnabled"
              className="flex-item pull-right"
              component={FieldFormGroupToggle}
            />
          </div>

          <hr/>
          
          <div className="flex-row options-item">
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
              className="flex-item pull-right"
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
  streaming_add_ip_addr: selector(state, 'streaming_add_ip_addr')
}))(injectIntl(form))
