import React, { PropTypes } from 'react'
import { reduxForm } from 'redux-form'
import { Map }from 'immutable'
import {
  Modal,
  Input,
  ButtonToolbar,
  Button
} from 'react-bootstrap'

import SelectWrapper from '../select-wrapper.jsx'
import CheckboxArray from '../checkboxes.jsx'

import {
  ACCOUNT_TYPES,
  SERVICE_TYPES,
  NAME_VALIDATION_REGEXP,
  BRAND_OPTIONS,
  ACCOUNT_TYPE_OPTIONS
} from '../../constants/account-management-options'

import { checkForErrors } from '../../util/helpers'

import './account-form.scss'

import { FormattedMessage, injectIntl } from 'react-intl'

const validate = ({ accountName, accountBrand, accountType, services }) => {
  const conditions = {
    accountName: [
      {
        condition: ! new RegExp( NAME_VALIDATION_REGEXP ).test(accountName),
        errorText: <div key={accountName}>{[<FormattedMessage id="portal.account.manage.invalidAccountName.text" />, <div key={1}>
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

      accountName.onChange(account.get('name'))
      accountType.onChange(account.get('provider_type'))
      services.onChange(account.get('services'))
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.fields.accountType.value !== this.props.fields.accountType.value) {
      const { fields: { services, accountType } } = nextProps
      const activeServiceTypes  = SERVICE_TYPES.filter(item => item.accountTypes.includes(accountType.value))
      const activeServiceValues = activeServiceTypes.map(item => item.value)
      const checkedServiceTypes = services.value.filter(item => activeServiceValues.includes(item))
      services.onChange(checkedServiceTypes)
    }
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

      if (this.props.account) {
        this.props.onSave(accountBrand.value, this.props.account.get('id'), data)
      } else {
        this.props.onSave(accountBrand.value, data)
      }
    }
  }

  render() {
    const { fields: { accountBrand, accountName, accountType, services }, show, onCancel } = this.props
    const serviceTypes = SERVICE_TYPES.filter(item => item.accountTypes.includes(accountType.value))

    // accountBrand.initialValue = BRAND_OPTIONS.length > 1 ? '' : BRAND_OPTIONS[0][0]

    const title = this.props.account ? <FormattedMessage id="portal.account.manage.editAccount.title" /> : <FormattedMessage id="portal.account.manage.newAccount.title" />
    const subTitle = this.props.account ? `${accountBrand.initialValue} / ${this.props.account.get('name')}` : 'udn'

    return (
      <Modal dialogClassName="account-form-sidebar configuration-sidebar" show={show}>
        <Modal.Header>
          <h1>{title}</h1>
          <p>{subTitle}</p>
        </Modal.Header>

        <Modal.Body>
          <form>

            <Input
              {...accountName}
              type="text"
              label="Account name"
              placeholder={this.props.intl.formatMessage({id: 'portal.account.manage.enterAccount.placeholder.text'})} />
            {accountName.touched && accountName.error &&
              <div className='error-msg'>{accountName.error}</div>
            }

            <hr/>

            <div className='form-group'>
              <label className='control-label'><FormattedMessage id="portal.account.manage.brand.title" /></label>
              <SelectWrapper
                {... accountBrand}
                className="input-select"
                value={accountBrand.value}
                options={BRAND_OPTIONS}
              />
            </div>
            {accountBrand.touched && accountBrand.error &&
            <div className='error-msg'>{accountBrand.error}</div>}

            <hr/>

            <div className='form-group'>
              <label className='control-label'><FormattedMessage id="portal.account.manage.accountType.title" /></label>
              {this.props.account ?
                <p>{accountType.value && ACCOUNT_TYPES.find(type => type.value === accountType.value).label}</p>
              :
                <SelectWrapper
                  {...accountType}
                  numericValues={true}
                  value={accountType.value}
                  className="input-select"
                  options={ACCOUNT_TYPE_OPTIONS}
                />
              }
            </div>

            <hr/>

            <label><FormattedMessage id="portal.account.manage.services.title" /></label>
            <CheckboxArray iterable={serviceTypes} field={services}/>
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
  fields: PropTypes.object,
  invalid: PropTypes.bool,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  show: PropTypes.bool
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
})(injectIntl(AccountForm))
