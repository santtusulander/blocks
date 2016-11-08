import React, { PropTypes } from 'react'
import { Input, ButtonToolbar } from 'react-bootstrap'
import { List } from 'immutable'

import UDNButton from '../button'

export const CertificateForm = ({ onCancel, onSave, fields, errors }) => {
  const { title, privateKey, certificate } = fields

  return (
    <form>
      <div id="sslCertTitle">
        <Input type="text"
          label="SSL Cert Title"
          {...title}/>
        {title.touched && title.error && <div className="error-msg">{title.error}</div>}
        <hr/>
      </div>
      <div id="privateKey">
        <Input type="textarea"
          label="Private Key"
          className="fixed-size-textarea"
          {...privateKey}/>
        {privateKey.touched && privateKey.error && <div className="error-msg">{privateKey.error}</div>}
        <hr/>
      </div>
      <div id="certificate">
        <Input type="textarea"
          label="Certificate"
          className="fixed-size-textarea"
          {...certificate}/>
        {certificate.touched && certificate.error && <div className="error-msg">{certificate.error}</div>}
      </div>
      <ButtonToolbar className="text-right extra-margin-top" bsClass="btn-toolbar">
        <UDNButton
          id="cancel_button"
          outLine={true}
          onClick={onCancel}>
          Cancel
        </UDNButton>
        <UDNButton
          id="save_button"
          bsStyle="primary"
          disabled={Object.keys(errors).length !== 0}
          onClick={onSave}>
          Save
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
  initialValues: PropTypes.object,
  onCancel: PropTypes.func,
  onSave: PropTypes.func
}

export default CertificateForm
