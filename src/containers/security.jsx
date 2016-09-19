import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { Nav } from 'react-bootstrap'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getTabName } from '../util/helpers'
import { getSecurityUrlFromParams } from '../util/routes'

import * as accountActionCreators from '../redux/modules/account'
import * as securityActionCreators from '../redux/modules/security'
import * as uiActionCreators from '../redux/modules/ui'

import UDNModal from '../components/modal'
import CertificateForm from '../components/security/certificate-form-container'
import PageHeader from '../components/layout/page-header'
import Content from '../components/layout/content'
import SSLList from '../components/security/ssl-list'

import {
  UPLOAD_CERTIFICATE,
  EDIT_CERTIFICATE,
  DELETE_CERTIFICATE
} from '../constants/account-management-modals.js'

export class Security extends React.Component {
  constructor(props) {
    super(props)
    this.fetchData = this.fetchData.bind(this)
  }
  componentWillMount() {
    this.fetchData(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if(JSON.stringify(nextProps.params) !== JSON.stringify(this.props.params)) {
      this.fetchData(nextProps)
    }
  }

  fetchData(props) {
    const { location: { pathname }, params: { brand, account, group } } = props
    switch(getTabName(pathname)) {
      case 'ssl-certificate':
        props.securityActions.fetchSSLCertificates(brand, Number(account), Number(group))
        break
      // case 'token-authentication':  securityActions.fetchTokenAuthentication(account)
      // case 'content-targeting': securityActions.fetchContentTrageting(account)
      default: break
    }
  }

  renderContent(certificateFormProps, sslListProps) {
    const params = this.props.params
    const subPage = getTabName(this.props.location.pathname)
    const securityBaseUrl = getSecurityUrlFromParams(params);
    if (!params.account) {
      return (
        <Content className="tab-bodies">
          <p className='text-center'>Please select an account<br/>
            from top left to see security</p>
        </Content>
      )
    }
    return (
      <div>
        <Nav bsStyle="tabs">
          <li className="navbar">
            <Link to={securityBaseUrl + '/ssl-certificate'} activeClassName="active"><FormattedMessage id="portal.security.sslCertificate.text"/></Link>
          </li>
          <li className="navbar">
            <Link to={securityBaseUrl + '/token-authentication'} activeClassName="active"><FormattedMessage id="portal.security.tokenAuth.text"/></Link>
          </li>
          <li className="navbar">
            <Link to={securityBaseUrl + '/content-targeting'} activeClassName="active"><FormattedMessage id="portal.security.contentTargeting.text"/></Link>
          </li>
        </Nav>
        <Content className="tab-bodies">
          {subPage === 'ssl-certificate' && <SSLList {...sslListProps}/>}
          {subPage === 'token-authentication' && <h3>token-authentication</h3>}
          {subPage === 'content-targeting' && <h3>content-targeting</h3>}
        </Content>
      </div>
    )
  }

  render() {
    const {
      accounts,
      groups,
      activeAccount,
      activeCertificates,
      activeModal,
      fetchAccount,
      onDelete,
      sslCertificates,
      securityActions: { toggleActiveCertificates, fetchSSLCertificate },
      toDelete,
      toggleModal,
      intl
    } = this.props

    const certificateFormProps = {
      title: activeModal === EDIT_CERTIFICATE ? <FormattedMessage id="portal.security.editCertificate.text"/> : <FormattedMessage id="portal.security.uploadCertificate.text"/>,
      activeAccount,
      accounts,
      fetchAccount,
      toggleModal
    }

    const sslListProps = {
      groups,
      activeModal,
      activeCertificates,
      certificates: sslCertificates,
      onCheck: commonName => toggleActiveCertificates(commonName),
      uploadCertificate: () => toggleModal(UPLOAD_CERTIFICATE),
      editCertificate: (...args) => fetchSSLCertificate(...args).then(() => toggleModal(EDIT_CERTIFICATE)),
      deleteCertificate: (...args) => fetchSSLCertificate(...args).then(() => toggleModal(DELETE_CERTIFICATE))
    }

    return (
      <Content>
        <PageHeader pageSubTitle={<FormattedMessage id="portal.security.header.text"/>}>
          <h1>{activeAccount.get('name') || intl.formatMessage({id: 'portal.account.manage.selectAccount.text'})}</h1>
        </PageHeader>
         {/* ----- Not in 0.8.1* ----- */}
         {/*{this.renderContent(certificateFormProps, sslListProps)}*/}

         {/* ----- REMOVE ME AFTER ----- */}
         <p className='text-center'>Coming soon!</p>
        {activeModal === EDIT_CERTIFICATE && <CertificateForm {...certificateFormProps}/>}
        {activeModal === UPLOAD_CERTIFICATE && <CertificateForm {...certificateFormProps}/>}
        {activeModal === DELETE_CERTIFICATE &&
        <UDNModal
          show={true}
          title={<FormattedMessage id="portal.deleteModal.header.text" values={{itemToDelete: "Certificate"}}/>}
          cancelButton={() => toggleModal(null)}
          deleteButton={() => onDelete(toDelete)}
          invalid={true}
          verifyDelete={true}>
          <p>
            {<FormattedMessage id="portal.deleteModal.warning.text" values={{itemToDelete : "Certificate"}}/>}
          </p>
        </UDNModal>}
      </Content>
    )
  }
}

Security.propTypes = {
  accounts: PropTypes.instanceOf(List),
  activeAccount: PropTypes.instanceOf(Map),
  activeCertificates: PropTypes.instanceOf(List),
  activeModal: PropTypes.string,
  fetchAccount: PropTypes.func,
  fetchListData: PropTypes.func,
  intl: PropTypes.object,
  location: PropTypes.object,
  onDelete: PropTypes.func,
  params: PropTypes.object,
  securityActions: PropTypes.object,
  sslCertificates: PropTypes.instanceOf(List),
  toDelete: PropTypes.instanceOf(Map),
  toggleModal: PropTypes.func
}

function mapStateToProps(state, ownProps) {
  return {
    toDelete: state.security.get('certificateToEdit'),
    activeCertificates: state.security.get('activeCertificates'),
    activeModal: state.ui.get('accountManagementModal'),
    accounts: state.account.get('allAccounts'),
    activeAccount: state.account.get('activeAccount') || Map({}),
    groups: state.group.get('allGroups'),
    sslCertificates: state.security.get('sslCertificates').filter(cert =>
      ownProps.params.group ? cert.get('group') === Number(ownProps.params.group) : false
    )
  };
}

function mapDispatchToProps(dispatch) {
  const fetchAccount = bindActionCreators(accountActionCreators, dispatch).fetchAccount
  const securityActions = bindActionCreators(securityActionCreators, dispatch)
  const uiActions = bindActionCreators(uiActionCreators, dispatch)
  const toggleModal = uiActions.toggleAccountManagementModal
  function onDelete(toDelete) {
    toggleModal(null)
    securityActions.deleteSSLCertificate('udn', toDelete.get('account'), toDelete.get('group'), toDelete.get('cn'))
      .then(() => {
        securityActions.resetCertificateToEdit()
      })
  }
  return {
    fetchAccount,
    onDelete,
    securityActions: securityActions,
    toggleModal
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Security))
