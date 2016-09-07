import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as domainActionCreators from '../../../redux/modules/dns'
import * as dnsRecordActionCreators from '../../../redux/modules/dns-records/actions'
import { toggleAccountManagementModal } from '../../../redux/modules/ui'

import { getRecordValueString } from '../../../util/dns-records-helpers'

import { RECORD_EDIT } from '../../../constants/account-management-modals'

import LoadingSpinner from '../../../components/loading-spinner/loading-spinner'
import DomainToolbar from '../../../components/account-management/system/domain-toolbar'
import DNSList from '../../../components/account-management/dns-list'
// import SoaEditForm from '../soa-edit-form'
import RecordForm from '../modals/record-form'
import DeleteDnsRecordModal from '../../../components/account-management/delete-dns-record-modal'

class AccountManagementSystemDNS extends Component {
  constructor(props) {
    super(props)
    this.editingRecord = false
    this.state = {
      domainSearch: '',
      recordSearch: '',
      recordToDelete: null
    }
  }

  componentWillMount() {
    this.props.fetchDomains(this.props.params.brand).then(res =>
      !res.error && this.props.fetchRecords(this.props.activeDomain)
    )
  }

  componentWillReceiveProps(nextProps) {
    this.props.activeDomain &&
    this.props.activeDomain !== nextProps.activeDomain &&
    this.props.fetchRecords(nextProps.activeDomain)
  }

  render() {
    const {
      changeActiveDomain,
      onAddDomain,
      onEditDomain,
      domains,
      activeDomain,
      records,
      loadingRecords,
      loadingDomains,
      activeModal,
      toggleModal } = this.props
    const {domainSearch, recordSearch} = this.state
    const setSearchValue = (event, stateVariable) => this.setState({ [stateVariable]: event.target.value })
    const domainHeaderProps = {
      activeDomain,
      changeActiveDomain: value => changeActiveDomain(value),
      domains: domains && domains.filter(domain => domain.id.includes(domainSearch)),
      emptyDomainsTxt: loadingDomains ? 'portal.loading.text' : 'portal.account.manage.system.empty.domain',
      onAddDomain,
      onEditDomain,
      searchValue: domainSearch,
      searchFunc: e => setSearchValue(e, 'domainSearch')
    }
    const DNSListProps = {
      modalOpen: activeModal !== null ? true : false,
      onAddEntry: () => {
        this.editingRecord = false
        toggleModal(RECORD_EDIT)
      },
      onDeleteEntry: (record) => {
        this.setState({
          recordToDelete: record
        })
      },
      onEditEntry: id => {
        this.props.setActiveRecord(id)
        this.editingRecord = true
        toggleModal(RECORD_EDIT)
      },
      searchFunc: e => setSearchValue(e, 'recordSearch'),
      searchValue: this.state.recordSearch,
      records: records.filter(({ name, value }) => name.includes(recordSearch) || getRecordValueString(value).includes(recordSearch))
    }
    return (
      <div>
        <DomainToolbar {...domainHeaderProps}/>
        {(loadingDomains || loadingRecords) ? <LoadingSpinner/> : <DNSList {...DNSListProps}/>}
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
        {this.state.recordToDelete && <DeleteDnsRecordModal
          itemToDelete={this.state.recordToDelete.name}
          cancel={() => { this.setState({ recordToDelete: null }) }}
          submit={() => {
            const { recordToDelete } = this.state
            this.props.removeResource(activeDomain, recordToDelete.name, recordToDelete)
            this.setState({
              recordToDelete: null
            })
          }}/>}
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
  loadingDomains: PropTypes.bool,
  loadingRecords: PropTypes.bool,
  onAddDomain: PropTypes.func,
  onEditDomain: PropTypes.func,
  params: PropTypes.object,
  records: PropTypes.array,
  setActiveRecord: PropTypes.func,
  toggleModal: PropTypes.func
}

function mapStateToProps({ dns, dnsRecords, ui }) {
  return {
    loadingDomains: dns.get('fetching'),
    loadingRecords: dnsRecords.get('fetching'),
    records: dnsRecords.get('resources').toJS(),
    domains: dns.get('domains').toJS(),
    activeDomain: dns.get('activeDomain'),
    activeModal: ui.get('accountManagementModal')
  }
}

function mapDispatchToProps(dispatch, { params: { brand } }) {
  const { changeActiveDomain, fetchDomains, fetchDomain, startFetchingDomains } = bindActionCreators(domainActionCreators, dispatch)
  const { fetchResourcesWithDetails, startFetching, setActiveRecord, removeResource } = bindActionCreators(dnsRecordActionCreators, dispatch)
  return {
    fetchRecords: domain => {
      startFetching()
      fetchResourcesWithDetails(domain)
    },
    fetchDomains: brand => {
      startFetchingDomains()
      return fetchDomains(brand)
    },
    removeResource,
    onEditDomain: activeDomain => fetchDomain(brand, activeDomain),
    changeActiveDomain,
    toggleModal: modal => dispatch(toggleAccountManagementModal(modal)),
    setActiveRecord
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountManagementSystemDNS)
