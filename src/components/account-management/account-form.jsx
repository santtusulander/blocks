import React, { PropTypes } from 'react'
import { reduxForm } from 'redux-form'
import { Map, List }from 'immutable'
import {
  Modal,
  FormGroup,
  FormControl,
  ControlLabel,
  HelpBlock,
  ButtonToolbar,
  Button
} from 'react-bootstrap'

import SelectWrapper from '../select-wrapper.jsx'
import MultiOptionSelector from '../multi-option-selector'

import {getProviderTypeOptions, getServiceOptions} from '../../redux/modules/service-info/selectors'
import {fetchAll as serviceInfofetchAll} from '../../redux/modules/service-info/actions'
import {
  BRAND_OPTIONS
} from '../../constants/account-management-options'

import { checkForErrors, getReduxFormValidationState } from '../../util/helpers'
import { isValidAccountName } from '../../util/validators'


import './account-form.scss'

import { FormattedMessage, injectIntl } from 'react-intl'

const validate = ({ accountName = '', accountBrand, accountType, services }) => {
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

  return checkForErrors({ accountName, accountBrand, accountType, services }, conditions)
}

class AccountForm extends React.Component {
  constructor(props) {
    super(props)

    this.save = this.save.bind(this)
  }

  componentWillMount() {
    if (this.props.account) {
      const {
        account,
        fields: {
          accountName,
          accountType,
          services
        }
      } = this.props

      const accountNameVal = account.get('name')
      accountNameVal && accountName.onChange(accountNameVal)

      const accountTypeVal = account.get('provider_type')
      accountTypeVal && accountType.onChange(accountTypeVal)

      const servicesVal = account.get('services')
      servicesVal && services.onChange(servicesVal.toJS())
    }

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
    const { providerTypes, serviceOptions, fields: { accountBrand, accountName, accountType, services }, show, onCancel } = this.props
    const title = this.props.account ? <FormattedMessage id="portal.account.manage.editAccount.title" /> : <FormattedMessage id="portal.account.manage.newAccount.title" />
    const subTitle = this.props.account ? `${accountBrand.initialValue} / ${this.props.account.get('name')}` : 'udn'

    const providerType =  providerTypes && providerTypes.find(type => type.value === accountType.value)
    const providerTypeLabel = providerType && providerType.label ? providerType.label : <FormattedMessage id="portal.account.manage.providerTypeUnknown.text" />

    return (

      <Modal dialogClassName="account-form-sidebar configuration-sidebar" show={show}>
        <Modal.Header>
          <h1>{title}</h1>
          <p>{subTitle}</p>
        </Modal.Header>

        <Modal.Body>
          <form>

            <FormGroup controlId="account-name" validationState={getReduxFormValidationState(accountName)}>
              <ControlLabel><FormattedMessage id="portal.account.manage.accountName.title" /></ControlLabel>
              <FormControl
                {...accountName}
                placeholder={this.props.intl.formatMessage({id: 'portal.account.manage.enterAccount.placeholder.text'})}
              />
              {accountName.touched && accountName.error &&
                <HelpBlock className='error-msg'>{accountName.error}</HelpBlock>
              }
            </FormGroup>

            <hr/>

            <FormGroup validationState={getReduxFormValidationState(accountBrand)}>
              <ControlLabel><FormattedMessage id="portal.account.manage.brand.title" /></ControlLabel>
              <SelectWrapper
                {... accountBrand}
                className="input-select"
                value={accountBrand.value}
                options={BRAND_OPTIONS}
              />
              {accountBrand.touched && accountBrand.error &&
                <HelpBlock className='error-msg'>{accountBrand.error}</HelpBlock>
              }
            </FormGroup>

            <hr/>

            <FormGroup>
              <ControlLabel><FormattedMessage id="portal.account.manage.accountType.title" /></ControlLabel>
              {this.props.account ?
                <p>{providerTypeLabel}</p>
              :
                <SelectWrapper
                  {...accountType}
                  numericValues={true}
                  value={accountType.value}
                  className="input-select"
                  options={providerTypes}
                />
              }
            </FormGroup>

            <hr/>

            <FormGroup>
              <ControlLabel><FormattedMessage id="portal.account.manage.services.title" /></ControlLabel>
              <MultiOptionSelector
                options={serviceOptions}
                field={{
                  onChange: val => {services.onChange(val)},
                  value: List(services.value)
                }}
              />
            </FormGroup>

            <ButtonToolbar className="text-right extra-margin-top">
              <Button id="cancel-btn" className="btn-outline" onClick={onCancel}><FormattedMessage id="portal.button.cancel" /></Button>
              <Button id="save-btn" disabled={this.props.invalid} bsStyle="primary"
                      onClick={this.save}>{this.props.account ? <FormattedMessage id="portal.button.save" /> : <FormattedMessage id="portal.button.add" />}</Button>
            </ButtonToolbar>
          </form>
        </Modal.Body>
      </Modal>
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

const mapStateToProps = (state) => {
  const accountType = state.form && state.form.account && state.form.account.accountType && state.form.account.accountType.value !== "" ?  state.form.account.accountType.value : undefined

  return {
    providerTypes: getProviderTypeOptions(state),
    serviceOptions: accountType && getServiceOptions(state, accountType)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchServiceInfo: () => dispatch( serviceInfofetchAll() )
  }
}

export default reduxForm({
  fields: ['accountName', 'accountBrand', 'accountType', 'services'],
  form: 'account',
  validate,
  initialValues: {
    accountBrand: BRAND_OPTIONS.length ? BRAND_OPTIONS[0][0] : '',
    accountType: '',
    services: []
  }
}, mapStateToProps,mapDispatchToProps)(injectIntl(AccountForm))
