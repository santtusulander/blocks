import React, { PropTypes } from 'react'
import { Modal, FormGroup, FormControl, ControlLabel, HelpBlock, ButtonToolbar } from 'react-bootstrap'
import { reduxForm } from 'redux-form'
import { Map } from 'immutable'
import { FormattedMessage } from 'react-intl'

import { isValidEmail, isInLength } from '../../util/validators'

import UDNButton from '../button'
import { getReduxFormValidationState } from '../../util/helpers'

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

          <FormGroup
            id="domain_name"
            validationState={getReduxFormValidationState(domainName)}>
            <ControlLabel><FormattedMessage id="portal.account.soaForm.domainName.label" /></ControlLabel>
            <FormControl {...domainName} />
            {domainName.touched && domainName.error &&
              <HelpBlock className="error-msg">{domainName.error}</HelpBlock>
            }
          </FormGroup>

          <hr/>

          <FormGroup validationState={getReduxFormValidationState(nameServer)}>
            <ControlLabel><FormattedMessage id="portal.account.soaForm.nameServer.label" /></ControlLabel>
            <FormControl {...nameServer} />
            {nameServer.touched && nameServer.error &&
              <HelpBlock className="error-msg">{nameServer.error}</HelpBlock>
            }
          </FormGroup>

          <hr/>

          <FormGroup validationState={getReduxFormValidationState(personResponsible)}>
            <ControlLabel><FormattedMessage id="portal.account.soaForm.personResponsible.label" /></ControlLabel>
            <FormControl className="soa-form-input" {...personResponsible} />
            {personResponsible.touched && personResponsible.error &&
              <HelpBlock className="error-msg">{personResponsible.error}</HelpBlock>
            }
          </FormGroup>

          <hr/>

          <FormGroup validationState={getReduxFormValidationState(zoneSerialNumber)}>
            <ControlLabel><FormattedMessage id="portal.account.soaForm.zoneSerialNumber.label" /></ControlLabel>
            <FormControl className="soa-form-input" {...zoneSerialNumber} />
            {zoneSerialNumber.touched && zoneSerialNumber.error &&
              <HelpBlock className="error-msg">{zoneSerialNumber.error}</HelpBlock>
            }
          </FormGroup>

          <hr/>

          <FormGroup validationState={getReduxFormValidationState(refresh)}>
            <ControlLabel><FormattedMessage id="portal.account.soaForm.refresh.label" /></ControlLabel>
            <FormControl className="soa-form-input refresh-input" {...refresh} />
            {refresh.touched && refresh.error &&
              <HelpBlock className="error-msg">{refresh.error}</HelpBlock>
            }
          </FormGroup>

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
  onCancel: PropTypes.func,
  onSave: PropTypes.func
}

export default reduxForm({
  fields: ['domainName', 'nameServer', 'personResponsible', 'zoneSerialNumber', 'refresh'],
  form: 'soaEditForm',
  validate
})(SoaEditForm)
