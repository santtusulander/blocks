import React, { PropTypes } from 'react'
import { Field, reduxForm, propTypes as reduxFormPropTypes } from 'redux-form'
import { Button, ButtonToolbar } from 'react-bootstrap'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'

import { checkForErrors } from '../../../util/helpers'
import { isInt } from '../../../util/validators'

import FieldFormGroup from '../../form/field-form-group'
import FieldFormGroupSelect from '../../form/field-form-group-select.jsx'
import FieldFormGroupNumber from '../../form/field-form-group-number.jsx'
import FormFooterButtons from '../../form/form-footer-buttons'

const validate = fields => {
  const { name, locationId, popId } = fields

  const customConditions = {
    name: {
      condition: !(name.length > 0),
      errorText: <FormattedMessage id='portal.network.popEditForm.popName.validation.error.text'/>
    },
    locationId: {
      condition: !locationId,
      errorText: <FormattedMessage id='portal.network.popEditForm.locationId.validation.error.text'/>
    },
    popId: {
      condition: !(isInt(popId) && (parseInt(popId) >= 0)),
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
    edit,
    fetching,
    intl,
    onCancel,
    invalid,
    submitting,
    onSave,
    popId,
    locationId,
    onDelete,
    initialValues
  } = props

  const actionButtonTitle = fetching ? <FormattedMessage id="portal.button.saving"/> :
                            edit ? <FormattedMessage id="portal.button.save"/> :
                            <FormattedMessage id="portal.button.add"/>

  return (
      <form onSubmit={props.handleSubmit(onSave)}>
        <Field
          type="text"
          name="name"
          placeholder={intl.formatMessage({id: 'portal.network.popEditForm.popName.placeholder'})}
          component={FieldFormGroup}
          label={<FormattedMessage id="portal.network.popEditForm.popName.label" />} />

        <hr />

        <Field
          name="locationId"
          component={FieldFormGroupSelect}
          options={initialValues.locationOptions}
          label={<FormattedMessage id="portal.network.popEditForm.locationId.label" />} />

        <hr/>

        {locationId
            ? <Field
                name="popId"
                component={FieldFormGroupNumber}
                addonBefore={`${locationId}${popId}`}
                label={<FormattedMessage id="portal.network.popEditForm.popId.label" />} />
            : <p><FormattedMessage id="portal.network.popEditForm.popId.selectLocation.text" /></p>
        }

        <hr/>

        <FormFooterButtons autoAlign={false}>
          { edit &&
            <ButtonToolbar className="pull-left">
              <Button
                id="delete-btn"
                className="btn-danger"
                disabled={submitting || fetching}
                onClick={onDelete}>
                {fetching ? <FormattedMessage id="portal.button.deleting"/>  : <FormattedMessage id="portal.button.delete"/>
                }
              </Button>
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
              disabled={invalid || submitting || fetching}>
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
  intl: intlShape,
  locationId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
  onSave: PropTypes.func,
  popId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  ...reduxFormPropTypes
}

export const POP_FORM_NAME = 'networkPopEditForm'
export default reduxForm({
  form: POP_FORM_NAME,
  validate
})(injectIntl(NetworkPopForm))
