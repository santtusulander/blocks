import React, { PropTypes } from 'react'
import { Input, ButtonToolbar } from 'react-bootstrap'
import { List } from 'immutable'
import { injectIntl, intlShape } from 'react-intl'

import SelectWrapper from '../select-wrapper.jsx'
import UDNButton from '../button'

export const CertificateForm = ({ onCancel, onSave, groups, fields, errors, editMode, intl }) => {
  const { group, title, privateKey, certificate, intermediateCertificates } = fields
  const groupsOptions = groups.map(group => [group.get('id'), group.get('name')])

  return (
    <form>
      <div id="groups">
        <SelectWrapper
          {...group}
          label={intl.formatMessage({id: 'portal.security.ssl.certificateForm.groupsSelector.label'})}
          disabled={editMode}
          numericValues={true}
          value={group.value}
          className="input-select"
          options={groupsOptions.toJS()}/>
        <hr/>
      </div>
      <div id="sslCertTitle">
        <Input type="text"
          label={intl.formatMessage({id: 'portal.security.ssl.certificateForm.sslCertTitle.label'})}
          {...title}/>
        {title.touched && title.error && <div className="error-msg">{title.error}</div>}
        <hr/>
      </div>
      <div id="privateKey">
        <Input type="textarea"
          label={intl.formatMessage({id: 'portal.security.ssl.certificateForm.privateKey.label'})}
          className="fixed-size-textarea"
          {...privateKey}/>
        {privateKey.touched && privateKey.error && <div className="error-msg">{privateKey.error}</div>}
        <hr/>
      </div>
      <div id="intermediateCertificates">
        <Input type="textarea"
          label={intl.formatMessage({id: 'portal.security.ssl.certificateForm.intermediateCertificates.label'})}
          className="fixed-size-textarea"
          {...intermediateCertificates}/>
        {intermediateCertificates.touched && intermediateCertificates.error && <div className="error-msg">{intermediateCertificates.error}</div>}
        <hr/>
      </div>
      <div id="certificate">
        <Input type="textarea"
          label={intl.formatMessage({id: 'portal.security.ssl.certificateForm.certificate.label'})}
          className="fixed-size-textarea"
          {...certificate}/>
        {certificate.touched && certificate.error && <div className="error-msg">{certificate.error}</div>}
      </div>
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
          disabled={Object.keys(errors).length !== 0}
          onClick={onSave}>
          {intl.formatMessage({id: 'portal.common.button.save'})}
        </UDNButton>
      </ButtonToolbar>
    </form>
  )
}

CertificateForm.propTypes = {
  accounts: PropTypes.instanceOf(List),
  editMode: PropTypes.bool,
  errors: PropTypes.object,
  fields: PropTypes.object,
  groups: PropTypes.instanceOf(List),
  initialValues: PropTypes.object,
  intl: intlShape.isRequired,
  onCancel: PropTypes.func,
  onSave: PropTypes.func
}

export default injectIntl(CertificateForm)
