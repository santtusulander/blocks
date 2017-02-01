import React, { PropTypes } from 'react'
import { reduxForm, Field } from 'redux-form'
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
import ActionItemsContainer from '../../shared/action-items-container'

import { POD_PROVIDER_WEIGHT_MIN } from '../../../constants/network'
import './pod-form.scss'

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
      localAS: <FormattedMessage id="portal.network.podForm.localAS.required.error"/>
    }
  )
}

const asyncValidate = ({ localAS }) => {
  return fetchASOverview(localAS)
    .then(({ data: { holder } }) => {
      if (!holder) {
        throw {
          localAS: <FormattedMessage id="portal.network.spConfig.routingDaemon.editForm.asNameNotFound.label"/>
        }
      }
    })
    .catch(() => {
      throw {
        localAS: <FormattedMessage id="portal.network.spConfig.routingDaemon.editForm.asNameNotFound.label"/>
      }
    })
}

const PodForm = ({
  asyncValidating,
  account,
  addAction,
  availableActions,
  brand,
  discoveryMethodValue,
  edit,
  editAction,
  group,
  handleSubmit,
  hasNodes,
  initialValues,
  intl,
  invalid,
  network,
  onCancel,
  onDelete,
  onSubmit,
  pop,
  searchInputValue,
  submitting,
  dirty}) => {

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
        label={intl.formatMessage({id: "portal.network.podForm.type.label"})} />

      <Field
        type="text"
        name="localAS"
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
        name="requestForwardType"
        numericValues={true}
        component={FieldFormGroupSelect}
        options={[
          [1, "On-Net"]
        ]}
        label={intl.formatMessage({id: "portal.network.podForm.requestForwardType.label"})} />

      <Field
        min={POD_PROVIDER_WEIGHT_MIN}
        type="text"
        name="provider_weight"
        id="provider_weight-field"
        component={FieldFormGroupNumber}
        label={<FormattedMessage id="portal.network.podForm.providerWeight.label" />} />

      <hr/>

      <Field
        name="discoveryMethod"
        numericValues={true}
        component={FieldFormGroupSelect}
        options={[
          [1, "BGP"],
          [2, "Footprints API"]
        ]}
        label={intl.formatMessage({id: "portal.network.podForm.discoveryMethod.label"})}
        addonAfter={
          <HelpTooltip
            id="tooltip-help"
            title={<FormattedMessage id="portal.network.podForm.discoveryMethod.help.label"/>}>
            <FormattedMessage id="portal.network.podForm.discoveryMethod.help.text" />
          </HelpTooltip>
        }/>

      <ActionItemsContainer
        addAction={addAction}
        editAction={editAction}
        initialValues={initialValues}
        intl={intl}
        type={discoveryMethodValue}
        searchInputValue={searchInputValue}
        availableActions={availableActions} />

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
  account: PropTypes.string,
  addAction: PropTypes.func,
  asyncValidating: React.PropTypes.oneOfType([ React.PropTypes.string, React.PropTypes.bool ]),
  availableActions: PropTypes.array,
  brand: PropTypes.string,
  dirty: PropTypes.bool,
  discoveryMethodValue: PropTypes.number,
  edit: PropTypes.bool,
  editAction: PropTypes.func,
  group: PropTypes.string,
  handleSubmit: PropTypes.func,
  hasNodes: PropTypes.bool,
  initialValues: PropTypes.object,
  intl: intlShape.isRequired,
  invalid: PropTypes.bool,
  network: PropTypes.string,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
  onSubmit: PropTypes.func,
  pop: PropTypes.string,
  searchInputValue: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  submitting: PropTypes.bool
}

export default reduxForm({
  form: 'podForm',
  validate,
  asyncValidate,
  asyncBlurFields: [ 'localAS' ]
})(injectIntl(PodForm))
