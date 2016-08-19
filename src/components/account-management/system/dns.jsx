import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as dnsActionCreators from '../../../redux/modules/dns'

import DomainToolbar from './domain-toolbar'
import DNSList from '../dns-list'
// import SoaEditForm from '../soa-edit-form'
// import DnsEditForm from '../dns-edit-form'

class AccountManagementSystemDNS extends Component {
  constructor(props) {
    super(props)
    this.state = {
      domainSearchValue: ''
    }
  }

  componentWillMount() {
    //this.props.fetchDomain(this.props.params.brand, 'cdx-dev.unifieddeliverynetwork.net')
    !this.props.domains.size && this.props.fetchDomains(this.props.params.brand).then(({ payload }) => {
      !this.props.activeDomain && this.props.changeActiveDomain(payload[0])
    })
  }

  render() {
    const { changeActiveDomain, onAddDomain, onEditDomain, domains, activeDomain } = this.props
    const domainHeaderProps = {
      searchValue: this.state.domainSearchValue,
      searchFunc: ({ target: { value } }) => this.setState({ domainSearchValue: value }),
      activeDomain,
      domains: domains.filter(domain => domain.includes(this.state.domainSearchValue)),
      changeActiveDomain: value => changeActiveDomain(value),
      onAddDomain,
      onEditDomain
    }
    return (
      <div className="account-management-system-dns">
        <DomainToolbar {...domainHeaderProps}/>
        <DNSList
          onAddEntry={() => {/*noop*/}}
          onDeleteEntry={() => {/*noop*/}}/>
        {/*activeModal === EDIT_DNS &&
          <DnsEditForm
            id="dns-form"
            show={true}
            edit={true}
            domain='foobar.com'
            onSave={dnsEditOnSave}
            onCancel={() => toggleModal(null)}
            { ...dnsFormInitialValues }
          />*/}

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

const shouldCallApi = (state, item) => {
  return dnsActionCreators.shouldCallApi(state.get('domains'), item)
}

function mapDispatchToProps(dispatch) {
  const { fetchDomain, fetchDomains, changeActiveDomain } = bindActionCreators(dnsActionCreators, dispatch)
  return {
    fetchDomains,
    fetchDomain: (brand, domain) => fetchDomain(brand, domain, shouldCallApi),
    changeActiveDomain
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountManagementSystemDNS)
