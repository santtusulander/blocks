import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Select from '../../select'
import UDNButton from '../../button'
import { DNSList } from '../dns-list'

class AccountManagementSystemDNS extends Component {
  render() {
    const dnsListProps = {
      // soaEditOnSave: this.editSOARecord,
      // modalActive: this.state.modalVisible,
      // //changeActiveDomain: dnsActions.changeActiveDomain,
      // activeDomain: activeDomain,
      // domains: dnsData && dnsData.get('domains'),
      // changeRecordType: dnsActions.changeActiveRecordType,
      // activeRecordType: activeRecordType,
      // dnsEditOnSave: this.dnsEditOnSave,
      // accountManagementModal: accountManagementModal,
      // toggleModal: toggleModal,
      // dnsFormInitialValues: dnsInitialValues,
      // soaFormInitialValues: soaFormInitialValues
    }
    return (
      <div className="account-management-system-dns">
        <DomainToolbar/>
        <DNSList
          onAddDomain={() => console.log('add domain')}
          changeActiveDomain={id => console.log('change active domain, id:', id)}
          onAddEntry={() => console.log('add entry')}
          onDeleteEntry={() => console.log('delete entry')}
          {...dnsListProps}
        />
      </div>
    )
  }
}

AccountManagementSystemDNS.propTypes = {}

// function mapStateToProps(state) {
//   return {
//     domains: state.dns.get('domains')
//   }
// }

const DomainToolbar = ({ activeDomain, changeActiveDomain, domains, onAddDomain }) =>
  <div className="account-management-header">
    Select Domain
    <Select
      value={activeDomain && activeDomain.get('id')}
      className="dns-dropdowns"
      onSelect={id => (changeActiveDomain(id))}
      options={domains && domains.map(domain => [domain.get('id'), domain.get('name')]).toJS()}/>
    <UDNButton id="add-domain" bsStyle="primary" onClick={onAddDomain}>
      <strong>ADD DOMAIN</strong>
    </UDNButton>
  </div>

export default connect(() => ({}))(AccountManagementSystemDNS)
