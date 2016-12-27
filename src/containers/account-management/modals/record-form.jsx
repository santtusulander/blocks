import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { reduxForm, getFormValues } from 'redux-form'
import { Modal } from 'react-bootstrap'
import { injectIntl, FormattedMessage } from 'react-intl'

import * as recordActionCreators from '../../../redux/modules/dns-records/actions'

import RecordForm from '../../../components/account-management/record-form'

import { checkForErrors } from '../../../util/helpers'
import { isValidIPv4Address, isValidIPv6Address, isInt } from '../../../util/validators'

import { getRecordFormInitialValues, isShown, recordValues } from '../../../util/dns-records-helpers'


/**
 * Filter fields to validate according to the fields that get rendered for the active record type.
 */
const filterFields = fields => {
  let filteredFields = {}
  for(const field in fields) {
    if (isShown(fields.type)(field)) {
      filteredFields[field] = fields[field]
    }
  }
  return filteredFields
}

const validateIpAddress = (fields, intl) => {
  if (fields.type === 'A') {
    return {
      valid: isValidIPv4Address(fields.value),
      errorText: intl.formatMessage({id: 'portal.account.recordForm.address.validationError.IPv4'})
    }
  } else if (fields.type === 'AAAA') {
    return {
      valid: isValidIPv6Address(fields.value),
      errorText: intl.formatMessage({id: 'portal.account.recordForm.address.validationError.IPv6'})
    }
  }

  return {
    valid: true,
    errorText: ''
  }
}

const validate = (fields, props) => {
  let filteredFields = filterFields(fields)
  const { type = '', ...rest } = filteredFields
  const ipAddressConfig = validateIpAddress(filteredFields, props.intl)
  const conditions = {
    prio: {
      condition: !isInt(filteredFields.prio),
      errorText: props.intl.formatMessage({id: 'portal.account.recordForm.prio.validationError'})
    },
    ttl: {
      condition: !isInt(filteredFields.ttl),
      errorText: props.intl.formatMessage({id: 'portal.account.recordForm.ttl.validationError'})
    },
    name: {
      condition: !filteredFields.name,
      errorText: props.intl.formatMessage({id: 'portal.account.recordForm.hostName.validationError'})
    },
    value: {
      condition: !ipAddressConfig.valid,
      errorText: ipAddressConfig.errorText
    }
  }
  return checkForErrors({ type, ...rest }, conditions)
}

const RecordFormContainer = props => {
  const { domain, edit, updateRecord, addRecord, closeModal, vals = {}, activeRecord, ...formProps } = props
  const filteredValues = filterFields(vals)
  const recordFormProps = {
    domain,
    edit,
    shouldShowField: isShown(vals.type),
    onSubmit: () => {
      let { ttl, prio } = filteredValues
      if (ttl) {
        filteredValues.ttl = Number(ttl)
      }
      if (prio) {
        filteredValues.prio = Number(prio)
      }
      edit ?
        updateRecord(filteredValues, domain, activeRecord) :
        addRecord(filteredValues, domain)
    },
    cancel: closeModal,
    ...formProps
  }
  return (
    <Modal show={true} dialogClassName="dns-edit-form-sidebar">
      <Modal.Header>
        <h1>{edit ? <FormattedMessage id='portal.account.recordForm.editRecord.title' /> : <FormattedMessage id='portal.account.recordForm.newRecord.title' />}</h1>
        {edit && <p>{vals.name}</p>}
      </Modal.Header>
      <Modal.Body>
        <RecordForm {...recordFormProps}/>
      </Modal.Body>
    </Modal>
  )
}

RecordFormContainer.propTypes = {
  activeRecord: PropTypes.object,
  addRecord: PropTypes.func,
  closeModal: PropTypes.func,
  domain: PropTypes.string,
  edit: PropTypes.bool,
  fields: PropTypes.object,
  updateRecord: PropTypes.func,
  vals: PropTypes.object

}

function mapStateToProps(state, { edit }) {
  const { dnsRecords, dns } = state
  const getRecordById = recordActionCreators.getById
  let activeRecord = getRecordById(dnsRecords.get('resources'), dnsRecords.get('activeRecord'))
  let initialValues = undefined
  if (activeRecord && edit) {
    initialValues = getRecordFormInitialValues(activeRecord.toJS())
  }
  let props = {
    activeRecord,
    vals: getFormValues('record-edit')(state),
    domain: dns.get('activeDomain'),
    loading: dnsRecords.get('fetching')
  }
  if (initialValues) {
    props.initialValues = initialValues
  }

  return props
}

function mapDispatchToProps(dispatch, { closeModal }) {
  const { startFetching, createResource, updateResource } = bindActionCreators(recordActionCreators, dispatch)
  return {
    addRecord: (vals, domain) => {
      vals = recordValues(vals)
      // Hardcode class-key as it is not set anywhere
      vals.class = 'IN'
      startFetching()
      createResource(domain, vals.name, vals)
        .then(() => closeModal())
    },
    updateRecord: (formValues, zone, activeRecord) => {
      let vals = recordValues(formValues)
      vals.id = activeRecord.get('id')
      vals.class = 'IN'
      startFetching()
      updateResource(zone, activeRecord.get('name'), vals)
        .then(() => closeModal())
    }
  }
}

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    reduxForm({
      form: 'record-edit',
      validate
    })(RecordFormContainer)
  )
)
