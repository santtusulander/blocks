import React from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector, propTypes as reduxFormPropTypes } from 'redux-form'
import { Row, Col, ControlLabel, Button } from 'react-bootstrap'

import { injectIntl, FormattedMessage } from 'react-intl'

import HelpTooltip from '../shared/tooltips/help-tooltip'
import FieldFormGroup from '../shared/form-fields/field-form-group'
import FieldFormGroupToggle from '../shared/form-fields/field-form-group-toggle'
import FieldFormGroupSelect from '../shared/form-fields/field-form-group-select'
import FieldFormGroupMultiOptionSelector from '../shared/form-fields/field-form-group-multi-option-selector'
import FormFooterButtons from '../shared/form-elements/form-footer-buttons'

import { isValidPhoneNumber, isValidEmail, isValidTextField } from '../../util/validators'

const validate = ({contact_email, contact_first_name, contact_second_name, contact_phone, is_enabled}) => {
  const errors = {}

  /*
    Disable validation when logDeliveryService is disabled
  */
  if (!is_enabled) {
    return errors
  }

  if (contact_email && !isValidEmail(contact_email)) {
    errors.contact_email = <FormattedMessage id="portal.common.error.invalid.email.text"/>
  }

  if (contact_first_name && !isValidTextField(contact_first_name)) {
    errors.contact_first_name = <FormattedMessage id="portal.validators.invalid" values={{field: <FormattedMessage id="portal.services.logDelivery.firstName.text"/>}}/>
  }

  if (contact_second_name && !isValidTextField(contact_second_name)) {
    errors.contact_second_name = <FormattedMessage id="portal.validators.invalid" values={{field: <FormattedMessage id="portal.services.logDelivery.lastName.text"/>}}/>
  }

  if (contact_phone && !isValidPhoneNumber(contact_phone)) {
    errors.contact_phone = <FormattedMessage id="portal.validators.invalid" values={{field: <FormattedMessage id="portal.services.logDelivery.phone.text"/>}}/>
  }

  return errors
}

class LogDeliveryConfigureForm extends React.Component {
  constructor(props) {
    super(props)

    this.saveChanges = this.saveChanges.bind(this)
  }

  saveChanges(values) {
    /*
      Save an empty object if logDeliveryService is disabled
    */
    const {ldsEnabled, onSave} = this.props
    onSave(ldsEnabled ? values : {})
  }

  render() {
    const { onCancel, handleSubmit, invalid, ldsEnabled } = this.props
    const logTypesOptions = [
      {value: "conductor", label: "Conductor", options: []}
    ]

    const fileFormatOptions = [
      {value: "zip", label: ".zip"}
    ]

    const aggIntervalOptions = [
      {value: 30, label: "30 min"}
    ]

    return (
      <div>
        <form
          className="log-delivery-form"
          onSubmit={handleSubmit(this.saveChanges)}
        >
          <Row className="form-group">
            <Col xs={4} className="toggle-label">
              <ControlLabel>
                <FormattedMessage id="portal.services.logDelivery.enableLogDelivery.text"/>
              </ControlLabel>
            </Col>
            <Col xs={8}>
              <Field
                className="pull-right"
                name="is_enabled"
                component={FieldFormGroupToggle}
              />
            </Col>
          </Row>

          <hr/>

          <Row className="form-group">
            <Col xs={12}>
              <ControlLabel>
                <FormattedMessage id="portal.services.logDelivery.contactPerson.text"/>
              </ControlLabel>
            </Col>
          </Row>

          <Row className="form-group">
            <Col xs={12}>
              <Field
                name="contact_email"
                component={FieldFormGroup}
                label={<FormattedMessage id="portal.services.logDelivery.email.text"/>}
                required={false}
                disabled={!ldsEnabled}
              />
            </Col>
          </Row>

          <Row className="form-group">
            <Col xs={6}>
              <Field
                name="contact_first_name"
                component={FieldFormGroup}
                label={<FormattedMessage id="portal.services.logDelivery.firstName.text"/>}
                required={false}
                disabled={!ldsEnabled}
              />
            </Col>
            <Col xs={6}>
              <Field
                name="contact_second_name"
                component={FieldFormGroup}
                label={<FormattedMessage id="portal.services.logDelivery.lastName.text"/>}
                required={false}
                disabled={!ldsEnabled}
              />
            </Col>
          </Row>

          <Row className="form-group">
            <Col xs={12}>
              <Field
                name="contact_phone"
                component={FieldFormGroup}
                label={<FormattedMessage id="portal.services.logDelivery.phone.text"/>}
                required={false}
                disabled={!ldsEnabled}
              />
            </Col>
          </Row>

          <hr/>

          <Row className="form-group">
            <Col xs={12}>
              <Field
                name="log_types"
                component={FieldFormGroupMultiOptionSelector}
                options={logTypesOptions}
                label={<FormattedMessage id="portal.services.logDelivery.requestedLogTypes.text" />}
                normalize={(v) => v && v.map(item => item.id)}
                format={(v) => v && v.map(item => ({id: item}))}
                required={false}
                disabled={!ldsEnabled}
              />
            </Col>
          </Row>

          <Row className="form-group">
            <Col xs={6}>
              <Field
                name="log_export_file_format"
                className='input-select'
                component={FieldFormGroupSelect}
                options={fileFormatOptions}
                label={<FormattedMessage id="portal.services.logDelivery.exportFileFormat.text" />}
                required={false}
                disabled={!ldsEnabled}
                addonAfter={
                  <HelpTooltip
                    id="tooltip-help"
                    title={<FormattedMessage id="portal.services.logDelivery.exportFileFormat.text"/>}
                  >
                    <FormattedMessage id="portal.services.logDelivery.exportFileFormat.tooltip.message" />
                  </HelpTooltip>
                }
              />
            </Col>
          </Row>

          <Row className="form-group">
            <Col xs={6}>
              <Field
                name="log_aggregation_interval"
                className='input-select'
                component={FieldFormGroupSelect}
                options={aggIntervalOptions}
                label={<FormattedMessage id="portal.services.logDelivery.logAggregationInterval.text" />}
                addonBefore={<FormattedMessage id="portal.services.logDelivery.every.text" />}
                disabled={!ldsEnabled}
                required={false}
                addonAfter={
                  <HelpTooltip
                    id="tooltip-help"
                    title={<FormattedMessage id="portal.services.logDelivery.logAggregationInterval.text"/>}
                  >
                    <FormattedMessage id="portal.services.logDelivery.logAggregationInterval.tooltip.message" />
                  </HelpTooltip>
                }
              />
            </Col>
          </Row>

          <FormFooterButtons>
            <Button
              id="cancel-btn"
              className="btn-secondary"
              onClick={onCancel}
            >
              <FormattedMessage id="portal.services.logDelivery.cancel.text"/>
            </Button>

            <Button
              type="submit"
              bsStyle="primary"
              disabled={invalid}
            >
              <FormattedMessage id="portal.services.logDelivery.save.text"/>
            </Button>
          </FormFooterButtons>
        </form>
      </div>
    )
  }
}

LogDeliveryConfigureForm.displayName = 'LogDeliveryConfigureForm'
LogDeliveryConfigureForm.propTypes = {
  config: React.PropTypes.object,
  onCancel: React.PropTypes.func,
  onSave: React.PropTypes.func,
  ...reduxFormPropTypes
}

LogDeliveryConfigureForm.defaultProps = {
  initialValues: {
    is_enabled: false,
    aggregation_interval: 30,
    log_types: ['conductor'],
    export_file_format: 'zip'
  }
}

/* istanbul ignore next */
const mapStateToProps = (state, { config }) => {
  const selector = formValueSelector('log-delivery-configure-form')

  return {
    ldsEnabled: selector(state, 'is_enabled'),
    initialValues: {
      ...config
    }
  }
}

const form = reduxForm({
  form: 'log-delivery-configure-form',
  validate
})(LogDeliveryConfigureForm)

export default connect(mapStateToProps)(injectIntl(form))
