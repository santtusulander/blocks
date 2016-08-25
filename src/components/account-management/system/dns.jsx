import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as dnsActionCreators from '../../../redux/modules/dns'
import { toggleAccountManagementModal } from '../../../redux/modules/ui'

import { RECORD_EDIT } from '../../../constants/account-management-modals'

import DomainToolbar from './domain-toolbar'
import DNSList from '../dns-list'
// import SoaEditForm from '../soa-edit-form'
import RecordForm from '../record-form'

class AccountManagementSystemDNS extends Component {
  constructor(props) {
    super(props)
    this.editingRecord = true
    this.state = {
      domainSearchValue: ''
    }
  }

  componentWillMount() {
    this.props.fetchDomains(this.props.params.brand)
  }

  render() {
    const { changeActiveDomain, onAddDomain, onEditDomain, domains, activeDomain, toggleModal, activeModal } = this.props
    const domainHeaderProps = {
      searchValue: this.state.domainSearchValue,
      searchFunc: ({ target: { value } }) => this.setState({ domainSearchValue: value }),
      activeDomain,
      domains: domains && domains.filter(domain => domain.id.includes(this.state.domainSearchValue)),
      changeActiveDomain: value => changeActiveDomain(value),
      onAddDomain,
      onEditDomain
    }
    const dnsFormInitialValues = {}
    return (
      <div className="account-management-system-dns">
        <DomainToolbar {...domainHeaderProps}/>
        <DNSList
          onAddEntry={() => {
            this.editingRecord = false
            toggleModal(RECORD_EDIT)}
          }
          onDeleteEntry={() => {/*noop*/}}/>
        {activeModal === RECORD_EDIT &&
          <RecordForm
            id="record-form"
            edit={this.editingRecord}
            domain='foobar.com'
            onSave={values => console.log(values)}
            onCancel={() => toggleModal(null)}
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
    changeActiveDomain,
    toggleModal: modal => dispatch(toggleAccountManagementModal(modal))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountManagementSystemDNS)
