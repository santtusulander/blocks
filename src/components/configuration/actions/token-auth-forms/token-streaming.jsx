import React from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, change, formValueSelector, propTypes as reduxFormPropTypes } from 'redux-form'
import { Button } from 'react-bootstrap'
import Immutable from 'immutable'

import { injectIntl, FormattedMessage } from 'react-intl'

import FieldFormGroup from '../../../form/field-form-group'
import FieldFormGroupToggle from '../../../form/field-form-group-toggle'
import FormFooterButtons from '../../../form/form-footer-buttons'

import { TOKEN_AUTH_STATIC, TOKEN_AUTH_STREAMING } from '../../../../constants/configuration'

const TTL_DEFAULT = 6 * 60 * 60 // 6 hours in seconds

export class TokenStreaming extends React.Component {
  constructor(props) {
    super(props)

    this.saveChanges = this.saveChanges.bind(this)
    this.streamingToggle = this.streamingToggle.bind(this)
  }

  componentWillMount() {
    this.props.change('streamingEnabled', this.props.streamingEnabled)
    this.props.change('streaming_ttl', this.props.streaming_ttl)
    this.props.change('streaming_add_ip_addr', this.props.streaming_add_ip_addr)
  }

  streamingToggle(value) {
    if (!value) {
      this.props.change('streaming_ttl', null)
      this.props.change('streaming_add_ip_addr', false)
    } else {
      this.props.change('streaming_ttl', TTL_DEFAULT)
    }

    this.props.change('streamingEnabled', value)
  }

  saveChanges({ streaming_ttl, streaming_add_ip_addr }) {
    this.props.dispatch(change('token-auth-form', 'type', this.props.isStreamingEnabled ? TOKEN_AUTH_STREAMING : TOKEN_AUTH_STATIC))
    this.props.dispatch(change('token-auth-form', 'streaming_ttl', streaming_ttl))
    this.props.dispatch(change('token-auth-form', 'streaming_add_ip_addr', streaming_add_ip_addr))
    this.props.close()
  }

  render() {
    const { close, handleSubmit, isStreamingEnabled } = this.props

    return (
      <div>
        <form onSubmit={handleSubmit(this.saveChanges)}>

         <div className="flex-row options-item">
            <div className="flex-item options-item--name">
              <FormattedMessage id="portal.policy.edit.tokenauth.streaming_toggle.text" />
            </div>
            <Field
              name="streamingEnabled"
              className="flex-item pull-right"
              component={FieldFormGroupToggle}
              onToggle={this.streamingToggle}
            />
          </div>

          <hr/>
          
          <div className="flex-row options-item">
            <div className="flex-item options-item--name">
              <FormattedMessage id="portal.policy.edit.tokenauth.check_client_ip.text" />
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
            type="text"
            name="streaming_ttl"
            disabled={!isStreamingEnabled}
            component={FieldFormGroup}
            label={<FormattedMessage id="portal.policy.edit.tokenauth.streaming_ttl.text" />}
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
              disabled={false}
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
  schema: React.PropTypes.instanceOf(Immutable.List),
  ...reduxFormPropTypes
}

const form = reduxForm({
  form: 'token-streaming-form'
})(TokenStreaming)

const selector = formValueSelector('token-auth-form')
const selfSelector = formValueSelector('token-streaming-form')
export default connect(state => ({
  isStreamingEnabled: selfSelector(state, 'streamingEnabled'),
  streamingEnabled: selector(state, 'type') === TOKEN_AUTH_STREAMING,
  streaming_ttl: selector(state, 'streaming_ttl'),
  streaming_add_ip_addr: selector(state, 'streaming_add_ip_addr')
}))(injectIntl(form))
