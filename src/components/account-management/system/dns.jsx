import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as dnsActionCreators from '../../../redux/modules/dns'
import { toggleAccountManagementModal } from '../../../redux/modules/ui'

import { RECORD_EDIT } from '../../../constants/account-management-modals'

import DomainToolbar from './domain-toolbar'
import DNSList from '../dns-list'
// import SoaEditForm from '../soa-edit-form'
import RecordForm from '../modals/record-form'

class AccountManagementSystemDNS extends Component {
  constructor(props) {
    super(props)
    this.editingRecord = false
    this.state = {
      domainSearch: '',
      recordSearch: ''
    }
  }

  componentWillMount() {
    this.props.fetchDomains(this.props.params.brand)
  }

  render() {
    const { changeActiveDomain, onAddDomain, onEditDomain, domains, activeDomain, records, activeModal, toggleModal } = this.props
    const {domainSearch, recordSearch} = this.state
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
      onAddEntry: () => {
        this.editingRecord = false
        toggleModal(RECORD_EDIT)
      },
      onDeleteEntry: () => {/*noop*/},
      onEditEntry: id => {
        this.editingRecord = true
        toggleModal(RECORD_EDIT)
      },
      records: records.filter(({ name, value }) => name.includes(recordSearch) || value.includes(recordSearch)),
      searchFunc: e => setSearchValue(e, 'recordSearch'),
      searchValue: recordSearch
    }
    return (
      <div className="account-management-system-dns">
        <DomainToolbar {...domainHeaderProps}/>
        <DNSList {...DNSListProps}/>
        {activeModal === RECORD_EDIT && <RecordForm edit={this.editingRecord}/>}
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
  changeActiveDomain: PropTypes.func,
  domains: PropTypes.array,
  fetchDomains: PropTypes.func,
  onAddDomain: PropTypes.func,
  onEditDomain: PropTypes.func,
  params: PropTypes.object,
  records: PropTypes.array
}

function mapStateToProps(state) {
  return {
    records: [
      {
        id: 1,
        class: "IN",
        name: "aaa",
        ttl: 3600,
        type: "AAAA",
        value: "85.184.251.171"
      },
      {
        id: 2,
        class: "IN",
        name: "pbtest01.fra.cdx-dev.unifieddeliverynetwork.net",
        ttl: 3600,
        type: "AAAA",
        value: "85.184.251.171"
      },
      {
        id: 3,
        class: "IN",
        name: "pbtest01.fra.cdx-dev.unifieddeliverynetwork.net",
        ttl: 3600,
        type: "MX",
        value: "85.184.251.171"
      },
      {
        id: 4,
        class: "IN",
        name: "pbtest01.fra.cdx-dev.unifieddeliverynetwork.net",
        ttl: 3600,
        type: "A",
        value: "85.184.251.171"
      }
    ],
    domains: state.dns.get('domains').toJS(),
    activeDomain: state.dns.get('activeDomain'),
    activeModal: state.ui.get('accountManagementModal')
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
