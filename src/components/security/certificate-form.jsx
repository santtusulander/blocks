import React, { PropTypes } from 'react'
import { Input, ButtonToolbar } from 'react-bootstrap'
import { List } from 'immutable'

import UDNButton from '../button.js'

export const CertificateForm = ({ onCancel, onSave, accounts, groups, fields, errors, editMode }) => {
  const { account, group, title, privateKey, interMediateCert, certificate } = fields
  return (
    <form>
      <div id="accounts">
        <Input type="select"
          label="Account"
          disabled={editMode}
          { ...account }>
          {!account.value && <option>Please select an account</option>}
          {accounts.map((account, i) => <option key={i} value={account.get('id')}>{account.get('name')}</option>)}
        </Input>
        <hr/>
      </div>
      <div id="groups">
        <Input type="select"
          label="Assign to Group"
          disabled={editMode}
          { ...group }>
          {!group.value && <option value="">Please select a group</option>}
          {groups.map((group, i) => <option key={i} value={group.get('id')}>{group.get('name')}</option>)}
        </Input>
        <hr/>
      </div>
      <div id="sslCertTitle">
        <Input type="text"
          label="SSL Cert Title"
          { ...title }/>
        {title.touched && title.error && <div className="error-msg">{title.error}</div>}
        <hr/>
      </div>
      <div id="privateKey">
        <Input type="textarea"
          label="Private Key*"
          className="fixed-size-textarea"
          { ...privateKey }/>
        {privateKey.touched && privateKey.error && <div className="error-msg">{privateKey.error}</div>}
        <hr/>
      </div>
      <div id="interMediateCert">
        <Input type="textarea"
          className="fixed-size-textarea"
          label="Intermediate Certificate (optional)"
        { ...interMediateCert }/>
        <hr/>
      </div>
      <div id="certificate">
        <Input type="textarea"
          label="Certificate*"
          className="fixed-size-textarea"
          { ...certificate }/>
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
  errors: PropTypes.object,
  fields: PropTypes.object,
  groups: PropTypes.instanceOf(List),
  initialValues: PropTypes.object,
  onCancel: PropTypes.func,
  onSave: PropTypes.func
}

export default CertificateForm
