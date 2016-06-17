import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { Nav } from 'react-bootstrap'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as accountActionCreators from '../redux/modules/account'
import * as securityActionCreators from '../redux/modules/security'
import * as uiActionCreators from '../redux/modules/ui'

import DeleteModal from '../components/delete-modal'
import CertificateForm from '../components/security/certificate-form-container'
import PageHeader from '../components/layout/page-header'
import PageContainer from '../components/layout/page-container'
import Content from '../components/layout/content'
import Select from '../components/select.jsx'
import SSLList from '../components/security/ssl-list'

import {
  UPLOAD_CERTIFICATE,
  EDIT_CERTIFICATE,
  DELETE_CERTIFICATE
} from '../constants/account-management-modals.js'

class Security extends React.Component {

  componentWillMount() {
    this.props.fetchAccountData(this.props.accounts)
  }

  componentWillReceiveProps(nextProps) {
    switch(nextProps.params.subPage) {
      case 'ssl-certificate':
        this.props.securityActions.fetchSSLCertificates({ account: nextProps.activeAccount.get('id') })
        break
      // case 'token-authentication':  securityActions.fetchTokenAuthentication(account)
      // case 'content-targeting': securityActions.fetchContentTrageting(account)
      default: break
    }
  }

  render() {
    const {
      accounts,
      activeAccount,
      activeCertificates,
      activeModal,
      fetchAccount,
      sslCertificates,
      securityActions: { toggleActiveCertificates },
      toggleModal,
      params: { subPage }
    } = this.props
    const sslListProps = {
      activeCertificates,
      certificates: sslCertificates && sslCertificates.get('items'),
      uploadCertificate: () => toggleModal(UPLOAD_CERTIFICATE),
      deleteCertificate: () => toggleModal(DELETE_CERTIFICATE),
      editCertificate: () => toggleModal(EDIT_CERTIFICATE),
      onCheck: id => toggleActiveCertificates(id)
    }
    const certificateFormProps = {
      activeAccount,
      accounts,
      fetchAccount,
      onSave: () => toggleModal(null),
      onCancel: () => toggleModal(null)
    }
    const changeActiveAccount = brand => id => fetchAccount(brand, id)
    const accountOptions = accounts.map(account => [account.get('id'), account.get('name')])
    return (
      <PageContainer className="account-management">
         <div className="account-management-system-users">
          <PageHeader>
            <h1 className="security-header-text">Security</h1>
            <div className='dns-filter-wrapper'>
              Account
              <Select
                onSelect={changeActiveAccount('udn')}
                className="dns-dropdowns"
                value={activeAccount.get('id')}
                options={accountOptions.toJS()}/>
            </div>
          </PageHeader>
          <Nav bsStyle="tabs" className="system-nav">
              <li className="navbar">
                <Link to="/security/ssl-certificate" activeClassName="active">SSL CERTIFICATE</Link>
              </li>
              <li className="navbar">
                <Link to="/security/token-authentication" activeClassName="active">TOKEN AUTHENTICATION</Link>
              </li>
              <li className="navbar">
                <Link to="/security/content-targeting" activeClassName="active">CONTENT TARGETING</Link>
              </li>
          </Nav>
          <Content className="tab-bodies">
            {subPage === 'ssl-certificate' && <SSLList { ...sslListProps }/>}
            {subPage === 'token-authentication' && <h3>token-authentication</h3>}
            {subPage === 'content-targeting' && <h3>content-targeting</h3>}
          </Content>
        </div>
        {activeModal === EDIT_CERTIFICATE && <CertificateForm title='Edit Certificate'{ ...certificateFormProps }/>}
        {activeModal === UPLOAD_CERTIFICATE && <CertificateForm title='Upload Certificate'{ ...certificateFormProps }/>}
        {activeModal === DELETE_CERTIFICATE &&
          <DeleteModal
            itemToDelete='Certificate'
            onDelete={() => toggleModal(null)}
            onCancel={() => toggleModal(null)}/>}
      </PageContainer>
    )
  }
}

Security.defaultProps = {
  activeAccount: Map({ id: 1, name: 'Account1' })
}
Security.propTypes = {
  accounts: PropTypes.instanceOf(List),
  activeAccount: PropTypes.instanceOf(Map),
  activeCertificates: PropTypes.instanceOf(List),
  activeModal: PropTypes.string,
  fetchAccount: PropTypes.func,
  fetchAccountData: PropTypes.func,
  fetchListData: PropTypes.func,
  params: PropTypes.object,
  securityActions: PropTypes.object,
  sslCertificates: PropTypes.instanceOf(Map),
  toggleModal: PropTypes.func
}


function mapStateToProps(state) {
  return {
    activeCertificates: state.security.get('activeCertificates'),
    activeModal: state.ui.get('accountManagementModal'),
    accounts: state.account.get('allAccounts'),
    activeAccount: state.account.get('activeAccount'),
    sslCertificates: state.security.get('sslCertificates')
  };
}

function mapDispatchToProps(dispatch) {
  const accountActions = bindActionCreators(accountActionCreators, dispatch)
  const securityActions = bindActionCreators(securityActionCreators, dispatch)
  const uiActions = bindActionCreators(uiActionCreators, dispatch)
  function fetchAccountData(accounts) {
    if(accounts && accounts.isEmpty()) {
      accountActions.fetchAccounts('udn')
    }
  }

  return {
    fetchAccountData: fetchAccountData,
    fetchAccount: accountActions.fetchAccount,
    securityActions: securityActions,
    toggleModal: uiActions.toggleAccountManagementModal
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Security)
