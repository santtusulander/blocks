import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { reduxForm, formValueSelector, Field, FieldArray, arrayPush, propTypes as reduxFormPropTypes } from 'redux-form'
import FieldFormGroup from '../../form/field-form-group'
import FieldFormGroupSelect from '../../form/field-form-group-select'
import FormFooterButtons from '../../form/form-footer-buttons'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import {
  Button,
  ButtonToolbar,
  Row,
  Col
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

import { POD_PROVIDER_WEIGHT_MIN } from '../../../constants/network'

//TODO: If Ip list needed uncomment
//import { isValidIPv4Address } from '../../../util/validators'

import UDNButton from '../../button'
import IconAdd from '../../icons/icon-add'
import IconEdit from '../../icons/icon-edit'
import IconClose from '../../icons/icon-close'

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

const validate = (values) => {
  const { UIname, UILbMethod, pod_type, UILocalAS, UIRequestFwdType, UIProviderWeight, UIDiscoveryMethod, UIFootprints } = values

  const conditions = {
    UIname: {
      condition: !isValidTextField(UIname),
      errorText: <MultilineTextFieldError fieldLabel="portal.network.podForm.name.label" />
    }
  }
  return checkForErrors(
    {
      UIname,
      UILbMethod,
      pod_type,
      UIRequestFwdType,
      UIProviderWeight,
      UIDiscoveryMethod,
      UILocalAS,
      UIFootprints
    },
    conditions,
    {
      UIname: <FormattedMessage id="portal.network.podForm.name.required.error"/>,
      UILbMethod: <FormattedMessage id="portal.network.podForm.lb_method.required.error"/>,
      pod_type: <FormattedMessage id="portal.network.podForm.pod_type.required.error"/>,
      UIRequestFwdType: <FormattedMessage id="portal.network.podForm.requestForwardType.required.error"/>,
      UIProviderWeight: <FormattedMessage id="portal.network.podForm.provider_weight.required.error"/>,
      UIDiscoveryMethod: <FormattedMessage id="portal.network.podForm.discoveryMethod.required.error"/>,
      UILocalAS: <FormattedMessage id="portal.network.podForm.localAS.required.error"/>,
      UIFootprints: <FormattedMessage id="portal.network.podForm.footprints.required.error"/>
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

/** TODO: This is needed for IPList
const validateCIDRToken = (item) => {
  return item.label && isValidIPv4Address(item.label)
}
*/


/*eslint-disable react/no-multi-comp */
const renderFootprints = ({ fields, onEdit }) => (
  <ul className="footprints">
    {
      fields.map(( footprint, index) =>
        <Field
          key={index}
          name={`${footprint}`}
          type="text"
          component={renderFootprint}
          onEdit={onEdit}
        />
      )
    }
  </ul>
)

renderFootprints.propTypes = {
  fields: PropTypes.object,
  onEdit: PropTypes.func
}
renderFootprints.displayName = 'renderFootprints'

/*eslint-disable react/no-multi-comp */
const renderFootprint = ({ onEdit, input }) => (
  <li>
    <Row>
      <Col xs={8}>
        <span>{input.value.name}</span>
      </Col>

      <Col xs={4} className="action-buttons">
        <Button
          className="btn btn-icon edit-button"
          onClick={() => onEdit(input.value.id)}>
          <IconEdit/>
        </Button>

        <Button
          bsStyle="link"
          className="btn btn-icon delete-button btn-undo"
          onClick={() => {
            const newVal = { ...input.value, removed: !input.value.removed }
            input.onChange(newVal)
          }}
        >

          { input.value.removed
            ? <FormattedMessage id="portal.common.button.undo"/>
            : <IconClose/>
          }

        </Button>
      </Col>
    </Row>
  </li>
)

renderFootprint.propTypes = {
  input: PropTypes.object,
  onEdit: PropTypes.func
}
renderFootprint.displayName = 'renderFootprint'

const PodForm = ({
  asyncValidating,
  handleSubmit,
  hasNodes,
  intl,
  invalid,
  initialValues,
  onCancel,
  onDelete,
  onSave,
  submitting,
  dirty,

  onShowFootprintModal,
  onEditFootprint,

  onShowRoutingDaemonModal,
  onDeleteRoutingDaemon,

  dispatch,
  footprints,
  UIFootprints,
  UIDiscoveryMethod,
  UIsp_bgp_router_as
  }) => {

  const edit = !!initialValues.pod_name
  //const typeaheadValidationMethod = dataType === 'ipv4cidr' ? validateCIDRToken : validateASNToken

  /*eslint-disable no-unused-vars */
  const addFootprint = ([footprint, ...rest]) => {
    if (footprint) dispatch(arrayPush('pod-form', 'UIFootprints', footprint))
  }

  const showFootprints = (UIDiscoveryMethod === 'footprints')
  const showBgp = (UIDiscoveryMethod === 'BGP')
  const hasFootprints = UIFootprints.length > 0 && UIFootprints.filter( fp => fp && !fp.removed || fp && fp.removed === false).length > 0

  const hasBGPRoutingDaemon = !!UIsp_bgp_router_as

  //change of method is allowed is no footprints / BGP's assigned
  const discoveryMethodChangeAllowed = showFootprints && !hasFootprints || !showFootprints && !hasBGPRoutingDaemon

  //Filter out footprints that have been added to UIFootprints
  const availableFootprints = showFootprints && footprints.filter( fp => UIFootprints.filter( item => item.id === fp.id ).length === 0  )

  return (
    <form onSubmit={handleSubmit(onSave)}>
      <Field
        type="text"
        name="UIName"
        disabled={edit}
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
        name="UILocalAS"
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

      {/* TODO: IpList MIGHT be needed <Field
        required={true}
        name="UIIpList"
        allowNew={true}
        component={FieldFormGroupTypeahead}
        multiple={true}
        options={[]}
        validation={validateCIDRToken}
        label={<FormattedMessage id="portal.network.podForm.ipList.label" />}
      />*/}

      <hr/>

      <Field
        name="UIDiscoveryMethod"
        //numericValues={true}
        component={FieldFormGroupSelect}
        disabled={!discoveryMethodChangeAllowed}
        options={DISCOVERY_METHOD_OPTIONS}
        label={<FormattedMessage id="portal.network.podForm.discoveryMethod.label" />}
        addonAfter={
          <HelpTooltip
            id="tooltip-help"
            title={<FormattedMessage id="portal.network.podForm.discoveryMethod.help.label"/>}>
            <FormattedMessage id="portal.network.podForm.discoveryMethod.help.text" />
          </HelpTooltip>
        }
      />

      {showFootprints &&
      <div className="form-group discovery-section">
        <label><FormattedMessage id="portal.network.podForm.discoveryMethod.footprintApi.label"/>
          <UDNButton bsStyle="success" icon={true} addNew={true} onClick={onShowFootprintModal}>
            <IconAdd/>
          </UDNButton>
        </label>
        {/* Footprints autocomplete */}
        <Field
          className="action-item-search search-input-group"
          component={FieldFormGroupTypeahead}
          labelKey='name'
          disabled={availableFootprints.length === 0}
          name="footprintSearch"
          options={availableFootprints}
          required={false}
          multiple={false}
          allowNew={false}
          props={{
            onChange: (fp) => addFootprint(fp)
          }}
        />

        {/* Footprints list */}
        <FieldArray
          name="UIFootprints"
          component={renderFootprints}
          props={{
            onEdit: onEditFootprint
          }}
        />
      </div>
      }

      {/* BGP */}
      {showBgp &&
      <div className="form-group discovery-section">
        <label><FormattedMessage id="portal.network.podForm.discoveryMethod.bgp.label"/>
          <UDNButton bsStyle="success"
                     icon={true}
                     addNew={true}
                     disabled={hasBGPRoutingDaemon}
                     onClick={onShowRoutingDaemonModal}>
            <IconAdd/>
          </UDNButton>
        </label>
        {hasBGPRoutingDaemon &&
        <ul className="footprints">
          <li>
            <Row>
              <Col xs={8}>
                <span>{UIsp_bgp_router_as}</span>
              </Col>

              <Col xs={4} className="action-buttons">
                <Button
                  className="btn btn-icon edit-button"
                  onClick={onShowRoutingDaemonModal}>
                  <IconEdit/>
                </Button>

                <Button
                  bsStyle="link"
                  className="btn btn-icon delete-button btn-undo"
                  onClick={onDeleteRoutingDaemon}
                >
                  <IconClose/>
                </Button>
              </Col>
            </Row>
          </li>
        </ul>
        }
      </div>
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
  hasNodes: PropTypes.bool,
  intl: intlShape.isRequired,
  network: PropTypes.string,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
  onSave: PropTypes.func,
  ...reduxFormPropTypes,

  /* needs to override reduxFormPropTypes - BUG in redux-form */
  asyncValidating: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool
  ]).isRequired
}

const mapStateToProps = (state) => {
  const selector = formValueSelector('pod-form')
  const UIsp_bgp_router_as = selector(state, 'UIsp_bgp_router_as')

  return {
    UIsp_bgp_router_as
  }
}

const form = reduxForm({
  form: 'pod-form',
  validate,
  asyncValidate,
  asyncBlurFields: [ 'UILocalAS' ]
})(injectIntl(PodForm))

export default connect(mapStateToProps)(form)
