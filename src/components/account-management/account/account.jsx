import React from 'react'
import { Col, OverlayTrigger, Tooltip, ButtonToolbar } from 'react-bootstrap'
import { Map, is, fromJS } from 'immutable'
import { reduxForm } from 'redux-form'
import { withRouter } from 'react-router'

import SelectWrapper from '../../select-wrapper.jsx'
import CheckboxArray from '../../checkboxes.jsx'
import UDNButton from '../../button.js'
import InfoModal from '../../info-modal.jsx'

// import IconAdd from '../../icons/icon-add.jsx'
// import IconEdit from '../../icons/icon-edit.jsx'
import { ACCOUNT_TYPES, SERVICE_TYPES } from '../../../constants/account-management-options'

import './account.scss'

// const brandOptions = BRANDS.map( (e) => {
//   return [ e.id, e.brandName ]
// });

const accountTypeOptions = ACCOUNT_TYPES.map(e => {
  return [ e.value, e.label]
});


let errors = {}

const validate = values => {
  errors = {}

  const { accountName } = values
  if(!accountName || accountName.length === 0) errors.accountName = 'Account name is required'

  return errors;

}

class AccountManagementAccountDetails extends React.Component {
  constructor(props) {
    super(props)
    this.shouldLeave = this.shouldLeave.bind(this)
    this.save = this.save.bind(this)
    this.state = { showModal: false, next: '', leaving: false }
  }

  componentDidMount() {
    const { router, route } = this.props
    router.setRouteLeaveHook(route, this.shouldLeave)
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.fields.accountType.value !== this.props.fields.accountType.value) {
      const { fields: { services, accountType } } = nextProps
      const activeServiceTypes = SERVICE_TYPES.filter(item => item.accountTypes.includes(accountType.value))
      const activeServiceValues = activeServiceTypes.map(item => item.value)
      const checkedServiceTypes = services.value.filter(item => activeServiceValues.includes(item))
      services.onChange(checkedServiceTypes)
    }
  }

  save() {
    if(!Object.keys(errors).length) {
      const { fields: { accountName } } = this.props
      this.props.onSave(this.props.account.get('id'), {
        name: accountName.value
      })
    }
  }

  shouldLeave({ pathname }) {
    const { fields, account } = this.props
    const services = fields.services.value
    if(!is(fromJS(services), account.get('services'))) {
      this.setState({ showModal: true, next: pathname })
      return this.state.leaving
    }
    for(const key in fields) {
      if(key !== 'services' && fields[key].value !== fields[key].initialValue) {
        this.setState({ showModal: true, next: pathname })
        return this.state.leaving
      }
    }
    return true
  }

  leavePage() {
    Promise.resolve(this.setState({ leaving: true }))
      .then(() => this.props.router.push(this.state.next))
  }

  render() {
    const { fields: { accountName, accountType, services } } = this.props
    const checkBoxes = SERVICE_TYPES.filter(item => item.accountTypes.includes(accountType.value))
    return (
      <div className="account-management-account-details">
        <h2>Account</h2>
        <form className='form-horizontal'>

          <div className="form-group">
            <label className="col-xs-3 control-label">Brand</label>
            <Col xs={6}>
              <div className="input-group brand-row">

                <span className="brand-field">UDN</span>
                {/* Not in 0.7
                  <SelectWrapper
                    { ... brand }
                    className="input-select"
                    options={brandOptions}
                  />*/}


                <span className="input-group-addon brand-tooltip">
                  <ButtonToolbar>
                  {/* Not in 0.7
                      <UDNButton bsStyle="success" icon={true} addNew={true}
                        onClick={this.props.onAdd}>
                        <IconAdd/>
                      </UDNButton>

                      <UDNButton bsStyle="primary" icon={true} addNew={true}
                        onClick={this.props.onAdd}>
                        <IconEdit/>
                      </UDNButton>*/}

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

                    <UDNButton bsStyle="link" icon={true}>?</UDNButton>
                  </OverlayTrigger>
                </span>
              </div>

              {accountName.touched && accountName.error &&
              <div className='error-msg errorAccountName'>{accountName.error}</div>}
            </Col>
          </div>

          <div className="form-group">
            <label className="col-xs-3 control-label">Account Type</label>
            <Col xs={3}>
              <div className="input-group">
                <SelectWrapper
                  { ...accountType }
                  numericValues={true}
                  value={Number(accountType.value)}
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
              <CheckboxArray iterable={checkBoxes} field={services}/>
            </Col>
          </div>

          <ButtonToolbar className="text-right extra-margin-top">
            <UDNButton
              disabled={Object.keys(errors).length > 0}
              bsStyle="primary"
              onClick={this.save}>
              Save
            </UDNButton>
          </ButtonToolbar>
        </form>
        {this.state.showModal &&
          <InfoModal title="Warning" content="You have made changes to the Account and/or Group(s), are you sure you want to exit without saving?">
            <UDNButton onClick={this.leavePage.bind(this)} bsStyle="primary">Continue</UDNButton>
            <UDNButton onClick={() => this.setState({ showModal: false })} bsStyle="primary">Stay</UDNButton>
          </InfoModal>
        }
      </div>
    )
  }
}

AccountManagementAccountDetails.displayName = 'AccountManagementAccountDetails'
AccountManagementAccountDetails.propTypes = {
  account: React.PropTypes.instanceOf(Map),
  fields: React.PropTypes.object,
  onAdd: React.PropTypes.func,
  onSave: React.PropTypes.func,
  toggleModal: React.PropTypes.func
}
AccountManagementAccountDetails.defaultProps = {
  account: Map({})
}

export default reduxForm({
  fields: ['accountName', 'brand', 'accountType', 'services'],
  form: 'account-details',
  validate
})(withRouter(AccountManagementAccountDetails))
