import React, { PropTypes } from 'react'
import { Modal, Input, ButtonToolbar } from 'react-bootstrap'
import { reduxForm } from 'redux-form'
import { Map } from 'immutable'
import { FormattedMessage, injectIntl } from 'react-intl'

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
    errors.domainName = <FormattedMessage id="portal.account.soaForm.validation.required"/>
  }
  if(!nameServer) {
    errors.nameServer = <FormattedMessage id="portal.account.soaForm.validation.required"/>
  }
  if(!personResponsible) {
    errors.personResponsible = <FormattedMessage id="portal.account.soaForm.validation.required"/>
  }
  else if(!isValidEmail(personResponsible)) {
    errors.personResponsible = <FormattedMessage id="portal.account.soaForm.validation.invalid"/>
  }
  if(!zoneSerialNumber) {
    errors.zoneSerialNumber = <FormattedMessage id="portal.account.soaForm.validation.required"/>
  }
  else if(!isInLength(zoneSerialNumber, 20)) {
    errors.zoneSerialNumber = <FormattedMessage id="portal.account.soaForm.validation.invalid"/>
  }
  if(!refresh) {
    errors.refresh = <FormattedMessage id="portal.account.soaForm.validation.required"/>
  }
  else if(!isInLength(refresh)) {
    errors.refresh = <FormattedMessage id="portal.account.soaForm.validation.invalid"/>
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
            {...domainName}
            type="text"
            label={props.intl.formatMessage({id: 'portal.account.soaForm.domainName.label'})}/>

          {domainName.touched && domainName.error && <div className="error-msg">{domainName.error}</div>}

          <hr/>

          <Input
            {...nameServer}
            type="text"
            label={props.intl.formatMessage({id: 'portal.account.soaForm.nameServer.label'})}/>

          {nameServer.touched && nameServer.error && <div className="error-msg">{nameServer.error}</div>}

          <hr/>

          <Input
            {...personResponsible}
            type="text"
            className="soa-form-input"
            label={props.intl.formatMessage({id: 'portal.account.soaForm.personResponsible.label'})}/>

          {personResponsible.touched && personResponsible.error &&
          <div className="error-msg">{personResponsible.error}</div>}

          <hr/>

          <Input
            {...zoneSerialNumber}
            type="text"
            className="soa-form-input"
            label={props.intl.formatMessage({id: 'portal.account.soaForm.zoneSerialNumber.label'})}/>

          {zoneSerialNumber.touched && zoneSerialNumber.error &&
          <div className="error-msg">{zoneSerialNumber.error}</div>}

          <hr/>

          <Input
            {...refresh}
            type="text"
            className="soa-form-input refresh-input"
            label={props.intl.formatMessage({id: 'portal.account.soaForm.refresh.label'})}/>

          {refresh.touched && refresh.error && <div className="error-msg">{refresh.error}</div>}

          <hr/>

          <ButtonToolbar className="text-right extra-margin-top">
            <UDNButton
              id="cancel_button"
              outLine={true}
              onClick={onCancel}>
              <FormattedMessage id="portal.common.button.cancel"/>
            </UDNButton>
            <UDNButton
              id="save_button"
              bsStyle="primary"
              disabled={Object.keys(errors).length !== 0}
              onClick={onSave}>
              <FormattedMessage id="portal.common.button.save"/>
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
  intl: PropTypes.object,
  onCancel: PropTypes.func,
  onSave: PropTypes.func
}

export default reduxForm({
  fields: ['domainName', 'nameServer', 'personResponsible', 'zoneSerialNumber', 'refresh'],
  form: 'soaEditForm',
  validate
})(injectIntl(SoaEditForm))
