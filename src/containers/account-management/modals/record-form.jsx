import React, { Component, PropTypes } from 'react'
import { reduxForm } from 'redux-form'
import { Modal } from 'react-bootstrap'

import { activeRecordSelector } from '../../../redux/modules/dns-records/reducers'
import { toggleAccountManagementModal } from '../../../redux/modules/ui'


import { checkForErrors } from '../../util/helpers'
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
    if (isShown(fields.recordType)(field)) {
      filteredFields[field] = fields[field]
    }
  }
  return filteredFields
}

const validate = fields => {
  let filteredFields = filterFields(fields)
  delete filteredFields.hostName
  const conditions = {
    priority: {
      condition: !new RegExp('^[0-9]*$').test(filteredFields.priority),
      errorText: 'Priority must be a number.'
    },
    ttl: {
      condition: !new RegExp('^[0-9]*$').test(filteredFields.ttl),
      errorText: 'TTL value must be a number.'
    },
    targetValue: {
      condition: !new RegExp('^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$').test(filteredFields.targetValue),
      errorText: 'Address must be an IP address.'
    }
  }
  return checkForErrors(filteredFields, conditions)
}

class RecordFormContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      search: ''
    }
  }

  render() {
    const { domain, edit, saveRecord, addRecord, toggleModal, ...formProps  } = this.props
    const recordFormProps = {
      domain,
      edit,
      values: filterFields(this.props.values),
      searchValue: this.state.search,
      shouldShowField: isShown(this.props.fields.recordType.value),
      searchFunc: ({ target: { value } }) => this.setState({ search: value }),
      onSave: values => this.editingRecord ? saveRecord(values) : addRecord(values),
      onCancel: () => toggleModal(null),
      formProps
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
}

function mapStateToProps({ dnsRecords }, { edit }) {
  const initialValues = edit ?
    activeRecordSelector(dnsRecords.get('resources'), dnsRecords.get('activeRecord')) :
    {}
  return {
    initialValues
  }
}

function mapDispatchToProps(dispatch) {
  return {
    toggleModal: value => dispatch(toggleAccountManagementModal(value))
  }
}

export default reduxForm({
  form: 'dns-edit',
  fields: ['type', 'name', 'value', 'ttl', 'priority'],
  validate
}, mapStateToProps, mapDispatchToProps)(RecordFormContainer)
