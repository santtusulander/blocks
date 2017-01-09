import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { reduxForm, Field, change, reset, propTypes as reduxFormPropTypes, formValueSelector, SubmissionError} from 'redux-form'
import { Link } from 'react-router'

import { Tooltip, Button, ButtonToolbar,
         Col, ControlLabel, Row} from 'react-bootstrap'

import { FormattedMessage, injectIntl } from 'react-intl';

import FieldFormGroup from '../form/field-form-group'
import FieldFormGroupToggle from '../form/field-form-group-toggle'
import FieldFormGroupSelect from '../form/field-form-group-select'
import FieldTelephoneInput from '../form/field-telephone-input'
import FieldPasswordFields from '../form/field-passwordfields'

import SaveBar from '../save-bar'

//import SetPasswordForm from '../form/set-password-form'

import { AUTHY_APP_DOWNLOAD_LINK,
         TWO_FA_METHODS_OPTIONS,
         TWO_FA_DEFAULT_AUTH_METHOD } from '../../constants/user.js'

import '../../styles/components/user/_edit-form.scss'

const ErrorTooltip = ({ error, active }) =>
    !active &&
      <Tooltip placement="top" className="input-tooltip in" id="tooltip-top">
        {error}
      </Tooltip>

const validate = (values) => {
  const errors = {}

  const {
    first_name,
    last_name,
    tfa_toggle,
    tfa,
    current_password,
    new_password,
    validPass
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

  if ( (current_password || new_password) && !(current_password && new_password && validPass) ) errors._error = "Check passwords."

  if ( new_password && !validPass ) errors.new_password = "New password is not valid!"

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
    this.savePasswordOnClick = this.savePasswordOnClick.bind(this)

    this.togglePasswordEditing = this.togglePasswordEditing.bind(this)
    //this.togglePasswordVisibility = this.togglePasswordVisibility.bind(this)
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

    return this.props.onSave(data)

  }

  savePasswordOnClick(values) {
    const {
      onSavePassword
    } = this.props

    const newValues = {
      current_password: values.current_password,
      new_password: values.new_password
    }

    return onSavePassword(newValues)
      .then((response) => {
        if (response.error) throw new SubmissionError( {'current_password': response.payload.message})
      })
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

  render() {
    const {
      handleSubmit,
      intl,
      invalid,
      initialValues: {
        email
      },
      resetForm,
      submitting,
      savingPassword,
      tfa,
      tfa_toggle
    } = this.props

    // ReactTelephoneInput decorates the phone number at render and thus triggers
    // the phone_number.dirty flag. Need to add extra check to see if any actual
    // digits have been changed before showing the Save bar
    //const trimmedPhoneNumber = phone.value.replace(/\D/g,'')
    const showSaveBar = this.props.dirty

    // (first_name.dirty || middle_name.dirty || last_name.dirty || tfa.dirty ||
    //                      (phone.dirty && phone.initialValue !== trimmedPhoneNumber)) &&
    //                      this.state.phoneNumberValidationState === null

    return (
      <form className="form-horizontal user-profile-edit-form" onSubmit={handleSubmit(this.onSubmit)}>

        {/* NAME */}
          <Row>
            <ControlLabel className="col-xs-2">
              <FormattedMessage id="portal.user.edit.name.text"/>
            </ControlLabel>

            <Col xs={3}>
              <Field
                type="text"
                name="first_name"
                placeholder={this.props.intl.formatMessage({id: 'portal.user.edit.firstName.text'})}
                //label={<FormattedMessage id="portal.user.edit.firstName.text"/>}
                component={FieldFormGroup}
              />
            </Col>

            <Col xs={3}>
              <Field
                type="text"
                name="middleName"
                placeholder={this.props.intl.formatMessage({id: 'portal.user.edit.middleName.text'})}
                //label={<FormattedMessage id="portal.user.edit.middleName.text"/>}
                component={FieldFormGroup}
              />
            </Col>

            <Col xs={3}>
              <Field
                type="text"
                name="last_name"
                placeholder={this.props.intl.formatMessage({id: 'portal.user.edit.lastName.text'})}
                //label={<FormattedMessage id="portal.user.edit.lastName.text"/>}
                component={FieldFormGroup}
              />
            </Col>
          </Row>

        <hr />

        {/* CONTACT */}
        <Row>
          <ControlLabel className="col-xs-2">
            <FormattedMessage id="portal.user.edit.contact.text"/>
          </ControlLabel>

          <Col xs={3}>
            <p className="form-control-static">{email}</p>
          </Col>

          <Col xs={3}>
            <Field
              name="phone"
              component={FieldTelephoneInput}
            />
          </Col>
        </Row>

        <hr/>

        { /* PASSWORD */}
        <Row>
          <ControlLabel className="col-xs-2">
            <FormattedMessage id="portal.user.edit.password.text"/>
          </ControlLabel>

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
                    ErrorComponent={ErrorTooltip}
                  />
                </Col>

                <Col xs={6}>
                  <Field
                    name="new_password"
                    component={FieldPasswordFields}
                    validCallBack={(valid) => {
                      this.props.dispatch(change('user-edit-form', 'validPass', valid))
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
                      disabled={invalid||submitting}
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

        {/* 2 FA */}
        <Row>
          <ControlLabel className="col-xs-2">
            <FormattedMessage id="portal.user.edit.2FA.text" />
          </ControlLabel>

          <Col xs={3}>
            <Field
              name="tfa_toggle"
              component={FieldFormGroupToggle}
            />
          </Col>

          <Col xs={2}>
            <p className="form-control-static">
              <FormattedMessage id="portal.user.edit.2FA.method.text" />
            </p>
          </Col>

          <Col xs={2}>
            <Field
              name="tfa"
              component={FieldFormGroupSelect}
              disabled={!tfa_toggle}
              options={this.tfaMethodOptions()}
              //label={<FormattedMessage id="portal.user.edit.2FA.method.text" />}
            />
          </Col>

          <Col xs={3}>
            <div className="select-box-tooltip">
              {this.renderTwoFAMethodsTooltips( tfa )}
            </div>
          </Col>
        </Row>

        <hr/>

        <SaveBar
          onCancel={resetForm}
          invalid={invalid}
          saving={submitting}
          show={showSaveBar &&  !this.state.showPasswordField}>
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
    tfa_toggle: formValueSelector('user-edit-form')(state, 'tfa_toggle'),
    tfa: formValueSelector('user-edit-form')(state, 'tfa')
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    resetForm: () => dispatch( reset('user-edit-form') )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
  form: 'user-edit-form',
  validate: validate
})(injectIntl(UserEditForm)))
