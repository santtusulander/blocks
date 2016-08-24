import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { toggleAccountManagementModal } from '../../../redux/modules/ui'
import * as dnsActionCreators from '../../../redux/modules/dns'

import DomainToolbar from './domain-toolbar'
import DNSList from '../dns-list'
import RecordModal from '../dns-edit-form'
// import SoaEditForm from '../soa-edit-form'

class AccountManagementSystemDNS extends Component {
  constructor(props) {
    super(props)
    this.state = {
      domainSearchValue: ''
    }
  }

  componentWillMount() {
    this.props.fetchDomains(this.props.params.brand)
  }

  render() {
    const { changeActiveDomain, onAddDomain, activeModal, onEditDomain, domains, toggleAccountManagementModal, activeDomain } = this.props
    const domainHeaderProps = {
      searchValue: this.state.domainSearchValue,
      searchFunc: ({ target: { value } }) => this.setState({ domainSearchValue: value }),
      activeDomain,
      domains: domains && domains.filter(domain => domain.id.includes(this.state.domainSearchValue)),
      changeActiveDomain: value => changeActiveDomain(value),
      onAddDomain: () => toggleAccountManagementModal('EDIT_DNS'),
      onEditDomain
    }
    const dnsFormInitialValues = {
      initialValues: {
        recordType: 'AAAA',
        recordName: 'qlli',
        targetValue: 'asdsdsdsa',
        ttl: 3600
      }
    }
    return (
      <div className="account-management-system-dns">
        <DomainToolbar {...domainHeaderProps}/>
        <DNSList
          onAddEntry={() => {/*noop*/}}
          onDeleteEntry={() => {/*noop*/}}/>
        {activeModal === 'EDIT_DNS' &&
          <RecordModal
            id="dns-form"
            show={true}
            edit={true}
            domain='foobar.com'
            onSave={() => {}}
            onCancel={() => toggleAccountManagementModal(null)}
            {...dnsFormInitialValues}/>}

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
  params: PropTypes.object
}

function mapStateToProps(state) {
  return {
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
    changeActiveDomain
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountManagementSystemDNS)
