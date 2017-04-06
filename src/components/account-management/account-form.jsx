import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, formValueSelector, isInvalid, propTypes as reduxFormPropTypes } from 'redux-form'
import { Map, List } from 'immutable'

import { Button, ControlLabel, FormGroup } from 'react-bootstrap'

import FieldFormGroup from '../shared/form-fields/field-form-group'
import FieldFormGroupSelect from '../shared/form-fields/field-form-group-select'
import FieldFormGroupMultiOptionSelector from '../shared/form-fields/field-form-group-multi-option-selector'
import FormFooterButtons from '../shared/form-elements/form-footer-buttons'
import SidePanel from '../shared/side-panel'
import MultilineTextFieldError from '../shared/form-elements/multiline-text-field-error'

import { getProviderTypeOptions, getServiceOptions } from '../../redux/modules/service-info/selectors'
import { fetchAll as serviceInfofetchAll } from '../../redux/modules/service-info/actions'
import {
  BRAND_OPTIONS,
  ACCOUNT_TYPE_CONTENT_PROVIDER
} from '../../constants/account-management-options'

import { checkForErrors } from '../../util/helpers'
import { isValidTextField } from '../../util/validators'
import { getServicesIds, getServicesFromIds } from '../../util/services-helpers'

import ServiceOptionSelector from './service-option-selector'

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

  componentWillReceiveProps(nextProps) {
    // UDNP-2388: below is a hack to handle change of accountType
    // Since accountServices holds values which were selected for
    // previosly configured account type, we need to clear them manually.

    if (nextProps.accountType && (!nextProps.account)) {
      if (JSON.stringify(this.props.serviceOptions) !== JSON.stringify(nextProps.serviceOptions)) {
        this.props.change('accountServices', [])
      }
    }
  }

  onSubmit(values, dispatch, { account, accountType, onSave }) {
    const services = accountType !== ACCOUNT_TYPE_CONTENT_PROVIDER
                     ? values.accountServices.toJS()
                     : getServicesFromIds(values.accountServicesIds)

    const data = {
      name: values.accountName,
      provider_type: values.accountType,
      services
    }

    const accountId = account && account.get('id') || null

    return onSave(values.accountBrand, accountId, data)
      //TODO: Handle submittion error
      //  .then( (res) => {
      //    if (res)
      //   throw new SubmissionError({ _error: 'Jipii' + res })
      // );

  }

  render() {
    let providerType = ''
    let providerTypeLabel = ''
    const { accountType, providerTypes, serviceOptions, invalid, submitting,
            initialValues: { accountBrand }, show, onCancel } = this.props
    const isEditing = this.props.account.get('name')
    const title = isEditing
      ? <FormattedMessage id="portal.account.manage.editAccount.title" />
      : <FormattedMessage id="portal.account.manage.newAccount.title" />
    const subTitle = isEditing ? `${accountBrand} / ${this.props.account.get('name')}` : 'udn'

    const submitButtonLabel = isEditing
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

          { !this.props.account.get('id')
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

           { accountType && accountType === ACCOUNT_TYPE_CONTENT_PROVIDER &&
              <Field
                name="accountServicesIds"
                component={FieldFormGroupMultiOptionSelector}
                options={serviceOptions}
                label={<FormattedMessage id="portal.account.groupForm.services_options.title" />}
                required={false}
              />
           }

           { accountType && accountType !== ACCOUNT_TYPE_CONTENT_PROVIDER &&
              <Field
                name="accountServices"
                component={ServiceOptionSelector}
                showServiceItemForm={this.props.showServiceItemForm}
                onChangeServiceItem={this.props.onChangeServiceItem}
                options={serviceOptions}
                label={<FormattedMessage id="portal.account.groupForm.services_options.title" />}
                required={false}
              />
           }

           { !accountType &&
            <p><FormattedMessage id="portal.account.manage.selectAccountType.text" /></p>
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
              disabled={invalid || submitting}>
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
  fetchServiceInfo: PropTypes.func,
  intl: PropTypes.object,
  onCancel: PropTypes.func,
  onChangeServiceItem: PropTypes.func,
  onSave: PropTypes.func,
  providerTypes: PropTypes.array,
  ...reduxFormPropTypes,
  serviceOptions: PropTypes.array,
  show: PropTypes.bool
}

AccountForm.defaultProps = {
  account: Map(),
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
      accountServices: ownProps.account && ownProps.account.get('services') || List(),
      accountServicesIds: ownProps.account && ownProps.account.get('services') && getServicesIds(ownProps.account.get('services')).toJS() || []
    },
    invalid: isInvalid('accountForm')(state),
    providerTypes: getProviderTypeOptions(state),
    serviceOptions: accountType && getServiceOptions(state, accountType)
  }
}

/* istanbul ignore next */
const mapDispatchToProps = (dispatch) => {
  return {
    fetchServiceInfo: () => dispatch(serviceInfofetchAll())
  }
}

const form = reduxForm({
  form: 'accountForm',
  validate
})(AccountForm)

export default connect(mapStateToProps,mapDispatchToProps)(injectIntl(form))
