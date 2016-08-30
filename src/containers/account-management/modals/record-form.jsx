import React, { PropTypes } from 'react'
import { reduxForm } from 'redux-form'
import { Modal } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

import { getById, updateResource, createResource } from '../../../redux/modules/dns-records/actions'
import { showInfoDialog, hideInfoDialog } from '../../../redux/modules/ui'

import UDNButton from '../../../components/button'
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
  const { type = '', ...rest } = filteredFields
  const conditions = {
    priority: {
      condition: !new RegExp('^[0-9]*$').test(filteredFields.priority),
      errorText: 'Priority must be a number.'
    },
    ttl: {
      condition: !new RegExp('^[0-9]*$').test(filteredFields.ttl),
      errorText: 'TTL value must be a number.'
    }
  }
  return checkForErrors({ type, ...rest }, conditions)
}

const RecordFormContainer = props => {
  const { domain, edit, saveRecord, addRecord, closeModal, values, ...formProps } = props
  const recordFormProps = {
    domain,
    edit,
    values: filterFields(values),
    shouldShowField: isShown(props.fields.type.value),
    onSave: fields => {
      if (fields.ttl) {
        fields.ttl = Number(fields.ttl)
      }
      if (fields.priority) {
        fields.priority = Number(fields.priority)
      }
      edit ? saveRecord(fields, domain) : addRecord(fields, domain)
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
  addRecord: PropTypes.func,
  closeModal: PropTypes.func,
  domain: PropTypes.string,
  edit: PropTypes.bool,
  fields: PropTypes.object,
  saveRecord: PropTypes.func,
  values: PropTypes.object

}

function mapStateToProps({ dnsRecords, dns }, { edit }) {
  const domain = dns.get('activeDomain')
  const initialValues = edit ?
    getById(dnsRecords.get('resources'), dnsRecords.get('activeRecord')).toJS() : {}
  return {
    initialValues,
    domain
  }
}

function mapDispatchToProps(dispatch, { closeModal }) {
  return {
    addRecord: (values, domain) => {
      // Hardcode class-key as it is not set anywhere
      values.class = 'IN'
      dispatch(createResource(domain, values.name, values)).then(({ error, payload }) => {
        if(error) {
          dispatch(showInfoDialog({
            title: 'Error',
            content: payload.data.message,
            buttons: <UDNButton onClick={() => dispatch(hideInfoDialog())} bsStyle="primary"><FormattedMessage id="portal.button.ok"/></UDNButton>
          }))
        }
      })
    },
    saveRecord: () => {
      // Leave updating records out for now, since record identifying logic is unclear
      // values.class = 'IN'
      // dispatch(updateResource(domain, values.name, values)).then(({ error, payload }) => {
      //   if(error) {
      //     dispatch(showInfoDialog({
      //       title: 'Record Not Found',
      //       content: payload.data.message,
      //       buttons: <UDNButton onClick={() => dispatch(hideInfoDialog())} bsStyle="primary"><FormattedMessage id="portal.button.ok"/></UDNButton>
      //     }))
      //   }
      // })
      closeModal()
    }
  }
}

export default reduxForm({
  form: 'dns-edit',
  fields: ['type', 'name', 'value', 'ttl', 'priority'],
  validate
}, mapStateToProps, mapDispatchToProps)(RecordFormContainer)
