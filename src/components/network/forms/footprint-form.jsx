import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector, propTypes as reduxFormPropTypes } from 'redux-form'
import { Button, ControlLabel, InputGroup } from 'react-bootstrap'
import { FormattedMessage, injectIntl } from 'react-intl'
import Papa from 'papaparse'
import _ from 'lodash'

import UDNButton from '../../button'
import IconAdd from '../../icons/icon-add'
import FieldRadio from '../../form/field-radio'
import FieldFormGroup from '../../form/field-form-group'
import FieldFormGroupSelect from '../../form/field-form-group-select'
import FieldFormGroupTypeahead from '../../form/field-form-group-typeahead'
import FieldFormGroupAsnLookup from '../../form/field-form-group-asn-lookup'
import FormFooterButtons from '../../form/form-footer-buttons'
import HelpTooltip from '../../../components/help-tooltip'
import IsAllowed from '../../is-allowed'
import MultilineTextFieldError from '../../shared/forms/multiline-text-field-error'

import { isValidFootprintTextField, isValidFootprintDescription , isValidIPv4Address, isValidASN } from '../../../util/validators'
import { checkForErrors } from '../../../util/helpers'
import CsvUploadArea from '../csv-upload'

import { MODIFY_FOOTPRINT } from '../../../constants/permissions'
import { FORM_TEXT_FIELD_DEFAULT_MIN_LEN,
         FORM_FOOTPRINT_TEXT_FIELD_MAX_LEN,
         FORM_FOOTPRINT_DESCRIPTION_FIELD_MIN_LEN,
         FORM_FOOTPRINT_DESCRIPTION_FIELD_MAX_LEN
         } from '../../../constants/common'

import { FOOTPRINT_FILE_TYPES, FOOTPRINT_FIELDS_NAME,
         FOOTPRINT_UND_TYPES_VALUES, FOOTPRINT_CSV_TEMPLATE_PATH
         } from '../../../constants/network'

const validateCIDRToken = (item) => {
  return item.label && isValidIPv4Address(item.label, true)
}

const validateASNToken = (item) => {
  return item.label && isValidASN(item.label)
}

const validate = ({ name, description, data_type, value_ipv4cidr, value_asnlist, udn_type }) => {

  const valueValidationTranslationId = data_type === 'ipv4cidr' ? 'portal.network.footprintForm.CIRD.required.text' : 'portal.network.footprintForm.ASN.required.text'
  const conditions = {
    name: {
      condition: !isValidFootprintTextField(name),
      errorText: <MultilineTextFieldError
                    fieldLabel="portal.network.footprintForm.name.invalid.text"
                    customValidationErrorText="portal.common.textFieldMultilineValidation.allowedSpecialChars.limited"
                    minValue={FORM_TEXT_FIELD_DEFAULT_MIN_LEN}
                    maxValue={FORM_FOOTPRINT_TEXT_FIELD_MAX_LEN}
                    />
    }
  }

  if (data_type === 'ipv4cidr' && value_ipv4cidr && value_ipv4cidr.length > 0) {
    let hasInvalidCIDRItems = false
    value_ipv4cidr.forEach((cidrItem) => {
      if (!validateCIDRToken(cidrItem)) {
        hasInvalidCIDRItems = true
      }
    })

    conditions.value_ipv4cidr = [
      {
        condition: hasInvalidCIDRItems,
        errorText: <FormattedMessage id="portal.network.footprintForm.CIRD.invalid.text"/>
      }
    ]
  }

  const errors = checkForErrors(
    { name, data_type, udn_type, value_ipv4cidr, value_asnlist },
    conditions,
    {
      name: <FormattedMessage id="portal.network.footprintForm.name.required.text"/>,
      [`value_${data_type}`]: <FormattedMessage id={valueValidationTranslationId}/>
    }
  )

  /* TODO, refactor checkForErrors, so field which not required still able to check for conditions
     UDNP-2772 Validation function does not support validation for optional fields */
  if(description && !isValidFootprintDescription(description)) {
    errors.description = (
      <MultilineTextFieldError
        fieldLabel="portal.common.description"
        customValidationErrorText="portal.common.textFieldMultilineValidation.allowedSpecialChars.all"
        minValue={FORM_FOOTPRINT_DESCRIPTION_FIELD_MIN_LEN}
        maxValue={FORM_FOOTPRINT_DESCRIPTION_FIELD_MAX_LEN}
      />
    )
  }

  return errors
}

class FootprintForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = { csvValues: {} }
    this.onDropComplete = this.onDropComplete.bind(this)
    this.validateCSV = this.validateCSV.bind(this)
    this.renderFileUpload = this.renderFileUpload.bind(this)
    this.onShowFileUploadDialog = this.onShowFileUploadDialog.bind(this)
  }

  validateCSV(file, cb) {
    Papa.parse(file, {complete: ({data, errors}) => {

      // Assume that file conten is invalid to avoide code duplication
      file.isFileContentValid = false

      if (errors.length > 0) {
        return cb(file, false)
      }

      // data[0] - CSV keys
      // data[1] - CSV data

      if (!(_.isEqual(data[0], FOOTPRINT_FIELDS_NAME))) {
        return cb(file)
      }

      // Validate footprint name
      const name = data[1][0]
      if (!(isValidFootprintTextField(name))) {
        return cb(file)
      }

      // Validate footprint description
      const description = data[1][1]
      if (!(isValidFootprintDescription(description))) {
        return cb(file)
      }

      // Validata data type
      const data_type = data[1][2]
      if ((data_type !== 'ipv4cidr') &&
          (data_type !== 'asnlist')) {
        return cb(file)
      }

      // Validate data
      const values = data[1][3].split(',')
      if (!(values && values.length > 0)) {
        return cb(file)
      }

      let hasInvalidItems = false
      values.forEach((item) => {
        if (data_type === 'ipv4cidr') {
          if (!validateCIDRToken(item)) {
            hasInvalidItems = true
          }
        } else {
          if (!validateASNToken(item)) {
            hasInvalidItems = true
          }
        }
      })

      if (!(hasInvalidItems)) {
        return cb(file)
      }

      // Validate UDN type
      const udn_type = data[1][4]
      if ((FOOTPRINT_UND_TYPES_VALUES[0] !== udn_type) &&
          (FOOTPRINT_UND_TYPES_VALUES[1] !== udn_type) &&
          (FOOTPRINT_UND_TYPES_VALUES[2] !== udn_type)) {
        return cb(file)
      }

      file.isFileContentValid = true
      this.setState({ csvValues: {
        name, description, data_type,
        value: values, udn_type
      }})
      return cb(file)
    }})

    return true
  }

  onDropComplete(validatedFiles, rejectedFiles) {
    if (rejectedFiles.length || (!validatedFiles.length)) {
      this.props.showNotification(<FormattedMessage id="portal.network.footprintForm.file.invalid.text" />)
      this.setState({ csvValues: {} })
      return
    }
  }

  onShowFileUploadDialog() {
    // Should simulate click on file upload area to open upload dialog
    const areaSelector = document.querySelector(".filedrop-area")
    areaSelector.click()
  }

  renderFileUpload() {
    const templateLink = _.isEmpty(this.state.csvValues) ? (
      <div className="template-link">
        <a href={FOOTPRINT_CSV_TEMPLATE_PATH} download={true}>
          <FormattedMessage id="portal.network.footprintForm.file.download.text"/>
        </a>
      </div>
    ) : null

    return (
      <div className="csv-upload">
        <div className="upload-header">
          <ControlLabel><FormattedMessage id="portal.network.footprintForm.file.label"/></ControlLabel>
          <InputGroup.Addon>
            <HelpTooltip
              placement="bottom"
              id="tooltip-help"
              title={<FormattedMessage id="portal.network.footprintForm.file.help.label"/>}>
              <FormattedMessage id="portal.network.footprintForm.file.help.text" />
            </HelpTooltip>
          </InputGroup.Addon>

          <span className="pull-right">
            <UDNButton bsStyle="success"
                       icon={true}
                       addNew={true}
                       onClick={this.onShowFileUploadDialog}
                       disabled={!(_.isEmpty(this.state.csvValues))}>
              <IconAdd/>
            </UDNButton>
          </span>
        </div>

        <CsvUploadArea
          asyncValidation={true}
          acceptFileTypes={FOOTPRINT_FILE_TYPES}
          contentValidation={this.validateCSV}
          multiple={false}
          uploadModalOnClick={true}
          onDropCompleted={this.onDropComplete}
          onDeleteCompleted={() => { this.setState({ csvValues: {} }) }}/>

        { templateLink }
      </div>
    )
  }

  render() {
    const {
      addFootprintMethod,
      dataType,
      editing,
      fetching,
      handleSubmit,
      intl,
      invalid,
      onCancel,
      onSave,
      onCSVSave,
      submitting,
      udnTypeOptions
    } = this.props

    const submitButtonLabel = editing
      ? <FormattedMessage id="portal.button.save"/>
      : <FormattedMessage id="portal.button.add"/>

    const filteredUdnTypeOptions = dataType === 'ipv4cidr' ? udnTypeOptions.filter(({value}) => !value.includes('asn')) : udnTypeOptions

    return (
      <form className="sp-footprint-form" onSubmit={(addFootprintMethod === 'manual') ? handleSubmit(onSave) : handleSubmit(() => onCSVSave(this.state.csvValues))}>
          <span className='submit-error'>
          {this.props.error}
          </span>

        {!editing &&
          <div>
            <Field
              name="addFootprintMethod"
              type="radio"
              value="manual"
              component={FieldRadio}
              label={<FormattedMessage id="portal.network.footprintForm.checkbox.option.manual.text"/>}
            />

            <Field
              name="addFootprintMethod"
              type="radio"
              value="addfile"
              component={FieldRadio}
              label={<FormattedMessage id="portal.network.footprintForm.checkbox.option.useCSV.text"/>}
            />
          </div>
        }

        { addFootprintMethod === 'manual' &&
        <div>
          <Field
            type="text"
            name="name"
            placeholder={intl.formatMessage({ id: 'portal.network.footprintForm.name.placeholder.text' })}
            component={FieldFormGroup}
            label={<FormattedMessage id="portal.network.footprintForm.name.title.text"/>}
          />

          <Field
            name="description"
            type="text"
            placeholder={intl.formatMessage({ id: 'portal.network.footprintForm.description.placeholder.text' })}
            component={FieldFormGroup}
            label={<FormattedMessage id="portal.network.footprintForm.description.title.text"/>}
            required={false}
          />

          <ControlLabel>
            <FormattedMessage id="portal.network.footprintForm.dataType.title.text"/>*
          </ControlLabel>

          <Field
            name="data_type"
            type="radio"
            value="ipv4cidr"
            component={FieldRadio}
            label={<FormattedMessage id="portal.network.footprintForm.dataType.option.cidr.text"/>}
          />

          <Field
            type="radio"
            name="data_type"
            value="asnlist"
            component={FieldRadio}
            label={<FormattedMessage id="portal.network.footprintForm.dataType.option.asn.text"/>}
          />

          { dataType === 'ipv4cidr' &&
            <Field
              required={true}
              name="value_ipv4cidr"
              allowNew={true}
              component={FieldFormGroupTypeahead}
              multiple={true}
              options={[]}
              validation={validateCIDRToken}
            />
          }

          { dataType === 'asnlist' &&
            <FieldFormGroupAsnLookup
              name="value_asnlist"
              withoutLabel={true}
            />
          }

          <Field
            name="udn_type"
            className="input-select"
            component={FieldFormGroupSelect}
            options={filteredUdnTypeOptions}
            label={<FormattedMessage id="portal.network.footprintForm.UDNType.title.text"/>}
          />
        </div>
        }

        { addFootprintMethod !== 'manual' && this.renderFileUpload() }

        <FormFooterButtons>
          <Button
            id="cancel-btn"
            className="btn-secondary"
            onClick={onCancel}>
            <FormattedMessage id="portal.button.cancel"/>
          </Button>

          <IsAllowed to={MODIFY_FOOTPRINT}>
            <Button
              type="submit"
              bsStyle="primary"
              disabled={invalid || submitting || fetching || ((addFootprintMethod !== 'manual') && (_.isEmpty(this.state.csvValues)))}>
              {submitButtonLabel}
            </Button>
          </IsAllowed>
        </FormFooterButtons>
      </form>
    )
  }
}

FootprintForm.displayName = "FootprintForm"
FootprintForm.propTypes = {
  editing: PropTypes.bool,
  fetching: PropTypes.bool,
  intl: PropTypes.object,
  onCSVSave: PropTypes.func,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
  onSave: PropTypes.func,
  show: PropTypes.bool,
  showNotification: PropTypes.func,
  ...reduxFormPropTypes,
  udnTypeOptions: PropTypes.array
}

const form = reduxForm({
  form: 'footprintForm',
  validate
})(FootprintForm)

const mapStateToProps = (state) => {
  const selector = formValueSelector('footprintForm')
  const addFootprintMethod = selector(state, 'addFootprintMethod')
  const dataType = selector(state, 'data_type')

  return {
    addFootprintMethod,
    dataType
  }
}


export default connect(mapStateToProps)(injectIntl(form))
