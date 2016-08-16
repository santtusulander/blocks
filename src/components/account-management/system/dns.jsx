import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Select from '../../select'
import UDNButton from '../../button'
import IconAdd from '../../icons/icon-add'
import IconEdit from '../../icons/icon-edit'
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

const DomainToolbar = ({ activeDomain, changeActiveDomain, domains, onAddDomain, onEditDomain }) =>
  <div className="account-management-header">
    <Select
      value={activeDomain}
      className="dns-dropdowns"
      onSelect={id => (changeActiveDomain(id))}
      options={domains && domains.map(domain => [domain.get('id'), domain.get('name')]).toJS()}/>

      <UDNButton
        id="add-domain"
        bsStyle="primary"
        icon={true}
        addNew={true}
        onClick={onAddDomain}>
        <IconAdd/>
      </UDNButton>

      <UDNButton
        id="edit-domain"
        bsStyle="primary"
        icon={true}
        onClick={onEditDomain}>
        <IconEdit/>
      </UDNButton>

  </div>

export default connect(() => ({}))(AccountManagementSystemDNS)
