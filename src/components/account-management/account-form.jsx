import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector, isInvalid } from 'redux-form'
import { Map }from 'immutable'

import FieldFormGroup from '../form/field-form-group'
import FieldFormGroupSelect from '../form/field-form-group-select'
import FieldFormGroupMultiOptionSelector from '../form/field-form-group-multi-option-selector'

import SidePanel from '../side-panel'

import {getProviderTypeOptions, getServiceOptions} from '../../redux/modules/service-info/selectors'
import {fetchAll as serviceInfofetchAll} from '../../redux/modules/service-info/actions'
import {
  BRAND_OPTIONS
} from '../../constants/account-management-options'

import { checkForErrors } from '../../util/helpers'
import { isValidAccountName } from '../../util/validators'


import './account-form.scss'

import { FormattedMessage, injectIntl } from 'react-intl'

const validate = ({ accountName, accountBrand, accountType, services }) => {
  const conditions = {
    accountName: [
      {
        condition: ! isValidAccountName(accountName),
        errorText: <div key={accountName}>{[<FormattedMessage key={1} id="portal.account.manage.invalidAccountName.text" />, <div key={2}>
                    <div style={{marginTop: '0.5em'}}>
                      <FormattedMessage id="portal.account.manage.nameValidationRequirements.line1.text" />
                      <ul>
                        <li><FormattedMessage id="portal.account.manage.nameValidationRequirements.line2.text" /></li>
                        <li><FormattedMessage id="portal.account.manage.nameValidationRequirements.line3.text" /></li>
                      </ul>
                    </div></div>]}
                  </div>
      }
    ]
  }

  const errors = checkForErrors({ accountName, accountBrand, accountType, services }, conditions)

  return errors;

}

class AccountForm extends React.Component {
  constructor(props) {
    super(props)

    this.save = this.save.bind(this)
  }

  componentWillMount() {
    // if (this.props.account) {
    //   const {
    //     account,
    //     fields: {
    //       accountName,
    //       accountType,
    //       services
    //     }
    //   } = this.props
    //
    //   const accountNameVal = account.get('name')
    //   accountNameVal && accountName.onChange(accountNameVal)
    //
    //   const accountTypeVal = account.get('provider_type')
    //   accountTypeVal && accountType.onChange(accountTypeVal)
    //
    //   const servicesVal = account.get('services')
    //   servicesVal && services.onChange(servicesVal.toJS())
    // }
    //
    this.props.fetchServiceInfo()
  }

  save() {
    if(!this.props.invalid) {
      const {
        fields: { accountBrand, accountName, accountType, services }
      } = this.props
      let data = {
        name: accountName.value,
        provider_type: accountType.value,
        services: services.value
      }
      const accountId = this.props.account && this.props.account.get('id') || null
      this.props.onSave(accountBrand.value, accountId, data)
    }
  }

  render() {
    const { providerTypes, serviceOptions, /*fields: { accountBrand, accountName, accountType, services }, */ show, onCancel } = this.props
    const title = this.props.account ? <FormattedMessage id="portal.account.manage.editAccount.title" /> : <FormattedMessage id="portal.account.manage.newAccount.title" />
    const subTitle = this.props.account ? `${accountBrand.initialValue} / ${this.props.account.get('name')}` : 'udn'

    //const providerType =  providerTypes && providerTypes.find(type => type.value === accountType.value)
    const providerTypeLabel = /*providerType && providerType.label ? providerType.label : */ <FormattedMessage id="portal.account.manage.providerTypeUnknown.text" />

    return (
      <SidePanel
        show={show}
        title={title}
        subTitle={subTitle}
        invalid={this.props.invalid}
        cancelButton={true}
        submitButton={true}
        submitText={this.props.account ? this.props.intl.formatMessage({id: 'portal.button.save'}) : null}
        cancel={onCancel}
        submit={this.save}>
        <form>

          <Field
            type="text"
            name="accountName"
            placeholder={this.props.intl.formatMessage({id: 'portal.account.manage.enterAccount.placeholder.text'})}
            component={FieldFormGroup}
            >
            <FormattedMessage id="portal.account.manage.accountName.title" />
          </Field>

          <hr/>

          <Field
            name="accountBrand"
            placeholder={this.props.intl.formatMessage({id: 'portal.account.manage.enterAccount.placeholder.text'})}
            component={FieldFormGroupSelect}
            options={BRAND_OPTIONS}
            >
            <FormattedMessage id="portal.account.manage.brand.title" />
          </Field>

          <hr/>

          <Field
            name="accountType"
            placeholder={this.props.intl.formatMessage({id: 'portal.account.manage.enterAccount.placeholder.text'})}
            component={FieldFormGroupSelect}
            options={providerTypes}
            >
            <FormattedMessage id="portal.account.manage.accountType.title" />
          </Field>

          <hr/>

          {this.props.accountType
              ? <Field
                  name="services"
                  placeholder={this.props.intl.formatMessage({id: 'portal.account.manage.enterAccount.placeholder.text'})}
                  component={FieldFormGroupMultiOptionSelector}
                  options={serviceOptions}
                  >
                  <FormattedMessage id="portal.account.manage.services.title" />
                </Field>
              : <p>Please, select account type</p>
          }
        </form>
      </SidePanel>
    )
  }
}

AccountForm.propTypes = {
  account: React.PropTypes.instanceOf(Map),
  fetchServiceInfo: React.PropTypes.func,
  fields: PropTypes.object,
  intl: PropTypes.object,
  invalid: PropTypes.bool,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  providerTypes: PropTypes.array,
  serviceOptions: PropTypes.array,
  show: PropTypes.bool
}

AccountForm.defaultProps = {
  serviceOptions: []
}

const formSelector = formValueSelector('accountForm')
const mapStateToProps = (state) => {

  const accountType = formSelector(state, 'accountType')
  return {
    accountType,
    invalid: isInvalid('accountForm')(state),
    providerTypes: getProviderTypeOptions(state),
    serviceOptions: accountType && getServiceOptions(state, accountType)
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
