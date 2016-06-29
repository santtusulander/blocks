import React, { PropTypes } from 'react'
import { reduxForm } from 'redux-form'
import {
  Modal,
  Input,
  ButtonToolbar,
  Button
} from 'react-bootstrap'

import SelectWrapper from '../select-wrapper.jsx'
import CheckboxArray from '../checkboxes.jsx'

import { ACCOUNT_TYPES, SERVICE_TYPES, BRANDS } from '../../constants/account-management-options'

import './add-account-form.scss'

const accountTypeOptions = ACCOUNT_TYPES.map(e => {
  return [ e.value, e.label]
});

const brandOptions = BRANDS.map(e => {
  return [ e.id, e.brandName ]
});


let errors = {}

const validate = (values) => {
  errors = {}

  const { accountName, accountBrand, serviceType } = values

  if(!accountName || accountName.length === 0) {
    errors.accountName = 'Account name is required'
  }
  if(!accountBrand || accountBrand.length === 0) {
    errors.accountBrand = 'Account brand is required'
  }
  if(!serviceType) {
    errors.serviceType = 'Service type is required'
  }

  return errors;
}

class NewAccountForm extends React.Component {
  constructor(props) {
    super(props)

    this.save = this.save.bind(this)
  }

  save() {
    if(!Object.keys(errors).length) {
      const {
        fields: { accountBrand, accountName, accountType, serviceType }
      } = this.props
      this.props.onSave({
        brand: accountBrand.value,
        name: accountName.value,
        type: accountType.value,
        serviceType: serviceType.value
      })
    }
  }

  render() {
    const { fields: { accountBrand, accountName, accountType, services }, show, onCancel } = this.props
    const serviceTypes = SERVICE_TYPES.filter(item => item.accountType === Number(accountType.value))
    return (
      <Modal dialogClassName="add-account-form-sidebar" show={show}>
        <Modal.Header>
          <h1>Add new account</h1>
          <p>Lorem ipsum</p>
        </Modal.Header>

        <Modal.Body>
          <form>

            <Input
              {...accountName}
              type="text"
              label="Account name"
              placeholder='Enter Account Name'/>
            {accountName.touched && accountName.error &&
              <div className='error-msg'>{accountName.error}</div>}

            <hr/>

            <div className='form-group'>
              <label className='control-label'>Brand</label>
              <SelectWrapper
                    { ... accountBrand }
                    className="input-select"
                    options={brandOptions}
              />
            </div>
            {accountBrand.touched && accountBrand.error &&
              <div className='error-msg'>{accountBrand.error}</div>}

            <hr/>

            <div className='form-group'>
              <label className='control-label'>Account type</label>
              <SelectWrapper
                    { ...accountType }
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
                onClick={this.save}>Add</Button>
            </ButtonToolbar>
          </form>
        </Modal.Body>
      </Modal>
    )
  }
}

NewAccountForm.propTypes = {
  fields: PropTypes.object,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  show: PropTypes.bool
}

export default reduxForm({
  fields: ['accountName', 'accountBrand', 'accountType', 'services'],
  form: 'new-account',
  validate
})(NewAccountForm)
