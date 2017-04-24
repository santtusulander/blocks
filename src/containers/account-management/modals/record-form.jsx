import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { reduxForm, formValueSelector } from 'redux-form'
import { injectIntl, FormattedMessage } from 'react-intl'

import * as recordActionCreators from '../../../redux/modules/dns-records/actions'

import RecordForm from '../../../components/account-management/record-form'
import SidePanel from '../../../components/shared/side-panel'

import { checkForErrors } from '../../../util/helpers'
import { isValidIPv4Address, isValidIPv6Address, isInt } from '../../../util/validators'

import { getRecordFormInitialValues, isShown, recordValues } from '../../../util/dns-records-helpers'


/**
 * Filter fields to validate according to the fields that get rendered for the active record type.
 */
const filterFields = fields => {
  const filteredFields = {}
  for (const field in fields) {
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
const validate = ({ type = '', value = '', name = '', ttl = '', prio = '' }, props) => {

  //Don't validate name for NS record
  name = (type !== 'NS') ? name : null
  const filteredFields = filterFields({ type, value, name, ttl })
  const ipAddressConfig = validateIpAddress(filteredFields, props.intl)

  const conditions = {
    prio: {
      condition: !isInt(prio),
      errorText: props.intl.formatMessage({id: 'portal.account.recordForm.prio.validationError'})
    },
    ttl: {
      condition: !isInt(filteredFields.ttl),
      errorText: props.intl.formatMessage({id: 'portal.account.recordForm.ttl.validationError'})
    },
    name: {
      condition: !filteredFields.name && type !== 'NS',
      errorText: props.intl.formatMessage({id: 'portal.account.recordForm.hostName.validationError'})
    },
    value: {
      condition: !ipAddressConfig.valid,
      errorText: ipAddressConfig.errorText
    }
  }
  return checkForErrors({ type, ...filteredFields }, conditions)
}

const RecordFormContainer = ({ domain, edit, updateRecord, addRecord, closeModal, recordType, recordName, activeRecord, ...formProps }) => {
  const recordFormProps = {
    domain,
    edit,
    shouldShowField: isShown(recordType),
    type: recordType,
    onSubmit: values => {
      const filteredValues = filterFields(values)
      const { ttl, prio } = filteredValues
      if (ttl) {
        filteredValues.ttl = Number(ttl)
      }
      if (prio) {
        filteredValues.prio = Number(prio)
      }
      return edit ?
        updateRecord(filteredValues, domain, activeRecord) :
        addRecord(filteredValues, domain)
    },
    cancel: closeModal,
    ...formProps
  }
  const title = edit ? <FormattedMessage id='portal.account.recordForm.editRecord.title' /> : <FormattedMessage id='portal.account.recordForm.newRecord.title' />
  const subTitle = edit && recordName
  return (
    <SidePanel
      show={true}
      title={title}
      subTitle={subTitle}
      cancel={closeModal}>
      <RecordForm {...recordFormProps}/>
    </SidePanel>
  )
}

RecordFormContainer.displayName = "RecordFormContainer"
RecordFormContainer.propTypes = {
  activeRecord: PropTypes.object,
  addRecord: PropTypes.func,
  closeModal: PropTypes.func,
  domain: PropTypes.string,
  edit: PropTypes.bool,
  fields: PropTypes.object,
  recordName: PropTypes.string,
  recordType: PropTypes.string,
  updateRecord: PropTypes.func

}

function mapStateToProps(state, { edit }) {
  const { dnsRecords, dns } = state
  const getRecordById = recordActionCreators.getById
  const getField = formValueSelector('record-edit')
  const activeRecord = getRecordById(dnsRecords.get('resources'), dnsRecords.get('activeRecord'))
  let initialValues = {}
  const domain = dns.get('activeDomain')
  if (activeRecord && edit) {
    initialValues = getRecordFormInitialValues(activeRecord.toJS())

    //Clear name for NS records with same name as domain
    if (initialValues.type === 'NS' && initialValues.name === domain) {
      initialValues.name = ''
    }
  }
  return {
    activeRecord,
    initialValues,
    recordName: getField(state, 'name'),
    recordType: getField(state, 'type'),
    domain: domain,
    loading: dnsRecords.get('fetching')
  }
}

function mapDispatchToProps(dispatch, { closeModal, showNotification }) {
  const { startFetching, createResource, updateResource } = bindActionCreators(recordActionCreators, dispatch)
  return {
    addRecord: (vals, domain) => {
      vals = recordValues(vals)
      // Hardcode class-key as it is not set anywhere
      vals.class = 'IN'
      startFetching()
      return createResource(domain, vals.name, vals)
        .then(() => {
          showNotification(<FormattedMessage id='portal.accountManagement.dnsCreated.text' />)
          closeModal()
        })
    },
    updateRecord: (formValues, zone, activeRecord) => {
      const vals = recordValues(formValues)
      vals.id = activeRecord.get('id')
      vals.class = 'IN'
      startFetching()
      return updateResource(zone, activeRecord.get('name'), vals)
        .then(() => {
          showNotification(<FormattedMessage id='portal.accountManagement.dnsUpdated.text' />)
          closeModal()
        })
    }
  }
}

const form = reduxForm({
  form: 'record-edit',
  validate
})(RecordFormContainer)

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(form))
