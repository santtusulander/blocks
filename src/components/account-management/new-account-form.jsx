import React, { PropTypes } from 'react'
import {
  Modal,
  Input,
  ButtonToolbar,
  Button
} from 'react-bootstrap'

import SelectWrapper from '../select-wrapper.jsx'

import { reduxForm } from 'redux-form'
import { ACCOUNT_TYPES, SERVICE_TYPES } from '../../constants/account-management-options'

import './new-account-form.scss'

const serviceTypeOptions = ACCOUNT_TYPES.map((e, i) => {
  return [ e.value, e.label]
});

let errors = {}

const validate = (values) => {
  errors = {}

  const { accountName, accountBrand, serviceType } = values

  if(!accountName || accountName.length === 0) errors.accountName = 'Account name is required'
  if(!accountBrand || accountBrand.length === 0) errors.accountBrand = 'Account brand is required'
  if(!serviceType) errors.serviceType = 'Service type is required'

  return errors;
}

const NewAccountForm = (props) => {

  const { fields: { accountName, accountBrand, serviceType }, show, onCancel, onSave } = props

  return (
    <Modal dialogClassName='account-management-new-account' show={show}>
      <Modal.Header>
        <h1>Add new account</h1>
        <p>Lorem ipsum</p>
      </Modal.Header>

      <Modal.Body>
        <form className='new-account-form'>

          <Input
            {...accountName}
            type="text"
            label="Account name"
            placeholder='Enter Account Name'
            groupClassName="border-bottom"/>
          {accountName.touched && accountName.error && <div className='error-msg'>{accountName.error}</div>}

          <Input
            {...accountBrand}
            type="text"
            label="Brand"
            placeholder='Enter Brand'
            groupClassName="border-bottom"/>
          {accountBrand.touched && accountBrand.error && <div className='error-msg'>{accountBrand.error}</div>}

          <div className='form-group'>
            <SelectWrapper
                  { ... serviceType }
                  className="input-select"
                  options={ serviceTypeOptions }
            />
          </div>
          
          <label>Service type</label>
          {SERVICE_TYPES.map((e, i) => {
            return <Input {...serviceType} value={e} key={i} type="radio" label={e}/>
          })
          }

          <ButtonToolbar className="text-right">
            <Button bsStyle="primary" className="btn-outline" onClick={onCancel}>Cancel</Button>
            <Button disabled={!!Object.keys(errors).length} bsStyle="primary" onClick={onSave}>Add</Button>
          </ButtonToolbar>
        </form>
      </Modal.Body>
    </Modal>
  )
}

NewAccountForm.propTypes = {
  fields: PropTypes.object,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  show: PropTypes.bool
}

export default reduxForm({
  fields: ['accountName', 'accountBrand', 'serviceType'],
  form: 'new-account',
  validate
})(NewAccountForm)
