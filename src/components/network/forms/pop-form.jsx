import React, { PropTypes } from 'react'
import { Field, reduxForm, propTypes as reduxFormPropTypes } from 'redux-form'
import { Button } from 'react-bootstrap'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'

import { checkForErrors } from '../../../util/helpers'
import { isValidTextField } from '../../../util/validators'
import { isInt } from '../../../util/validators'

import FieldFormGroup from '../../form/field-form-group'
import FormFooterButtons from '../../form/form-footer-buttons'
import ButtonDisableTooltip from '../../../components/button-disable-tooltip'
import FieldFormGroupSelect from '../../form/field-form-group-select'
import FieldFormGroupNumber from '../../form/field-form-group-number'
import MultilineTextFieldError from '../../shared/forms/multiline-text-field-error'
import IsAllowed from '../../is-allowed'

import { DELETE_POP, MODIFY_POP } from '../../../constants/permissions'
import { POP_ID_MIN, POP_ID_MAX, STATUS_OPTIONS } from '../../../constants/network.js'

const validate = ({ name, billing_region, locationId, id }) => {

  const customConditions = {
    name: {
      condition: !isValidTextField(name),
      errorText: <MultilineTextFieldError fieldLabel="portal.common.name" />
    },
    billing_region: {
      condition: !billing_region,
      errorText: <FormattedMessage id='portal.network.popEditForm.billing_region.validation.error.text'/>
    },
    locationId: {
      condition: !locationId,
      errorText: <FormattedMessage id='portal.network.popEditForm.locationId.validation.error.text'/>
    },
    id: {
      condition: !isInt(id),
      errorText: <FormattedMessage id="portal.network.popEditForm.popId.validation.error.text"/>
    }
  }

  const requiredTexts = {
    name: <FormattedMessage id='portal.network.popEditForm.popName.validation.required.text'/>,
    billing_region: <FormattedMessage id='portal.network.popEditForm.billing_region.validation.required.text'/>,
    locationId: <FormattedMessage id='portal.network.popEditForm.locationId.validation.required.text'/>,
    id: <FormattedMessage id='portal.network.popEditForm.popId.validation.required.text'/>
  }

  return checkForErrors({ name, locationId, billing_region, id }, customConditions, requiredTexts)
}

const NetworkPopForm = (props) => {
  const {
    intl,
    error,
    onCancel,
    invalid,
    submitting,
    onSave,
    iata,
    onDelete,
    initialValues,
    hasPods,
    dirty,
    handleSubmit,
    readOnly
  } = props

  const edit = !!initialValues.id
  const actionButtonTitle = submitting ? <FormattedMessage id="portal.button.saving"/> :
                            edit ? <FormattedMessage id="portal.button.save"/> :
                            <FormattedMessage id="portal.button.add"/>

  return (
      <form className="sp-pop-form" onSubmit={handleSubmit(onSave)}>

        { //This block will be shown when SubmissionError has been thrown form async call
          error &&
          <p className='has-error'>
            <span className='help-block'>{error}</span>
          </p>
        }

        <Field
          type="text"
          name="name"
          placeholder={intl.formatMessage({id: 'portal.network.popEditForm.popName.placeholder'})}
          component={FieldFormGroup}
          label={<FormattedMessage id="portal.network.popEditForm.popName.label" />}
          disabled={readOnly} />

        {edit &&
          <Field
            name="status"
            component={FieldFormGroupSelect}
            options={STATUS_OPTIONS.map(({value, label}) => { return { value, label: intl.formatMessage({id: label}) }})}
            label={<FormattedMessage id="portal.network.item.status.label" />}
            disabled={readOnly}
          />
        }

        <Field
          name="billing_region"
          className="input-select"
          component={FieldFormGroupSelect}
          options={initialValues.billingRegionOptions}
          label={<FormattedMessage id="portal.network.popEditForm.billing_region.label" />}
          disabled={readOnly} />

        <Field
          name="locationId"
          className="input-select"
          component={FieldFormGroupSelect}
          disabled={edit || readOnly}
          options={initialValues.locationOptions}
          label={<FormattedMessage id="portal.network.popEditForm.locationId.label" />} />

        {iata
          ? <Field
              name="id"
              component={FieldFormGroupNumber}
              disabled={edit || readOnly}
              addonBefore={`${iata}`}
              min={POP_ID_MIN}
              max={POP_ID_MAX}
              label={<FormattedMessage id="portal.network.popEditForm.popId.label" />}
            />
          : <p><FormattedMessage id="portal.network.popEditForm.popId.selectLocation.text" /></p>
        }

        <FormFooterButtons>
          { edit &&
            <IsAllowed to={DELETE_POP}>
              <ButtonDisableTooltip
                id="delete-btn"
                className="btn-danger pull-left"
                disabled={hasPods}
                onClick={onDelete}
                tooltipId="tooltip-help"
                tooltipMessage={{text: intl.formatMessage({id: "portal.network.popEditForm.delete.tooltip.message"})}}>
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

          <IsAllowed to={MODIFY_POP}>
            <Button
              type="submit"
              bsStyle="primary"
              disabled={invalid || submitting || (!dirty)}>
              {actionButtonTitle}
            </Button>
          </IsAllowed>
        </FormFooterButtons>
      </form>
  )
}

NetworkPopForm.displayName = 'NetworkPopEditForm'
NetworkPopForm.propTypes = {
  fetching: PropTypes.bool,
  hasPods: PropTypes.bool,
  iata: PropTypes.string,
  intl: intlShape,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
  onSave: PropTypes.func,
  popId: PropTypes.string,
  readOnly: PropTypes.bool,

  ...reduxFormPropTypes
}

export const POP_FORM_NAME = 'networkPopEditForm'
export default reduxForm({
  form: POP_FORM_NAME,
  validate
})(injectIntl(NetworkPopForm))
