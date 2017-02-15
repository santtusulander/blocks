import React, { PropTypes } from 'react'
import { reduxForm, Field, propTypes as reduxFormPropTypes } from 'redux-form'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { Button } from 'react-bootstrap'

import FieldFormGroup from '../../form/field-form-group'
import FormFooterButtons from '../../form/form-footer-buttons'
import ButtonDisableTooltip from '../../../components/button-disable-tooltip'
import MultilineTextFieldError from '../../shared/forms/multiline-text-field-error'

import { checkForErrors } from '../../../util/helpers'
import { isValidTextField } from '../../../util/validators'

import { FORM_DESCRIPTION_FIELD_MIN_LEN, FORM_DESCRIPTION_FIELD_MAX_LEN } from '../../../constants/common'

const validate = ({ name, description }) => {
  const conditions = {
    name: {
      condition: !isValidTextField(name),
      errorText: <MultilineTextFieldError fieldLabel="portal.common.name" />
    },
    description: {
      condition: !isValidTextField(description, FORM_DESCRIPTION_FIELD_MIN_LEN, FORM_DESCRIPTION_FIELD_MAX_LEN),
      errorText: <MultilineTextFieldError fieldLabel="portal.common.description"
                                          minValue={FORM_DESCRIPTION_FIELD_MIN_LEN}
                                          maxValue={FORM_DESCRIPTION_FIELD_MAX_LEN} />
    }
  }
  return checkForErrors(
    { name, description },
    conditions,
    { name: <FormattedMessage id="portal.network.networkForm.name.required.error"/>,
      description: <FormattedMessage id="portal.network.networkForm.description.required.error"/> }
  )
}

const NetworkForm = ({ error, submitting, handleSubmit, intl, initialValues, isFetching, invalid, hasPops, onCancel, onSave, onDelete }) => {
  const deleteButtonDisabled = isFetching ? true : hasPops
  //simple way to check if editing -> no need to pass 'edit' - prop
  const edit = !!initialValues.name

  const actionButtonTitle = submitting ? <FormattedMessage id="portal.button.saving"/> :
                            edit ? <FormattedMessage id="portal.button.save"/> :
                            <FormattedMessage id="portal.button.add"/>


  return (
    <form className="sp-network-form" onSubmit={handleSubmit(onSave)}>

      { //This block will be shown when SubmissionError has been thrown form async call
        error &&
        <p className='has-error'>
          <span className='help-block'>{error}</span>
        </p>
      }

      <Field
        name="name"
        placeholder={intl.formatMessage({id: 'portal.network.networkForm.name.placeholder'})}
        component={FieldFormGroup}
        label={<FormattedMessage id="portal.common.name" />}
        disabled={edit ? true : false}
        required={edit ? false : true} />

      <Field
        name="description"
        placeholder={intl.formatMessage({id: 'portal.network.networkForm.description.placeholder'})}
        component={FieldFormGroup}
        label={<FormattedMessage id="portal.common.description" />} />

      <FormFooterButtons>
        { edit &&
          <ButtonDisableTooltip
            id="delete-btn"
            className="btn-danger pull-left"
            disabled={deleteButtonDisabled}
            onClick={handleSubmit(() => onDelete(initialValues.name))}
            tooltipId="tooltip-help"
            tooltipMessage={{text :intl.formatMessage({id: "portal.network.networkForm.delete.tooltip.message"})}}>
            {
              //Commented out: as submitting is also true when 'saving'.
              //Should show DELETE -modal and ask for confirmation
              //submitting ? <FormattedMessage id="portal.button.deleting"/>  :
            }
            <FormattedMessage id="portal.button.delete"/>
          </ButtonDisableTooltip>
        }
        <Button
          className="btn-secondary"
          onClick={onCancel}>
          <FormattedMessage id="portal.button.cancel"/>
        </Button>

        <Button
          type="submit"
          bsStyle="primary"
          disabled={invalid || submitting}>
          {actionButtonTitle}
        </Button>
      </FormFooterButtons>
    </form>
  )
}

NetworkForm.displayName = "NetworkForm"

NetworkForm.propTypes = {
  edit: PropTypes.bool,
  fetching: PropTypes.bool,
  handleSubmit: PropTypes.func,
  hasPops: PropTypes.bool,
  intl: intlShape.isRequired,
  invalid: PropTypes.bool,
  isFetching: PropTypes.bool,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
  onSave: PropTypes.func,
  ...reduxFormPropTypes
}

export default reduxForm({
  form: 'networkForm',
  validate
})(injectIntl(NetworkForm))
