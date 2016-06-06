import React, { PropTypes } from 'react'
import { Modal, Input, ButtonToolbar } from 'react-bootstrap'
import { reduxForm } from 'redux-form'
import { Map } from 'immutable'

import UDNButton from '../button.js'

let errors = {}
const validate = values => {
  errors = {}
  const {
    domainName,
    nameServer,
    personResponsible,
    refresh,
    zoneSerialNumber } = values
  if (!domainName) {
    errors.domainName = 'Required'
  }
  if (!nameServer) {
    errors.nameServer = 'Required'
  }
  if (!personResponsible) {
    errors.personResponsible = 'Required'
  }
  else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/i.test(personResponsible)) {
    errors.personResponsible = 'Invalid input'
  }
  if (!zoneSerialNumber) {
    errors.zoneSerialNumber = 'Required'
  }
  else if(!/^[0-9]{1,20}$/i.test(zoneSerialNumber)) {
    errors.zoneSerialNumber = 'Invalid input'
  }
  if (!refresh) {
    errors.refresh = 'Required'
  }
  else if(!/^[0-9]{1,10}$/i.test(refresh)) {
    errors.refresh = 'Invalid input'
  }
  return errors
}

export const SoaEditForm = props => {
  const {
    onCancel,
    onSave,
    activeDomain,
    fields: {
      domainName,
      nameServer,
      personResponsible,
      zoneSerialNumber,
      refresh
    }
  } = props
  return (
    <Modal show={true} dialogClassName="soa-form-sidebar">
      <Modal.Header>
        <h1>SOA Record</h1>
        <p>{activeDomain.get('name')}</p>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div id="domain_name">
            <Input type="text"
              className="soa-form-input"
              label="Domain Name"
              { ...domainName }
              />
            {domainName.touched && domainName.error && <div className="error-msg">{domainName.error}</div>}
          </div>
          <div id="primary_nameserver">
            <Input type="text"
              className="soa-form-input"
              label="Primary Nameserver"
              { ...nameServer }/>
            {nameServer.touched && nameServer.error && <div className="error-msg">{nameServer.error}</div>}
          </div>
          <div id="responsible_person_mailbox">
            <Input type="text"
              className="soa-form-input"
              label="Responsible Person Mailbox"
              { ...personResponsible }/>
            {personResponsible.touched && personResponsible.error && <div className="error-msg">{personResponsible.error}</div>}
          </div>
          <div id="zone_serial_number">
            <Input type="text"
              className="soa-form-input"
              label="Serial # of Zone"
              { ...zoneSerialNumber }/>
            {zoneSerialNumber.touched && zoneSerialNumber.error && <div className="error-msg">{zoneSerialNumber.error}</div>}
          </div>
          <div id="refresh">
            <Input type="text"
              className="soa-form-input refresh-input"
              label="Refresh"
              { ...refresh }/>
            {refresh.touched && refresh.error && <div className="error-msg">{refresh.error}</div>}
          </div>
          <ButtonToolbar className="text-right extra-margin-top">
            <UDNButton
              id="cancel_button"
              bsStyle="primary"
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

SoaEditForm.propTypes = {
  activeDomain: PropTypes.instanceOf(Map),
  fields: PropTypes.object,
  initialValues: PropTypes.object,
  onCancel: PropTypes.func,
  onSave: PropTypes.func
}

export default reduxForm({
  fields: ['domainName', 'nameServer', 'personResponsible', 'zoneSerialNumber', 'refresh'],
  form: 'soaEditForm',
  validate
})(SoaEditForm)
