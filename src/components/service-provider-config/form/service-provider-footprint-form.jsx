import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, propTypes as reduxFormPropTypes } from 'redux-form'
import { Map }from 'immutable'
import { Button, FormGroup, ControlLabel } from 'react-bootstrap'

import FieldRadio from '../../form/field-radio'
import FieldFormGroup from '../../form/field-form-group'
import FieldFormGroupSelect from '../../form/field-form-group-select'
import FormFooterButtons from '../../form/form-footer-buttons'
import SidePanel from '../../side-panel'


import { checkForErrors } from '../../../util/helpers'

import { FormattedMessage, injectIntl } from 'react-intl'

const validate = ({ footPrintName, footPrintDescription }) => {

  const errors = checkForErrors({ footPrintName, footPrintDescription })

  return errors;

}

class FootPrintForm extends React.Component {
  constructor(props) {
    super(props)

    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit(){

  }

  render() {
    const { providerTypes, invalid, submitting, initialValues: { accountBrand }, show, onCancel, intl, useCSVFile } = this.props
    const title = this.props.account
      ? <FormattedMessage id="portal.account.manage.editAccount.title" />
      : <FormattedMessage id="portal.account.manage.newAccount.title" />
    const subTitle = this.props.account ? `${accountBrand} / ${this.props.account.get('name')}` : 'udn'

    const submitButtonLabel = this.props.account
      ? <FormattedMessage id="portal.button.save" />
      : <FormattedMessage id="portal.button.add" />


    return (
      <SidePanel
        show={show}
        title={title}
        subTitle={subTitle}
        cancel={onCancel}
      >

        <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
          <span className='submit-error'>
          {this.props.error}
          </span>

          <FormGroup>
              <Field
                name="manualAddFootprint"
                type="radio"
                value="manual"
                component={FieldRadio}
                label={<FormattedMessage id="portal.serviceProviderConfig.form.footprint.checkbox.option.manual.text" />}
              />

              <Field
                type="radio"
                name="addCSVFile"
                value="addfile"
                component={FieldRadio}
                label={<FormattedMessage id="portal.serviceProviderConfig.form.footprint.checkbox.option.useCSV.text" />}
              />
          </FormGroup>

          { useCSVFile &&
            <div>
              <Field
                type="text"
                name="footPrintName"
                placeholder={intl.formatMessage({id: 'portal.serviceProviderConfig.form.footprint.name.placeholder.text'})}
                component={FieldFormGroup}
                label={<FormattedMessage id="portal.serviceProviderConfig.form.footprint.name.title.text" />}
              />

              <Field
                name="footPrintDescription"
                type="text"
                placeholder={intl.formatMessage({id: 'portal.serviceProviderConfig.form.footprint.description.placeholder.text'})}
                component={FieldFormGroupSelect}
                label={<FormattedMessage id="portal.serviceProviderConfig.form.footprint.description.title.text" />}
              />

              <FormGroup>
                  <ControlLabel>{<FormattedMessage id="portal.serviceProviderConfig.form.footprint.dataType.title.text" />}</ControlLabel>
                  <Field
                    name="CIDR"
                    type="radio"
                    value="cidr"
                    component={FieldRadio}
                    label={<FormattedMessage id="portal.serviceProviderConfig.form.footprint.dataType.option.cidr.text" />}
                  />

                  <Field
                    type="radio"
                    name="ASN"
                    value="asn"
                    component={FieldRadio}
                    label={<FormattedMessage id="portal.serviceProviderConfig.form.footprint.dataType.option.asn.text" />}
                  />

                  <Field
                    type="text"
                    name="footPrintName"
                    placeholder={intl.formatMessage({id: 'portal.serviceProviderConfig.form.footprint.name.placeholder.text'})}
                    component={FieldFormGroup}
                    label={<FormattedMessage id="portal.serviceProviderConfig.form.footprint.UDNType.title.text" />}
                  />
              </FormGroup>

              <Field
                name="dataTypeList"
                className="input-select"
                component={FieldFormGroupSelect}
                options={providerTypes}
                label={<FormattedMessage id="portal.account.manage.accountType.title" />}
              />
            </div>
          }
          { !useCSVFile &&
            <Field
              name="CSVUploader"
              type="text"
              placeholder={intl.formatMessage({id: 'portal.serviceProviderConfig.form.footprint.description.placeholder.text'})}
              component={FieldFormGroupSelect}
              label={<FormattedMessage id="portal.serviceProviderConfig.form.footprint.description.title.text" />}
            />
          }

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
                disabled={invalid||submitting}>
                {submitButtonLabel}
              </Button>
            </FormFooterButtons>
        </form>
      </SidePanel>
    )
  }
}

FootPrintForm.displayName = "AccountForm"
FootPrintForm.propTypes = {
  account: PropTypes.instanceOf(Map),
  accountType: PropTypes.number,
  fetchServiceInfo: PropTypes.func,
  intl: PropTypes.object,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  providerTypes: PropTypes.array,
  ...reduxFormPropTypes,
  serviceOptions: PropTypes.array,
  show: PropTypes.bool
}

FootPrintForm.defaultProps = {
  serviceOptions: []
}


const form = reduxForm({
  form: 'accountForm',
  validate
})(FootPrintForm)

export default connect()(injectIntl(form))
