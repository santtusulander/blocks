import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as domainActionCreators from '../../../redux/modules/dns'
import * as dnsRecordActionCreators from '../../../redux/modules/dns-records/actions'
import { hideInfoDialog, showInfoDialog, toggleAccountManagementModal } from '../../../redux/modules/ui'
import { getRecordValueString } from '../../../util/dns-records-helpers'

import { DNS_DOMAIN_EDIT, EDIT_RECORD } from '../../../constants/account-management-modals'

import LoadingSpinner from '../../../components/loading-spinner/loading-spinner'
import DomainToolbar from '../../../components/account-management/domain-toolbar'
import DNSList from '../../../components/account-management/dns-list'
import RecordForm from '../modals/record-form'
import DomainForm from '../modals/domain-form'
import ModalWindow from '../../../components/modal'

class AccountManagementSystemDNS extends Component {
  constructor(props) {
    super(props)
    this.editingRecord = true
    this.editingDomain = true
    this.state = {
      domainSearch: '',
      domainToDelete: null,
      recordSearch: '',
      recordToDelete: null
    }

    this.closeDeleteDnsRecordModal = this.closeDeleteDnsRecordModal.bind(this)
    this.deleteDnsRecord = this.deleteDnsRecord.bind(this)
    this.deleteDomain = this.deleteDomain.bind(this)
    this.hideDeleteModal = this.hideDeleteModal.bind(this)
    this.showDeleteModal = this.showDeleteModal.bind(this)
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

  deleteDnsRecord() {
    const { props: { activeDomain, deleteRecord }, state: { recordToDelete } } = this
    deleteRecord(activeDomain, recordToDelete)
      .then(() => {
        this.props.showNotification(<FormattedMessage id="portal.accountManagement.dnsDeleted.text"/>)
        this.setState({ recordToDelete: null })
      })
      .catch(() => {
        this.props.showNotification(<FormattedMessage id="portal.accountManagement.dnsDeleted.failed.text"/>)
      })
  }

  closeDeleteDnsRecordModal() {
    this.setState({ recordToDelete: null })
  }

  render() {
    const {
      fetchDomain,
      changeActiveDomain,
      domains,
      activeDomain,
      records,
      loadingRecords,
      loadingDomains,
      activeModal,
      showNotification,
      toggleModal } = this.props

    const { domainSearch, recordSearch, recordToDelete } = this.state
    const setSearchValue = (event, stateVariable) => this.setState({ [stateVariable]: event.target.value })
    const visibleRecords = records.filter(({ name, value }) => name.toLowerCase().includes(recordSearch.toLocaleLowerCase()) || getRecordValueString(value).toLowerCase().includes(recordSearch.toLowerCase()))

    const hiddenRecordCount = records.length - visibleRecords.length
    const domainHeaderProps = {
      activeDomain,
      changeActiveDomain: value => changeActiveDomain(value),
      onEditDomain: (activeDomainToEdit) => {
        this.editingDomain = true
        fetchDomain('udn', activeDomainToEdit)
          .then(() => toggleModal(DNS_DOMAIN_EDIT))
      },
      onAddDomain: () => {
        this.editingDomain = false
        toggleModal(DNS_DOMAIN_EDIT)
      },
      onDeleteDomain: (activeDomainToDelete) => {
        this.showDeleteModal(activeDomainToDelete)
      },
      domains: domains && domains.filter(domain => domain.id.includes(domainSearch)),
      emptyDomainsTxt: loadingDomains ? 'portal.loading.text' : 'portal.account.manage.system.empty.domain',
      searchValue: domainSearch,
      searchFunc: e => setSearchValue(e, 'domainSearch')
    }
    const DNSListProps = {
      modalOpen: activeModal !== null,
      onAddEntry: () => {
        this.editingRecord = false
        toggleModal(EDIT_RECORD)
      },
      onDeleteEntry: (record) => {
        this.setState({
          recordToDelete: record
        })
      },
      onEditEntry: id => {
        this.props.setActiveRecord(id)
        this.editingRecord = true
        toggleModal(EDIT_RECORD)
      },
      searchFunc: e => setSearchValue(e, 'recordSearch'),
      searchValue: this.state.recordSearch,
      records: visibleRecords,
      visibleRecordCount:
        <FormattedMessage
          id='portal.account.dnsList.records.visibleRecords'
          values={{ visibleRecordCount: String(visibleRecords.length) }}/>,
      hiddenRecordCount:
        hiddenRecordCount > 0 ?
          <FormattedMessage
            id='portal.account.dnsList.records.hiddenRecords'
            values={{ hiddenRecordCount }} /> : ''
    }

    return (
      <div>
        <DomainToolbar {...domainHeaderProps}/>
        {(loadingDomains || loadingRecords) ? <LoadingSpinner/> : <DNSList {...DNSListProps}/>}

        {activeModal === EDIT_RECORD &&
        <RecordForm
          edit={this.editingRecord}
          showNotification={showNotification}
          closeModal={() => toggleModal(null)}/>
        }
        {activeModal === DNS_DOMAIN_EDIT &&
        <DomainForm
          edit={this.editingDomain}
          showNotification={showNotification}
          closeModal={() => toggleModal(null)}/>
        }
        {this.state.recordToDelete &&
        <ModalWindow
          title={<FormattedMessage id="portal.dnsRecord.delete.title"/>}
          cancelButton={true}
          deleteButton={true}
          cancel={this.closeDeleteDnsRecordModal}
          onSubmit={this.deleteDnsRecord}
          loading={loadingRecords}
          invalid={false}>
          <p>
            <FormattedMessage id="portal.dnsRecord.delete.disclaimer.text" values={{itemToDelete: recordToDelete.name}}/>
          </p>
        </ModalWindow>
        }
        {this.state.domainToDelete &&
        <ModalWindow
          title={<FormattedMessage id="portal.dnsDomain.delete.title"/>}
          cancelButton={true}
          deleteButton={true}
          cancel={this.hideDeleteModal}
          onSubmit={() => {
            this.deleteDomain()
          }}
          invalid={true}
          verifyDelete={true}>
          <p>
            <FormattedMessage id="portal.dnsDomain.delete.disclaimer.text" values={{itemToDelete: this.state.domainToDelete}}/>
          </p>
        </ModalWindow>
        }
      </div>
    )
  }
}

AccountManagementSystemDNS.displayName = "AccountManagementSystemDNS"
AccountManagementSystemDNS.propTypes = {
  activeDomain: PropTypes.string,
  activeModal: PropTypes.string,
  changeActiveDomain: PropTypes.func,
  deleteDomain: PropTypes.func,
  deleteRecord: PropTypes.func,
  domains: PropTypes.array,
  fetchDomain: PropTypes.func,
  fetchDomains: PropTypes.func,
  fetchRecords: PropTypes.func,
  loadingDomains: PropTypes.bool,
  loadingRecords: PropTypes.bool,
  params: PropTypes.object,
  records: PropTypes.array,
  setActiveRecord: PropTypes.func,
  showNotification: PropTypes.func,
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

function mapDispatchToProps(dispatch, { params: { brand }, showNotification }) {
  const { changeActiveDomain, deleteDomain, fetchDomains, fetchDomain, startFetchingDomains, stopFetchingDomains } = bindActionCreators(domainActionCreators, dispatch)
  const { fetchResourcesWithDetails, startFetching, setActiveRecord, removeResource } = bindActionCreators(dnsRecordActionCreators, dispatch)
  return {
    fetchDomain,
    fetchRecords: domain => {
      startFetching()
      fetchResourcesWithDetails(domain)
    },
    fetchDomains: brand => {
      startFetchingDomains()
      return fetchDomains(brand)
    },
    deleteRecord: (domain, record) => {
      startFetching()
      return removeResource(domain, record.name, record)
    },
    onEditDomain: activeDomain => fetchDomain(brand, activeDomain),
    changeActiveDomain,
    toggleModal: modal => dispatch(toggleAccountManagementModal(modal)),
    setActiveRecord,
    deleteDomain: (domainId) => {
      startFetchingDomains()
      deleteDomain('udn', domainId)
        .then(res => {
          if (res.error) {
            dispatch(showInfoDialog({
              title: <FormattedMessage id="portal.accountManagement.dns.domain.deleteError"/>,
              content: res.payload.data.message,
              okButton: true,
              cancel: () => dispatch(hideInfoDialog())
            }))
          }
          showNotification(<FormattedMessage id="portal.accountManagement.dns.domain.deleted.text"/>)
          stopFetchingDomains()
        })
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountManagementSystemDNS)
