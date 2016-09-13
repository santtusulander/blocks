import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { reduxForm } from 'redux-form'
import { Modal } from 'react-bootstrap'

import * as recordActionCreators from '../../../redux/modules/dns-records/actions'

import RecordForm from '../../../components/account-management/record-form'

import { checkForErrors } from '../../../util/helpers'

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

const validate = fields => {
  let filteredFields = filterFields(fields)
  delete filteredFields.name
  const { type = '', ...rest } = filteredFields
  const conditions = {
    prio: {
      condition: !new RegExp('^[0-9]*$').test(filteredFields.prio),
      errorText: 'priority must be a number.'
    },
    ttl: {
      condition: !new RegExp('^[0-9]*$').test(filteredFields.ttl),
      errorText: 'TTL value must be a number.'
    }
  }
  return checkForErrors({ type, ...rest }, conditions)
}

const RecordFormContainer = props => {
  const { domain, edit, updateRecord, addRecord, closeModal, values, activeRecord, ...formProps } = props
  const filteredValues = filterFields(values)
  const recordFormProps = {
    domain,
    edit,
    shouldShowField: isShown(props.fields.type.value),
    submit: () => {
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
        <h1>{edit ? 'Edit DNS Record' : 'New DNS Record'}</h1>
        {edit && <p>{props.fields.name.value}</p>}
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
  values: PropTypes.object

}

function mapStateToProps({ dnsRecords, dns }, { edit }) {
  const getRecordById = recordActionCreators.getById
  let activeRecord = getRecordById(dnsRecords.get('resources'), dnsRecords.get('activeRecord'))
  let initialValues = undefined
  initialValues = activeRecord && edit && getRecordFormInitialValues(activeRecord.toJS())
  let props = {
    activeRecord,
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
    addRecord: (values, domain) => {
      values = recordValues(values)
      // Hardcode class-key as it is not set anywhere
      values.class = 'IN'
      startFetching()
      createResource(domain, values.name, values)
        .then(() => closeModal())
    },
    updateRecord: (formValues, zone, activeRecord) => {
      let values = recordValues(formValues)
      values.id = activeRecord.get('id')
      values.class = 'IN'
      startFetching()
      updateResource(zone, activeRecord.get('name'), values)
        .then(() => closeModal())
    }
  }
}

export default reduxForm({
  form: 'dns-edit',
  fields: ['type', 'name', 'value', 'ttl', 'prio'],
  validate
}, mapStateToProps, mapDispatchToProps)(RecordFormContainer)
