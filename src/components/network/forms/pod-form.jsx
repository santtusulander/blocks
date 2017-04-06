import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { reduxForm, formValueSelector, Field, FieldArray, arrayPush, propTypes as reduxFormPropTypes } from 'redux-form'
import FieldFormGroup from '../../shared/form-fields/field-form-group'
import FieldFormGroupSelect from '../../shared/form-fields/field-form-group-select'
import FormFooterButtons from '../../shared/form-elements/form-footer-buttons'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import {
  Button,
  Row,
  Col
} from 'react-bootstrap'
import classnames from 'classnames'

import { checkForErrors } from '../../../util/helpers'

import { fetchASOverview } from '../../../util/network-helpers'
import { isValidFootprintTextField, isInt, isValidProviderWeight, isValidIP } from '../../../util/validators'

import { FORM_TEXT_FIELD_DEFAULT_MIN_LEN,
         FORM_FOOTPRINT_TEXT_FIELD_MAX_LEN
         } from '../../../constants/common'


import HelpTooltip from '../../shared/tooltips/help-tooltip'
import ButtonDisableTooltip from '../../shared/tooltips/button-disable-tooltip'
import MultilineTextFieldError from '../../shared/form-elements/multiline-text-field-error'
import FieldFormGroupTypeahead from '../../shared/form-fields/field-form-group-typeahead'

import {
  DELETE_POD, MODIFY_POD,
  CREATE_FOOTPRINT, VIEW_FOOTPRINT, DELETE_FOOTPRINT, MODIFY_FOOTPRINT
} from '../../../constants/permissions'

import {
  POD_PROVIDER_WEIGHT_MIN,
  LBMETHOD_OPTIONS,
  POD_TYPE_OPTIONS,
  REQUEST_FWD_TYPE_OPTIONS,
  DISCOVERY_METHOD_OPTIONS,
  STATUS_OPTIONS,
  SALT_ROLE_OPTIONS
} from '../../../constants/network'

import UDNButton from '../../button'
import IconAdd from '../../shared/icons/icon-add'
import IconEdit from '../../shared/icons/icon-edit'
import IconClose from '../../shared/icons/icon-close'
import IsAllowed from '../../shared/permission-wrappers/is-allowed'

const validate = (values) => {
  const { UIName, UILbMethod, pod_type, UILocalAS, UIRequestFwdType, UIProviderWeight, UIDiscoveryMethod, UIFootprints, UIIpList, UISaltRole } = values
  const IPList = UIIpList.map(address => address.label)
  const conditions = {
    UIName: {
      condition: !isValidFootprintTextField(UIName),
      errorText: <MultilineTextFieldError
                    fieldLabel="portal.network.podForm.name.label"
                    customValidationErrorText="portal.common.textFieldMultilineValidation.allowedSpecialChars.limited"
                    minValue={FORM_TEXT_FIELD_DEFAULT_MIN_LEN}
                    maxValue={FORM_FOOTPRINT_TEXT_FIELD_MAX_LEN}
                />
    },
    UIProviderWeight: {
      condition: !isValidProviderWeight(UIProviderWeight),
      errorText: <FormattedMessage id="portal.network.podForm.provider_weight.range.error" />
    },
    UIIpList: {
      condition: !isValidIP(IPList),
      errorText: <FormattedMessage id="portal.network.podForm.ipList.invalid.error" />
    }
  }
  const errors =  checkForErrors(
    {
      UIName,
      UILbMethod,
      pod_type,
      UIRequestFwdType,
      UIProviderWeight,
      UIDiscoveryMethod,
      UILocalAS,
      UIFootprints,
      UIIpList,
      UISaltRole
    },
    conditions,
    {
      UIName: <FormattedMessage id="portal.network.podForm.name.required.error"/>,
      UILbMethod: <FormattedMessage id="portal.network.podForm.lb_method.required.error"/>,
      pod_type: <FormattedMessage id="portal.network.podForm.pod_type.required.error"/>,
      UIRequestFwdType: <FormattedMessage id="portal.network.podForm.requestForwardType.required.error"/>,
      UIProviderWeight: <FormattedMessage id="portal.network.podForm.provider_weight.required.error"/>,
      UIDiscoveryMethod: <FormattedMessage id="portal.network.podForm.discoveryMethod.required.error"/>,
      UILocalAS: <FormattedMessage id="portal.network.podForm.localAS.required.error"/>,
      UIFootprints: <FormattedMessage id="portal.network.podForm.footprints.required.error"/>,
      UISaltRole: <FormattedMessage id="portal.network.podForm.saltRole.required.error"/>
    }
  )

  //Since checkForErrors function always make sure every Field validated is required, errors has to be tweaked like this
  //for optional field to be validated
  errors.UIIpList = errors.UIIpList === 'Required' ? null : errors.UIIpList
  return errors
}

const asyncValidate = ({ UILocalAS }) => {

  if (!isInt(UILocalAS)) {
    return new Promise(() => {
      throw {
        UILocalAS: <FormattedMessage id="portal.network.podForm.localAS.asIsNotAnNumber.text"/>
      }
    })
  }

  return fetchASOverview(UILocalAS)
    .then((resp) => {
      if (!resp[0]) {
        throw {
          UILocalAS: <FormattedMessage id="portal.network.podForm.localAS.notFound.error"/>
        }
      }
    })
    .catch(() => {
      throw {
        UILocalAS: <FormattedMessage id="portal.network.podForm.localAS.notFound.error"/>
      }
    })
}

const validateCIDRToken = (item) => {
  return item.label && isValidIP(item.label)
}

/*eslint-disable react/no-multi-comp */
const renderFootprints = ({ fields, onEdit, footprintPermissions }) => (
  <ul className="footprints">
    {
      fields.map((footprint, index) =>
        <Field
          key={index}
          name={`${footprint}`}
          type="text"
          component={renderFootprint}
          onEdit={onEdit}
          footprintPermissions={footprintPermissions}
        />
      )
    }
  </ul>
)

renderFootprints.propTypes = {
  fields: PropTypes.object,
  footprintPermissions: PropTypes.object,
  onEdit: PropTypes.func
}
renderFootprints.displayName = 'renderFootprints'

/*eslint-disable react/no-multi-comp */
const renderFootprint = ({ onEdit, input }) => (
  <li className={classnames({'removed': input.value.removed})}>
    <Row>
      <Col xs={8}>
        <span>{input.value.name}</span>
      </Col>

      <Col xs={4} className="action-buttons">
        <IsAllowed to={VIEW_FOOTPRINT}>
          <Button
            className="btn btn-icon edit-button"
            onClick={() => onEdit(input.value.id)}>
            <IconEdit/>
          </Button>
        </IsAllowed>
        <IsAllowed to={DELETE_FOOTPRINT}>
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
        </IsAllowed>
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
  readOnly,
  hasNodes,
  intl,
  invalid,
  initialValues,
  onCancel,
  onDelete,
  onSave,
  submitting,
  dirty,
  footprintPermissions,
  error,
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
    if (footprint) {
      dispatch(arrayPush('pod-form', 'UIFootprints', footprint))
    }
  }

  const showFootprints = (UIDiscoveryMethod === 'footprints')
  const showBgp = (UIDiscoveryMethod === 'BGP')
  const hasFootprints = UIFootprints.length > 0 && UIFootprints.filter(fp => fp && !fp.removed || fp && fp.removed === false).length > 0

  const hasBGPRoutingDaemon = !!UIsp_bgp_router_as

  //change of method is allowed is no footprints / BGP's assigned
  const discoveryMethodChangeAllowed = showFootprints && !hasFootprints || !showFootprints && !hasBGPRoutingDaemon

  //Filter out footprints that have been added to UIFootprints
  const availableFootprints = showFootprints && footprints.filter(fp => UIFootprints.filter(item => item.id === fp.id).length === 0)
  const noFootprintsPlaceholder = availableFootprints.length === 0 ? intl.formatMessage({id: 'portal.network.podForm.footprintSearch.placeholder'}) : null

  let actionButtonTitle = edit ? <FormattedMessage id='portal.button.save' /> : <FormattedMessage id='portal.button.add' />
  if (submitting) {
    actionButtonTitle = <FormattedMessage id="portal.button.saving"/>
  }

  return (
    <form className="sp-pod-form" onSubmit={handleSubmit(onSave)}>
      {
        error &&
        <p className='has-error'>
          <span className='help-block'>{error}</span>
        </p>
      }
      <Field
        type="text"
        name="UIName"
        disabled={edit || readOnly}
        id="pod_name-field"
        placeholder={intl.formatMessage({id: 'portal.network.podForm.name.text'})}
        component={FieldFormGroup}
        label={<FormattedMessage id="portal.network.podForm.name.label" />}/>

      {edit &&
        <Field
          name="status"
          component={FieldFormGroupSelect}
          options={STATUS_OPTIONS.map(({value, label}) => {
            return { value, label: intl.formatMessage({id: label}) }
          })}
          label={<FormattedMessage id="portal.network.item.status.label" />}
          disabled={readOnly}
        />
      }

      <Field
        className="input-select"
        name="UILbMethod"
        component={FieldFormGroupSelect}
        options={LBMETHOD_OPTIONS.map(({value, label}) => {
          return { value, label: intl.formatMessage({id: label}) }
        })}
        label={intl.formatMessage({id: "portal.network.podForm.lbMethod.label"})}
        disabled={readOnly}
        addonAfter={
          <HelpTooltip
            id="tooltip-help"
            title={<FormattedMessage id="portal.network.podForm.lbMethod.help.label"/>}>
            <FormattedMessage id="portal.network.podForm.lbMethod.help.text" />
          </HelpTooltip>
        }/>

      <Field
        name="pod_type"
        className="input-select"
        component={FieldFormGroupSelect}
        options={POD_TYPE_OPTIONS.map(({value, label}) => {
          return { value, label: intl.formatMessage({id: label}) }
        })}
        label={intl.formatMessage({id: "portal.network.podForm.type.label"})}
        disabled={readOnly}
        addonAfter={
          <HelpTooltip
            id="tooltip-help"
            title={<FormattedMessage id="portal.network.podForm.type.label"/>}>
            <FormattedMessage id="portal.network.podForm.type.help.text" />
          </HelpTooltip>
        }/>

      <Field
        type="text"
        name="UILocalAS"
        className="as-num-input"
        component={FieldFormGroup}
        addonBefore={intl.formatMessage({ id: 'portal.network.spConfig.routingDaemon.editForm.as.label' })}
        label={<FormattedMessage id="portal.network.podForm.localAS.label" />}
        disabled={readOnly}
        addonAfter={
          <HelpTooltip
            id="tooltip-help"
            title={<FormattedMessage id="portal.network.podForm.localAS.help.label"/>}>
            <FormattedMessage id="portal.network.podForm.localAS.help.text" />
          </HelpTooltip>
        }/>

      <Field
        className="input-select"
        name="UIRequestFwdType"
        component={FieldFormGroupSelect}
        options={REQUEST_FWD_TYPE_OPTIONS.map(({value, label}) => {
          return { value, label: intl.formatMessage({id: label}) }
        })}
        label={intl.formatMessage({id: "portal.network.podForm.requestForwardType.label"})}
        disabled={readOnly}
        addonAfter={
          <HelpTooltip
            id="tooltip-help"
            title={<FormattedMessage id="portal.network.podForm.requestForwardType.label"/>}>
            <FormattedMessage id="portal.network.podForm.requestForwardType.help.text" />
          </HelpTooltip>
        }/>

      <Field
        min={POD_PROVIDER_WEIGHT_MIN}
        type="text"
        name="UIProviderWeight"
        id="provider_weight-field"
        component={FieldFormGroup}
        label={<FormattedMessage id="portal.network.podForm.providerWeight.label" />}
        disabled={readOnly}
        addonAfter={
          <HelpTooltip
            id="tooltip-help"
            title={<FormattedMessage id="portal.network.podForm.providerWeight.label"/>}>
            <FormattedMessage id="portal.network.podForm.providerWeight.help.text" />
          </HelpTooltip>
        }/>

      <Field
        name="UISaltRole"
        className="input-select"
        component={FieldFormGroupSelect}
        options={SALT_ROLE_OPTIONS.map(({value, label}) => ({ value, label: intl.formatMessage({id: label}) }))}
        label={<FormattedMessage id="portal.network.podForm.saltRole.label" />}
        disabled={readOnly}
      />

      <Field
        required={false}
        name="UIIpList"
        allowNew={true}
        component={FieldFormGroupTypeahead}
        multiple={true}
        options={[]}
        validation={validateCIDRToken}
        label={<FormattedMessage id="portal.network.podForm.ipList.label" />}
        disabled={readOnly}
      />

      <hr/>

      <Field
        name="UIDiscoveryMethod"
        className="input-select"
        component={FieldFormGroupSelect}
        disabled={!discoveryMethodChangeAllowed || readOnly}
        options={DISCOVERY_METHOD_OPTIONS.map(({value, label}) => {
          return { value, label: intl.formatMessage({id: label}) }
        })}
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
      <div className="discovery-section">
        <div className="clearfix">
          <label>
            <FormattedMessage id="portal.network.podForm.discoveryMethod.footprintApi.label"/>
          </label>
          <IsAllowed to={CREATE_FOOTPRINT}>
            <UDNButton bsStyle="success"
               icon={true}
               addNew={true}
               onClick={onShowFootprintModal}>
              <IconAdd/>
            </UDNButton>
          </IsAllowed>
        </div>
        {/* Footprints autocomplete */}
        <Field
          className="action-item-search search-input-group"
          component={FieldFormGroupTypeahead}
          labelKey='name'
          disabled={availableFootprints.length === 0 || readOnly}
          name="footprintSearch"
          placeholder={noFootprintsPlaceholder}
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
            onEdit: onEditFootprint,
            footprintPermissions
          }}
        />
      </div>
      }

      {/* BGP */}
      {showBgp &&
      <div className="discovery-section">
        <div className="clearfix">
          <label>
            <FormattedMessage id="portal.network.podForm.discoveryMethod.bgp.label"/>
          </label>
          <IsAllowed to={CREATE_FOOTPRINT}>
            <UDNButton bsStyle="success"
                       icon={true}
                       addNew={true}
                       disabled={hasBGPRoutingDaemon}
                       onClick={onShowRoutingDaemonModal}>
              <IconAdd/>
            </UDNButton>
          </IsAllowed>
        </div>
        {hasBGPRoutingDaemon &&
        <ul className="footprints">
          <li>
            <Row>
              <Col xs={8}>
                <span><FormattedMessage id="portal.network.spConfig.routingDaemon.editForm.as.label"/>{UIsp_bgp_router_as}</span>
              </Col>

              <Col xs={4} className="action-buttons">
                <IsAllowed to={VIEW_FOOTPRINT}>
                  <Button
                    className="btn btn-icon edit-button"
                    onClick={onShowRoutingDaemonModal}>
                    <IconEdit/>
                  </Button>
                </IsAllowed>

                <IsAllowed to={MODIFY_FOOTPRINT}>
                  <Button
                    bsStyle="link"
                    className="btn btn-icon delete-button btn-undo"
                    onClick={onDeleteRoutingDaemon}
                  >
                    <IconClose/>
                  </Button>
                </IsAllowed>
              </Col>
            </Row>
          </li>
        </ul>
        }
      </div>
      }

      <FormFooterButtons>
        {edit &&
          <IsAllowed to={DELETE_POD}>
            <ButtonDisableTooltip
              id="delete-btn"
              className="btn-danger pull-left"
              disabled={hasNodes}
              onClick={onDelete}
              tooltipId="tooltip-help"
              tooltipMessage={{text: intl.formatMessage({id: "portal.network.podForm.delete.tooltip.message"})}}>
              <FormattedMessage id="portal.button.delete"/>
            </ButtonDisableTooltip>
          </IsAllowed>
        }
        <Button
          id="cancel-btn"
          className="btn-secondary"
          onClick={onCancel}>
          <FormattedMessage id="portal.button.cancel"/>
        </Button>

        <IsAllowed to={MODIFY_POD}>
          <Button
            type="submit"
            bsStyle="primary"
            disabled={invalid || submitting || (!!asyncValidating) || (!dirty)}>
            {actionButtonTitle}
          </Button>
        </IsAllowed>
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

/* istanbul ignore next */
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
