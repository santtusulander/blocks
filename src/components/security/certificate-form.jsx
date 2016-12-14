import React, { PropTypes } from 'react'
import { FormGroup, FormControl, ControlLabel, ButtonToolbar } from 'react-bootstrap'
import { List } from 'immutable'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'

import { getReduxFormValidationState } from '../../util/helpers'
import SelectWrapper from '../select-wrapper'
import UDNButton from '../button'

export const CertificateForm = ({ onCancel, onSave, groups, fields, errors, editMode, intl }) => {
  const { group, title, privateKey, certificate, intermediateCertificates } = fields
  const groupsOptions = groups.map(group => [group.get('id'), group.get('name')])

  return (
    <form>
      <div id="groups">
        <SelectWrapper
          {...group}
          label={intl.formatMessage({id: 'portal.security.ssl.edit.assign.text'})}
          disabled={editMode}
          numericValues={true}
          value={group.value}
          className="input-select"
          options={groupsOptions.toJS()}/>
      </div>

      <hr/>

      <FormGroup controlId="title" validationState={getReduxFormValidationState(title)}>
        <ControlLabel><FormattedMessage id="portal.security.ssl.edit.certTitle.text" /></ControlLabel>
        <FormControl componentClass="input" {...title} />
        {title.touched && title.error && <div className="error-msg">{title.error}</div>}
      </FormGroup>

      <hr/>

      <FormGroup controlId="privateKey" validationState={getReduxFormValidationState(privateKey)}>
        <ControlLabel><FormattedMessage id="portal.security.ssl.edit.privateKey.text" /></ControlLabel>
        <FormControl componentClass="textarea" className="fixed-size-textarea" {...privateKey} />
        {privateKey.touched && privateKey.error && <div className="error-msg">{privateKey.error}</div>}
      </FormGroup>

      <hr/>

      <FormGroup controlId="intermediateCertificates" validationState={getReduxFormValidationState(intermediateCertificates)}>
        <ControlLabel><FormattedMessage id="portal.security.ssl.edit.intermediateCertificates.text" /></ControlLabel>
        <FormControl componentClass="textarea" className="fixed-size-textarea" {...intermediateCertificates} />
        {intermediateCertificates.touched && intermediateCertificates.error && <div className="error-msg">{intermediateCertificates.error}</div>}
      </FormGroup>

      <FormGroup controlId="certificate" validationState={getReduxFormValidationState(certificate)}>
        <ControlLabel><FormattedMessage id="portal.security.ssl.edit.certificate.text" /></ControlLabel>
        <FormControl componentClass="textarea" className="fixed-size-textarea" {...certificate} />
        {certificate.touched && certificate.error && <div className="error-msg">{certificate.error}</div>}
      </FormGroup>

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
  editMode: PropTypes.bool,
  errors: PropTypes.object,
  fields: PropTypes.object,
  groups: PropTypes.instanceOf(List),
  intl: intlShape.isRequired,
  onCancel: PropTypes.func,
  onSave: PropTypes.func
}

export default injectIntl(CertificateForm)
