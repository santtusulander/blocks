import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { fetchDomains, changeActiveDomain } from '../../../redux/modules/dns'

import UDNButton from '../../button'
import DomainSelector from '../../global-account-selector/selector-component'
import IconAdd from '../../icons/icon-add'
import IconEdit from '../../icons/icon-edit'
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
    !this.props.domains.size && this.props.fetchDomains(this.props.params.brand)
  }

  render() {
    const dnsListProps = {
      // activeRecordType: activeRecordType,
      // dnsEditOnSave: this.dnsEditOnSave,
      // toggleModal: toggleModal
    }
    const domainHeaderProps = {
      domainSearchData: {
        value: this.state.domainSearchValue,
        onChange: ({ target: { value } }) => this.setState({ domainSearchValue: value })
      },
      activeDomain: 'heippa',
      domains: this.props.domains.filter(domain => domain.includes(this.state.domainSearchValue)),
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

AccountManagementSystemDNS.propTypes = {}

// function mapStateToProps(state) {
//   return {
//     domains: state.dns.get('domains')
//   }
// }

const DomainToolbar = ({ activeDomain, changeActiveDomain, domains, onAddDomain, onEditDomain, domainSearchData }) =>
  <div className="account-management-header">
      <DomainSelector
        items={domains.map(domain => [domain, domain])}
        onSelect={changeActiveDomain}
        searchValue={domainSearchData.value}
        onSearch={domainSearchData.onChange}>
        <span>{activeDomain}</span>
      </DomainSelector>
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
    domains: state.dns.get('domains').toJS(),
    activeDomain: state.dns.get('activeDomain'),
    activeModal: state.ui.get('accountManagementModal')
  }
}

export default connect(mapStateToProps, { fetchDomains, changeActiveDomain })(AccountManagementSystemDNS)
