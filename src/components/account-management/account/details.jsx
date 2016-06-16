import React from 'react'
import { Col, Input, OverlayTrigger, Tooltip, ButtonToolbar } from 'react-bootstrap'
import SelectWrapper from '../../select-wrapper.jsx'

import UDNButton from '../../button.js'
import { reduxForm } from 'redux-form'

import IconAdd from '../../icons/icon-add.jsx'
import IconEdit from '../../icons/icon-edit.jsx'

import './details.scss'

const fakeBrands = [
  { id: 'udn', brandName: 'UDN' }
];

const brandOptions = fakeBrands.map( (e) => {
  return [ e.id, e.brandName ]
});

const fakeAccountTypes = [
  'Content Provider',
  'Service Provider'
]

const accountTypeOptions = fakeAccountTypes.map( (e) => {
  return [ e, e ]
});


let errors = {}

const validate = values => {
  errors = {}

  const { accountName, brand, accountType } = values

  return errors;

}

const servicesOptions = [
  'UDN Network Partner',
  'Media Delivery',
  'Storage'
]

const AccountManagementAccountDetails = (props) => {

  const { fields: { accountName, brand, accountType, services } } = props

  return (
    <div className="account-management-account-details">
      <h2>Details</h2>

      <form className='form-horizontal'>

        <div className="form-group">
          <label className="col-xs-3 control-label">Account Name</label>
          <Col xs={8}>
            <div className="input-group">
              <input
                { ... accountName }
                type="text"
                placeholder="Enter Account Name"
                className="form-control"/>

              <span className="input-group-addon">
                <OverlayTrigger placement="top" overlay={
                  <Tooltip id="tooltip_brand">
                    <div className="tooltip-header">Account Name</div>
                    <div className="text-sm">Lorem ipsum ...</div>
                  </Tooltip>
                  }>

                  <UDNButton bsStyle="link" className="btn-icon">?</UDNButton>
                </OverlayTrigger>
              </span>
            </div>
          </Col>
        </div>

        <div className="form-group">
          <label className="col-xs-3 control-label">Brand</label>
          <Col xs={6}>
            <div className="input-group">

              <SelectWrapper
                { ... brand }
                className="input-select"
                options={brandOptions}
              />

              <span className="input-group-addon">
                <ButtonToolbar>
                  <UDNButton bsStyle="success" icon={true} addNew={true}
                    onClick={props.onAdd}>
                    <IconAdd/>
                  </UDNButton>

                  <UDNButton bsStyle="primary" icon={true} addNew={true}
                    onClick={props.onAdd}>
                    <IconEdit/>
                  </UDNButton>

                  <OverlayTrigger placement="top" overlay={
                    <Tooltip id="tooltip_brand">
                      <div className="tooltip-header">Brand</div>
                      <div className="text-sm">Lorem ipsum ...</div>
                    </Tooltip>
                    }>

                    <UDNButton bsStyle="link" className="btn-icon">?</UDNButton>
                  </OverlayTrigger>
                </ButtonToolbar>
              </span>

            </div>
          </Col>
        </div>

        <div className="form-group">
          <label className="col-xs-3 control-label">Account Type</label>
          <Col xs={3}>
            <div className="input-group">
              <SelectWrapper
                { ... accountType }
                className="input-select"
                options={accountTypeOptions}
              />

              <span className="input-group-addon">
                <OverlayTrigger placement="top" overlay={
                  <Tooltip id="tooltip_brand">
                    <div className="tooltip-header">Account Type</div>
                    <div className="text-sm">Lorem ipsum ...</div>
                  </Tooltip>
                  }>

                  <UDNButton bsStyle="link" className="btn-icon">?</UDNButton>
                </OverlayTrigger>
              </span>
            </div>
          </Col>
        </div>

        <div className="form-group">
          <label className="col-xs-3 control-label">Services</label>
          <Col xs={3}>
            {
              servicesOptions.map( (option, index) => {
                return (
                  <div key={index} className='checkbox-div'>
                    <Input
                      value={option}
                      type='checkbox'
                      label={option}
                      onChange={e => e.target.checked ? services.addField(e.target.value) : services.removeField(services.indexOf(e.target.value))}
                    />
                  </div>
                )
              })
            }
          </Col>
        </div>

        <ButtonToolbar className="text-right extra-margin-top">
          <UDNButton
            disabled={Object.keys(errors).length > 0}
            bsStyle="primary"
            onClick={props.onSave}>
            Save
          </UDNButton>
        </ButtonToolbar>
      </form>
    </div>
  )
}

AccountManagementAccountDetails.displayName = 'AccountManagementAccountDetails'
AccountManagementAccountDetails.propTypes = {
  fields: React.PropTypes.object,
  onAdd: React.PropTypes.func,
  onSave: React.PropTypes.func
}

export default reduxForm({
  fields: ['accountName', 'brand', 'accountType', 'services[]'],
  form: 'account-details',
  validate
})(AccountManagementAccountDetails)
