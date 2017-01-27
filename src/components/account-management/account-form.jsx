import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector, isInvalid, propTypes as reduxFormPropTypes } from 'redux-form'
import { Map }from 'immutable'

import { Button, ControlLabel, FormGroup } from 'react-bootstrap'

import FieldFormGroup from '../form/field-form-group'
import FieldFormGroupSelect from '../form/field-form-group-select'
import FieldFormGroupMultiOptionSelector from '../form/field-form-group-multi-option-selector'
import FormFooterButtons from '../form/form-footer-buttons'
import SidePanel from '../side-panel'
import MultilineTextFieldError from '../shared/forms/multiline-text-field-error'

import {getProviderTypeOptions, getServiceOptions, getServicesInfo} from '../../redux/modules/service-info/selectors'
import {fetchAll as serviceInfofetchAll} from '../../redux/modules/service-info/actions'
import {
  BRAND_OPTIONS
} from '../../constants/account-management-options'

import { checkForErrors } from '../../util/helpers'
import { isValidTextField } from '../../util/validators'
import { getServicesIDs } from '../../util/services-helpers'

import ServiceOptionSelector from './service-option-selector'

import './account-form.scss'

import { FormattedMessage, injectIntl } from 'react-intl'

const validate = ({ accountName, accountBrand, accountType, accountServices, services }) => {
  const conditions = {
    accountName: [
      {
        condition: ! isValidTextField(accountName),
        errorText: <MultilineTextFieldError fieldLabel="portal.account.manage.accountName.title" />
      }
    ]
  }

  return checkForErrors({ accountName, accountBrand, accountType, accountServices, services }, conditions)
}

class AccountForm extends React.Component {
  constructor(props) {
    super(props)

    this.onSubmit = this.onSubmit.bind(this)
  }

  componentWillMount() {
    this.props.fetchServiceInfo()
  }

  onSubmit(values, dispatch, props){
    const services = props.account.get('services').toJS()
    const data = {
      name: values.accountName,
      provider_type: values.accountType,
      services
    }

    const accountId = props.account && props.account.get('id') || null

    return this.props.onSave(values.accountBrand, accountId, data)
      //TODO: Handle submittion error
      //  .then( (res) => {
      //    if (res)
      //   throw new SubmissionError({ _error: 'Jipii' + res })
      // );

  }

  render() {
    let providerType = ''
    let providerTypeLabel = ''
    const { accountType, providerTypes, serviceOptions, invalid, submitting, disabled,
            initialValues: { accountBrand }, show, onCancel } = this.props
    const title = this.props.account
      ? <FormattedMessage id="portal.account.manage.editAccount.title" />
      : <FormattedMessage id="portal.account.manage.newAccount.title" />
    const subTitle = this.props.account ? `${accountBrand} / ${this.props.account.get('name')}` : 'udn'

    const submitButtonLabel = this.props.account
      ? <FormattedMessage id="portal.button.save" />
      : <FormattedMessage id="portal.button.add" />

    if (accountType && providerTypes) {
      providerType = providerTypes.find((type) => {
        return type.value === accountType
      })

      providerTypeLabel = providerType && providerType.label ?
                                          providerType.label :
                                          <FormattedMessage id="portal.account.manage.providerTypeUnknown.text" />
    }

    return (
      <SidePanel
        show={show}
        title={title}
        subTitle={subTitle}
        cancel={onCancel}
        disabled={disabled}
      >

        <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
          <span className='submit-error'>
          {this.props.error}
          </span>

          <Field
            type="text"
            name="accountName"
            placeholder={this.props.intl.formatMessage({id: 'portal.account.manage.enterAccount.placeholder.text'})}
            component={FieldFormGroup}
            label={<FormattedMessage id="portal.account.manage.accountName.title" />}
          />

          <hr/>

          <Field
            name="accountBrand"
            className="input-select"
            placeholder={this.props.intl.formatMessage({id: 'portal.account.manage.enterAccount.placeholder.text'})}
            component={FieldFormGroupSelect}
            options={BRAND_OPTIONS}
            label={<FormattedMessage id="portal.account.manage.brand.title" />}
          />

          <hr/>

          { !this.props.account
            ? <Field
                name="accountType"
                className="input-select"
                component={FieldFormGroupSelect}
                options={providerTypes}
                label={<FormattedMessage id="portal.account.manage.accountType.title" />}
              />
            : <FormGroup>
                <ControlLabel>{<FormattedMessage id="portal.account.manage.accountType.title" />}</ControlLabel>
                <p>{providerTypeLabel}</p>
              </FormGroup>
           }

           <hr/>

           { accountType === 1
            ? <Field
                name="accountServicesIds"
                component={FieldFormGroupMultiOptionSelector}
                options={serviceOptions}
                label={<FormattedMessage id="portal.account.manage.services.title" />}
              />
            : <Field
                name="accountServices"
                component={ServiceOptionSelector}
                showServiceItemForm={this.props.showServiceItemForm}
                options={serviceOptions}
                onChangeServiceItem={this.props.onChangeServiceItem}
                label={<FormattedMessage id="portal.account.manage.services.title" />}
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

AccountForm.displayName = "AccountForm"
AccountForm.propTypes = {
  account: PropTypes.instanceOf(Map),
  accountType: PropTypes.number,
  disabled: PropTypes.bool,
  fetchServiceInfo: PropTypes.func,
  intl: PropTypes.object,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  providerTypes: PropTypes.array,
  ...reduxFormPropTypes,
  serviceOptions: PropTypes.array,
  show: PropTypes.bool
}

AccountForm.defaultProps = {
  serviceOptions: []
}

const formSelector = formValueSelector('accountForm')

const mapStateToProps = (state, ownProps) => {
  const accountType = formSelector(state, 'accountType')

  return {
    accountType,
    initialValues: {
      accountBrand: 'udn',
      accountName: ownProps.account && ownProps.account.get('name'),
      accountType: ownProps.account && ownProps.account.get('provider_type'),
      accountServices: ownProps.account && ownProps.account.get('services'),
      accountServicesIds: ownProps.account && getServicesIDs(ownProps.account.get('services')).toJS()
    },
    invalid: isInvalid('accountForm')(state),
    providerTypes: getProviderTypeOptions(state),
    serviceOptions: accountType && getServiceOptions(state, accountType),
    servicesInfo: getServicesInfo(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchServiceInfo: () => dispatch( serviceInfofetchAll() )
  }
}

const form = reduxForm({
  form: 'accountForm',
  validate
})(AccountForm)

export default connect(mapStateToProps,mapDispatchToProps)(injectIntl(form))
