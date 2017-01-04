import React from 'react'
import { Col, /*OverlayTrigger, Tooltip,*/ ButtonToolbar, FormControl } from 'react-bootstrap'
import { Map, is, fromJS } from 'immutable'
import { reduxForm } from 'redux-form'
import { withRouter } from 'react-router'

import PageContainer from '../../../components/layout/page-container'
// import SelectWrapper from '../../select-wrapper.jsx'
import CheckboxArray from '../../checkboxes.jsx'
import UDNButton from '../../button'
import IsAllowed from '../../is-allowed'

// import IconAdd from '../../icons/icon-add.jsx'
// import IconEdit from '../../icons/icon-edit.jsx'
import { ACCOUNT_TYPES, SERVICE_TYPES } from '../../../constants/account-management-options'
import { MODIFY_ACCOUNTS } from '../../../constants/permissions'

import './account.scss'

import {FormattedMessage, injectIntl} from 'react-intl';

import {isUdnAdmin} from '../../../redux/modules/user'

// const brandOptions = BRANDS.map( (e) => {
//   return [ e.id, e.brandName ]
// });

// const accountTypeOptions = ACCOUNT_TYPES.map(e => {
//   return [ e.value, e.label]
// });

class AccountManagementAccountDetails extends React.Component {
  constructor(props) {
    super(props)
    this.shouldLeave = this.shouldLeave.bind(this)
    this.save = this.save.bind(this)
    this.isLeaving = false;
  }

  componentWillMount() {
    const { router, route } = this.props
    router.setRouteLeaveHook(route, this.shouldLeave)
  }

  componentWillReceiveProps(nextProps) {
    const { fields: { accountType, services } } = nextProps
    if(accountType.value !== this.props.fields.accountType.value && services.value !== '') {
      const activeServiceTypes = SERVICE_TYPES.filter(item => item.accountTypes.includes(accountType.value))
      const activeServiceValues = activeServiceTypes.map(item => item.value)
      const checkedServiceTypes = services.value.filter(item => activeServiceValues.includes(item))
      services.onChange(checkedServiceTypes)
    }
  }

  componentWillUpdate() {
    if(this.isLeaving) {
      this.isLeaving = false
    }
  }

  save() {
    if(!this.props.invalid) {
      const { fields: { accountName, accountType, services } } = this.props
      this.props.onSave('udn', this.props.account.get('id'), {
        name: accountName.value,
        provider_type: Number(accountType.value),
        services: services.value
      })
    }
  }

  isDirty() {
    const { fields, account } = this.props
    const services = fields.services.value

    if (account.get('services') && !is(fromJS(services), account.get('services')) ||
      !account.get('services') && fromJS(services).size) {
      return true;
    }

    for(const key in fields) {
      if(key !== 'services' && fields[key].value !== fields[key].initialValue) {
        return true;
      }
    }

    return false;
  }

  shouldLeave({ pathname }) {
    if (!this.isLeaving && this.isDirty() && this.props.account.size) {
      this.props.uiActions.showInfoDialog({
        title: <FormattedMessage id='portal.account.manage.unsavedChanges.warning.title'/>,
        content: <FormattedMessage id='portal.account.manage.unsavedChanges.warning.content'/>,
        stayButton: true,
        continueButton: true,
        cancel: this.props.uiActions.hideInfoDialog,
        onSubmit: () => {
          this.isLeaving = true
          this.props.router.push(pathname)
          this.props.uiActions.hideInfoDialog()
        }
      })

      return false;
    }

    return true
  }

  render() {
    const { fields: { accountName, accountType, services } } = this.props
    const checkBoxes = SERVICE_TYPES.filter(item => item.accountTypes.includes(accountType.value))
    return (
      <PageContainer className="account-management-account-details">
        <h2><FormattedMessage id="portal.account.manage.account.title"/></h2>
        <form className='form-horizontal'>

          <div className="form-group">
            <label className="col-xs-3 control-label">Brand</label>
            <Col xs={6}>
              <div className="input-group input-group-static">

                <span className="form-control-static">UDN</span>
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

                    {/* TODO: Get real tooltip content
                    <OverlayTrigger placement="top" overlay={
                      <Tooltip id="tooltip_brand">
                        <div className="tooltip-header">Brand</div>
                        <div className="text-sm"> ...</div>
                      </Tooltip>
                      }>

                      <UDNButton bsStyle="link" className="btn-icon">?</UDNButton>
                    </OverlayTrigger>
                    */}
                  </ButtonToolbar>
                </span>
              </div>
            </Col>
          </div>

          <div className="form-group">
            <label className="col-xs-3 control-label">Account Name</label>
            <Col xs={8}>
              {/* <div className="input-group"> */}
              <IsAllowed to={MODIFY_ACCOUNTS}>
                <FormControl
                  {...accountName}
                  placeholder={this.props.intl.formatMessage({id: 'portal.account.manage.enterAccount.placeholder.text'})}
                  className="form-control"/>
              </IsAllowed>
              <IsAllowed not={true} to={MODIFY_ACCOUNTS}>
                <div className="input-group input-group-static">
                  <span className="form-control-static">
                    {accountName.value}
                  </span>
                </div>
              </IsAllowed>
                {/* TODO: Get real tooltip content
                <span className="input-group-addon">
                  <OverlayTrigger placement="top" overlay={
                    <Tooltip id="tooltip_brand">
                      <div className="tooltip-header">Account Name</div>
                      <div className="text-sm"> ...</div>
                    </Tooltip>
                    }>

                    <UDNButton bsStyle="link" icon={true}>?</UDNButton>
                  </OverlayTrigger>
                </span>
                */}
              {/* </div> */}

              {accountName.touched && accountName.error &&
              <div className='error-msg errorAccountName'>{accountName.error}</div>}
            </Col>
          </div>

          <div className="form-group">
            <label className="col-xs-3 control-label"><FormattedMessage id="portal.account.manage.accountType.text"/></label>
            <Col xs={3}>
              {/* Not editable in 0.8
              <div className="input-group">
                <SelectWrapper
                  {...accountType}
                  numericValues={true}
                  className="input-select"
                  options={accountTypeOptions}
                />
                */}

              <div className="input-group input-group-static">
                <span className="form-control-static">
                  {accountType.value && ACCOUNT_TYPES.find(type => type.value === accountType.value).label}
                </span>

                {/* TODO: Get real tooltip content
                <span className="input-group-addon">
                  <OverlayTrigger placement="top" overlay={
                    <Tooltip id="tooltip_account_type">
                      <div className="tooltip-header">Account Type</div>
                      <div className="text-sm"> ...</div>
                    </Tooltip>
                    }>

                    <UDNButton bsStyle="link" className="btn-icon">?</UDNButton>
                  </OverlayTrigger>
                </span>
                */}
              </div>
            </Col>
          </div>

          <div className="form-group">
            <label className="col-xs-3 control-label"><FormattedMessage id="portal.account.manage.services.text"/></label>
            <Col xs={3}>
              {/*TODO: remove isUdnAdmin - check as part of UDNP-1713 */}
              <CheckboxArray iterable={checkBoxes} field={services} disabled={!isUdnAdmin(this.props.currentUser)}/>
            </Col>
          </div>

          <ButtonToolbar className="text-right extra-margin-top">
            <IsAllowed to={MODIFY_ACCOUNTS}>
              <UDNButton disabled={this.props.invalid} bsStyle="primary" onClick={this.save}>Save</UDNButton>
            </IsAllowed>
          </ButtonToolbar>
        </form>
      </PageContainer>
    )
  }
}

AccountManagementAccountDetails.displayName = 'AccountManagementAccountDetails'
AccountManagementAccountDetails.propTypes = {
  account: React.PropTypes.instanceOf(Map),
  currentUser: React.PropTypes.instanceOf(Map),
  fields: React.PropTypes.object,
  intl: React.PropTypes.object,
  invalid: React.PropTypes.bool,
  // onAdd: React.PropTypes.func,
  onSave: React.PropTypes.func,
  route: React.PropTypes.object,
  router: React.PropTypes.object,
  // toggleModal: React.PropTypes.func,
  uiActions: React.PropTypes.object
}
AccountManagementAccountDetails.defaultProps = {
  account: Map({})
}

export default reduxForm({
  fields: ['accountName', 'brand', 'accountType', 'services'],
  form: 'account-details'
})(withRouter(injectIntl(AccountManagementAccountDetails)))
