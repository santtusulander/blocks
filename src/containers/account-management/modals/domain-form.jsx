import React, { PropTypes } from 'react'
import { List } from 'immutable'
import { reduxForm } from 'redux-form'
import { Modal } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

import * as dnsActions from '../../../redux/modules/dns'
import { showInfoDialog, hideInfoDialog } from '../../../redux/modules/ui'

import UDNButton from '../../../components/button'
import DnsDomainEditForm from '../../../components/account-management/dns-domain-edit-form'

let errors = {}

const validate = (values) => {
  errors = {}

  const maxTtl = 2147483647;
  const { name, email_addr, name_server, refresh, ttl, negative_ttl } = values

  if (!name || name.length === 0) errors.name = <FormattedMessage id="portal.accountManagement.dns.form.validation.name.text"/>
  if (!email_addr || email_addr.length === 0) errors.email_addr = <FormattedMessage id="portal.accountManagement.dns.form.validation.email.text"/>
  if (!name_server || name_server.length === 0) errors.name_server = <FormattedMessage id="portal.accountManagement.dns.form.validation.nameServer.text"/>
  if (!refresh || refresh.length === 0) errors.refresh = <FormattedMessage id="portal.accountManagement.dns.form.validation.refresh.text"/>
  if (!ttl || ttl.length === 0) errors.ttl = <FormattedMessage id="portal.accountManagement.dns.form.validation.ttl.text"/>

  if (parseInt(ttl) > maxTtl) errors.ttl = <FormattedMessage id='portal.accountManagement.dns.form.validation.maxTtl.text' values={{maxTtl}}/>
  if (parseInt(negative_ttl) > maxTtl) errors.negative_ttl = <FormattedMessage id='portal.accountManagement.dns.form.validation.maxTtl.text' values={{maxTtl}}/>

  // TODO: name_server validation
  // From API-docs:
  // Any name server that will respond authoritatively for the domain.
  // Called the Primary Master in the context of Dynamic DNS (DDNS).
  // If DDNS is not used this may be any suitable name server either
  // within the zone file (in-zone) or in an external or foreign zone
  // (also called out-of-zone or even out-of-bailiwick by those of a
  // more literary bent or with a taste for the exotic). To mimimise
  // confusion this is most commonly written as a Fully-qualified
  // Domain Name (FQDN - ends with a dot). If the record points to
  // an EXTERNAL server (not defined in this zone) it MUST be a FQDN
  // and end with a '.' (dot), for example, ns1.example.net.

  return errors;
}

const DnsDomainEditFormContainer = (props) => {
  const { edit, updateDomain, createDomain, closeModal, ...formProps } = props
  const domainFormProps = {
    edit,
    onSave: (fields) => {
      console.log('onSave()', edit, fields);

    },
    onCancel: () => {
      console.log('onCancel()')
      closeModal()
    },
    ...formProps
  }
  return (
    <Modal show={true} dialogClassName="dns-edit-form-sidebar">
      <Modal.Header>
        <h1>{edit ? 'Edit Domain' : 'New Domain'}</h1>
        {edit && <p>{props.fields.name.value}</p>}
      </Modal.Header>
      <Modal.Body>
        <DnsDomainEditForm {...domainFormProps}/>
      </Modal.Body>
    </Modal>
  )
}

DnsDomainEditFormContainer.propTypes = {
  closeModal: PropTypes.func,
  edit: PropTypes.bool,
  fields: PropTypes.object,
  createDomain: PropTypes.func,
  updateDomain: PropTypes.func,
}

function mapStateToProps({ dns }, { edit }) {
  let props = {
    loading: dns.get('loading')
  }

  if (edit) {
    const domains = dns.get('domains')
    const activeDomainId = dns.get('activeDomain')
    const currentDomain = activeDomainId && dnsActions.domainToEdit(domains, activeDomainId)

    let initialValues = currentDomain && currentDomain.get('details')

    if ( initialValues ) {
      props.initialValues = initialValues.toJS()
      props.initialValues.name = currentDomain.get('id')
    }
  }

  return props
}

function mapDispatchToProps(dispatch, { closeModal }) {
  return {
    createDomain: (values, domain) => {

    },
    updateDomain: (formValues, zone, records, activeRecord) => {

    }
  }
}

export default reduxForm({
  form: 'dnsDomainEditForm',
  fields: ['name', 'email_addr', 'name_server', 'refresh', 'ttl', 'negative_ttl'],
  validate
}, mapStateToProps, mapDispatchToProps)(DnsDomainEditFormContainer)
