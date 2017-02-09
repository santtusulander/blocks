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

import { POP_ID_MIN, POP_ID_MAX } from '../../../constants/network.js'

const validate = ({ name, locationId, id }) => {

  const customConditions = {
    name: {
      condition: !isValidTextField(name),
      errorText: <MultilineTextFieldError fieldLabel="portal.common.name" />
    },
    locationId: {
      condition: !locationId,
      errorText: <FormattedMessage id='portal.network.popEditForm.locationId.validation.error.text'/>
    },
    id: {
      condition: !isInt(id),
      errorText:<FormattedMessage id="portal.network.popEditForm.popId.validation.error.text"/>
    }
  }

  const requiredTexts = {
    name: <FormattedMessage id='portal.network.popEditForm.popName.validation.required.text'/>,
    locationId: <FormattedMessage id='portal.network.popEditForm.locationId.validation.required.text'/>,
    id: <FormattedMessage id='portal.network.popEditForm.popId.validation.required.text'/>
  }

  return checkForErrors({ name, locationId, id }, customConditions, requiredTexts)
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
      <form className="sp-pop-form" onSubmit={props.handleSubmit(onSave)}>

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

        <Field
          name="locationId"
          className="input-select"
          component={FieldFormGroupSelect}
          disabled={edit}
          options={initialValues.locationOptions}
          label={<FormattedMessage id="portal.network.popEditForm.locationId.label" />} />

        {iata
          ? <Field
              name="id"
              component={FieldFormGroupNumber}
              disabled={edit}
              addonBefore={`${iata}`}
              min={POP_ID_MIN}
              max={POP_ID_MAX}
              label={<FormattedMessage id="portal.network.popEditForm.popId.label" />}
            />
          : <p><FormattedMessage id="portal.network.popEditForm.popId.selectLocation.text" /></p>
        }

        <FormFooterButtons>
          { edit &&
            <ButtonDisableTooltip
              id="delete-btn"
              className="btn-danger pull-left"
              disabled={hasPods}
              onClick={onDelete}
              tooltipId="tooltip-help"
              tooltipMessage={{text :intl.formatMessage({id: "portal.network.popEditForm.delete.tooltip.message"})}}>
              {
                //TODO: delete modal with confirm
                submitting ? <FormattedMessage id="portal.button.deleting"/>  : <FormattedMessage id="portal.button.delete"/>
              }
            </ButtonDisableTooltip>
          }

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

  ...reduxFormPropTypes
}

export const POP_FORM_NAME = 'networkPopEditForm'
export default reduxForm({
  form: POP_FORM_NAME,
  validate
})(injectIntl(NetworkPopForm))
