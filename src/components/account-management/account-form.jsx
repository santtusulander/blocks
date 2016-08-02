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

import { ACCOUNT_TYPES, SERVICE_TYPES, BRANDS } from '../../constants/account-management-options'

import './account-form.scss'

const accountTypeOptions = ACCOUNT_TYPES.map(e => {
  return [e.value, e.label]
});

const brandOptions = BRANDS.map(e => {
  return [e.id, e.brandName]
});

let errors = {}

const validate = (values) => {
  errors = {}

  const { accountName, accountBrand, services } = values

  if(!accountName || accountName.length === 0) {
    errors.accountName = 'Account name is required'
  }
  if( accountName && !/^[a-zA-Z0-9_\.,\-\&\(\)\[\]]{3,40}$/g.test(accountName) ) {
    errors.accountName = 'Account name is invalid'
  }
  if(!accountBrand || accountBrand.length === 0) {
    errors.accountBrand = 'Account brand is required'
  }
  if(services && services.length === 0) {
    errors.serviceType = 'Service type is required'
  }

  return errors;
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
    if(!Object.keys(errors).length) {
      const {
        fields: { accountBrand, accountName, accountType, services }
      } = this.props
      let data = {
        name: accountName.value,
        provider_type: Number(accountType.value),
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

    accountBrand.initialValue = brandOptions.length > 1 ? '' : brandOptions[0][0]

    const title = this.props.account ? 'Edit Account' : 'Add new account'
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
              placeholder='Enter Account Name'/>
            {accountName.touched && accountName.error &&
              <div className='error-msg'>{accountName.error}</div>
            }

            <hr/>

            <div className='form-group'>
              <label className='control-label'>Brand</label>
              <SelectWrapper
                {... accountBrand}
                className="input-select"
                value={accountBrand.value}
                options={brandOptions}
              />
            </div>
            {accountBrand.touched && accountBrand.error &&
            <div className='error-msg'>{accountBrand.error}</div>}

            <hr/>

            <div className='form-group'>
              <label className='control-label'>Account type</label>
              <SelectWrapper
                {...accountType}
                numericValues={true}
                value={Number(accountType.value)}
                className="input-select"
                options={accountTypeOptions}
              />
            </div>

            <hr/>

            <label>Service type</label>
            <CheckboxArray iterable={serviceTypes} field={services}/>
            <ButtonToolbar className="text-right extra-margin-top">
              <Button className="btn-outline" onClick={onCancel}>Cancel</Button>
              <Button disabled={!!Object.keys(errors).length} bsStyle="primary"
                      onClick={this.save}>{this.props.account ? 'Save' : 'Add'}</Button>
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
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  show: PropTypes.bool
}

export default reduxForm({
  fields: ['accountName', 'accountBrand', 'accountType', 'services'],
  form: 'account',
  validate,
  initialValues: {
    accountBrand: brandOptions.length ? brandOptions[0][0] : '',
    accountType: accountTypeOptions.length ? accountTypeOptions[0][0] : '',
    services: []
  }
})(AccountForm)
