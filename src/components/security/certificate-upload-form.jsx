import React, { PropTypes } from 'react'
import { Modal, Input, ButtonToolbar } from 'react-bootstrap'
import { reduxForm } from 'redux-form'
import { List } from 'immutable'

import UDNButton from '../button.js'

let errors = {}
const validate = values => {
  errors = {}
  const {
    sslCertTitle,
    privateKey,
    certificate } = values
  if (!sslCertTitle) {
    errors.sslCertTitle = 'Required'
  }
  if (!privateKey) {
    errors.privateKey = 'Required'
  }
  if (!certificate) {
    errors.certificate = 'Required'
  }
  return errors
}

export const CertificateUploadForm = ({ onCancel, onSave, accounts, groups, fields }) => {
  const { account, group, sslCertTitle, privateKey, interMediateCert, certificate } = fields
  return (
    <Modal show={true} dialogClassName="soa-form-sidebar">
      <Modal.Header>
        <h1>Upload Certificate</h1>
        <p>Lorem ipsum dolor</p>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div id="accounts">
            <Input type="select"
              label="Account"
              { ...account }
              >
                {accounts.map((account, i) => <option key={i} value={account.get('id')}>{account.get('name')}</option>)}
              </Input>
          </div>
          <div id="groups">
            <Input type="select"
              label="Assign to Group"
              { ...group }>
              {groups.map((group, i) => <option key={i} value={group.get('id')}>{group.get('name')}</option>)}
            </Input>
          </div>
          <div id="sslCertTitle">
            <Input type="text"
              label="SSL Cert Title"
              { ...sslCertTitle }/>
            {sslCertTitle.touched && sslCertTitle.error && <div className="error-msg">{sslCertTitle.error}</div>}
          </div>
          <div id="privateKey">
            <Input type="textarea"
              label="Private Key*"
              className="fixed-size-textarea"
              { ...privateKey }/>
            {privateKey.touched && privateKey.error && <div className="error-msg">{privateKey.error}</div>}
          </div>
          <div id="interMediateCert">
            <Input type="textarea"
              className="fixed-size-textarea"
              label="Intermediate Certificate (optional)"
            { ...interMediateCert }/>
          </div>
          <div id="certificate">
            <Input type="textarea"
              label="Certificate*"
              className="fixed-size-textarea"
              { ...certificate }/>
            {certificate.touched && certificate.error && <div className="error-msg">{certificate.error}</div>}
          </div>
          <ButtonToolbar className="text-right extra-margin-top">
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
      </Modal.Body>
    </Modal>
  )
}

CertificateUploadForm.propTypes = {
  accounts: PropTypes.instanceOf(List),
  fields: PropTypes.object,
  groups: PropTypes.instanceOf(List),
  initialValues: PropTypes.object,
  onCancel: PropTypes.func,
  onSave: PropTypes.func
}

export default reduxForm({
  fields: ['account', 'group', 'sslCertTitle', 'interMediateCert', 'privateKey', 'certificate'],
  form: 'certUploadForm',
  validate
})(CertificateUploadForm)
