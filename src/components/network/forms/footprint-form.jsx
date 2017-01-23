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

import { isValidAccountName, isValidIPv4AddressWithSubnet } from '../../../util/validators'
import { checkForErrors } from '../../../util/helpers'

const validate = ({ footPrintName, footPrintDescription, UDNType }) => {
  // TODO: those error should stay in a reuseable component, seen it's been used 3 times
  const conditions = {
    footPrintName: [
      {
        condition: !footPrintName || !isValidAccountName(footPrintName),
        errorText: <div key={footPrintName}>{[<FormattedMessage key={1}
                                                                id="portal.serviceProviderConfig.form.footprint.name.invalid.text"/>,
          <div key={2}>
            <div style={{ marginTop: '0.5em' }}>
              <FormattedMessage id="portal.account.manage.nameValidationRequirements.line1.text"/>
              <ul>
                <li><FormattedMessage id="portal.account.manage.nameValidationRequirements.line2.text"/></li>
                <li><FormattedMessage id="portal.account.manage.nameValidationRequirements.line3.text"/></li>
              </ul>
            </div>
          </div>]}
        </div>
      }
    ],
    footPrintDescription: [
      {
        condition: !footPrintDescription,
        errorText: <div key={footPrintDescription}>{[<FormattedMessage key={1}
                                                                       id="portal.serviceProviderConfig.form.footprint.description.invalid.text"/>,
          <div key={2}>
            <div style={{ marginTop: '0.5em' }}>
              <FormattedMessage id="portal.account.manage.nameValidationRequirements.line1.text"/>
              <ul>
                <li><FormattedMessage id="portal.account.manage.nameValidationRequirements.line2.text"/></li>
              </ul>
            </div>
          </div>]}
        </div>
      }
    ]
  }
  const errors = checkForErrors({ footPrintName, footPrintDescription, UDNType }, conditions)

  return errors;

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
    const { UDNTypes, invalid, submitting, show, onCancel, intl, addManual, dataType } = this.props

    const submitButtonLabel = this.props.account
      ? <FormattedMessage id="portal.button.save"/>
      : <FormattedMessage id="portal.button.add"/>


    return (
      <SidePanel
        show={show}
        title={<FormattedMessage id="portal.serviceProviderConfig.form.footprint.title.text"/>}
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
              label={<FormattedMessage id="portal.serviceProviderConfig.form.footprint.checkbox.option.manual.text"/>}
            />

            <Field
              name="addFootprintMethod"
              type="radio"
              value="addfile"
              component={FieldRadio}
              label={<FormattedMessage id="portal.serviceProviderConfig.form.footprint.checkbox.option.useCSV.text"/>}
            />
          </FormGroup>

          { addManual === 'manual' &&
          <div>
            <Field
              type="text"
              name="footPrintName"
              placeholder={intl.formatMessage({ id: 'portal.serviceProviderConfig.form.footprint.name.placeholder.text' })}
              component={FieldFormGroup}
              label={<FormattedMessage id="portal.serviceProviderConfig.form.footprint.name.title.text"/>}
            />

            <Field
              name="footPrintDescription"
              type="text"
              placeholder={intl.formatMessage({ id: 'portal.serviceProviderConfig.form.footprint.description.placeholder.text' })}
              component={FieldFormGroup}
              label={<FormattedMessage id="portal.serviceProviderConfig.form.footprint.description.title.text"/>}
            />

            <FormGroup>
              <ControlLabel>{<FormattedMessage
                id="portal.serviceProviderConfig.form.footprint.dataType.title.text"/>}</ControlLabel>
              <Field
                name="dataType"
                type="radio"
                value="cidr"
                component={FieldRadio}
                label={<FormattedMessage id="portal.serviceProviderConfig.form.footprint.dataType.option.cidr.text"/>}
              />

              <Field
                type="radio"
                name="dataType"
                value="asn"
                component={FieldRadio}
                label={<FormattedMessage id="portal.serviceProviderConfig.form.footprint.dataType.option.asn.text"/>}
              />

              { dataType === 'cidr' &&
              <Typeahead
                multiple={true}
                onChange={() => null}
                allowNew={true}
                renderToken={this.renderCIDRToken}
                options={[
                  { id: 'BY', label: 'Belarus' }
                ]}/>
              }

              { dataType !== 'cidr' &&
              <Typeahead
                multiple={true}
                onChange={() => null}
                allowNew={true}
                renderToken={this.renderASNToken}
                options={[
                  { id: 'BY', label: 'Waa' }
                ]}/>
              }
            </FormGroup>

            <Field
              name="UDNTypeList"
              className="input-select"
              component={FieldFormGroupSelect}
              options={UDNTypes}
              label={<FormattedMessage id="portal.serviceProviderConfig.form.footprint.UDNType.title.text"/>}
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
  intl: PropTypes.object,
  onCancel: PropTypes.func,
  show: PropTypes.bool,
  ...reduxFormPropTypes
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
    selector,
    initialValues: {
      addFootprintMethod: 'manual',
      dataType: 'cidr'
    },
    addManual,
    dataType,
    invalid: isInvalid('footprintForm')(state)
  }
}


export default connect(mapStateToProps)(injectIntl(form))
