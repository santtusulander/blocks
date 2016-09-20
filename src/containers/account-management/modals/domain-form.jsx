import React, { PropTypes, Component } from 'react'
import { bindActionCreators } from 'redux'

import { reduxForm } from 'redux-form'
import { Modal, Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

import * as dnsActionCreators from '../../../redux/modules/dns'

import { showInfoDialog, hideInfoDialog } from '../../../redux/modules/ui'

import DnsDomainEditForm from '../../../components/account-management/dns-domain-edit-form'
import DeleteDomainModal from '../../../components/account-management/delete-domain-modal'

import { checkForErrors } from '../../../util/helpers'

const validate = fields => {
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
  const { ttl, negative_ttl, email_addr } = fields
  const maxTtl = 2147483647;
  const customConditions = {
    name: {
      condition: !(new RegExp(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/).test(name)),
      errorTxt: 'asdsasd'
    },
    email_addr: {
      condition: new RegExp(/^((?!@).)*[.]$/).test(email_addr),
      errorTxt: 'asdsasd'
    },
    ttl: {
      condition: parseInt(ttl) > maxTtl, errorTxt: <FormattedMessage id='portal.accountManagement.dns.form.validation.maxTtl.text' values={{maxTtl}}/>
    },
    negative_ttl: {
      condition: parseInt(negative_ttl) > maxTtl, errorTxt: <FormattedMessage id='portal.accountManagement.dns.form.validation.maxTtl.text' values={{maxTtl}}/>
    }
  }
  const requiredTexts = {
    name: <FormattedMessage id="portal.accountManagement.dns.form.validation.name.text"/>,
    email_addr: <FormattedMessage id="portal.accountManagement.dns.form.validation.email.text"/>,
    name_server: <FormattedMessage id="portal.accountManagement.dns.form.validation.nameServer.text"/>,
    refresh: <FormattedMessage id="portal.accountManagement.dns.form.validation.refresh.text"/>
  }
  return checkForErrors(fields, customConditions, requiredTexts)
}

class DnsDomainEditFormContainer  extends Component {
  constructor() {
    super()

    this.state = {
      domainToDelete: null
    }

    this.deleteDomain = this.deleteDomain.bind(this)
    this.showDeleteModal = this.showDeleteModal.bind(this)
    this.hideDeleteModal = this.hideDeleteModal.bind(this)
  }

  deleteDomain() {
    this.props.deleteDomain(this.state.domainToDelete)
    this.hideDeleteModal()
  }

  showDeleteModal(domainId) {
    this.setState({
      domainToDelete: domainId
    })
  }

  hideDeleteModal() {
    this.setState({
      domainToDelete: null
    })
  }

  render() {
    const { edit, saveDomain, closeModal, ...formProps } = this.props
    const domainFormProps = {
      edit,
      onSave: (fields) => {
        saveDomain( edit, fields)
      },
      onCancel: () => {
        closeModal()
      },
      onDelete: (domainId) => {
        this.showDeleteModal(domainId)
      },
      ...formProps
    }
    return (
      <div className="dns-edit-container">
        <Modal show={true} dialogClassName="dns-edit-form-sidebar">
          <Modal.Header>
            <h1>{edit ? <FormattedMessage id='portal.account.domainForm.editDomain.title' /> : <FormattedMessage id='portal.account.domainForm.newDomain.title' />}</h1>
            {edit && <p>{this.props.fields.name.value}</p>}
          </Modal.Header>
          <Modal.Body>
            <DnsDomainEditForm {...domainFormProps}/>
          </Modal.Body>
        </Modal>
        {this.state.domainToDelete && <DeleteDomainModal
          cancel={this.hideDeleteModal}
          submit={() => { this.deleteDomain() }}/>}
      </div>
    )
  }
}

DnsDomainEditFormContainer.propTypes = {
  closeModal: PropTypes.func,
  deleteDomain: PropTypes.func,
  edit: PropTypes.bool,
  fields: PropTypes.object,
  saveDomain: PropTypes.func
}

function mapStateToProps({ dns }, { edit }) {
  let props = {
    fetching: dns.get('fetching')
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
      dnsActions.startFetchingDomains()
      dnsActions.deleteDomain('udn', domainId)
        .then(res => {
          if (res.error) {
            dispatch( showInfoDialog({
              title: <FormattedMessage id="portal.accountManagement.dns.domain.deleteError"/>,
              content: res.payload.data.message,
              buttons: <Button onClick={()=>dispatch(hideInfoDialog())} bsStyle="primary">
                <FormattedMessage id="portal.button.ok"/>
              </Button>
            }))
          }
          dnsActions.stopFetchingDomains()
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

      dnsActions.startFetchingDomains()
      dnsActions[method]('udn', domain, data)
        .then(res => {
          if (res.error) {
            dispatch( showInfoDialog({
              title: <FormattedMessage id="portal.accountManagement.dns.domain.saveError"/>,
              content: res.payload.data.message,
              buttons: <Button onClick={()=>dispatch(hideInfoDialog())} bsStyle="primary">
                <FormattedMessage id="portal.button.ok"/>
              </Button>
            }))
          }
          dnsActions.stopFetchingDomains()
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
