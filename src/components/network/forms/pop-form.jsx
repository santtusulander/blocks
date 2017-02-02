import React, { PropTypes } from 'react'
import { Field, reduxForm, propTypes as reduxFormPropTypes } from 'redux-form'
import { Button, ButtonToolbar } from 'react-bootstrap'
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

import { POP_ID_MIN, POP_ID_MAX } from '../../../constants/network.js'

const validate = fields => {
  const { name, locationId, popId } = fields

  const customConditions = {
    name: {
      condition: !isValidTextField(name),
      errorText: <MultilineTextFieldError fieldLabel="portal.common.name" />
    },
    locationId: {
      condition: !locationId,
      errorText: <FormattedMessage id='portal.network.popEditForm.locationId.validation.error.text'/>
    },
    popId: {
      condition: !isInt(popId),
      errorText:<FormattedMessage id="portal.network.popEditForm.popId.validation.error.text"/>
    }
  }

  const requiredTexts = {
    name: <FormattedMessage id='portal.network.popEditForm.popName.validation.required.text'/>,
    locationId: <FormattedMessage id='portal.network.popEditForm.locationId.validation.required.text'/>,
    popId: <FormattedMessage id='portal.network.popEditForm.popId.validation.required.text'/>
  }

  return checkForErrors(fields, customConditions, requiredTexts)
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
    dirty

  } = props

  const edit = !!initialValues.id

  const actionButtonTitle = submitting ? <FormattedMessage id="portal.button.saving"/> :
                            edit ? <FormattedMessage id="portal.button.save"/> :
                            <FormattedMessage id="portal.button.add"/>

  return (
      <form onSubmit={props.handleSubmit(onSave)}>

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
          label={<FormattedMessage id="portal.network.popEditForm.popName.label" />} />

        <hr />

        <Field
          name="iata"
          component={FieldFormGroupSelect}
          options={initialValues.locationOptions}
          label={<FormattedMessage id="portal.network.popEditForm.locationId.label" />} />

        <hr/>

        {iata
            ? <Field
                name="locationId"
                component={FieldFormGroupNumber}
                addonBefore={`${iata}`}
                min={POP_ID_MIN}
                max={POP_ID_MAX}
                label={<FormattedMessage id="portal.network.popEditForm.popId.label" />}
              />
            : <p><FormattedMessage id="portal.network.popEditForm.popId.selectLocation.text" /></p>
        }

        <hr/>

        <FormFooterButtons autoAlign={false}>
          { edit &&
            <ButtonToolbar className="pull-left">
              <ButtonDisableTooltip
                id="delete-btn"
                className="btn-danger"
                disabled={hasPods}
                onClick={onDelete}
                tooltipId="tooltip-help"
                tooltipMessage={{text :intl.formatMessage({id: "portal.network.popEditForm.delete.tooltip.message"})}}>
                {
                  //TODO: delete modal with confirm
                  submitting ? <FormattedMessage id="portal.button.deleting"/>  : <FormattedMessage id="portal.button.delete"/>
                }
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
              disabled={invalid || submitting || (!dirty)}>
              {actionButtonTitle}
            </Button>
          </ButtonToolbar>
        </FormFooterButtons>
      </form>
  )
}

NetworkPopForm.displayName = 'NetworkPopEditForm'
NetworkPopForm.propTypes = {
  edit: PropTypes.bool,
  fetching: PropTypes.bool,
  hasPods: PropTypes.bool,
  iata: PropTypes.string,
  intl: intlShape,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
  onSave: PropTypes.func,
  popId: PropTypes.string,

  ...reduxFormPropTypes
}

export const POP_FORM_NAME = 'networkPopEditForm'
export default reduxForm({
  form: POP_FORM_NAME,
  validate
})(injectIntl(NetworkPopForm))
