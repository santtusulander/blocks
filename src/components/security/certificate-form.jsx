import React, { PropTypes } from 'react'
import { ButtonToolbar } from 'react-bootstrap'
import { List } from 'immutable'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'

import UDNButton from '../button'
import FieldFormGroup from '../form/field-form-group'
import FieldFormGroupSelect from '../form/field-form-group-select'

export const CertificateForm = ({ certificate, editMode, submitting, group, groups, intermediateCertificates, intl, invalid, onCancel, onSubmit, privateKey, title }) => {
  const groupsOptions = groups.map(group => [
    group.get('id'),
    group.get('name')
  ])

  return (
    <form>
      <div id="groups">
        <FieldFormGroupSelect
          {...group}
          label={<FormattedMessage id="portal.security.ssl.edit.assign.text"/>}
          disabled={editMode}
          numericValues={true}
          className="input-select"
          options={groupsOptions.toJS()}/>
      </div>

      <hr/>

      <FieldFormGroup
        {...title}
        label={<FormattedMessage id="portal.security.ssl.edit.certTitle.text" />}
      />

      <hr/>

      <FieldFormGroup
        {...privateKey}
        type="textarea"
        className="fixed-size-textarea"
        label={<FormattedMessage id="portal.security.ssl.edit.privateKey.text" />}
      />

      <hr/>

      <FieldFormGroup
        {...intermediateCertificates}
        type="textarea"
        className="fixed-size-textarea"
        required={false}
        label={<FormattedMessage id="portal.security.ssl.edit.intermediateCertificates.text" />}
      />

      <hr/>

      <FieldFormGroup
        {...certificate}
        type="textarea"
        className="fixed-size-textarea"
        label={<FormattedMessage id="portal.security.ssl.edit.certificate.text" />}
      />

      <ButtonToolbar className="text-right extra-margin-top" bsClass="btn-toolbar">
        <UDNButton
          id="cancel_button"
          outLine={true}
          onClick={onCancel}>
          {intl.formatMessage({id: 'portal.common.button.cancel'})}
        </UDNButton>
        <UDNButton
          id="save_button"
          bsStyle="primary"
          disabled={invalid || submitting}
          onClick={onSubmit}>
          {intl.formatMessage({id: 'portal.common.button.save'})}
        </UDNButton>
      </ButtonToolbar>
    </form>
  )
}

CertificateForm.displayName = "CertificateForm"
CertificateForm.propTypes = {
  certificate: PropTypes.object,
  editMode: PropTypes.bool,
  group: PropTypes.object,
  groups: PropTypes.instanceOf(List),
  intermediateCertificates: PropTypes.object,
  intl: intlShape.isRequired,
  invalid: PropTypes.bool,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  privateKey: PropTypes.object,
  submitting: PropTypes.bool,
  title: PropTypes.object
}
CertificateForm.defaultProps = {
  groups: List()
}

export default injectIntl(CertificateForm)
