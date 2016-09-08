import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'

import { reduxForm } from 'redux-form'
import { Modal, Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

import * as dnsActionCreators from '../../../redux/modules/dns'

import { showInfoDialog } from '../../../redux/modules/ui'

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
  const { edit, saveDomain, deleteDomain, closeModal, ...formProps } = props
  const domainFormProps = {
    edit,
    onSave: (fields) => {
      saveDomain( edit, fields)
    },
    onCancel: () => {
      closeModal()
    },
    onDelete: (domainId) => {
      deleteDomain(domainId)
      console.log('onDelete()', domainId)
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
  fields: PropTypes.object
}

function mapStateToProps({ dns }, { edit }) {
  let props = {
    loading: dns.get('loading')
  }

  if (edit) {
    const domains = dns.get('domains')
    const activeDomainId = dns.get('activeDomain')
    const currentDomain = activeDomainId && dnsActionCreators.domainToEdit(domains, activeDomainId)

    let initialValues = currentDomain && currentDomain.get('details')

    if ( initialValues ) {
      props.initialValues = initialValues.toJS()
      props.initialValues.name = currentDomain.get('id')
    }
  }

  return props
}


function getDomainValues(fields){
  let data = {}

  for(const field in fields){
    data[field] = fields[field].value
  }

  return data
}

function mapDispatchToProps(dispatch, { closeModal }) {
  const dnsActions = bindActionCreators(dnsActionCreators, dispatch)

  return {
    dnsActions: dnsActions,
    deleteDomain: (domainId) => {
      dnsActions.deleteDomain('udn', domainId)
        .then(res => {
          if (res.error) {
            uiActions.showInfoDialog({
              title: <FormattedMessage id="portal.button.error"/>,
              content: res.payload.data.message,
              buttons: <Button onClick={uiActions.hideInfoDialog} bsStyle="primary">
                <FormattedMessage id="portal.button.ok"/>
              </Button>
            })
          }
          closeModal();
        })
    },
    saveDomain: (edit, fields) => {
      const method = edit ? 'editDomain' : 'createDomain'

      // TODO: Are the required params ok (refresh, retry, expiry)?
      const data = Object.assign({}, getDomainValues(fields), {
        'class': 'IN',
        retry: 1,
        expiry: 1
      })

      const domain = data.name
      delete data.name

      dnsActions[method]('udn', domain, data)
        .then(res => {
          if (res.error) {
            dispatch( showInfoDialog({
              title: <FormattedMessage id="portal.button.error"/>,
              content: res.payload.data.message,
              buttons: <Button onClick={this.props.uiActions.hideInfoDialog} bsStyle="primary"><FormattedMessage id="portal.button.ok"/></Button>
            }))
          }

          closeModal();

        })
    }
  }
}

export default reduxForm({
  form: 'dnsDomainEditForm',
  fields: ['name', 'email_addr', 'name_server', 'refresh', 'ttl', 'negative_ttl'],
  validate
}, mapStateToProps, mapDispatchToProps)(DnsDomainEditFormContainer)
