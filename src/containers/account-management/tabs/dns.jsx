import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as dnsActionCreators from '../../../redux/modules/dns'
import { fetchResourcesWithDetails } from '../../../redux/modules/dns-records/actions'
import { toggleAccountManagementModal } from '../../../redux/modules/ui'
import { setActiveRecord } from '../../../redux/modules/dns-records/actions'

import { RECORD_EDIT } from '../../../constants/account-management-modals'

import DomainToolbar from '../../../components/account-management/system/domain-toolbar'
import DNSList from '../../../components/account-management/dns-list'
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
    this.props.fetchDomains(this.props.params.brand).then(() =>
      this.props.fetchRecords(this.props.activeDomain)
    )
  }

  componentWillReceiveProps(nextProps) {
    this.props.activeDomain !== nextProps.activeDomain && this.props.fetchRecords(nextProps.activeDomain)
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
        this.props.setActiveRecord(id)
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
        {activeModal === RECORD_EDIT &&
          <RecordForm
            edit={this.editingRecord}
            closeModal={() => toggleModal(null)}/>}
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
  onAddDomain: PropTypes.func,
  onEditDomain: PropTypes.func,
  params: PropTypes.object,
  records: PropTypes.array,
  setActiveRecord: PropTypes.func,
  toggleModal: PropTypes.func
}

function mapStateToProps({ dns, dnsRecords, ui }) {
  return {
    records: dnsRecords.get('resources').toJS(),
    domains: dns.get('domains').toJS(),
    activeDomain: dns.get('activeDomain'),
    activeModal: ui.get('accountManagementModal')
  }
}

function mapDispatchToProps(dispatch, { params: { brand } }) {
  const { changeActiveDomain, fetchDomains, fetchDomain } = bindActionCreators(dnsActionCreators, dispatch)
  return {
    fetchRecords: domain => dispatch(fetchResourcesWithDetails(domain)),
    fetchDomains,
    onEditDomain: activeDomain => fetchDomain(brand, activeDomain),
    changeActiveDomain,
    toggleModal: modal => dispatch(toggleAccountManagementModal(modal)),
    setActiveRecord: id => dispatch(setActiveRecord(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountManagementSystemDNS)
