import React, { PropTypes } from 'react'
import { ButtonToolbar } from 'react-bootstrap'
import { List } from 'immutable'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'

import UDNButton from '../button'
import FieldFormGroup from '../form/field-form-group'
import FieldFormGroupSelect from '../form/field-form-group-select'

export const CertificateForm = ({ certificate, editMode, group, groups, intermediateCertificates, intl, invalid, onCancel, onSave, privateKey, title }) => {
  const groupsOptions = groups.map(group => [group.get('id'),
    group.get('name')])

  return (
    <form>
      <div id="groups">
        <FieldFormGroupSelect
          {...group}
          label={<FormattedMessage id="'portal.security.ssl.edit.assign.text'"/>}
          disabled={editMode}
          numericValues={true}
          className="input-select"
          options={groupsOptions.toJS()}/>
      </div>

      <hr/>

      <FieldFormGroup {...title}>
        <FormattedMessage id="portal.security.ssl.edit.certTitle.text" />
      </FieldFormGroup>

      <hr/>

      <FieldFormGroup type="textarea" className="fixed-size-textarea" {...privateKey} >
        <FormattedMessage id="portal.security.ssl.edit.privateKey.text" />
      </FieldFormGroup>

      <hr/>

      <FieldFormGroup type="textarea" className="fixed-size-textarea" {...intermediateCertificates} >
        <FormattedMessage id="portal.security.ssl.edit.intermediateCertificates.text" />
      </FieldFormGroup>

      <hr/>

      <FieldFormGroup type="textarea" className="fixed-size-textarea" {...certificate} >
        <FormattedMessage id="portal.security.ssl.edit.certificate.text" />
      </FieldFormGroup>

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
          disabled={invalid}
          onClick={onSave}>
          {intl.formatMessage({id: 'portal.common.button.save'})}
        </UDNButton>
      </ButtonToolbar>
    </form>
  )
}

CertificateForm.propTypes = {
  certificate: PropTypes.object,
  editMode: PropTypes.bool,
  group: PropTypes.object,
  groups: PropTypes.instanceOf(List),
  intermediateCertificates: PropTypes.object,
  intl: intlShape.isRequired,
  invalid: PropTypes.bool,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  privateKey: PropTypes.object,
  title: PropTypes.object
}

export default injectIntl(CertificateForm)
