import React, { PropTypes } from 'react'
import { List } from 'immutable'
import { reduxForm } from 'redux-form'
import { Modal } from 'react-bootstrap'

import {
  getById,
  createResource,
  updateResource,
  startFetching
} from '../../../redux/modules/dns-records/actions'

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
  const { domain, edit, updateRecord, addRecord, closeModal, values, activeRecord, records, ...formProps } = props
  const recordFormProps = {
    domain,
    edit,
    values: filterFields(values),
    shouldShowField: isShown(props.fields.type.value),
    onSave: fields => {
      if (fields.ttl) {
        fields.ttl = Number(fields.ttl)
      }
      if (fields.prio) {
        fields.prio = Number(fields.prio)
      }
      edit ? updateRecord(fields, domain, records, activeRecord) : addRecord(fields, domain)
    },
    onCancel: closeModal,
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
  records: PropTypes.instanceOf(List),
  updateRecord: PropTypes.func,
  values: PropTypes.object

}

function mapStateToProps({ dnsRecords, dns }, { edit }) {
  const records = dnsRecords.get('resources')
  let activeRecord = getById(records, dnsRecords.get('activeRecord'))
  let initialValues = undefined
  initialValues = activeRecord && edit && getRecordFormInitialValues(activeRecord.toJS())
  let props = {
    activeRecord,
    domain: dns.get('activeDomain'),
    loading: dnsRecords.get('fetching'),
    records
  }
  if (initialValues) {
    props.initialValues = initialValues
  }
  return props
}

function mapDispatchToProps(dispatch, { closeModal }) {
  return {
    addRecord: (values, domain) => {
      values = recordValues(values)
      // Hardcode class-key as it is not set anywhere
      values.class = 'IN'
      dispatch(startFetching())
      dispatch(createResource(domain, values.name, values))
        .then(() => closeModal())
    },
    updateRecord: (formValues, zone, records, activeRecord) => {
      let values = recordValues(formValues)
      values.id = activeRecord.get('id')
      values.class = 'IN'
      dispatch(startFetching())
      dispatch(updateResource(zone, activeRecord.get('name'), values))
        .then(() => closeModal())
    }
  }
}

export default reduxForm({
  form: 'dns-edit',
  fields: ['type', 'name', 'value', 'ttl', 'prio'],
  validate
}, mapStateToProps, mapDispatchToProps)(RecordFormContainer)
