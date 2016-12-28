import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector, isInvalid } from 'redux-form'
import { Map }from 'immutable'
import { Button, ButtonToolbar } from 'react-bootstrap'

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

    this.onSubmit = this.onSubmit.bind(this)
  }

  componentWillMount() {
    this.props.fetchServiceInfo()
  }

  onSubmit(values, dispatch, props){
    const data = {
      name: values.accountName,
      provider_type: values.accountType,
      services: values.accountServices
    }

    const accountId = props.account && props.account.get('id') || null

    return this.props.onSave(values.accountBrand, accountId, data)
  }

  render() {
    const { providerTypes, serviceOptions, invalid, submitting, initialValues: { accountBrand }, show, onCancel } = this.props
    const title = this.props.account
      ? <FormattedMessage id="portal.account.manage.editAccount.title" />
      : <FormattedMessage id="portal.account.manage.newAccount.title" />
    const subTitle = this.props.account ? `${accountBrand} / ${this.props.account.get('name')}` : 'udn'

    //const providerType =  providerTypes && providerTypes.find(type => type.value === accountType.value)
    //const providerTypeLabel = /*providerType && providerType.label ? providerType.label : */ <FormattedMessage id="portal.account.manage.providerTypeUnknown.text" />

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
            component={FieldFormGroupSelect}
            options={providerTypes}
            >
            <FormattedMessage id="portal.account.manage.accountType.title" />
          </Field>

          <hr/>

          {this.props.accountType
              ? <Field
                  name="accountServices"
                  component={FieldFormGroupMultiOptionSelector}
                  options={serviceOptions}
                >
                  <FormattedMessage id="portal.account.manage.services.title" />
                </Field>
              : <p>Please, select account type</p>
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
              disabled={invalid||submitting}>
              {submitButtonLabel}
            </Button>
          </ButtonToolbar>

        </form>
      </SidePanel>
    )
  }
}

AccountForm.propTypes = {
  account: PropTypes.instanceOf(Map),
  accountType: PropTypes.number,
  fetchServiceInfo: PropTypes.func,
  initialValues: PropTypes.object,
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
const mapStateToProps = (state, ownProps) => {

  const accountType = formSelector(state, 'accountType')
  return {
    accountType,
    initialValues: {
      accountBrand: 'udn',
      accountName: ownProps.account && ownProps.account.get('name'),
      accountType: ownProps.account && ownProps.account.get('provider_type'),
      accountServices: ownProps.account && ownProps.account.get('services').toJS()
    },
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
