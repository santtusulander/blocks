import React, { PropTypes } from 'react'
import { reduxForm, change } from 'redux-form'
import { Link } from 'react-router'
import { HelpBlock, FormGroup, InputGroup,
         Tooltip, Button, ButtonToolbar,
         Col, FormControl, ControlLabel, Row } from 'react-bootstrap'
import ReactTelephoneInput from 'react-telephone-input'
import { FormattedMessage, injectIntl } from 'react-intl';
import phoneValidator from 'phone'

import Toggle from '../toggle'
import SelectWrapper from '../select-wrapper'
import PasswordFields from '../password-fields'
import SaveBar from '../save-bar'
// import IconUser from '../icons/icon-user.jsx'

import { getReduxFormValidationState } from '../../util/helpers'
import { AUTHY_APP_DOWNLOAD_LINK,
         TWO_FA_METHODS_OPTIONS,
         TWO_FA_DEFAULT_AUTH_METHOD } from '../../constants/user.js'
import '../../styles/components/user/_edit-form.scss'

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

    const { fields: { middle_name, tfa }} = props

    this.save = this.save.bind(this)
    this.savePassword = this.savePassword.bind(this)
    this.showMiddleName = this.showMiddleName.bind(this)
    this.togglePasswordEditing = this.togglePasswordEditing.bind(this)
    this.togglePasswordVisibility = this.togglePasswordVisibility.bind(this)
    this.changePassword = this.changePassword.bind(this)
    this.currentPasswordChangesCallback = this.currentPasswordChangesCallback.bind(this)
    this.tfaMethodOptions = this.tfaMethodOptions.bind(this)
    this.toggleTfa = this.toggleTfa.bind(this)
    this.onPhoneNumberChange = this.onPhoneNumberChange.bind(this)
    this.validatePhoneNumber = this.validatePhoneNumber.bind(this)
    this.isTfaEnabled = this.isTfaEnabled.bind(this)

    this.state = {
      showMiddleNameField: !!middle_name.value,
      showPasswordField: false,
      passwordVisible: false,
      validPassword: false,
      currentPasswordValid: true,
      currentPasswordErrorStr: '',
      isTFAEnabled: this.isTfaEnabled(tfa.value, this.tfaMethodOptions()),
      phoneNumberValidationState: null
    }
  }

  save() {
    const {
      fields: {
        first_name,
        middle_name,
        last_name,
        phone_number,
        phone_country_code,
        tfa,
        timezone
      },
      onSave
    } = this.props

    let newValues = {
      first_name: first_name.value,
      middle_name: middle_name.value,
      last_name: last_name.value,
      phone_number: phone_number.value,
      phone_country_code: phone_country_code.value,
      tfa: tfa.value,
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

  tfaMethodOptions() {
    let tfaOptions = []

    TWO_FA_METHODS_OPTIONS.forEach((option) => {
      tfaOptions.push({
        value: option.value,
        label: this.props.intl.formatMessage({id: option.intl_label})
      })
    })

    return tfaOptions
  }

  toggleTfa() {
    this.setState({ isTFAEnabled: !this.state.isTFAEnabled })
    if (this.state.isTFAEnabled) {
      this.props.fields.tfa.onChange('')
    } else {
      this.props.fields.tfa.onChange(TWO_FA_DEFAULT_AUTH_METHOD)
    }

    this.validatePhoneNumber(this.props.fields.phone.value,
                             !this.state.isTFAEnabled)
  }

  validatePhoneNumber(number, isTFAEnabled) {
    const isPhoneValid = phoneValidator(number).length
    if ((isPhoneValid == 0) && isTFAEnabled) {
      this.setState({
        phoneNumberValidationState: 'error'
      })
    } else {
      this.setState({
        phoneNumberValidationState: null
      })
    }
  }

  onPhoneNumberChange(number, { dialCode }) {
    const {
      fields: {
        phone,
        phone_number,
        phone_country_code
      }
    } = this.props

    // Fill the inputs that will be send to API
    phone.onChange(number)
    phone_number.onChange(number.replace(/\D/g,''))
    phone_country_code.onChange(dialCode)

    // Validate phone number
    this.validatePhoneNumber(number, this.state.isTFAEnabled)
  }

  isTfaEnabled(tfaValue, options) {
    return options.map(({ value }) => value).includes(tfaValue)
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
        phone,
        tfa
        /*, timezone*/
      },
      resetForm,
      savingPassword,
      savingUser
    } = this.props

    // ReactTelephoneInput decorates the phone number at render and thus triggers
    // the phone_number.dirty flag. Need to add extra check to see if any actual
    // digits have been changed before showing the Save bar
    const trimmedPhoneNumber = phone.value.replace(/\D/g,'')
    const showSaveBar = (first_name.dirty || middle_name.dirty || last_name.dirty || tfa.dirty ||
                         (phone.dirty && phone.initialValue !== trimmedPhoneNumber)) &&
                         this.state.phoneNumberValidationState === null

    const currentPasswordInvalid = !this.state.currentPasswordValid && (current_password.value === '')
    const currentPassowrdErrorTooltip = (
      currentPasswordInvalid ?
        (<Tooltip id="confirm-error" placement="top" className="input-tooltip in">
          {this.state.currentPasswordErrorStr}
         </Tooltip>)
      : null
    )

    const twoFAMethodsTooltip = (tfa_method) => {
      switch (tfa_method) {
        case "call":
          return (
            <FormattedMessage id="portal.user.edit.2FA.method.call.title"/>
          )
        case "sms":
          return (
            <FormattedMessage id="portal.user.edit.2FA.method.sms.title"/>
          )
        case "app":
          return (
            <FormattedMessage id="portal.user.edit.2FA.method.app.title" values={{
              link: <Link to={AUTHY_APP_DOWNLOAD_LINK} target="_blank">
                    {
                      this.props.intl.formatMessage({id: 'portal.user.edit.2FA.method.down_link.text'})
                    }
                    </Link>
            }}/>
          )
        case "one_touch":
          return (
            <FormattedMessage id="portal.user.edit.2FA.method.one_touch.title" values={{
              link: <Link to={AUTHY_APP_DOWNLOAD_LINK} target="_blank">
                    {
                      this.props.intl.formatMessage({id: 'portal.user.edit.2FA.method.down_link.text'})
                    }
                    </Link>
            }}/>
          )
        default:
          return
      }
    }

    return (
      <form className="form-horizontal user-profile-edit-form">
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
            </div>

            <hr />*/}

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

            <hr />

            <div className="form-group">
              <Row>
                <ControlLabel className="col-xs-2">
                  <FormattedMessage id="portal.user.edit.contact.text"/>
                </ControlLabel>
                <Col xs={3}>
                  <p className="form-control-static">{email.value}</p>
                </Col>

                <Col xs={3}>
                  <FormGroup validationState={this.state.phoneNumberValidationState}>
                      <ReactTelephoneInput
                        {...phone}
                        defaultCountry="us"
                        onChange={this.onPhoneNumberChange}
                      />
                  </FormGroup>
                  {
                    this.state.isTFAEnabled && this.state.phoneNumberValidationState === 'error' &&
                    <HelpBlock className="error-msg">
                      <FormattedMessage id="portal.user.edit.phoneInvalid.text"/>
                    </HelpBlock>
                  }
                </Col>
              </Row>
            </div>

            <hr />
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
            </div>

            <hr />*/}

            <div className="form-group">
              <Row>
                <ControlLabel className="col-xs-2">
                  <FormattedMessage id="portal.user.edit.password.text"/>
                </ControlLabel>

                {this.state.showPasswordField || savingPassword ?
                  <div>
                    <Col xs={3}>
                      <FormGroup>
                        <InputGroup className={currentPasswordInvalid ?
                                                "input-addon-after-outside invalid" :
                                                "input-addon-after-outside"
                                              }>
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

            <hr />

            <div className="form-group">
              <Row>
                <Col xs={2}>
                  <ControlLabel>
                    <FormattedMessage id="portal.user.edit.2FA.text" />
                  </ControlLabel>
                </Col>
                <Col xs={3}>
                  <Toggle value={this.state.isTFAEnabled}
                          changeValue={this.toggleTfa}
                  />
                </Col>
                <Col xs={2}>
                  <p className="form-control-static">
                    <FormattedMessage id="portal.user.edit.2FA.method.text" />
                  </p>
                </Col>
                <Col xs={5}>
                  <SelectWrapper {...tfa} disabled={!this.state.isTFAEnabled}
                                 options={this.tfaMethodOptions()}
                  />
                  <span className="select-box-tooltip">
                    { twoFAMethodsTooltip(tfa.value) }
                  </span>
                </Col>
              </Row>
            </div>

            <hr />

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

UserEditForm.displayName = "UserEditForm"
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
    'phone',
    'phone_number',
    'phone_country_code',
    'tfa',
    'timezone'
  ],
  validate: validate
})(injectIntl(UserEditForm))
