import React, { PropTypes } from 'react'
import { reduxForm, Field } from 'redux-form'
import FieldFormGroup from '../../form/field-form-group'
import FieldFormGroupSelect from '../../form/field-form-group-select'
import FormFooterButtons from '../../form/form-footer-buttons'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import {
  Button
} from 'react-bootstrap'
import {
  checkForErrors
} from '../../../util/helpers'
import { isValidTextField } from '../../../util/validators'
import HelpTooltip from '../../../components/help-tooltip'
import MultilineTextFieldError from '../../../components/shared/forms/multiline-text-field-error'

import './pod-form.scss'

const validate = ({ pod_name }) => {
  const conditions = {
    pod_name: {
      condition: !isValidTextField(pod_name),
      errorText: <MultilineTextFieldError fieldLabel="portal.network.podForm.name.label" />
    }
  }
  return checkForErrors(
    { pod_name },
    conditions,
    { pod_name: <FormattedMessage id="portal.network.podForm.name.required.error"/> }
  )
}

const PodForm = ({
  account,
  brand,
  group,
  handleSubmit,
  intl,
  invalid,
  network,
  onCancel,
  onSubmit,
  podId,
  pop}) => {

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Field
        type="text"
        name="pod_name"
        id="pod_name-field"
        placeholder={intl.formatMessage({id: 'portal.network.podForm.name.text'})}
        component={FieldFormGroup}
        label={<FormattedMessage id="portal.network.podForm.name.label" />}/>

      <div className="form-group">
        <label>Cloud Lookup ID</label>
        <div className="sub-title">{`${brand}+${account}+${group}+${network}+${pop}`}</div>
      </div>

      <Field
        name="lb_method"
        numericValues={true}
        component={FieldFormGroupSelect}
        options={[
          [1, "GSLB"]
        ]}
        label={intl.formatMessage({id: "portal.network.podForm.lbMethod.label"})}
        required={false}
        addonAfter={
          <HelpTooltip
            id="tooltip-help"
            title={<FormattedMessage id="portal.network.podForm.discoveryMethod.help.label"/>}>
            <FormattedMessage id="portal.network.podForm.discoveryMethod.help.text" />
          </HelpTooltip>
        }/>

      <Field
        name="pod_type"
        numericValues={true}
        component={FieldFormGroupSelect}
        options={[
          [1, "SP Edge"],
          [2, "Core"]
        ]}
        label={intl.formatMessage({id: "portal.network.podForm.type.label"})}
        required={false}/>

      <Field
        type="text"
        name="localAS"
        id="localAS-field"
        component={FieldFormGroup}
        label={<FormattedMessage id="portal.network.podForm.localAS.label" />}
        required={false}
        addonAfter={
          <HelpTooltip
            id="tooltip-help"
            title={<FormattedMessage id="portal.network.podForm.localAS.help.label"/>}>
            <FormattedMessage id="portal.network.podForm.localAS.help.text" />
          </HelpTooltip>
        }/>

      <Field
        name="requestForwardType"
        numericValues={true}
        component={FieldFormGroupSelect}
        options={[
          [1, "On-Net"]
        ]}
        label={intl.formatMessage({id: "portal.network.podForm.requestForwardType.label"})}
        required={false}/>

      <Field
        type="text"
        name="provider_weight"
        id="provider_weight-field"
        component={FieldFormGroup}
        label={<FormattedMessage id="portal.network.podForm.providerWeight.label" />}
        required={false}/>

      <hr/>

      <Field
        name="discoveryMethod"
        numericValues={true}
        component={FieldFormGroupSelect}
        options={[
          [1, "BGP"]
        ]}
        label={intl.formatMessage({id: "portal.network.podForm.discoveryMethod.label"})}
        required={false}
        addonAfter={
          <HelpTooltip
            id="tooltip-help"
            title={<FormattedMessage id="portal.network.podForm.discoveryMethod.help.label"/>}>
            <FormattedMessage id="portal.network.podForm.discoveryMethod.help.text" />
          </HelpTooltip>
        }/>

      <FormFooterButtons>
        <Button
          id="cancel-btn"
          className="btn-secondary"
          onClick={onCancel}>
          <FormattedMessage id="portal.button.cancel"/>
        </Button>

        <Button
          type="submit"
          bsStyle="primary"
          disabled={invalid}>
          {podId ? <FormattedMessage id='portal.button.save' /> : <FormattedMessage id='portal.button.add' />}
        </Button>
      </FormFooterButtons>
    </form>
  )
}

PodForm.displayName = "PodForm"

PodForm.propTypes = {
  account: PropTypes.string,
  brand: PropTypes.string,
  group: PropTypes.string,
  handleSubmit: PropTypes.func,
  intl: intlShape.isRequired,
  invalid: PropTypes.bool,
  network: PropTypes.string,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  podId: PropTypes.number,
  pop: PropTypes.string
}

export default reduxForm({
  form: 'pod-form',
  validate
})(injectIntl(PodForm))
