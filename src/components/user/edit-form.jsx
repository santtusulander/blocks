import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { reduxForm, Field, change, propTypes as reduxFormPropTypes, formValueSelector, getFormValues} from 'redux-form'
import { Link } from 'react-router'

import { HelpBlock, FormGroup, InputGroup,
         Tooltip, Button, ButtonToolbar,
         Col, FormControl, ControlLabel, Row} from 'react-bootstrap'

import ReactTelephoneInput from 'react-telephone-input'
import { FormattedMessage, injectIntl } from 'react-intl';
import phoneValidator from 'phone'

// import Toggle from '../toggle'
// import SelectWrapper from '../select-wrapper'
import PasswordFields from '../password-fields'
import SaveBar from '../save-bar'
// import IconUser from '../icons/icon-user.jsx'


import FieldFormGroup from '../form/field-form-group'
import FieldFormGroupToggle from '../form/field-form-group-toggle'
import FieldFormGroupSelect from '../form/field-form-group-select'
import FormFooterButtons from '../form/form-footer-buttons'
import SetPasswordForm from '../form/set-password-form'

import { AUTHY_APP_DOWNLOAD_LINK,
         TWO_FA_METHODS_OPTIONS,
         TWO_FA_DEFAULT_AUTH_METHOD } from '../../constants/user.js'

import '../../styles/components/user/_edit-form.scss'


const stripCountryCode = (num, countryCode) => {
  return num.replace( new RegExp ( `^\\+${countryCode} ` ), '')
}

const stripNonNumeric = (num) => {
  return num.replace(/\D/g,'')
}

const validate = (values) => {
  const errors = {}
  console.log('validate', values)

  const {
    first_name,
    last_name,
    tfa_toggle,
    tfa,
    email,
    current_password
  } = values


  if (!first_name) {
    errors.first_name = "First name is required"
  }

  if (!last_name) {
    errors.last_name = "Last name is required"
  }

  if (tfa_toggle && !tfa) {
    errors.tfa = "Select TFA method"
  }

  return errors;
}

class UserEditForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showMiddleNameField: !!props.initialValues.middleName,
      showPasswordField: false,
      passwordVisible: false,
      validPassword: false,
      currentPasswordValid: true,
      currentPasswordErrorStr: '',
      phoneNumberValidationState: null
    }

    this.onSubmit = this.onSubmit.bind(this);

    // SaveBar helpers
    //this.saveBarOnSave = this.saveBarOnSave.bind(this)

    // Password fields helper
    this.savePasswordOnClick = this.savePasswordOnClick.bind(this)
    this.togglePasswordEditing = this.togglePasswordEditing.bind(this)
    this.togglePasswordVisibility = this.togglePasswordVisibility.bind(this)
    //this.changePassword = this.changePassword.bind(this)
    this.currentPasswordChangesCallback = this.currentPasswordChangesCallback.bind(this)

    // 'middle_name' field helper
    //this.showMiddleName = this.showMiddleName.bind(this)

    // 2FA fields helpers
    // this.tfaMethodOptions = this.tfaMethodOptions.bind(this)
    // this.toggleTfa = this.toggleTfa.bind(this)

    // Phone number fields helpers
    // this.onPhoneNumberChange = this.onPhoneNumberChange.bind(this)
    // this.validatePhoneNumber = this.validatePhoneNumber.bind(this)

    // Render helpers
    // this.renderTwoFAMethodsTooltips = this.renderTwoFAMethodsTooltips.bind(this)
    // this.renderCurrentPassowrdErrorTooltip = this.renderCurrentPassowrdErrorTooltip.bind(this)
  }

  onSubmit(values){
    //strip out unneeded values
    const {tfa_toggle, tfa, phone, email, ...data} = values;

    //handle 2FA,  add method if ON
    if (tfa_toggle) {
      data.tfa = tfa
    } else {
      data.tfa = ""
    }

    console.log('onSubmit', data);
    return this.props.onSave(data)

  }

  // saveBarOnSave() {
  //   const {
  //     fields: {
  //       first_name,
  //       middle_name,
  //       last_name,
  //       phone_number,
  //       phone_country_code,
  //       tfa,
  //       timezone
  //     },
  //     onSave
  //   } = this.props
  //
  //   let newValues = {
  //     first_name: first_name.value,
  //     middle_name: middle_name.value,
  //     last_name: last_name.value,
  //     phone_number: phone_number.value,
  //     phone_country_code: phone_country_code.value,
  //     tfa: tfa.value,
  //     timezone: timezone.value
  //   }
  //
  //   onSave(newValues)
  // }

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

  savePasswordOnClick(values) {
    const {
      onSavePassword
    } = this.props

    let newValues = {
      current_password: values.current_password,
      new_password: values.new_password
    }

    this.setState({'savingPassword': true})
    return onSavePassword(newValues)
      .then((response) => {
        this.setState({'savingPassword': false})
        this.currentPasswordChangesCallback(response)
      })
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

  // changePassword(isPasswordValid) {
  //   this.setState({
  //     'validPassword': isPasswordValid
  //   });
  // }

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

  // toggleTfa() {
  //   if (this.props.fields.tfa_toggle.value) {
  //     this.props.dispatch(change('user-edit-form', 'tfa', ''))
  //   } else {
  //     if (this.props.fields.tfa.initialValue === '') {
  //       // When user enabling 2FA first time, set default method
  //       this.props.dispatch(change('user-edit-form', 'tfa',
  //                                  TWO_FA_DEFAULT_AUTH_METHOD))
  //     } else {
  //       // When user just playing with toggle, need to keep initial method
  //       this.props.dispatch(change('user-edit-form', 'tfa',
  //                                  this.props.fields.tfa.initialValue))
  //     }
  //   }
  //
  //   this.props.dispatch(change('user-edit-form', 'tfa_toggle',
  //                              !this.props.fields.tfa_toggle.value))
  //
  //   this.validatePhoneNumber(this.props.fields.phone.value)
  // }
  //
  // validatePhoneNumber(number) {
  //   // UDNP-2227: Number given to validator should always be with + symbol
  //   number = number.substr(0, 1) === "+" ? number : ("+" + number)
  //
  //   const isPhoneValid = phoneValidator(number).length
  //   if (isPhoneValid === 0) {
  //     this.setState({
  //       phoneNumberValidationState: 'error'
  //     })
  //   } else {
  //     this.setState({
  //       phoneNumberValidationState: null
  //     })
  //   }
  // }
  //
  // onPhoneNumberChange(number, { dialCode }) {
  //   const {
  //     fields: {
  //       phone,
  //       phone_number,
  //       phone_country_code
  //     }
  //   } = this.props
  //
  //   const trimmedPhoneNumber = number.replace(/\D/g, '').replace(dialCode, '')
  //
  //   phone.onChange(number)
  //   // Fill the inputs that will be send to API
  //   phone_number.onChange(trimmedPhoneNumber)
  //   phone_country_code.onChange(dialCode)
  //
  //   // Validate phone number
  //   this.validatePhoneNumber(number)
  // }

  renderTwoFAMethodsTooltips(tfa_method) {
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

  // renderCurrentPassowrdErrorTooltip(isCurrentPasswordInvalid) {
  //   if (isCurrentPasswordInvalid)
  //   {
  //     return (
  //       <Tooltip id="confirm-error" placement="top" className="input-tooltip in">
  //         {this.state.currentPasswordErrorStr}
  //       </Tooltip>
  //     )
  //   }
  // }
  //

  render() {
    const {
      handleSubmit,
      intl,
      invalid,
      initialValues: {
        email
      },
      submitting,
      savingPassword,
      resetForm,
      tfa_toggle,
      tfaVerificationMethod
    } = this.props

    // ReactTelephoneInput decorates the phone number at render and thus triggers
    // the phone_number.dirty flag. Need to add extra check to see if any actual
    // digits have been changed before showing the Save bar
    //const trimmedPhoneNumber = phone.value.replace(/\D/g,'')
    const showSaveBar = this.props.dirty

    // (first_name.dirty || middle_name.dirty || last_name.dirty || tfa.dirty ||
    //                      (phone.dirty && phone.initialValue !== trimmedPhoneNumber)) &&
    //                      this.state.phoneNumberValidationState === null

    // const currentPasswordInvalid = !this.state.currentPasswordValid && (current_password.value === '')

    return (
      <form className="form-horizontal user-profile-edit-form" onSubmit={handleSubmit(this.onSubmit)}>

        <Row>
          <ControlLabel>
            <FormattedMessage id="portal.user.edit.name.text"/>
          </ControlLabel>

          <Field
            type="text"
            name="first_name"
            placeholder={this.props.intl.formatMessage({id: 'portal.user.edit.firstName.text'})}
            label={<FormattedMessage id="portal.user.edit.firstName.text"/>}
            component={FieldFormGroup}
          />

          <Field
            type="text"
            name="middleName"
            placeholder={this.props.intl.formatMessage({id: 'portal.user.edit.middleName.text'})}
            label={<FormattedMessage id="portal.user.edit.middleName.text"/>}
            component={FieldFormGroup}
          />

          <Field
            type="text"
            name="last_name"
            placeholder={this.props.intl.formatMessage({id: 'portal.user.edit.lastName.text'})}
            label={<FormattedMessage id="portal.user.edit.lastName.text"/>}
            component={FieldFormGroup}
          />

        </Row>

        <hr />

        <Row>
          <ControlLabel className="col-xs-2">
            <FormattedMessage id="portal.user.edit.contact.text"/>
          </ControlLabel>

          <p className="form-control-static">{email}</p>

          <Field
            type="text"
            name="phone"
            component={({input, meta}) => {
              return (
                <ReactTelephoneInput
                  value={input.value}
                  onChange={(val, {dialCode})=> {
                    const strippedNum = stripNonNumeric( stripCountryCode(val, dialCode) )
                    meta.dispatch( change('user-edit-form', 'phone_country_code', dialCode) )
                    meta.dispatch( change('user-edit-form', 'phone_number', strippedNum))

                    input.onChange(val)
                  }}
                  defaultCountry="us"
                />
              )
            }}
          />
        </Row>

        <hr/>

        { /* Password */}
        <Row>
          {!this.state.showPasswordField
            ? <Col xs={9}>
                <Button bsStyle="primary" onClick={this.togglePasswordEditing}>
                  <FormattedMessage id="portal.button.CHANGE"/>
                </Button>
              </Col>
            : <div>
                <Col xs={3}>
                  <Field
                    name="current_password"
                    type="password"
                    component={FieldFormGroup}
                    placeholder={intl.formatMessage({id: 'portal.user.edit.currentPassword.text'})}
                  />
                {/*                <FormGroup>
                    <InputGroup className={currentPasswordInvalid ?
                                            "input-addon-after-outside invalid" :
                                            "input-addon-after-outside"
                                          }>
                      {this.renderCurrentPassowrdErrorTooltip(currentPasswordInvalid)}
                      <FormControl
                        type="password"
                        placeholder={this.props.intl.formatMessage({id: 'portal.user.edit.currentPassword.text'})}
                        {...current_password} />
                    </InputGroup>
                  </FormGroup>*/}
                </Col>

                <Col xs={6}>
                  <Field
                    name="new_password"
                    component={({input}) => {
                      return <PasswordFields inlinePassword={true} changePassword={this.changePassword} {...input} />
                    }}
                  />
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

                      bsStyle="success"
                      bsSize="small"
                      onClick={handleSubmit(values => this.savePasswordOnClick({...values, action: 'changePassword'}))}>
                      {savingPassword ? <FormattedMessage id="portal.button.CHANGING"/> : <FormattedMessage id="portal.button.CHANGE"/>}
                    </Button>
                  </ButtonToolbar>
                </Col>
              </div>
            }
        </Row>

        <hr/>

        <Row>
          <ControlLabel>
            <FormattedMessage id="portal.user.edit.2FA.text" />
          </ControlLabel>

          <Field
            name="tfa_toggle"
            component={FieldFormGroupToggle}
          />

          <Field
            name="tfa"
            component={FieldFormGroupSelect}
            disabled={!tfa_toggle}
            options={this.tfaMethodOptions()}
            label={<FormattedMessage id="portal.user.edit.2FA.method.text" />}
          />

          {this.renderTwoFAMethodsTooltips( tfaVerificationMethod )}
        </Row>

        <SaveBar
          onCancel={resetForm}
          invalid={invalid}
          saving={submitting}
          show={showSaveBar}>
          <FormattedMessage id="portal.user.edit.unsavedChanges.text"/>
        </SaveBar>

      </form>
    )
  }
}

UserEditForm.displayName = "UserEditForm"
UserEditForm.propTypes = {
  intl: PropTypes.object,
  onSave: PropTypes.func,
  onSavePassword: PropTypes.func,
  resetForm: PropTypes.func,
  savingPassword: PropTypes.bool,
  savingUser: PropTypes.bool,
  ...reduxFormPropTypes
}

const mapStateToProps = (state) => {
  return {
    //formValues: getFormValues('user-edit-form')(state),
    tfa_toggle: formValueSelector('user-edit-form')(state, 'tfa_toggle'),
    tfa: formValueSelector('user-edit-form')(state, 'tfa')
  }
}

export default connect(mapStateToProps)(reduxForm({
  form: 'user-edit-form',
  validate: validate
})(injectIntl(UserEditForm)))
