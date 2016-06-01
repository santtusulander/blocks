import React from 'react'
import { Modal, Input, ButtonToolbar, Button, Label } from 'react-bootstrap'
import {reduxForm} from 'redux-form'

import './details.scss'

const fakeBrands = [
  { id: 1, brandName: 'Brand Name 1' },
  { id: 2, brandName: 'Brand Name 2' },
  { id: 3, brandName: 'Brand Name 3' }
];

const brandOptions = fakeBrands.map( (e) => {
  return <option value={e.id}>{e.brandName}</option>;
});

const fakeAccounts = [
  { id: 1, accountName: 'Test Account 1', brandId: 1 },
  { id: 2, accountName: 'Test Account 2', brandId: 2 },
  { id: 3, accountName: 'Test Account 3', brandId: 3 },
  { id: 4, accountName: 'Test Account 4', brandId: 1 },
  { id: 5, accountName: 'Test Account 5', brandId: 2 }
]

const accountOptions = fakeAccounts.map( (e) => {
  return <option value={e.id}>{e.accountName}</option>;
});

const fakeAccountTypes = [
  'UDN Network Partner',
  'Media Delivery',
  'Storage'
]

const accountTypeOptions = fakeAccountTypes.map( (e) => {
  return <option value={e}>{e}</option>;
});


let errors = {}

const validate = values => {
  errors = {}

  const { accountName, brand, accountType } = values

  return errors;

}

const AccountManagementAccountDetails = (props) => {

  const { fields: { accountName, brand, accountType, services } } = props

  const servicesOptions = [
    'UDN Network Partner',
    'Media Delivery',
    'Storage'
  ]

  return (
    <div className="account-management-account-details">
      <h2>Details</h2>

      <form className='form-horizontal'>

        <Input
          { ...accountName }
          type="select"
          label="Account Name"
          placeholder="Select"
        >
          { accountOptions }
        </Input>

        <Input
          { ...brand }
          type="select"
          label="Brand"
          placeholder="Select"
        >
          { brandOptions }
        </Input>

        <Input
          { ...accountType }
          type="select"
          label="Account Type"
          placeholder="Select"
        >
          { accountTypeOptions }
        </Input>

        <div className='form-group'>
          <label className='control-label'>Services</label>

          <div className='checkbox-group'>
          {
            servicesOptions.map( (option, index) => {
              return (
                <div  key={index} className='checkbox-div'>
                  <Input
                    value={option}
                    type='checkbox'
                    label={ option }
                    onChange={ e => e.target.checked ? services.addField(e.target.value) : services.removeField(services.indexOf(e.target.value)) }
                  />
                </div>
              )
            })
          }
          </div>
        </div>

        <ButtonToolbar className="text-right extra-margin-top">
          <Button bsStyle="primary" className="btn-outline" onClick={props.onCancel}>Cancel</Button>
          <Button disabled={ Object.keys(errors).length > 0 } bsStyle="primary" onClick={props.onSave} >Save</Button>
        </ButtonToolbar>
      </form>
    </div>
  )
}

AccountManagementAccountDetails.displayName = 'AccountManagementAccountDetails'
AccountManagementAccountDetails.propTypes = {}

export default reduxForm({
  fields: ['accountName', 'brand', 'accountType', 'services[]'],
  form: 'account-details',
  validate
})(AccountManagementAccountDetails)
