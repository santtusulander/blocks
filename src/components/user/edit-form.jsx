import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { reduxForm, Field, initialize, change, blur, propTypes as reduxFormPropTypes, formValueSelector, SubmissionError} from 'redux-form'
import { Link } from 'react-router'
import { Tooltip, Button, ButtonToolbar,
         Col, ControlLabel, Row} from 'react-bootstrap'
import { FormattedMessage, injectIntl } from 'react-intl';

import FieldFormGroup from '../shared/form-fields/field-form-group'
import FieldFormGroupToggle from '../shared/form-fields/field-form-group-toggle'
import FieldFormGroupSelect from '../shared/form-fields/field-form-group-select'
import FieldTelephoneInput from '../shared/form-fields/field-telephone-input'
import FieldPasswordFields from '../shared/form-fields/field-passwordfields'
import SaveBar from '../shared/page-elements/save-bar'

import { AUTHY_APP_DOWNLOAD_LINK,
         TWO_FA_METHODS_OPTIONS,
         TWO_FA_DEFAULT_AUTH_METHOD
        } from '../../constants/user.js'

import '../../styles/components/user/_edit-form.scss'

import { isValidPhoneNumber } from '../../util/validators'

const ErrorTooltip = ({ error, active }) =>
    !active &&
      <Tooltip positionTop="0" placement="top" className="input-tooltip in" id="tooltip-top">
        {error}
      </Tooltip>

const validate = (values) => {
  const errors = {}

  const {
    changingPassword,
    first_name,
    last_name,
    phone,
    current_password,
    new_password,
    validPass
  } = values

  if (changingPassword) {
    if (!(current_password && new_password && validPass)) {
      errors._error = <FormattedMessage id="portal.user.edit.checkPasswords.text" />
    }
    if (new_password && !validPass) {
      errors.new_password = <FormattedMessage id="portal.user.edit.newPasswordInvalid.text" />
    }
  } else {
    if (!first_name) {
      errors.first_name = <FormattedMessage id="portal.user.edit.firstNameRequired.text" />
    }

    if (!last_name) {
      errors.last_name = <FormattedMessage id="portal.user.edit.lastNameRequired.text" />
    }

    if (phone.phone_number && !isValidPhoneNumber(phone.phone_number)) {
      errors.phone = <FormattedMessage id="portal.user.edit.phoneInvalid.text" />
    }

    const fullPhone = phone.phone_country_code + phone.phone_number;
    if (!isValidPhoneNumber(fullPhone)) {
      errors.phone = <FormattedMessage id="portal.user.edit.phoneInvalid.text" />
    }
  }

  return errors;
}

class UserEditForm extends React.Component {
  constructor(props) {
    super(props)

    this.onSubmit = this.onSubmit.bind(this);
    this.savePasswordOnClick = this.savePasswordOnClick.bind(this)

    this.togglePasswordEditing = this.togglePasswordEditing.bind(this)

  }

  componentWillUpdate(nextProps) {
    if (nextProps.tfa_toggle !== this.props.tfa_toggle) {
      this.setTFAMethod(nextProps)
    }
  }

  setTFAMethod(props) {
    const { tfa, tfa_toggle, initialValues } = props
    if (!tfa_toggle) {
      this.props.changeSelectedTFAMethod('')
    } else {
      if (!(tfa && tfa.length > 0)) {
        const selectedTFA = (initialValues.tfa.length > 0) ? initialValues.tfa : TWO_FA_DEFAULT_AUTH_METHOD
        this.props.changeSelectedTFAMethod(selectedTFA)
      }
    }
  }

  onSubmit(values) {
    //strip out unneeded values
    const {tfa_toggle, tfa} = values;

    const data = {
      first_name: values.first_name,
      middle_name: values.middle_name,
      last_name: values.last_name,
      phone_country_code: values.phone.phone_country_code,
      phone_number: values.phone.phone_number
    }

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
        if (response.error) {
          throw new SubmissionError({'current_password': response.payload.message})
        } else {
          /* eslint-disable no-unused-vars */
          /* stip unneeded vars from values */
          const {
            current_password,
            new_password,
            validPass,
            ...formData
          } = values
          /* eslint-enable no-unused-vars */

          this.props.initialize({...formData, changingPassword: false})

        }
      })
  }

  togglePasswordEditing() {
    //Set field in redux, because changingPassword is needed in validate()
    if (this.props.changingPassword) {
      this.props.clearPasswordRow(this.props.formValues)
    }
    this.props.change('changingPassword', !this.props.changingPassword)
  }

  tfaMethodOptions() {
    const tfaOptions = []

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
      changingPassword,
      handleSubmit,
      intl,
      invalid,
      initialValues: {
        email
      },
      resetForm,
      submitting,
      tfa,
      tfa_toggle
    } = this.props
    const showSaveBar = this.props.dirty

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
                component={FieldFormGroup}
              />
            </Col>

            <Col xs={3}>
              <Field
                type="text"
                name="middle_name"
                placeholder={this.props.intl.formatMessage({id: 'portal.user.edit.middleName.text'})}
                component={FieldFormGroup}
              />
            </Col>

            <Col xs={3}>
              <Field
                type="text"
                name="last_name"
                placeholder={this.props.intl.formatMessage({id: 'portal.user.edit.lastName.text'})}
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

          {!changingPassword
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
                      this.props.change('validPass', valid)
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
                      onClick={handleSubmit(this.savePasswordOnClick)}
                    >
                      {submitting
                        ? <FormattedMessage id="portal.button.CHANGING"/>
                        : <FormattedMessage id="portal.button.CHANGE"/>
                      }
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

          <Col xs={1}>
            <Field
              name="tfa"
              component={FieldFormGroupSelect}
              disabled={!tfa_toggle}
              options={this.tfaMethodOptions()}
            />
          </Col>

          <Col xs={3}>
            <div className="select-box-tooltip">
              {this.renderTwoFAMethodsTooltips(tfa)}
            </div>
          </Col>
        </Row>

        <hr/>

        <SaveBar
          onCancel={resetForm}
          invalid={invalid}
          saving={submitting}
          show={showSaveBar &&  !changingPassword}>
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

const mapStateToProps = (state, ownProps) => {
  return {
    changingPassword: formValueSelector('user-edit-form')(state, 'changingPassword'),
    tfa_toggle: formValueSelector('user-edit-form')(state, 'tfa_toggle'),
    tfa: formValueSelector('user-edit-form')(state, 'tfa'),
    formValues: formValueSelector('user-edit-form')(state, ...Object.keys(ownProps.initialValues))
  }
}

/* istanbul ignore next */
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    resetForm: () => dispatch(initialize('user-edit-form', ownProps.initialValues)),
    changeSelectedTFAMethod: (method) => dispatch(change('user-edit-form', 'tfa', method)),
    clearPasswordRow: (values) => dispatch(initialize('user-edit-form', values))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
  form: 'user-edit-form',
  validate: validate,
  onSubmitFail: (errors, dispatch) => {
    if (errors && errors.current_password) {
      dispatch(blur('user-edit-form', 'current_password', ''))
    }
  }
})(injectIntl(UserEditForm)))
