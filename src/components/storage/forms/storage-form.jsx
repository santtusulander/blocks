import React, { PropTypes } from 'react'
import { reduxForm, Field, change, propTypes as reduxFormPropTypes } from 'redux-form'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { Button } from 'react-bootstrap'

import HelpTooltip from '../../help-tooltip'
import FieldFormGroup from '../../form/field-form-group'
import FieldFormGroupSelect from '../../form/field-form-group-select'
import FieldFormGroupToggle from '../../form/field-form-group-toggle'
import FieldFormGroupNumber from '../../form/field-form-group-number'
import FormFooterButtons from '../../form/form-footer-buttons'
import FieldFormGroupMultiOptionSelector from '../../form/field-form-group-multi-option-selector'

import { checkForErrors, formatBytes, separateUnit } from '../../../util/helpers'
import { isValidStorageName, isValidEstimatedUsage } from '../../../util/validators'
import { STORAGE_ESTIMATE_UNITS,  STORAGE_ESTIMATE_UNITS_DEFAULT,
         STORAGE_ESTIMATE_DEFAULT, STORAGE_ABR_DEFAULT,
         STORAGE_ESTIMATE_MIN } from '../../../constants/storage'

const validate = ({ name, locations, estimate, estimate_unit, abr, abrProfile }) => {
  const conditions = {
    name: {
      condition: !isValidStorageName(name),
      errorText: <FormattedMessage id="portal.storage.storageForm.name.validation.error" />
    },
    estimate: {
      condition: !isValidEstimatedUsage(estimate),
      errorText: <FormattedMessage id="portal.storage.storageForm.estimate.validation.error" />
    }
  }

  return checkForErrors({ name, locations, estimate, estimate_unit, abr, abrProfile }, conditions, {
    name: <FormattedMessage id="portal.storage.storageForm.name.required.error"/>,
    locations: <FormattedMessage id="portal.storage.storageForm.locations.required.error"/>,
    estimate: <FormattedMessage id="portal.storage.storageForm.estimate.required.error"/>,
    abr: <FormattedMessage id="portal.storage.storageForm.abr.required.error"/>,
    abrProfile: <FormattedMessage id="portal.storage.storageForm.abrProfile.required.error"/>
  })
}

class StorageForm extends React.Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { initialValues, dispatch } = this.props
    const edit = !!initialValues.name
    const estimate = separateUnit(formatBytes(initialValues.estimate, undefined, "0"))

    if (!edit) {
      dispatch(change('storageForm', 'abr', STORAGE_ABR_DEFAULT))
      dispatch(change('storageForm', 'estimate', STORAGE_ESTIMATE_DEFAULT))
      dispatch(change('storageForm', 'estimate_unit', STORAGE_ESTIMATE_UNITS_DEFAULT))
    } else {
      dispatch(change('storageForm', 'estimate', estimate.value))
      dispatch(change('storageForm', 'estimate_unit', estimate.unit.toLowerCase()))
    }
  }

  render() {
    const { error, submitting, handleSubmit, intl, initialValues, abrProfileOptions, dirty,
            invalid, onCancel, onSave, onDelete, abrToggle, locationOptions } = this.props

    const edit = !!initialValues.name

    const actionButtonTitle = submitting ? <FormattedMessage id="portal.button.saving"/> :
                              edit ? <FormattedMessage id="portal.button.save"/> :
                              <FormattedMessage id="portal.button.add"/>


    return (
      <form className="storage-form" onSubmit={handleSubmit(onSave)}>

        { //This block will be shown when SubmissionError has been thrown form async call
          error &&
          <p className='has-error'>
            <span className='help-block'>{error}</span>
          </p>
        }

        <Field
          className="name-field"
          name="name"
          placeholder={intl.formatMessage({id: 'portal.storage.storageForm.name.placeholder'})}
          component={FieldFormGroup}
          label={<FormattedMessage id="portal.common.name" />}
          disabled={edit ? true : false}
          required={edit ? false : true}
        />

        <Field
          className="multi-option-selector-fields"
          name="locations"
          component={FieldFormGroupMultiOptionSelector}
          options={locationOptions}
          label={<FormattedMessage id="portal.storage.storageForm.locations.label" />}
          disabled={edit ? true : false}
          required={edit ? false : true}
          addonAfterLabel={
            <HelpTooltip
              id="tooltip-help"
              title={<FormattedMessage id="portal.storage.storageForm.locations.help.label"/>}>
              <FormattedMessage id="portal.storage.storageForm.locations.help.text" />
            </HelpTooltip>
          }
        />

        <div className="estimate-field-group">
          <Field
            className="estimate-field"
            name="estimate"
            min={STORAGE_ESTIMATE_MIN}
            component={FieldFormGroupNumber}
            label={<FormattedMessage id="portal.storage.storageForm.estimate.label" />}
            addonAfterLabel={
              <HelpTooltip
                id="tooltip-help"
                title={<FormattedMessage id="portal.storage.storageForm.estimate.help.label"/>}>
                <FormattedMessage id="portal.storage.storageForm.estimate.help.text" />
              </HelpTooltip>
            }
          />

          <Field
            className="unit-field"
            name="estimate_unit"
            component={FieldFormGroupSelect}
            options={STORAGE_ESTIMATE_UNITS}
          />
        </div>

        <Field
          name="abr"
          className="abr-field"
          component={FieldFormGroupToggle}
          label={<FormattedMessage id="portal.storage.storageForm.abr.label" />}
          readonly={edit ? true : false}
          required={edit ? false : true}
          addonAfterLabel={
            <HelpTooltip
              id="tooltip-help"
              title={<FormattedMessage id="portal.storage.storageForm.abrProfile.help.label"/>}>
              <FormattedMessage id="portal.storage.storageForm.abrProfile.help.text" />
            </HelpTooltip>
          }
        />

        {abrToggle &&
          <Field
            name="abrProfile"
            className="abr-profile-field"
            component={FieldFormGroupSelect}
            emptyLabel={<FormattedMessage id="portal.storage.storageForm.abrProfile.placeholder" />}
            options={abrProfileOptions}
            disabled={edit ? true : false}
            required={edit ? false : true}
          />
        }

        <FormFooterButtons>
          { edit &&
            <Button
              id="delete-btn"
              className="btn-danger pull-left"
              onClick={handleSubmit(() => onDelete(initialValues.name))}
            >
              <FormattedMessage id="portal.button.delete"/>
            </Button>
          }
          <Button
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
}

StorageForm.displayName = "StorageForm"

StorageForm.propTypes = {
  abrProfileOptions: PropTypes.array,
  abrToggle: PropTypes.bool,
  fetching: PropTypes.bool,
  intl: intlShape.isRequired,
  invalid: PropTypes.bool,
  locationOptions: PropTypes.array,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
  onSave: PropTypes.func,
  ...reduxFormPropTypes
}

export default reduxForm({
  form: 'storageForm',
  validate
})(injectIntl(StorageForm))
