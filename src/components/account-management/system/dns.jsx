import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { fetchDomains, changeActiveDomain } from '../../../redux/modules/dns'
import { toggleAccountManagementModal } from '../../../redux/modules/ui'

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
    !this.props.domains.size && this.props.fetchDomains(this.props.params.brand).then(({ payload }) => {
      !this.props.activeDomain && this.props.changeActiveDomain(payload[0])
    })
  }

  render() {
    const { changeActiveDomain, onAddDomain, activeModal, onEditDomain, domains, toggleAccountManagementModal, activeDomain } = this.props
    const domainHeaderProps = {
      searchValue: this.state.domainSearchValue,
      searchFunc: ({ target: { value } }) => this.setState({ domainSearchValue: value }),
      activeDomain,
      domains: domains.filter(domain => domain.includes(this.state.domainSearchValue)),
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

export default connect(mapStateToProps, { fetchDomains, changeActiveDomain, toggleAccountManagementModal })(AccountManagementSystemDNS)
