import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'
import { FormattedMessage } from 'react-intl'
import { List, Map } from 'immutable'

import * as accountActionCreators from '../../../redux/modules/account'
import * as securityActionCreators from '../../../redux/modules/security'
import * as uiActionCreators from '../../../redux/modules/ui'

import ModalWindow from '../../../components/modal'
import CertificateForm from '../../../components/security/certificate-form-container'
import SSLList from '../../../components/security/ssl-list'
import LoadingSpinner from '../../../components/loading-spinner/loading-spinner'

import {
  UPLOAD_CERTIFICATE,
  EDIT_CERTIFICATE,
  DELETE_CERTIFICATE
} from '../../../constants/account-management-modals.js'

class TabSslCertificate extends Component {
  componentWillMount() {
    this.fetchData(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if ( !Object.is(nextProps.params, this.props.params) ) this.fetchData(nextProps)
  }

  fetchData(props) {
    const { params: { brand, account, group } } = props
    this.props.securityActions.startFetching()
    this.props.securityActions.fetchSSLCertificates(brand, Number(account), Number(group))
  }

  render(){
    const {
      activeAccount,
      activeModal,
      activeCertificates,
      fetchAccount,
      groups,
      toggleModal,
      onDelete,
      securityActions: { toggleActiveCertificates, fetchSSLCertificate },
      sslCertificates,
      toDelete
      } = this.props

    const modalTitle = activeModal === EDIT_CERTIFICATE
      ? <FormattedMessage id="portal.security.editCertificate.text"/>
      : <FormattedMessage id="portal.security.uploadCertificate.text"/>

    const certificateFormProps = {
      title: modalTitle,
      activeAccount,
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

    if ( !this.props.params.group) return (
      <p className='text-center'>
        <FormattedMessage id="portal.security.ssl.selectGroup.text" />
      </p>
    )

    if (this.props.isFetching) {
      return <LoadingSpinner />
    }

    return (
      <div className='ssl-certificate-tab'>

        <SSLList {...sslListProps}/>

        {activeModal === EDIT_CERTIFICATE && <CertificateForm {...certificateFormProps}/>}
        {activeModal === UPLOAD_CERTIFICATE && <CertificateForm {...certificateFormProps}/>}
        {activeModal === DELETE_CERTIFICATE &&
          <ModalWindow
            title={<FormattedMessage id="portal.deleteModal.header.text" values={{itemToDelete: "Certificate"}}/>}
            cancelButton={true}
            deleteButton={true}
            cancel={() => toggleModal(null)}
            submit={() => onDelete(toDelete)}
            invalid={true}
            verifyDelete={true}>
            <p>
              <FormattedMessage id="portal.deleteModal.warning.text" values={{itemToDelete : "Certificate"}}/>
            </p>
          </ModalWindow>
        }
      </div>
    )
  }
}

TabSslCertificate.propTypes = {
  activeAccount: PropTypes.instanceOf(Map),
  activeCertificates: PropTypes.instanceOf(List),
  activeModal: PropTypes.string,
  fetchAccount: PropTypes.func,
  groups: PropTypes.instanceOf(List),
  isFetching: PropTypes.bool,
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
    activeAccount: state.account.get('activeAccount'),
    groups: state.group.get('allGroups'),
    isFetching: state.security.get('fetching'),
    sslCertificates: state.security.get('sslCertificates').filter(cert =>
      ownProps.params.group && cert.get('group') === Number(ownProps.params.group)
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TabSslCertificate))
