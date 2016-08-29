import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as dnsActionCreators from '../../../redux/modules/dns'
import { toggleAccountManagementModal } from '../../../redux/modules/ui'

import DomainToolbar from '../../../components/account-management/system/domain-toolbar'
import DNSList from '../../../components/account-management/dns-list'
// import SoaEditForm from '../soa-edit-form'

class AccountManagementSystemDNS extends Component {
  constructor(props) {
    super(props)
    this.editingRecord = false
    this.state = {
      domainSearch: '',
      recordSearch: ''
    }
  }

  render() {
    const { changeActiveDomain, onAddDomain, onEditDomain, domains, records, activeDomain } = this.props
    const { domainSearch, recordSearch } = this.state
    const setSearchValue = (event, stateVariable) => this.setState({ [stateVariable]: event.target.value })
    const domainHeaderProps = {
      activeDomain,
      changeActiveDomain: value => changeActiveDomain(value),
      domains: domains && domains.filter(domain => domain.id.includes(domainSearch)),
      onAddDomain,
      onEditDomain,
      searchValue: domainSearch,
      searchFunc: e => setSearchValue(e, 'domainSearch')
    }
    const DNSListProps = {
      onAddEntry: () => {/*noop*/},
      onDeleteEntry: id => console.log('record', id, 'pressed for deletion'),
      onEditEntry: id => console.log('record', id, 'pressed for edit'),
      searchFunc: e => setSearchValue(e, 'recordSearch'),
      searchValue: this.state.recordSearch,
      domain: activeDomain,
      records: records.filter(({ name, value }) => name.includes(recordSearch) || value.includes(recordSearch))
    }
    return (
      <div className="account-management-system-dns">
        <DomainToolbar {...domainHeaderProps}/>
        <DNSList {...DNSListProps}/>
        {/*activeModal === EDIT_SOA &&
          <SoaEditForm
            id="soa-form"
            onCancel={() => toggleModal(null)}
            activeDomain={activeDomain}
            onSave={soaEditOnSave}
            { ...soaFormInitialValues }
          />*/}
      </div>
    )
  }
}

AccountManagementSystemDNS.propTypes = {
  activeDomain: PropTypes.string,
  activeModal:PropTypes.string,
  changeActiveDomain: PropTypes.func,
  domains: PropTypes.array,
  fetchDomains: PropTypes.func,
  fetchRecords: PropTypes.func,
  onAddDomain: PropTypes.func,
  onEditDomain: PropTypes.func,
  params: PropTypes.object,
  records: PropTypes.array,
  setActiveRecord: PropTypes.func,
  toggleModal: PropTypes.func
}

function mapStateToProps({ dns, ui }) {
  return {
    records: [
      {
        id: 1,
        class: "IN",
        name: "pod1.uaaaaa.cdx-dev.unifieddeliverynetwork.net",
        ttl: 7200,
        type: "A",
        value: "10.10.10.1"
      },
      {
        id: 2,
        class: "IN",
        name: "pod1.ua.cdx-dev.unifieddeliverynetwork.net",
        ttl: 7200,
        type: "MX",
        value: "10.10.10.1"
      },
      {
        id: 3,
        class: "IN",
        name: "pod1.ua.cdx-dev.unifieddeliverynetwork.net",
        ttl: 7200,
        type: "AAAA",
        value: "10.10.10.1"
      },
      {
        id: 4,
        class: "IN",
        name: "pod1.ua.cdx-dev.unifieddeliverynetwork.net",
        ttl: 7200,
        type: "CNAME",
        value: "10.10.10.1"
      },
      {
        id: 5,
        class: "IN",
        name: "aaaod1.ua.cdx-dev.unifieddeliverynetwork.net",
        ttl: 7200,
        type: "CNAME",
        value: "10.100000.10.1"
      },
      {
        id: 6,
        class: "IN",
        name: "pod1.ua.cdx-dev.unifieddeliverynetwork.net",
        type: "DNAME",
        value: "10.10.10.1"
      },
      {
        id: 7,
        class: "IN",
        name: "pod1.ua.cdx-dev.unifieddeliverynetwork.net",
        ttl: 7200,
        type: "TXT",
        value: "10.10.10.1"
      }
    ],
    domains: dns.get('domains').toJS(),
    activeDomain: dns.get('activeDomain'),
    activeModal: ui.get('accountManagementModal')
  }
}

function mapDispatchToProps(dispatch, { params: { brand } }) {
  const { changeActiveDomain, fetchDomains, fetchDomain } = bindActionCreators(dnsActionCreators, dispatch)
  return {
    fetchDomains,
    onEditDomain: activeDomain => fetchDomain(brand, activeDomain),
    changeActiveDomain,
    toggleModal: modal => dispatch(toggleAccountManagementModal(modal))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountManagementSystemDNS)
