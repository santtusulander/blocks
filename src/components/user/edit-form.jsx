import React, { PropTypes } from 'react'
import { reduxForm } from 'redux-form'
import { Button, ButtonToolbar, Col, Input, Row } from 'react-bootstrap'
import ReactTelephoneInput from 'react-telephone-input'
// import moment from 'moment'
import PasswordFields from '../password-fields'
import SaveBar from '../save-bar'
import IconEye from '../icons/icon-eye.jsx'
// import IconUser from '../icons/icon-user.jsx'

import {FormattedMessage, injectIntl} from 'react-intl';

let errors = {}
let passwordErrors = {}

const validate = (values) => {
  errors = {}
  passwordErrors = {}

  const {
    email,
    password,
    confirm
  } = values

  if(!email || email.length === 0) {
    errors.email = <FormattedMessage id="portal.user.edit.emailRequired.text"/>
  }

  if(password && password !== confirm) {
    passwordErrors.password = <FormattedMessage id="portal.user.edit.passwordDoNotMatch.text"/>
  }

  return errors, passwordErrors;
}

class UserEditForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showMiddleNameField: props.fields.middle_name.value,
      showPasswordField: false,
      passwordVisible: false
    }

    this.save = this.save.bind(this)
    this.savePassword = this.savePassword.bind(this)
    this.showMiddleName = this.showMiddleName.bind(this)
    this.togglePasswordEditing = this.togglePasswordEditing.bind(this)
    this.togglePasswordVisibility = this.togglePasswordVisibility.bind(this)
  }

  save() {
    const {
      fields: {
        first_name,
        middle_name,
        last_name,
        phone_number,
        timezone
      },
      onSave
    } = this.props

    let newValues = {
      first_name: first_name.value,
      middle_name: middle_name.value,
      last_name: last_name.value,
      phone_number: phone_number.value,
      timezone: timezone.value
    }

    onSave(newValues)
  }

  savePassword() {
    const {
      fields: {
        password
      },
      onSave
    } = this.props

    let newValues = {
      password: password.value
    }

    onSave(newValues)
    this.togglePasswordEditing()
  }

  showMiddleName() {
    this.setState({
      showMiddleNameField: true
    })
  }

  togglePasswordEditing() {
    this.setState({
      showPasswordField: !this.state.showPasswordField
    })
  }

  togglePasswordVisibility() {
    this.setState({
      passwordVisible: !this.state.passwordVisible
    })
  }

  render() {
    const {
      fields: {
        confirm,
        email,
        first_name,
        last_name,
        middle_name,
        password,
        phone_number/*,
        timezone*/
      },
      resetForm,
      savingPassword,
      savingUser
    } = this.props

    // ReactTelephoneInput decorates the phone number at render and thus triggers
    // the phone_number.dirty flag. Need to add extra check to see if any actual
    // digits have been changed before showing the Save bar
    const trimmedPhoneNumber = phone_number.value.replace(/\D/g,'');
    const showSaveBar = first_name.dirty || middle_name.dirty || last_name.dirty ||
      (phone_number.dirty && phone_number.initialValue !== trimmedPhoneNumber)

    return (
      <form className="form-horizontal">
        <Row>
          <Col lg={10}>
            {/* Default user icon is waiting for customer approval
              <div className="form-group">
              <Row>
                <label className="col-xs-2 control-label">
                  <FormattedMessage id="portal.user.edit.photo.text"/>
                </label>
                <Col xs={9}>
                  <IconUser width={180} height={180} />
                </Col>
              </Row>
            </div>*/}

            <div className="form-group">
              <Row>
                <label className="col-xs-2 control-label">
                  <FormattedMessage id="portal.user.edit.name.text"/>
                </label>
                <Col xs={3}>
                  <Input
                    {...first_name}
                    type="text"
                    placeholder={this.props.intl.formatMessage({id: 'portal.user.edit.firstName.text'})}/>
                  {first_name.touched && first_name.error &&
                  <div className="error-msg">{first_name.error}</div>}
                </Col>

                {this.state.showMiddleNameField ?
                  <Col xs={3}>
                    <Input
                      {...middle_name}
                      type="text"
                      placeholder={this.props.intl.formatMessage({id: 'portal.user.edit.middleName.text'})}/>
                    {last_name.touched && last_name.error &&
                      <div className="error-msg">{middle_name.error}</div>
                    }
                  </Col>
                : null}

                <Col xs={3}>
                  <Input
                    {...last_name}
                    type="text"
                    placeholder={this.props.intl.formatMessage({id: 'portal.user.edit.lastName.text'})}/>
                  {last_name.touched && last_name.error &&
                    <div className="error-msg">{last_name.error}</div>
                  }
                </Col>

                {!this.state.showMiddleNameField ?
                  <Button bsStyle="link" onClick={this.showMiddleName}>
                    + <FormattedMessage id="portal.user.edit.addMiddleName.text"/>
                  </Button>
                : null}
              </Row>
            </div>

            <div className="form-group">
              <Row>
                <label className="col-xs-2 control-label">
                  <FormattedMessage id="portal.user.edit.contact.text"/>
                </label>
                <Col xs={3}>
                  <p className="form-control-static">{email.value}</p>
                </Col>

                <Col xs={3}>
                  <ReactTelephoneInput
                    value={phone_number.value !== '+' ? phone_number.value : '1'}
                    defaultCountry="us"
                    onChange={(value) => {
                      phone_number.onChange(value)
                    }}
                  />
                  {phone_number.touched && phone_number.error &&
                    <div className="error-msg">{phone_number.error}</div>
                  }
                </Col>
              </Row>
            </div>

            {/* Not supported yet
            <div className="form-group">
              <Row>
                <label className="col-xs-2 control-label">
                  <FormattedMessage id="portal.user.edit.timezone.text"/>
                </label>
                <Col xs={3}>
                  <div className="form-group">
                    <Input
                      {...timezone}
                      type="text"
                      placeholder={this.props.intl.formatMessage({id: 'portal.user.edit.timezone.text'})}/>
                  </div>
                </Col>
                <Col xs={7}>
                  <FormattedMessage id="portal.user.edit.currentDate.text"/>
                  : {moment().format('LLLL')}
                </Col>
              </Row>
            </div>*/}

            <div className="form-group">
              <Row>
                <label className="col-xs-2 control-label">
                  <FormattedMessage id="portal.user.edit.password.text"/>
                </label>

                {this.state.showPasswordField || savingPassword ?
                  <div>
                    <Col xs={6}>
                      <PasswordFields inlinePassword={true} />                      
                    </Col>
                    {/*
                    <Col xs={3}>
                      <Input
                        {...password}
                        type={this.state.passwordVisible ? 'text' : 'password'}
                        placeholder={this.props.intl.formatMessage({id: 'portal.user.edit.newPassword.text'})} />
                      {password.touched && password.error && !password.active && !confirm.active &&
                        <div className="error-msg">{password.error}</div>
                      }
                    </Col>

                    <Col xs={3}>
                      <Input
                        {...confirm}
                        type={this.state.passwordVisible ? 'text' : 'password'}
                        placeholder={this.props.intl.formatMessage({id: 'portal.user.edit.confirmNewPassword.text'})}
                        wrapperClassName="input-addon-after-outside"
                        addonAfter={
                          <a className={'input-addon-link' +
                            (this.state.passwordVisible ? ' active' : '')}
                            onClick={this.togglePasswordVisibility}>
                            <IconEye/>
                          </a>
                        }/>
                    </Col>
                    */}
                    <Col xs={3} xsOffset={1}>
                      <ButtonToolbar>
                        <Button
                          className="btn-secondary"
                          bsSize="small"
                          onClick={this.togglePasswordEditing}>
                          <FormattedMessage id="portal.button.CANCEL"/>
                        </Button>
                        <Button
                          disabled={!!Object.keys(passwordErrors).length || !password.value || savingPassword}
                          bsStyle="success"
                          bsSize="small"
                          onClick={this.savePassword}>
                          {savingPassword ? <FormattedMessage id="portal.button.CHANGING"/> : <FormattedMessage id="portal.button.CHANGE"/>}
                        </Button>
                      </ButtonToolbar>
                    </Col>

                    <Col xs={10} xsOffset={2}>
                      <p><FormattedMessage id="portal.user.edit.password.helperText"/></p>
                    </Col>
                  </div>
                :
                  <Col xs={9}>
                    <Button bsStyle="primary" onClick={this.togglePasswordEditing}>
                      <FormattedMessage id="portal.button.CHANGE"/>
                    </Button>
                  </Col>
                }
              </Row>
            </div>
          </Col>
        </Row>

        <SaveBar
          onCancel={resetForm}
          onSave={this.save}
          saving={savingUser}
          show={showSaveBar}>
          <FormattedMessage id="portal.user.edit.unsavedChanges.text"/>
        </SaveBar>
      </form>
    )
  }
}

UserEditForm.propTypes = {
  fields: PropTypes.object,
  intl: PropTypes.object,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  resetForm: PropTypes.func,
  savingPassword: PropTypes.bool,
  savingUser: PropTypes.bool
}

export default reduxForm({
  form: 'user-edit-form',
  fields: [
    'confirm',
    'email',
    'first_name',
    'last_name',
    'middle_name',
    'password',
    'phone_number',
    'timezone'
  ],
  validate: validate
})(injectIntl(UserEditForm))
