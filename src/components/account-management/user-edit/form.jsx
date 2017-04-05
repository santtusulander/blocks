import React, { PropTypes } from 'react'
import { reduxForm, Field, propTypes as reduxFormPropTypes } from 'redux-form'
import { Button, Row, Col } from 'react-bootstrap'
import { FormattedMessage, injectIntl } from 'react-intl';

import FieldFormGroup from '../../shared/form-fields/field-form-group'
import FieldTelephoneInput from '../../shared/form-fields/field-telephone-input'
import FieldFormGroupSelect from '../../shared/form-fields/field-form-group-select'
import FormFooterButtons from '../../shared/form-elements/form-footer-buttons'


let errors = {}
const validate = (values) => {
  errors = {}

  const { first_name, last_name, email, role } = values

  if (!first_name) {
    errors.first_name = <FormattedMessage id="portal.account.editUser.firstNameRequired.text"/>
  }
  if (!last_name) {
    errors.last_name = <FormattedMessage id="portal.account.editUser.lastNameRequired.text"/>
  }

  if (!email) {
    errors.email = <FormattedMessage id="portal.account.editUser.emailRequired.text"/>
  }

  if (!role) {
    errors.role = <FormattedMessage id="portal.account.editUser.roleRequired.text"/>
  }

  return errors;
}

class AccountManagementUserEditForm extends React.Component {
  constructor(props) {
    super(props)

    // TODO: uncomment once UDNP-2008 is unblocked
    // this.resetPassword = this.resetPassword.bind(this)
    this.save = this.save.bind(this)
  }

  // TODO: uncomment and implement once UDNP-2008 is unblocked
  // resetPassword() {
  //   // TODO: call password reset function and display toast on success
  // }

  save(values) {
    const { first_name, last_name, groups, role } = values

    const newValues = {
      first_name: first_name,
      last_name: last_name,
      group_id: groups,
      roles: [ role ]
    }

    return this.props.onSave(newValues)
  }

  render() {
    const {
      intl,
      invalid,
      handleSubmit,
      roleOptions,
      onCancel,
      submitting
    } = this.props

    const submitButtonLabel = submitting
      ? <FormattedMessage id="portal.button.saving" />
      : <FormattedMessage id="portal.button.save" />

    return (
      <form className="user-form" onSubmit={handleSubmit(this.save)}>

        <Field
          type="text"
          name="email"
          placeholder={intl.formatMessage({id: 'portal.user.edit.email.text'})}
          component={FieldFormGroup}
          label={<FormattedMessage id="portal.user.edit.email.text"/>}
          disabled={true}
          required={false} />

        <div className="user-form__name">
          <Row>
            <Col sm={6}>
              <Field
                type="text"
                name="first_name"
                placeholder={intl.formatMessage({id: 'portal.user.edit.firstName.text'})}
                component={FieldFormGroup}
                label={<FormattedMessage id="portal.user.edit.firstName.text"/>} />
            </Col>

            <Col sm={6}>
              <Field
                type="text"
                name="last_name"
                placeholder={intl.formatMessage({id: 'portal.user.edit.lastName.text'})}
                component={FieldFormGroup}
                label={<FormattedMessage id="portal.user.edit.lastName.text"/>} />
            </Col>
          </Row>
        </div>

        <div className="user-form__telephone">
          <Field
            name="phone"
            component={FieldTelephoneInput}
            disabled={true}
            label={<FormattedMessage id="portal.user.edit.phoneNumber.text"/>}
            required={false} />
        </div>

        <hr/>

        <Field
          name="role"
          component={FieldFormGroupSelect}
          options={roleOptions}
          label={<FormattedMessage id="portal.user.edit.role.text"/>}
          className="input-select" />


        {/* TODO: uncomment once UDNP-2008 is unblocked
        <hr/>

        <div className="form-group password-reset">
          <label className="control-label">
            <FormattedMessage id="portal.user.edit.resetPassword.text"/>
          </label>
          <div className="password-reset__wrapper">
            <Button bsStyle="primary" onClick={this.resetPassword}>
              <FormattedMessage id="portal.user.edit.resetPassword.button.text" />
            </Button>
            <p className="password-reset__description">
              <FormattedMessage
                id="portal.user.edit.resetPassword.instructions.text"
                values={{br: <br />}}
              />
            </p>
          </div>
        </div>
        */}

        <hr/>

        {/* Hiding group assignment until the API supports listing groups for
            users that have them assigned
        <hr/>

        <CheckboxArray
          iterable={groupOptions}
          field={groups}
          headerText="Groups"/>
        */}

        <FormFooterButtons>
            <Button
              id="cancel-btn"
              className="btn-secondary"
              onClick={onCancel}>
              <FormattedMessage id="portal.button.cancel"/>
            </Button>

            <Button
              type="submit"
              bsStyle="primary"
              disabled={invalid || submitting}>
              {submitButtonLabel}
            </Button>
          </FormFooterButtons>
      </form>
    )
  }
}

AccountManagementUserEditForm.displayName = "AccountManagementUserEditForm"
AccountManagementUserEditForm.propTypes = {
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  roleOptions: PropTypes.array,
  ...reduxFormPropTypes
}

export default reduxForm({
  form: 'account-management-edit-user-form',
  validate: validate
})(injectIntl(AccountManagementUserEditForm))
