import React, { PropTypes } from 'react'
import { Modal, Input, ButtonToolbar } from 'react-bootstrap'
import { reduxForm } from 'redux-form'
import { Map } from 'immutable'

import { isValidEmail, isInLength } from '../../util/validators'

import UDNButton from '../button'

import './soa-edit.form.scss'

let errors     = {}
const validate = values => {
  errors = {}
  const {
          domainName,
          nameServer,
          personResponsible,
          refresh,
          zoneSerialNumber
        } = values
  if(!domainName) {
    errors.domainName = 'Required'
  }
  if(!nameServer) {
    errors.nameServer = 'Required'
  }
  if(!personResponsible) {
    errors.personResponsible = 'Required'
  }
  else if(!isValidEmail(personResponsible)) {
    errors.personResponsible = 'Invalid input'
  }
  if(!zoneSerialNumber) {
    errors.zoneSerialNumber = 'Required'
  }
  else if(!isInLength(zoneSerialNumber, 20)) {
    errors.zoneSerialNumber = 'Invalid input'
  }
  if(!refresh) {
    errors.refresh = 'Required'
  }
  else if(!isInLength(refresh)) {
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
    <Modal show={true} dialogClassName="soa-edit-form-sidebar">
      <Modal.Header>
        <h1>Edit SOA Record</h1>
        <p>{activeDomain.get('name')}</p>
      </Modal.Header>
      <Modal.Body>
        <form>

          <Input
            { ...domainName }
            type="text"
            label="Domain Name"/>

          {domainName.touched && domainName.error && <div className="error-msg">{domainName.error}</div>}

          <hr/>

          <Input
            { ...nameServer }
            type="text"
            label="Primary Nameserver"/>

          {nameServer.touched && nameServer.error && <div className="error-msg">{nameServer.error}</div>}

          <hr/>

          <Input
            { ...personResponsible }
            type="text"
            className="soa-form-input"
            label="Responsible Person Mailbox"/>

          {personResponsible.touched && personResponsible.error &&
          <div className="error-msg">{personResponsible.error}</div>}

          <hr/>

          <Input
            { ...zoneSerialNumber }
            type="text"
            className="soa-form-input"
            label="Serial # of Zone"/>

          {zoneSerialNumber.touched && zoneSerialNumber.error &&
          <div className="error-msg">{zoneSerialNumber.error}</div>}

          <hr/>

          <Input
            { ...refresh }
            type="text"
            className="soa-form-input refresh-input"
            label="Refresh"/>

          {refresh.touched && refresh.error && <div className="error-msg">{refresh.error}</div>}

          <hr/>

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
