import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector, propTypes as reduxFormPropTypes } from 'redux-form'
import { Button, ControlLabel } from 'react-bootstrap'
import { FormattedMessage, injectIntl } from 'react-intl'

import FieldRadio from '../../form/field-radio'
import FieldFormGroup from '../../form/field-form-group'
import FieldFormGroupSelect from '../../form/field-form-group-select'
import FieldFormGroupTypeahead from '../../form/field-form-group-typeahead'
import FormFooterButtons from '../../form/form-footer-buttons'

import MultilineTextFieldError from '../../shared/forms/multiline-text-field-error'

import { isValidFootprintTextField , isValidIPv4Address, isValidASN } from '../../../util/validators'
import { checkForErrors } from '../../../util/helpers'

import { FORM_DESCRIPTION_FIELD_MIN_LEN,
         FORM_DESCRIPTION_FIELD_MAX_LEN,
         FORM_TEXT_FIELD_DEFAULT_MIN_LEN,
         FORM_FOOTPRINT_TEXT_FIELD_MAX_LEN,
         FORM_FOOTPRINT_DESCRIPTION_FIELD_MAX_LEN } from '../../../constants/common'

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
      condition: !isValidFootprintTextField(name, FORM_TEXT_FIELD_DEFAULT_MIN_LEN, FORM_FOOTPRINT_TEXT_FIELD_MAX_LEN ),
      errorText: <MultilineTextFieldError fieldLabel="portal.network.footprintForm.name.invalid.text" footprintTextValidation={true}/>
    },
    description: {
      condition: !isValidFootprintTextField(description, FORM_DESCRIPTION_FIELD_MIN_LEN, FORM_FOOTPRINT_DESCRIPTION_FIELD_MAX_LEN),
      errorText: <MultilineTextFieldError fieldLabel="portal.common.description"
                                          footprintTextValidation={true}
                                          minValue={FORM_DESCRIPTION_FIELD_MIN_LEN}
                                          maxValue={FORM_DESCRIPTION_FIELD_MAX_LEN}/>
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

  if (data_type === 'asnlist' && value_asnlist && value_asnlist.length > 0) {
    let hasInvalidASNItems = false
    value_asnlist.forEach((asnItem) => {
      if (!validateASNToken(asnItem)) {
        hasInvalidASNItems = true
      }
    })

    conditions.value_asnlist = [
      {
        condition: hasInvalidASNItems,
        errorText: <FormattedMessage id="portal.network.footprintForm.ASN.invalid.text"/>
      }
    ]
  }

  return checkForErrors(
    { name, description, data_type, udn_type, value_ipv4cidr, value_asnlist },
    conditions,
    {
      name: <FormattedMessage id="portal.network.footprintForm.name.required.text"/>,
      description: <FormattedMessage id="portal.network.footprintForm.description.required.text"/>,
      [`value_${data_type}`]: <FormattedMessage id={valueValidationTranslationId}/>
    }
  )
}

class FootprintForm extends React.Component {
  constructor(props) {
    super(props)

  }

  renderDropZone() {
    /* UDNP-2520 - Integrate File Upload component into 'Add footprint' form */
    return (
      <p>DropZone component here</p>
    )
  }

  render() {
    const {
      addManual,
      dataType,
      editing,
      fetching,
      handleSubmit,
      intl,
      invalid,
      onCancel,
      onSave,
      submitting,
      udnTypeOptions
    } = this.props

    const submitButtonLabel = editing
      ? <FormattedMessage id="portal.button.save"/>
      : <FormattedMessage id="portal.button.add"/>

    const typeaheadValidationMethod = dataType === 'ipv4cidr' ? validateCIDRToken : validateASNToken

    return (
      <form className="sp-footprint-form" onSubmit={handleSubmit(onSave)}>
          <span className='submit-error'>
          {this.props.error}
          </span>

        {/* UDNP-2520 - Integrate File Upload component into 'Add footprint' form */}
        {/* <Field
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
        /> */}

        { addManual === 'manual' &&
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

          <Field
            required={true}
            name={`value_${dataType}`}
            allowNew={true}
            component={FieldFormGroupTypeahead}
            multiple={true}
            options={[]}
            validation={typeaheadValidationMethod}
          />

          <Field
            name="udn_type"
            className="input-select"
            component={FieldFormGroupSelect}
            options={udnTypeOptions}
            label={<FormattedMessage id="portal.network.footprintForm.UDNType.title.text"/>}
          />
        </div>
        }

        { addManual !== 'manual' && this.renderDropZone()}

        <FormFooterButtons>
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
            {submitButtonLabel}
          </Button>
        </FormFooterButtons>
      </form>
    )
  }
}

FootprintForm.displayName = "FootprintForm"
FootprintForm.propTypes = {
  ASNOptions: PropTypes.array,
  CIDROptions: PropTypes.array,
  editing: PropTypes.bool,
  fetching: PropTypes.bool,
  intl: PropTypes.object,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
  show: PropTypes.bool,
  ...reduxFormPropTypes,
  udnTypeOptions: PropTypes.array
}

const form = reduxForm({
  form: 'footprintForm',
  validate
})(FootprintForm)

const mapStateToProps = (state) => {
  const selector = formValueSelector('footprintForm')
  /* UDNP-2520 - Integrate File Upload component into 'Add footprint' form */
  // const addManual = selector(state, 'addFootprintMethod')
  const addManual = 'manual'
  const dataType = selector(state, 'data_type')

  return {
    addManual,
    dataType
  }
}


export default connect(mapStateToProps)(injectIntl(form))
