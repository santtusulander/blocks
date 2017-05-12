import React, { PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import { Field } from 'redux-form'
import { Button } from 'react-bootstrap'

import FieldFormGroup from '../shared/form-fields/field-form-group'
import FieldFormGroupSelect from '../shared/form-fields/field-form-group-select'
import FormFooterButtons from '../shared/form-elements/form-footer-buttons'


export const CertificateForm = ({ groupsOptions, certificateToEdit, submitting,invalid, onCancel, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <Field
        name="group"
        className="input-select"
        component={FieldFormGroupSelect}
        options={groupsOptions.toJS()}
        label={<FormattedMessage id="portal.security.ssl.edit.assign.text"/>}
        disabled={!certificateToEdit.isEmpty()}
      />
      <hr/>

      <Field
        name="title"
        type="text"
        component={FieldFormGroup}
        label={<FormattedMessage id="portal.security.ssl.edit.certTitle.text"/>}
      />
      <hr/>

      <Field
        name="privateKey"
        type="textarea"
        className="fixed-size-textarea"
        component={FieldFormGroup}
        label={<FormattedMessage id="portal.security.ssl.edit.privateKey.text"/>}
      />

      <hr/>

      <Field
        name="certificate"
        type="textarea"
        className="fixed-size-textarea"
        component={FieldFormGroup}
        label={<FormattedMessage id="portal.security.ssl.edit.certificate.text"/>}
      />

      <hr/>

      <Field
        name="intermediateCertificates"
        type="textarea"
        className="fixed-size-textarea"
        component={FieldFormGroup}
        required={false}
        label={<FormattedMessage id="portal.security.ssl.edit.intermediateCertificates.text"/>}
      />

      <FormFooterButtons className="text-right extra-margin-top" bsClass="btn-toolbar">
        <Button
          id="cancel_button"
          className="btn-secondary"
          onClick={onCancel}>
          <FormattedMessage id="portal.common.button.cancel"/>
        </Button>
        <Button
          id="save_button"
          type="submit"
          bsStyle="primary"
          disabled={invalid || submitting}>
          {submitting ? <FormattedMessage id='portal.button.adding' />
                      : <FormattedMessage id='portal.button.add' />
          }
        </Button>
      </FormFooterButtons>
    </form>
  )
}

CertificateForm.displayName = "CertificateForm"
CertificateForm.propTypes = {
  certificateToEdit: PropTypes.object,
  groupsOptions: PropTypes.object,
  invalid: PropTypes.bool,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool
}


export default CertificateForm
