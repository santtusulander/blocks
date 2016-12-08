import React, { PropTypes } from 'react'
import { FormGroup, FormControl, ControlLabel, ButtonToolbar } from 'react-bootstrap'
import { List } from 'immutable'
import { FormattedMessage } from 'react-intl'

import SelectWrapper from '../select-wrapper'
import UDNButton from '../button'

const getValidationState = field => field.touched && field.error ? "error" : null

export const CertificateForm = ({ onCancel, onSave, groups, fields, errors, editMode }) => {
  const { group, title, privateKey, certificate } = fields
  const groupsOptions = groups.map(group => [group.get('id'), group.get('name')])

  return (
    <form>
      <div id="groups">
        <SelectWrapper
          {...group}
          label="Assign to Group"
          disabled={editMode}
          numericValues={true}
          value={group.value}
          className="input-select"
          options={groupsOptions.toJS()}/>
      </div>

      <hr/>

      <FormGroup controlId="title" validationState={getValidationState(title)}>
        <ControlLabel><FormattedMessage id="portal.security.ssl.edit.certTitle.text" /></ControlLabel>
        <FormControl componentClass="input" {...title} />
        {title.touched && title.error && <div className="error-msg">{title.error}</div>}
      </FormGroup>

      <hr/>

      <FormGroup controlId="privateKey" validationState={getValidationState(privateKey)}>
        <ControlLabel><FormattedMessage id="portal.security.ssl.edit.privateKey.text" /></ControlLabel>
        <FormControl componentClass="textarea" className="fixed-size-textarea" {...privateKey} />
        {privateKey.touched && privateKey.error && <div className="error-msg">{privateKey.error}</div>}
      </FormGroup>

      <hr/>

      <FormGroup controlId="certificate" validationState={getValidationState(certificate)}>
        <ControlLabel><FormattedMessage id="portal.security.ssl.edit.certificate.text" /></ControlLabel>
        <FormControl componentClass="textarea" className="fixed-size-textarea" {...certificate} />
        {certificate.touched && certificate.error && <div className="error-msg">{certificate.error}</div>}
      </FormGroup>

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
  groups: PropTypes.instanceOf(List),
  initialValues: PropTypes.object,
  onCancel: PropTypes.func,
  onSave: PropTypes.func
}

export default CertificateForm
