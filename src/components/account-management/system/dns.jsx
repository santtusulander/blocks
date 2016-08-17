import React, { Component, PropTypes } from 'react'
import { ButtonToolbar } from 'react-bootstrap'
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
    const { changeActiveDomain, onAddDomain, onEditDomain, domains, activeDomain } = this.props
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
      activeDomain: activeDomain || 'none selected',
      domains: domains.filter(domain => domain.includes(this.state.domainSearchValue)),
      changeActiveDomain: value => changeActiveDomain(value),
      onAddDomain: onAddDomain,
      onEditDomain: onEditDomain
    }
    return (
      <div className="account-management-system-dns">
        <DomainToolbar {...domainHeaderProps}/>
        <DNSList
          onAddEntry={() => {/*noop*/}}
          onDeleteEntry={() => {/*noop*/}}
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
  <div className="domain-toolbar">
      <DomainSelector
        items={domains.map(domain => [domain, domain])}
        onItemClick={changeActiveDomain}
        searchValue={domainSearchData.value}
        onSearch={domainSearchData.onChange}>
        <h3>{activeDomain}<span className="caret"></span></h3>
      </DomainSelector>
      <ButtonToolbar className='pull-right'>
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
      </ButtonToolbar>

  </div>

function mapStateToProps(state) {
  return {
    domains: state.dns.get('domains').toJS(),
    activeDomain: state.dns.get('activeDomain'),
    activeModal: state.ui.get('accountManagementModal')
  }
}

export default connect(mapStateToProps, { fetchDomains, changeActiveDomain })(AccountManagementSystemDNS)
