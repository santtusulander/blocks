import React, { PropTypes } from 'react'
import { reduxForm, Field, propTypes as reduxFormPropTypes } from 'redux-form'
import FieldFormGroup from '../../form/field-form-group'
import FieldFormGroupSelect from '../../form/field-form-group-select'
import FormFooterButtons from '../../form/form-footer-buttons'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import {
  Button,
  ButtonToolbar
} from 'react-bootstrap'
import {
  checkForErrors
} from '../../../util/helpers'
import { fetchASOverview } from '../../../util/network-helpers'

import { isValidTextField } from '../../../util/validators'
import HelpTooltip from '../../../components/help-tooltip'
import FieldFormGroupNumber from '../../form/field-form-group-number'
import ButtonDisableTooltip from '../../../components/button-disable-tooltip'
import MultilineTextFieldError from '../../../components/shared/forms/multiline-text-field-error'

import { POD_PROVIDER_WEIGHT_MIN } from '../../../constants/network'
import './pod-form.scss'

const LBMETHOD_OPTIONS = [
  {value: 'gslb', label: 'GSLB'}
]

const POD_TYPE_OPTIONS = [
  {value: 'core', label: 'Core'},
  {value: 'sp_edge', label: 'SP Edge'}
]

const REQUEST_FWD_TYPE_OPTIONS = [
  {value: 'gslb_referral', label: 'GSLB Referral'}
]

const DISCOVERY_METHOD_OPTIONS = [
  {value: 'BGP', label: 'BGP'},
  {value: 'footprints', label: 'Footprints'}
]


const validate = ({ pod_name, localAS, lb_method, pod_type, requestForwardType, provider_weight, discoveryMethod }) => {
  const conditions = {
    pod_name: {
      condition: !isValidTextField(pod_name),
      errorText: <MultilineTextFieldError fieldLabel="portal.network.podForm.name.label" />
    }
  }
  return checkForErrors(
    {
      pod_name, localAS, lb_method, pod_type,
      requestForwardType, provider_weight, discoveryMethod
    },
    conditions,
    {
      pod_name: <FormattedMessage id="portal.network.podForm.name.required.error"/>,
      lb_method: <FormattedMessage id="portal.network.podForm.lb_method.required.error"/>,
      pod_type: <FormattedMessage id="portal.network.podForm.pod_type.required.error"/>,
      requestForwardType: <FormattedMessage id="portal.network.podForm.requestForwardType.required.error"/>,
      provider_weight: <FormattedMessage id="portal.network.podForm.provider_weight.required.error"/>,
      discoveryMethod: <FormattedMessage id="portal.network.podForm.discoveryMethod.required.error"/>,
      local_as: <FormattedMessage id="portal.network.podForm.localAS.required.error"/>
    }
  )
}

const asyncValidate = ({ localAS }) => {
  return fetchASOverview(localAS)
    .then(({ data: { holder } }) => {
      if (!holder) {
        throw {
          UIlocalAS: <FormattedMessage id="portal.network.spConfig.routingDaemon.editForm.asNameNotFound.label"/>
        }
      }
    })
    .catch(() => {
      throw {
        UIlocalAS: <FormattedMessage id="portal.network.spConfig.routingDaemon.editForm.asNameNotFound.label"/>
      }
    })
}

const PodForm = ({
  asyncValidating,
  handleSubmit,
  hasNodes,
  intl,
  invalid,
  initialValues,
  onCancel,
  onDelete,
  onSubmit,
  submitting,
  dirty}) => {

  const edit = !!initialValues.pod_name

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
        <div className="sub-title">{initialValues.UICloudLookUpId}</div>
      </div>

      <Field
        name="UILbMethod"
        //numericValues={true}
        component={FieldFormGroupSelect}
        options={LBMETHOD_OPTIONS}
        label={intl.formatMessage({id: "portal.network.podForm.lbMethod.label"})}
        addonAfter={
          <HelpTooltip
            id="tooltip-help"
            title={<FormattedMessage id="portal.network.podForm.discoveryMethod.help.label"/>}>
            <FormattedMessage id="portal.network.podForm.discoveryMethod.help.text" />
          </HelpTooltip>
        }/>

      <Field
        name="pod_type"
        //numericValues={true}
        component={FieldFormGroupSelect}
        options={POD_TYPE_OPTIONS}
        label={intl.formatMessage({id: "portal.network.podForm.type.label"})} />

      <Field
        type="text"
        name="UILocalAs"
        id="localAS-field"
        component={FieldFormGroup}
        label={<FormattedMessage id="portal.network.podForm.localAS.label" />}
        addonAfter={
          <HelpTooltip
            id="tooltip-help"
            title={<FormattedMessage id="portal.network.podForm.localAS.help.label"/>}>
            <FormattedMessage id="portal.network.podForm.localAS.help.text" />
          </HelpTooltip>
        }/>

      <Field
        name="UIRequestFwdType"
        //numericValues={true}
        component={FieldFormGroupSelect}
        options={REQUEST_FWD_TYPE_OPTIONS}
        label={intl.formatMessage({id: "portal.network.podForm.requestForwardType.label"})} />

      <Field
        min={POD_PROVIDER_WEIGHT_MIN}
        type="text"
        name="UIProviderWeight"
        id="provider_weight-field"
        component={FieldFormGroupNumber}
        label={<FormattedMessage id="portal.network.podForm.providerWeight.label" />} />

      <hr/>

      <Field
        name="UIDiscoveryMethod"
        //numericValues={true}
        component={FieldFormGroupSelect}
        options={DISCOVERY_METHOD_OPTIONS}
        label={intl.formatMessage({id: "portal.network.podForm.discoveryMethod.label"})}
        addonAfter={
          <HelpTooltip
            id="tooltip-help"
            title={<FormattedMessage id="portal.network.podForm.discoveryMethod.help.label"/>}>
            <FormattedMessage id="portal.network.podForm.discoveryMethod.help.text" />
          </HelpTooltip>
        }/>

      <FormFooterButtons autoAlign={false}>
        {edit &&
          <ButtonToolbar className="pull-left">
            <ButtonDisableTooltip
              id="delete-btn"
              className="btn-danger"
              disabled={hasNodes}
              onClick={onDelete}
              tooltipId="tooltip-help"
              tooltipMessage={{text :intl.formatMessage({id: "portal.network.podForm.delete.tooltip.message"})}}>
              <FormattedMessage id="portal.button.delete"/>
            </ButtonDisableTooltip>
          </ButtonToolbar>
        }
        <ButtonToolbar className="pull-right">
          <Button
            id="cancel-btn"
            className="btn-secondary"
            onClick={onCancel}>
            <FormattedMessage id="portal.button.cancel"/>
          </Button>

          <Button
            type="submit"
            bsStyle="primary"
            disabled={invalid || submitting || (!!asyncValidating) || (!dirty)}>
            {edit ? <FormattedMessage id='portal.button.save' /> : <FormattedMessage id='portal.button.add' />}
          </Button>
        </ButtonToolbar>
      </FormFooterButtons>
    </form>
  )
}

PodForm.displayName = "PodForm"

PodForm.propTypes = {
  asyncValidating: React.PropTypes.oneOfType([ React.PropTypes.string, React.PropTypes.bool ]),
  dirty: PropTypes.bool,
  handleSubmit: PropTypes.func,
  hasNodes: PropTypes.bool,
  intl: intlShape.isRequired,
  network: PropTypes.string,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
  onSubmit: PropTypes.func,
  ...reduxFormPropTypes
}

export default reduxForm({
  form: 'pod-form',
  validate,
  asyncValidate,
  asyncBlurFields: [ 'UILocalAs' ]
})(injectIntl(PodForm))
