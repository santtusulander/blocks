import React, { PropTypes } from 'react'
import { List } from 'immutable'
import { connect } from 'react-redux'
import { formValueSelector, reduxForm, Field, propTypes as reduxFormPropTypes } from 'redux-form'
import FieldFormGroup from '../../form/field-form-group'
import FieldFormGroupSelect from '../../form/field-form-group-select'
import FormFooterButtons from '../../form/form-footer-buttons'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import {
  Button,
  ButtonToolbar,
  FormGroup
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
import FieldFormGroupTypeahead from '../../form/field-form-group-typeahead'

import UDNButton from '../../button'
import IconAdd from '../../icons/icon-add'

import { POD_PROVIDER_WEIGHT_MIN } from '../../../constants/network'

import { isValidIPv4Address } from '../../../util/validators'

import './pod-form.scss'

const LBMETHOD_OPTIONS = [
  { value: 'gslb', label: 'GSLB' }
]

const POD_TYPE_OPTIONS = [
  { value: 'core', label: 'Core' },
  { value: 'sp_edge', label: 'SP Edge' }
]

const REQUEST_FWD_TYPE_OPTIONS = [
  { value: 'gslb_referral', label: 'GSLB Referral' }
]

const DISCOVERY_METHOD_OPTIONS = [
  { value: 'BGP', label: 'BGP' },
  { value: 'footprints', label: 'Footprints' }
]


const validate = ({ pod_name, localAS, lb_method, pod_type, requestForwardType, provider_weight, discoveryMethod }) => {
  const conditions = {
    pod_name: {
      condition: !isValidTextField(pod_name),
      errorText: <MultilineTextFieldError fieldLabel="portal.network.podForm.name.label"/>
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

const asyncValidate = ({ UILocalAS }) => {
  return fetchASOverview(UILocalAS)
    .then(({ data: { holder } }) => {
      if (!holder) {
        throw {
          UILocalAS: <FormattedMessage id="portal.network.spConfig.routingDaemon.editForm.asNameNotFound.label"/>
        }
      }
    })
    .catch(() => {
      throw {
        UILocalAS: <FormattedMessage id="portal.network.spConfig.routingDaemon.editForm.asNameNotFound.label"/>
      }
    })
}

const validateIpListToken = (item) => {
  return item.label && isValidIPv4Address(item.label)
}

const PodForm = ({
  asyncValidating,
  dirty,
  discoveryMethod,
  footprints,
  handleSubmit,
  hasNodes,
  initialValues,
  intl,
  invalid,
  onAddFootprintModal,
  onCancel,
  onDelete,
  onDeleteFootprint,
  onEditFootprint,
  onSave,
  submitting
}) => {

  const edit = !!initialValues.pod_name

  return (
    <form onSubmit={handleSubmit(onSave)}>
      <Field
        type="text"
        name="UIName"
        id="pod_name-field"
        placeholder={intl.formatMessage({ id: 'portal.network.podForm.name.text' })}
        component={FieldFormGroup}
        label={<FormattedMessage id="portal.network.podForm.name.label"/>}/>

      <div className="form-group">
        <label>Cloud Lookup ID</label>
        <div className="sub-title">{initialValues.UICloudLookUpId}</div>
      </div>

      <Field
        name="UILbMethod"
        //numericValues={true}
        component={FieldFormGroupSelect}
        options={LBMETHOD_OPTIONS}
        label={intl.formatMessage({ id: "portal.network.podForm.lbMethod.label" })}
        addonAfter={
          <HelpTooltip
            id="tooltip-help"
            title={<FormattedMessage id="portal.network.podForm.discoveryMethod.help.label"/>}>
            <FormattedMessage id="portal.network.podForm.discoveryMethod.help.text"/>
          </HelpTooltip>
        }/>

      <Field
        name="pod_type"
        //numericValues={true}
        component={FieldFormGroupSelect}
        options={POD_TYPE_OPTIONS}
        label={intl.formatMessage({ id: "portal.network.podForm.type.label" })}/>

      <Field
        type="text"
        name="UILocalAS"
        id="localAS-field"
        component={FieldFormGroup}
        label={<FormattedMessage id="portal.network.podForm.localAS.label"/>}
        addonAfter={
          <HelpTooltip
            id="tooltip-help"
            title={<FormattedMessage id="portal.network.podForm.localAS.help.label"/>}>
            <FormattedMessage id="portal.network.podForm.localAS.help.text"/>
          </HelpTooltip>
        }/>

      <Field
        name="UIRequestFwdType"
        //numericValues={true}
        component={FieldFormGroupSelect}
        options={REQUEST_FWD_TYPE_OPTIONS}
        label={intl.formatMessage({ id: "portal.network.podForm.requestForwardType.label" })}/>

      <Field
        min={POD_PROVIDER_WEIGHT_MIN}
        type="text"
        name="UIProviderWeight"
        id="provider_weight-field"
        component={FieldFormGroupNumber}
        label={<FormattedMessage id="portal.network.podForm.providerWeight.label"/>}/>

      <Field
        required={true}
        name="value"
        allowNew={true}
        component={FieldFormGroupTypeahead}
        multiple={true}
        options={[]}
        validation={validateIpListToken}
        label={<FormattedMessage id="portal.network.podForm.ipList.label"/>}
      />

      <hr/>

      <Field
        name="discoveryMethod"
        disabled={!footprints.isEmpty()}
        numericValues={true}
        component={FieldFormGroupSelect}
        options={[
          [1, intl.formatMessage({ id: 'portal.network.podForm.discoveryMethod.bgp.text' })],
          [2, intl.formatMessage({ id: 'portal.network.podForm.discoveryMethod.footprintApi.text' })]
        ]}
        label={intl.formatMessage({ id: "portal.network.podForm.discoveryMethod.label" })}
        addonAfter={
          <HelpTooltip
            id="tooltip-help"
            title={<FormattedMessage id="portal.network.podForm.discoveryMethod.help.label"/>}>
            <FormattedMessage id="portal.network.podForm.discoveryMethod.help.text"/>
          </HelpTooltip>
        }/>

      {discoveryMethod && discoveryMethod === 2 &&
      <FormGroup className="footprint-section">
        <label><FormattedMessage id="portal.network.podForm.discoveryMethod.footprintApi.label"/>
          <UDNButton bsStyle="success" icon={true} addNew={true} onClick={onAddFootprintModal}>
            <IconAdd/>
          </UDNButton>
        </label>
        {!footprints.isEmpty() &&
        <div className="footprint-keys">
          {footprints.map((item, key) =>
            <div key={key}>
              {/*TODO: Add action item*/}
              <p>{item.get('footPrintName')} <span onClick={onEditFootprint}>edit</span> <span
                onClick={onDeleteFootprint}>del</span></p>
            </div>
          )}
        </div>
        }
      </FormGroup>
      }

      <FormFooterButtons autoAlign={false}>
        {edit &&
        <ButtonToolbar className="pull-left">
          <ButtonDisableTooltip
            id="delete-btn"
            className="btn-danger"
            disabled={hasNodes}
            onClick={onDelete}
            tooltipId="tooltip-help"
            tooltipMessage={{ text: intl.formatMessage({ id: "portal.network.podForm.delete.tooltip.message" }) }}>
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
            {edit ? <FormattedMessage id='portal.button.save'/> : <FormattedMessage id='portal.button.add'/>}
          </Button>
        </ButtonToolbar>
      </FormFooterButtons>
    </form>
  )
}

PodForm.displayName = "PodForm"

PodForm.propTypes = {
//  dirty: PropTypes.bool,
//  handleSubmit: PropTypes.func,
  hasNodes: PropTypes.bool,
  intl: intlShape.isRequired,
  network: PropTypes.string,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
  onSave: PropTypes.func,
  ...reduxFormPropTypes,
  /* needs to overrider reduxFormPropTypes */
  asyncValidating: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool
  ]).isRequired
}

const form = reduxForm({
  form: 'pod-form',
  validate,
  asyncValidate,
  asyncBlurFields: ['UILocalAS']
})(PodForm)

const mapStateToProps = (state, ownProps) => {
  const selector = formValueSelector('pod-form')
  const discoveryMethod = selector(state, 'discoveryMethod')

  return {
    discoveryMethod,
    initialValues: Object.assign({}, ownProps.initialValues, {
      discoveryMethod: !ownProps.footprints.isEmpty() ? 2 : ownProps.discoveryMethod
    })
  }
}

export default connect(mapStateToProps)(injectIntl(form))
