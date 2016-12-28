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

  // componentDidMount(){
  //   //show errors on edit even without touching fields
  //   if (this.props.edit) this.props.touchAll()
  // }

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
      ...formProps
    }

    const title = edit
      ? <FormattedMessage id='portal.account.domainForm.editDomain.title' />
      : <FormattedMessage id='portal.account.domainForm.newDomain.title' />

    const subTitle = 'domain name'

    return (
      <SidePanel
        show={true}
        title={title}
        subTitle={subTitle}
        cancel={domainFormProps.onCancel}
      >

        <DnsDomainEditForm {...domainFormProps/>

      </SidePanel>
    )
  }
}

DnsDomainEditFormContainer.propTypes = {
  closeModal: PropTypes.func,
  edit: PropTypes.bool,
  fields: PropTypes.object,
  saveDomain: PropTypes.func,
  touchAll: PropTypes.func
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
              okButton: true,
              cancel: () => dispatch(hideInfoDialog())
            }))
          }
          dnsActions.stopFetchingDomains()
          closeModal();
        })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DnsDomainEditFormContainer)
