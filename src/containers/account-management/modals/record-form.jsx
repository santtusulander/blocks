import React, { PropTypes } from 'react'
import { reduxForm } from 'redux-form'
import { Modal } from 'react-bootstrap'

//import { activeRecordSelector } from '../../../redux/modules/dns-records/reducers'

import { checkForErrors } from '../../../util/helpers'
import { recordFields } from '../../../constants/dns-record-types'

import RecordForm from '../../../components/account-management/record-form'

/**
 *
 * Filter fields to validate according to the fields that get rendered for the active record type.
 * The 'recordFields' -constant dictates which fields get rendered per record type.
 */
const isShown = recordType => field => recordFields[field].includes(recordType)
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
  const conditions = {
    priority: {
      condition: !new RegExp('^[0-9]*$').test(filteredFields.priority),
      errorText: 'Priority must be a number.'
    },
    ttl: {
      condition: !new RegExp('^[0-9]*$').test(filteredFields.ttl),
      errorText: 'TTL value must be a number.'
    },
    value: {
      condition: !new RegExp('^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$').test(filteredFields.value),
      errorText: 'Address must be an IP address.'
    }
  }
  return checkForErrors(filteredFields, conditions)
}

const RecordFormContainer = props => {
  const { domain, edit, saveRecord, addRecord, closeModal, ...formProps  } = props
  const recordFormProps = {
    domain,
    edit,
    values: filterFields(props.values),
    shouldShowField: isShown(props.fields.type.value),
    onSave: values => edit ? saveRecord(values) : addRecord(values),
    onCancel: closeModal,
    ...formProps
  }
  return (
    <Modal show={true} dialogClassName="dns-edit-form-sidebar">
      <Modal.Header>
        <h1>{edit ? 'Edit DNS Record' : 'New DNS Record'}</h1>
        {edit && <p>{name.value}</p>}
      </Modal.Header>
      <Modal.Body>
        <RecordForm {...recordFormProps}/>
      </Modal.Body>
    </Modal>
  )
}

RecordFormContainer.propTypes = {
  addRecord: PropTypes.func,
  closeModal: PropTypes.func,
  domain: PropTypes.string,
  edit: PropTypes.bool,
  fields: PropTypes.object,
  saveRecord: PropTypes.func,
  values: PropTypes.object

}

function mapStateToProps({ dnsRecords, dns }, { edit }) {
  const initialValues = edit ? {
    id: 1,
    class: "IN",
    name: "aaa",
    ttl: 3600,
    type: "AAAA",
    value: "aaaa"
  } : {}
    //activeRecordSelector(dnsRecords.get('resources'), dnsRecords.get('activeRecord')) :
  return {
    initialValues,
    domain: dns.get('activeDomain')
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addRecord: () => {},
    saveRecord: () => {}
  }
}

export default reduxForm({
  form: 'dns-edit',
  fields: ['type', 'name', 'value', 'ttl', 'priority'],
  validate
}, mapStateToProps, mapDispatchToProps)(RecordFormContainer)
