import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'

import { bindActionCreators } from 'redux'

import SidePanel from '../../../components/side-panel'
import { FormattedMessage } from 'react-intl'

import * as dnsActionCreators from '../../../redux/modules/dns'

import { showInfoDialog, hideInfoDialog } from '../../../redux/modules/ui'

import DnsDomainEditForm from '../../../components/account-management/dns-domain-edit-form'

class DnsDomainEditFormContainer  extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { edit, fetching, initialValues, saveDomain, closeModal } = this.props

    const title = edit
      ? <FormattedMessage id='portal.account.domainForm.editDomain.title' />
      : <FormattedMessage id='portal.account.domainForm.newDomain.title' />

    const subTitle = initialValues && initialValues.name ? initialValues.name : ''

    return (
      <SidePanel
        show={true}
        title={title}
        subTitle={subTitle}
        cancel={() => closeModal()}
      >

        <DnsDomainEditForm
          edit={edit}
          fetching={fetching}
          initialValues={initialValues}
          onSave={(values) => saveDomain(edit, values)}
          onCancel={() => closeModal()}
        />

      </SidePanel>
    )
  }
}

DnsDomainEditFormContainer.displayName = "DnsDomainEditFormContainer"
DnsDomainEditFormContainer.propTypes = {
  closeModal: PropTypes.func,
  edit: PropTypes.bool,
  fetching: PropTypes.bool,
  initialValues: PropTypes.object,
  saveDomain: PropTypes.func
}

function mapStateToProps({ dns }, { edit }) {
  const props = {
    fetching: dns.get('fetching')
  }

  if (edit) {
    const domains = dns.get('domains')
    const activeDomainId = dns.get('activeDomain')
    const currentDomain = activeDomainId && dnsActionCreators.domainToEdit(domains, activeDomainId)

    const initialValues = currentDomain && currentDomain.get('details')

    if ( initialValues ) {
      props.initialValues = initialValues.toJS()
      props.initialValues.name = currentDomain.get('id')
    }
  }

  return props
}

function mapDispatchToProps(dispatch, { closeModal, showNotification }) {
  const dnsActions = bindActionCreators(dnsActionCreators, dispatch)

  return {
    dnsActions: dnsActions,
    saveDomain: (edit, values) => {
      const method = edit ? 'editDomain' : 'createDomain'
      const saveDomainMessage = edit
                                ? <FormattedMessage id="portal.accountManagement.dns.domain.updated.text"/>
                                : <FormattedMessage id="portal.accountManagement.dns.domain.created.text"/>
      // TODO: Are these required params ok (refresh, retry, expiry)?
      const defaultData = {
        'class': 'IN',
        retry: 1,
        expiry: 1
      }

      const data = {
        email_addr: values.email_addr,
        name_server: values.name_server,
        refresh: parseInt(values.refresh),
        ttl: parseInt(values.ttl),
        negative_ttl: parseInt(values.negative_ttl),
        ...defaultData
      }

      const domain = values.name

      dnsActions.startFetchingDomains()
      return dnsActions[method]('udn', domain, data)
        .then(res => {
          if (res.error) {
            dispatch( showInfoDialog({
              title: <FormattedMessage id="portal.accountManagement.dns.domain.saveError"/>,
              content: res.payload.data.message,
              okButton: true,
              cancel: () => dispatch(hideInfoDialog())
            }))
          }
          dnsActions.stopFetchingDomains()
          showNotification(saveDomainMessage)
          closeModal();
        })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DnsDomainEditFormContainer)
