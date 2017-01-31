import React, { PropTypes } from 'react'
import { reduxForm, Field } from 'redux-form'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { Button, ButtonToolbar } from 'react-bootstrap'

import FieldFormGroup from '../../form/field-form-group'
import FormFooterButtons from '../../form/form-footer-buttons'
import ButtonDisableTooltip from '../../../components/button-disable-tooltip'
import MultilineTextFieldError from '../../shared/forms/multiline-text-field-error'

import { checkForErrors } from '../../../util/helpers'
import { isValidTextField } from '../../../util/validators'

import { FORMS_DESCRIPTION_MIN_LEN, FORMS_DESCRIPTION_MAX_LEN } from '../../../constants/network'

const validate = ({ name, description }) => {
  const conditions = {
    name: {
      condition: !isValidTextField(name),
      errorText: <MultilineTextFieldError fieldLabel="portal.common.name" />
    },
    description: {
      condition: !isValidTextField(description, FORMS_DESCRIPTION_MIN_LEN, FORMS_DESCRIPTION_MAX_LEN),
      errorText: <MultilineTextFieldError fieldLabel="portal.common.description"
                                          minValue={FORMS_DESCRIPTION_MIN_LEN}
                                          maxValue={FORMS_DESCRIPTION_MAX_LEN} />
    }
  }
  return checkForErrors(
    { name, description },
    conditions,
    { name: <FormattedMessage id="portal.network.networkForm.name.required.error"/>,
      description: <FormattedMessage id="portal.network.networkForm.description.required.error"/> }
  )
}

const NetworkForm = ({ edit, fetching, handleSubmit, intl, invalid, hasPops, onCancel, onSave, onDelete }) => {

  const actionButtonTitle = fetching ? <FormattedMessage id="portal.button.saving"/> :
                            edit ? <FormattedMessage id="portal.button.save"/> :
                            <FormattedMessage id="portal.button.add"/>

  return (
    <form
      onSubmit={handleSubmit(onSave)}>
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

      <FormFooterButtons autoAlign={false}>
        { edit &&
          <ButtonToolbar className="pull-left">
            <ButtonDisableTooltip
              id="delete-btn"
              className="btn-danger"
              disabled={hasPops}
              onClick={onDelete}
              tooltipId="tooltip-help"
              tooltipMessage={{text :intl.formatMessage({id: "portal.network.networkForm.delete.tooltip.message"})}}>
              {fetching ? <FormattedMessage id="portal.button.deleting"/>  : <FormattedMessage id="portal.button.delete"/>}
            </ButtonDisableTooltip>
          </ButtonToolbar>
        }
        <ButtonToolbar className="pull-right">
          <Button
            className="btn-secondary"
            onClick={onCancel}>
            <FormattedMessage id="portal.button.cancel"/>
          </Button>

          <Button
            type="submit"
            bsStyle="primary"
            disabled={invalid || fetching}>
            {actionButtonTitle}
          </Button>
        </ButtonToolbar>
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
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
  onSave: PropTypes.func
}

export default reduxForm({
  form: 'networkForm',
  validate
})(injectIntl(NetworkForm))
