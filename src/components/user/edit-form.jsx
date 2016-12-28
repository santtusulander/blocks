import React, { PropTypes } from 'react'
import { reduxForm, change } from 'redux-form'
import { HelpBlock, FormGroup, InputGroup,
         Tooltip, Button, ButtonToolbar,
         Col, FormControl, ControlLabel, Row } from 'react-bootstrap'
import ReactTelephoneInput from 'react-telephone-input'
import {FormattedMessage, injectIntl} from 'react-intl';
import classNames from 'classnames'
// import moment from 'moment'

import PasswordFields from '../password-fields'
import SaveBar from '../save-bar'
// import IconUser from '../icons/icon-user.jsx'

import { getReduxFormValidationState } from '../../util/helpers'

let errors = {}
let passwordErrors = {}

const validate = (values) => {
  errors = {}
  passwordErrors = {}

  const {
    email,
    current_password
  } = values


  if(!email || email.length === 0) {
    errors.email = <FormattedMessage id="portal.user.edit.emailRequired.text"/>
  }

  if(!current_password || current_password.length === 0) {
    passwordErrors.current_password = <FormattedMessage id="portal.user.edit.currentPasswordRequired.text"/>
  }

  return errors, passwordErrors;
}

class UserEditForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showMiddleNameField: props.fields.middle_name.value,
      showPasswordField: false,
      passwordVisible: false,
      validPassword: false,
      currentPasswordValid: true,
      currentPasswordErrorStr: ''
    }

    this.save = this.save.bind(this)
    this.savePassword = this.savePassword.bind(this)
    this.showMiddleName = this.showMiddleName.bind(this)
    this.togglePasswordEditing = this.togglePasswordEditing.bind(this)
    this.togglePasswordVisibility = this.togglePasswordVisibility.bind(this)
    this.changePassword = this.changePassword.bind(this)
    this.currentPasswordChangesCallback = this.currentPasswordChangesCallback.bind(this)
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

  currentPasswordChangesCallback(response) {
    if (response.error) {
      this.setState({
        currentPasswordValid: !response.error,
        currentPasswordErrorStr: response.payload.message
      })
      this.props.dispatch(change('user-edit-form', 'current_password', ''))
    } else {
      this.togglePasswordEditing()
    }
  }

  savePassword() {
    const {
      fields: {
        current_password,
        new_password
      },
      onSavePassword
    } = this.props

    let newValues = {
      current_password: current_password.value,
      new_password: new_password.value
    }

    onSavePassword(newValues, this.currentPasswordChangesCallback)
  }

  showMiddleName() {
    this.setState({
      showMiddleNameField: true
    })
  }

  togglePasswordEditing() {
    this.setState({
      showPasswordField: !this.state.showPasswordField,
      currentPasswordValid: true,
      currentPasswordErrorStr: ''
    })

    // Clear password fields on toggle.
    this.props.dispatch(change('user-edit-form', 'current_password', ''))
    this.props.dispatch(change('user-edit-form', 'new_password', ''))

  }

  togglePasswordVisibility() {
    this.setState({
      passwordVisible: !this.state.passwordVisible
    })
  }

  changePassword(isPasswordValid) {
    this.setState({
      'validPassword': isPasswordValid
    });
  }

  render() {
    const {
      fields: {
        current_password,
        email,
        first_name,
        last_name,
        middle_name,
        new_password,
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

    const currentPasswordInvalid = !this.state.currentPasswordValid && (current_password.value === '')
    const currentPassowrdErrorTooltip = (
      currentPasswordInvalid ?
        (<Tooltip id="confirm-error" placement="top" className="input-tooltip in">
          {this.state.currentPasswordErrorStr}
         </Tooltip>)
      : null
    )
    const currentPasswordWrapperClassName = classNames(
      {
        'invalid': currentPasswordInvalid
      },
      'input-addon-after-outside'
    )

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
                <ControlLabel className="col-xs-2">
                  <FormattedMessage id="portal.user.edit.name.text"/>
                </ControlLabel>
                <Col xs={3}>
                  <FormGroup validationState={getReduxFormValidationState(first_name)}>
                    <FormControl
                      {...first_name}
                      placeholder={this.props.intl.formatMessage({id: 'portal.user.edit.firstName.text'})}/>
                    {first_name.touched && first_name.error &&
                      <HelpBlock className="error-msg">{first_name.error}</HelpBlock>}
                  </FormGroup>
                </Col>

                {this.state.showMiddleNameField &&
                  <Col xs={3}>
                    <FormGroup validationState={getReduxFormValidationState(middle_name)}>
                      <FormControl
                        {...middle_name}
                        placeholder={this.props.intl.formatMessage({id: 'portal.user.edit.middleName.text'})}/>
                      {last_name.touched && last_name.error &&
                        <HelpBlock className="error-msg">{middle_name.error}</HelpBlock>}
                    </FormGroup>
                  </Col>}

                <Col xs={3}>
                  <FormGroup validationState={getReduxFormValidationState(last_name)}>
                    <FormControl
                      {...last_name}
                      placeholder={this.props.intl.formatMessage({id: 'portal.user.edit.lastName.text'})}/>
                    {last_name.touched && last_name.error &&
                      <HelpBlock className="error-msg">{last_name.error}</HelpBlock>}
                  </FormGroup>
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
                <ControlLabel className="col-xs-2">
                  <FormattedMessage id="portal.user.edit.contact.text"/>
                </ControlLabel>
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
                    <FormControl
                      {...timezone}
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
                <ControlLabel className="col-xs-2">
                  <FormattedMessage id="portal.user.edit.password.text"/>
                </ControlLabel>

                {this.state.showPasswordField || savingPassword ?
                  <div>
                    <Col xs={3}>
                      <FormGroup>
                        <InputGroup className={currentPasswordWrapperClassName}>
                          {currentPassowrdErrorTooltip}
                          <FormControl
                            type="password"
                            placeholder={this.props.intl.formatMessage({id: 'portal.user.edit.currentPassword.text'})}
                            {...current_password} />
                        </InputGroup>
                      </FormGroup>
                    </Col>
                    <Col xs={6}>
                      <PasswordFields inlinePassword={true} changePassword={this.changePassword} {...new_password} />
                    </Col>
                    <Col xs={4} xsOffset={2}>
                      <ButtonToolbar className="extra-margin-top">
                        <Button
                          className="btn-secondary"
                          bsSize="small"
                          onClick={this.togglePasswordEditing}>
                          <FormattedMessage id="portal.button.CANCEL"/>
                        </Button>
                        <Button
                          disabled={this.props.invalid || !this.state.validPassword || savingPassword}
                          bsStyle="success"
                          bsSize="small"
                          onClick={this.savePassword}>
                          {savingPassword ? <FormattedMessage id="portal.button.CHANGING"/> : <FormattedMessage id="portal.button.CHANGE"/>}
                        </Button>
                      </ButtonToolbar>
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
  dispatch: PropTypes.func,
  fields: PropTypes.object,
  intl: PropTypes.object,
  invalid: PropTypes.bool,
  onSave: PropTypes.func,
  onSavePassword: PropTypes.func,
  resetForm: PropTypes.func,
  savingPassword: PropTypes.bool,
  savingUser: PropTypes.bool
}

export default reduxForm({
  form: 'user-edit-form',
  fields: [
    'confirm',
    'current_password',
    'email',
    'first_name',
    'last_name',
    'middle_name',
    'new_password',
    'phone_number',
    'timezone'
  ],
  validate: validate
})(injectIntl(UserEditForm))
