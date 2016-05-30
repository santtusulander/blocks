import React, { PropTypes } from 'react'
import { Modal, Input, ButtonToolbar } from 'react-bootstrap'
import { reduxForm } from 'redux-form'

import { ButtonWrapper as Button } from '../button.js'

let errors = null
const validate = values => {
  errors = {}
  const {
    domainName,
    nameServer,
    personResponsible,
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
    errors.personResponsible = 'Invalid email'
  }
  if (!zoneSerialNumber) {
    errors.zoneSerialNumber = 'Required'
  }
  return errors
}

const SOAForm = props => {
  const {
    onHide,
    onSave,
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
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={e => { e.preventDefault(); onSave() }}>
          <Input type="text"
            className="soa-form-input"
            label="Domain Name"
            id="domain_name"
            { ...domainName }
            />
          {domainName.touched && domainName.error && <div>{domainName.error}</div>}
          <Input type="text"
            className="soa-form-input"
            label="Primary Nameserver"
            id="primary_nameserver"
            { ...nameServer }/>
          {nameServer.touched && nameServer.error && <div>{nameServer.error}</div>}
          <Input type="text"
            className="soa-form-input"
            label="Responsible Person Mailbox"
            id="responsible_person_mailbox"
            { ...personResponsible }/>
          {personResponsible.touched && personResponsible.error && <div>{personResponsible.error}</div>}
          <Input type="text"
            className="soa-form-input"
            label="Serial # of Zone"
            id="zone_serial_number"
            { ...zoneSerialNumber }/>
          {zoneSerialNumber.touched && zoneSerialNumber.error && <div>{zoneSerialNumber.error}</div>}
          <Input type="text"
            className="soa-form-input refresh-input"
            label="Refresh"
            id="refresh"
            { ...refresh }/>
          {refresh.touched && refresh.error && <div>{refresh.error}</div>}
          <ButtonToolbar className="text-right extra-margin-top">
            <Button bsStyle="primary"
              outLine={true}
              onClick={onHide}>
              Cancel
            </Button>
            <Button bsStyle="primary"
              disabled={Object.keys(errors).length !== 0}
              onClick={onSave}>
              Save
            </Button>
          </ButtonToolbar>
        </form>
      </Modal.Body>
    </Modal>
  )
}

SOAForm.propTypes = {
  fields: React.PropTypes.object,
  onHide: PropTypes.func,
  onSave: PropTypes.func
}


export default reduxForm({
  fields: ['domainName', 'nameServer', 'personResponsible', 'zoneSerialNumber', 'refresh'],
  form: 'addSOAForm',
  validate
})(SOAForm)
