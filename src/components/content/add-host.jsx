import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { SubmissionError } from 'redux-form'
import {
  Button,
  FormGroup,
  ControlLabel
} from 'react-bootstrap'

import { FormattedMessage, injectIntl } from 'react-intl'
import { Field, reduxForm, propTypes as reduxFormPropTypes } from 'redux-form'

import FieldRadio from '../shared/form-fields/field-radio'
import FieldFormGroup from '../shared/form-fields/field-form-group'
import FormFooterButtons from '../shared/form-elements/form-footer-buttons'

import { parseResponseError } from '../../redux/util'

import { isValidHostName } from '../../util/validators'
import { VOD_STREAMING_SERVICE_ID, MEDIA_DELIVERY_SERVICE_ID } from '../../constants/service-permissions'
import { DEFAULT_HOST_SERVICE_TYPE } from '../../constants/configuration'

const validate = (values) => {
  const errors = {}

  const {
    hostName,
    deploymentMode,
    serviceType
  } = values

  if (!hostName) {
    errors.hostName = <FormattedMessage id="portal.content.addHost.newHostnamePlaceholder.required" />
  }

  if (hostName && !isValidHostName(hostName)) {
    errors.hostName = <FormattedMessage id="portal.content.addHost.newHostnamePlaceholder.invalid" />
  }

  if (!deploymentMode) {
    errors.deploymentMode = <FormattedMessage id="portal.content.addHost.deploymentMode.required" />
  }

  if (!serviceType) {
    errors.serviceType = <FormattedMessage id="portal.content.addHost.serviceType.required" />
  }

  return errors
}

class AddHost extends React.Component {
  constructor(props) {
    super(props)

    this.onCancel = this.onCancel.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit({ hostName, deploymentMode, serviceType = DEFAULT_HOST_SERVICE_TYPE }) {
    const res = this.props.createHost(hostName, deploymentMode, serviceType)

    return res.catch((error) => {
      if (error) {
        throw new SubmissionError({ _error: parseResponseError(error) })
      }
    })
  }

  onCancel() {
    return this.props.cancelChanges()
  }

  render() {
    const {
      handleSubmit,
      invalid,
      intl,
      error,
      submitting,
      hasVODSupport,
      hasMDSupport
    } = this.props

    const submitButtonLabel = submitting
      ? <FormattedMessage id="portal.button.adding" />
      : <FormattedMessage id="portal.button.add" />

    return (
      <form onSubmit={handleSubmit(this.onSubmit)}>

        {
          error &&
          <p className='has-error'>
            <span className='help-block'>{error}</span>
          </p>
        }

        <Field
          type="text"
          name="hostName"
          label={<FormattedMessage id="portal.content.addHost.newHostname.text" />}
          placeholder={intl.formatMessage({id: 'portal.content.addHost.newHostnamePlaceholder.text'})}
          component={FieldFormGroup}
        />

        <FormGroup>
          <ControlLabel><FormattedMessage id="portal.content.addHost.deploymentMode.text" /><FormattedMessage id="portal.spaceWithAsterisk" /></ControlLabel>
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

        {(hasMDSupport || hasVODSupport) &&
          <FormGroup>
            <ControlLabel><FormattedMessage id="portal.content.addHost.serviceType.text" /><FormattedMessage id="portal.spaceWithAsterisk" /></ControlLabel>
              {hasMDSupport &&
                <Field
                  name="serviceType"
                  type="radio"
                  value="large"
                  component={FieldRadio}
                  label={<FormattedMessage id="portal.content.addHost.large.text" />}
                />
              }

              {hasVODSupport &&
                <Field
                  type="radio"
                  name="serviceType"
                  value="msd"
                  component={FieldRadio}
                  label={<FormattedMessage id="portal.content.addHost.msd.text" />}
                />
              }
          </FormGroup>
        }

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
  activeGroup: React.PropTypes.instanceOf(Immutable.Map),
  cancelChanges: React.PropTypes.func,
  createHost: React.PropTypes.func,
  hasMDSupport: React.PropTypes.bool,
  hasVODSupport: React.PropTypes.bool,
  intl: React.PropTypes.object,
  ...reduxFormPropTypes
}

function mapStateToProps(state, ownProps) {
  const enabledServices = ownProps.activeGroup.get('services') || Immutable.List()
  let hasVODSupport = false
  let hasMDSupport = false

  enabledServices.forEach((service) => {
    const serviceId = service.get('service_id')
    if (serviceId === VOD_STREAMING_SERVICE_ID) {
      hasVODSupport = true
    } else if (serviceId === MEDIA_DELIVERY_SERVICE_ID) {
      hasMDSupport = true
    }
  })

  return {
    hasVODSupport: hasVODSupport,
    hasMDSupport: hasMDSupport
  };
}

const form = reduxForm({
  form: 'add-host-form',
  validate: validate
})(injectIntl(AddHost))

export default connect(mapStateToProps)(form)
