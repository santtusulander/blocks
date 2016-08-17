import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { fetchDomains, changeActiveDomain } from '../../../redux/modules/dns'

import Select from '../../select'
import UDNButton from '../../button'
import IconAdd from '../../icons/icon-add'
import IconEdit from '../../icons/icon-edit'
import { DNSList } from '../dns-list'

class AccountManagementSystemDNS extends Component {
  componentWillMount() {
    !this.props.domains.size && this.props.fetchDomains()
  }

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
    const domainHeaderProps = {
      activeDomain: this.props.activeDomain,
      domains: this.props.domains,
      changeActiveDomain: this.props.changeActiveDomain,
      onAddDomain: this.props.onAddDomain,
      onEditDomain: this.props.onEditDomain
    }
    return (
      <div className="account-management-system-dns">
        <DomainToolbar {...domainHeaderProps}/>
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

function mapStateToProps(state) {
  return {
    domains: state.dns.get('domains'),
    activeDomain: state.dns.get('activeDomain')
  }
}

export default connect(mapStateToProps, { fetchDomains, changeActiveDomain })(AccountManagementSystemDNS)
