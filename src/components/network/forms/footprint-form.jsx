import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector, propTypes as reduxFormPropTypes } from 'redux-form'
import { Button, FormGroup, ControlLabel } from 'react-bootstrap'
import { FormattedMessage, injectIntl } from 'react-intl'

import SidePanel from '../../side-panel'
import FieldRadio from '../../form/field-radio'
import FieldFormGroup from '../../form/field-form-group'
import FieldFormGroupSelect from '../../form/field-form-group-select'
import FieldFormGroupTypeahead from '../../form/field-form-group-typeahead'
import FormFooterButtons from '../../form/form-footer-buttons'

import MultilineTextFieldError from '../../shared/forms/multiline-text-field-error'

import { isValidTextField, isValidIPv4AddressWithSubnet } from '../../../util/validators'
import { checkForErrors } from '../../../util/helpers'

const validateTypeaheadToken = (item) => {
  return item.label && isValidIPv4AddressWithSubnet(item.label)
}

const validate = ({ footPrintName, footPrintDescription, UDNType }) => {
  const conditions = {
    footPrintName: {
      condition: !isValidTextField(footPrintName),
      errorText: <MultilineTextFieldError fieldLabel="portal.network.footprintForm.name.invalid.text" />
    },
    footPrintDescription: {
      condition: !isValidTextField(footPrintDescription),
      errorText: <MultilineTextFieldError fieldLabel="portal.common.description" />
    }
  }

  return checkForErrors(
    { footPrintName, footPrintDescription, UDNType },
    conditions,
    {
      footPrintName: <FormattedMessage values={{ field: 'Footprint Name' }} id="portal.network.footprintForm.field.required.text"/>,
      footPrintDescription: <FormattedMessage values={{ field: 'Footprint Description' }} id="portal.network.footprintForm.field.required.text"/>
    }
  )
}

class FootprintForm extends React.Component {
  constructor(props) {
    super(props)

    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit(values) {
    this.props.onSubmit(values)
  }

  renderDropZone() {
    // TODO: DropZone component
    return (
      <p>DropZone component here</p>
    )
  }

  render() {
    const {
      ASNOptions,
      addManual,
      CIDROptions,
      dataType,
      editing,
      intl,
      invalid,
      onCancel,
      show,
      submitting,
      UNDTypeOptions
    } = this.props

    const formTitle = editing
      ? <FormattedMessage id="portal.network.footprintForm.title.add.text"/>
      : <FormattedMessage id="portal.network.footprintForm.title.add.text"/>

    const submitButtonLabel = editing
      ? <FormattedMessage id="portal.button.add"/>
      : <FormattedMessage id="portal.button.save"/>


    return (
      <SidePanel
        show={show}
        title={formTitle}
        cancel={onCancel}
        className="sp-footprint-form"
      >

        <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
          <span className='submit-error'>
          {this.props.error}
          </span>

          <FormGroup>
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
          </FormGroup>

          { addManual === 'manual' &&
          <div>
            <FormGroup>
              <Field
                type="text"
                name="footPrintName"
                placeholder={intl.formatMessage({ id: 'portal.network.footprintForm.name.placeholder.text' })}
                component={FieldFormGroup}
                label={<FormattedMessage id="portal.network.footprintForm.name.title.text"/>}
              />

              <Field
                name="footPrintDescription"
                type="text"
                placeholder={intl.formatMessage({ id: 'portal.network.footprintForm.description.placeholder.text' })}
                component={FieldFormGroup}
                label={<FormattedMessage id="portal.network.footprintForm.description.title.text"/>}
              />
            </FormGroup>

            <FormGroup>
              <ControlLabel>{<FormattedMessage
                id="portal.network.footprintForm.dataType.title.text"/>}</ControlLabel>
              <Field
                name="dataType"
                type="radio"
                value="cidr"
                component={FieldRadio}
                label={<FormattedMessage id="portal.network.footprintForm.dataType.option.cidr.text"/>}
              />

              <Field
                type="radio"
                name="dataType"
                value="asn"
                component={FieldRadio}
                label={<FormattedMessage id="portal.network.footprintForm.dataType.option.asn.text"/>}
              />

              { dataType === 'cidr' &&
              <Field
                required={false}
                name="cidr"
                allowNew={true}
                component={FieldFormGroupTypeahead}
                multiple={true}
                options={CIDROptions}
                validation={validateTypeaheadToken}/>
              }

              { dataType !== 'cidr' &&
              <Field
                name="asn"
                allowNew={true}
                component={FieldFormGroupTypeahead}
                multiple={true}
                options={ASNOptions}
                validation={validateTypeaheadToken}/>
              }
            </FormGroup>

            <Field
              name="UDNTypeList"
              className="input-select"
              component={FieldFormGroupSelect}
              options={UNDTypeOptions}
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
              disabled={invalid || submitting}>
              {submitButtonLabel}
            </Button>
          </FormFooterButtons>
        </form>
      </SidePanel>
    )
  }
}

FootprintForm.displayName = "FootprintForm"
FootprintForm.propTypes = {
  ASNOptions: PropTypes.array,
  CIDROptions: PropTypes.array,
  editing: PropTypes.bool,
  intl: PropTypes.object,
  onCancel: PropTypes.func,
  show: PropTypes.bool,
  ...reduxFormPropTypes,
  UNDTypeOptions: PropTypes.array
}

const form = reduxForm({
  form: 'footprintForm',
  validate
})(FootprintForm)

const selector = formValueSelector('footprintForm')

const mapStateToProps = (state) => {
  const addManual = selector(state, 'addFootprintMethod')
  const dataType = selector(state, 'dataType')

  return {
    addManual,
    dataType,
    selector,
    initialValues: {
      addFootprintMethod: 'manual',
      asn: [],
      cidr: [],
      dataType: 'cidr'
    }
  }
}


export default connect(mapStateToProps)(injectIntl(form))
