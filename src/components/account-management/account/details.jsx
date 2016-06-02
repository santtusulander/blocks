import React from 'react'
import { Row, Col, Input, OverlayTrigger, Tooltip, ButtonToolbar } from 'react-bootstrap'
import Select from '../../select.jsx'
import { ButtonWrapper as Button } from '../../button.js'
import { reduxForm } from 'redux-form'

import IconAdd from '../../icons/icon-add.jsx'
import IconEdit from '../../icons/icon-edit.jsx'

//import HoverToolTip from '../../hover-tool-tip/hover-tool-tip.jsx'

import './details.scss'

const fakeBrands = [
  { id: 1, brandName: 'Brand Name 1' },
  { id: 2, brandName: 'Brand Name 2' },
  { id: 3, brandName: 'Brand Name 3' }
];

const brandOptions = fakeBrands.map( (e) => {
  return [ e.id, e.brandName ]
});

const fakeAccounts = [
  { id: 1, accountName: 'Test Account 1', brandId: 1 },
  { id: 2, accountName: 'Test Account 2', brandId: 2 },
  { id: 3, accountName: 'Test Account 3', brandId: 3 },
  { id: 4, accountName: 'Test Account 4', brandId: 1 },
  { id: 5, accountName: 'Test Account 5', brandId: 2 }
]

const accountOptions = fakeAccounts.map( (e) => {
  return [ e.id, e.accountName]
});

const fakeAccountTypes = [
  'UDN Network Partner',
  'Media Delivery',
  'Storage'
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

/*function handleSelectChange(path) {
  return value => {
    this.props.changeValue(path, value)
  }
}*/

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

        <div className="form-group">
          <label className="col-xs-3 control-label">Account Name</label>
          <Col xs={8}>
            <div className="input-group">
              <Select className="input-select"
              onSelect={ e => { /* e.target.getAttribute('data-value')  brand.setField('kakka' e.target.getAttribute('data-value')) ) */ } }
              addonAfter=' '
              options={ accountOptions }
              />

              <span className="input-group-addon">
                <OverlayTrigger placement="top" overlay={
                  <Tooltip id="tooltip_brand">
                    <div className="tooltip-header">Account Name</div>
                    <div className="text-sm">Lorem ipsum ...</div>
                  </Tooltip>
                  }>

                  <Button bsStyle="link" className="btn-icon">?</Button>
                </OverlayTrigger>
              </span>
            </div>
          </Col>
        </div>

        <div className="form-group">
          <label className="col-xs-3 control-label">Brand</label>
          <Col xs={6}>
            <div className="input-group">
              <Select className="input-select"
                onSelect={ e => { /* e.target.getAttribute('data-value')  brand.setField('kakka' e.target.getAttribute('data-value')) ) */ } }
                addonAfter=' '
                options={ brandOptions }
              />

              <span className="input-group-addon">
                <ButtonToolbar>
                  <Button bsStyle="success" icon={true} addNew={true} onClick={props.onAdd}>
                    <IconAdd/>
                  </Button>

                  <Button bsStyle="primary" icon={true} addNew={true} onClick={props.onAdd}>
                    <IconEdit/>
                  </Button>

                  <OverlayTrigger placement="top" overlay={
                    <Tooltip id="tooltip_brand">
                      <div className="tooltip-header">Brand</div>
                      <div className="text-sm">Lorem ipsum ...</div>
                    </Tooltip>
                    }>

                    <Button bsStyle="link" className="btn-icon">?</Button>
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
              <Select className="input-select"
                onSelect={ e => { /* e.target.getAttribute('data-value')  brand.setField('kakka' e.target.getAttribute('data-value')) ) */ } }
                addonAfter=' '
                options={ accountTypeOptions }
              />

              <span className="input-group-addon">
                <OverlayTrigger placement="top" overlay={
                  <Tooltip id="tooltip_brand">
                    <div className="tooltip-header">Account Type</div>
                    <div className="text-sm">Lorem ipsum ...</div>
                  </Tooltip>
                  }>

                  <Button bsStyle="link" className="btn-icon">?</Button>
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
                      label={ option }
                      onChange={ e => e.target.checked ? services.addField(e.target.value) : services.removeField(services.indexOf(e.target.value)) }
                    />
                  </div>
                )
              })
            }
          </Col>
        </div>

        <Row>
        <ButtonToolbar className="text-right extra-margin-top">
          <Button disabled={ Object.keys(errors).length > 0 } bsStyle="primary" onClick={props.onSave} >Save</Button>
        </ButtonToolbar>
        </Row>
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
