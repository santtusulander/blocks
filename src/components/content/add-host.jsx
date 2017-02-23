import React from 'react'
import {
  Button,
  FormGroup,
  ControlLabel
} from 'react-bootstrap'

import { FormattedMessage, injectIntl } from 'react-intl'
import { Field, reduxForm, propTypes as reduxFormPropTypes } from 'redux-form'

import FieldRadio from '../form/field-radio'
import FieldFormGroup from '../form/field-form-group'
import FormFooterButtons from '../form/form-footer-buttons'

import { isValidHostName } from '../../util/validators'

const validate = (values) => {
  const errors = {}

  const {
    hostName,
    deploymentMode
  } = values

  if(!hostName) {
    errors.hostName = <FormattedMessage id="portal.content.addHost.newHostnamePlaceholder.required" />
  }

  if( hostName && !isValidHostName(hostName)) {
    errors.hostName = <FormattedMessage id="portal.content.addHost.newHostnamePlaceholder.invalid" />
  }

  if (!deploymentMode) {
    errors.deploymentMode = <FormattedMessage id="portal.content.addHost.deploymentMode.required" />
  }

  return errors
}

class AddHost extends React.Component {
  constructor(props) {
    super(props)

    this.onCancel = this.onCancel.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit(values){
    return this.props.createHost( values.hostName, values.deploymentMode )
  }

  onCancel(){
    return this.props.cancelChanges()
  }

  render() {
    const {
      handleSubmit,
      invalid,
      intl,
      submitting
    } = this.props

    const submitButtonLabel = submitting
      ? <FormattedMessage id="portal.button.adding" />
      : <FormattedMessage id="portal.button.add" />

    return (
      <form onSubmit={handleSubmit(this.onSubmit)}>

        <Field
          type="text"
          name="hostName"
          label={<FormattedMessage id="portal.content.addHost.newHostname.text" />}
          placeholder={intl.formatMessage({id: 'portal.content.addHost.newHostnamePlaceholder.text'})}
          component={FieldFormGroup}
        />

        <FormGroup>
          <ControlLabel><FormattedMessage id="portal.content.addHost.deploymentMode.text" /> *</ControlLabel>
            <Field
              name="deploymentMode"
              type="radio"
              value="trial"
              component={FieldRadio}
              label={<FormattedMessage id="portal.content.addHost.trial.text" />}
            />

            <Field
              type="radio"
              name="deploymentMode"
              value="production"
              component={FieldRadio}
              label={<FormattedMessage id="portal.content.addHost.production.text" />}
            />
        </FormGroup>

        <FormFooterButtons>
          <Button
            id="cancel-btn"
            className="btn-secondary"
            onClick={this.onCancel}>
            <FormattedMessage id="portal.button.cancel"/>
          </Button>

          <Button
            type="submit"
            bsStyle="primary"
            disabled={invalid||submitting}>
            {submitButtonLabel}
          </Button>
        </FormFooterButtons>
      </form>
    )
  }
}

AddHost.displayName = 'AddHost'
AddHost.propTypes = {
  cancelChanges: React.PropTypes.func,
  createHost: React.PropTypes.func,
  intl: React.PropTypes.object,
  ...reduxFormPropTypes
}

export default reduxForm({
  form: 'add-host-form',
  validate: validate
})(injectIntl(AddHost))
