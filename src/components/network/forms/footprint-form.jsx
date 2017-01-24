import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector, isInvalid, propTypes as reduxFormPropTypes } from 'redux-form'
import { Button, FormGroup, ControlLabel } from 'react-bootstrap'
import { FormattedMessage, injectIntl } from 'react-intl'
import Typeahead from 'react-bootstrap-typeahead'
import classNames from 'classnames'

import SidePanel from '../../side-panel'
import FieldRadio from '../../form/field-radio'
import FieldFormGroup from '../../form/field-form-group'
import FieldFormGroupSelect from '../../form/field-form-group-select'
import FormFooterButtons from '../../form/form-footer-buttons'

import MultilineTextFieldError from '../../shared/forms/multiline-text-field-error'

import { isValidTextField, isValidIPv4AddressWithSubnet } from '../../../util/validators'
import { checkForErrors } from '../../../util/helpers'

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

    this.renderCIDRToken = this.renderCIDRToken.bind(this)
    this.renderASNToken = this.renderASNToken.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit(values) {
    this.props.onSubmit(values)
  }

  renderCIDRToken(token, onRemove, key) {
    const tokenClass = isValidIPv4AddressWithSubnet(token.label) ? 'valid' : 'invalid'

    return (
      <div className={classNames('token token-removeable', `token__${tokenClass}`)} key={key}>
        {token.label}
        <span className="close-button" role="button" onClick={onRemove}>×</span>
      </div>
    )
  }

  renderASNToken(token, onRemove, key) {
    const tokenClass = isValidIPv4AddressWithSubnet(token.label) ? 'valid' : 'invalid'

    // TODO: Waiting for ASN validation, no idea what it is

    return (
      <div className={classNames('token token-removeable', `token__${tokenClass}`)} key={key}>
        {token.label}
        <span className="close-button" role="button" onClick={onRemove}>×</span>
      </div>
    )
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

              {
                // TODO: Add redux-form connected typeahead-field when UDNP-2447 gets merged
              }
              { dataType === 'cidr' &&
              <Typeahead
                multiple={true}
                onChange={() => null}
                allowNew={true}
                renderToken={this.renderCIDRToken}
                options={CIDROptions}/>
              }

              {
                // TODO: Add redux-form connected typeahead-field when UDNP-2447 gets merged
              }
              { dataType !== 'cidr' &&
              <Typeahead
                multiple={true}
                onChange={() => null}
                allowNew={true}
                renderToken={this.renderASNToken}
                options={ASNOptions}/>
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
  UNDTypeOptions: PropTypes.array,
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
      dataType: 'cidr'
    }
  }
}


export default connect(mapStateToProps)(injectIntl(form))
