import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FormattedMessage } from 'react-intl'
import { List, Map } from 'immutable'
import { injectIntl } from 'react-intl'

import * as accountActionCreators from '../../../redux/modules/account'
import * as securityActionCreators from '../../../redux/modules/security'
import * as uiActionCreators from '../../../redux/modules/ui'

import { getByAccount as getGroupByAccount } from '../../../redux/modules/entities/groups/selectors'

import { parseResponseError } from '../../../redux/util'

import ModalWindow from '../../../components/shared/modal'
import CertificateFormContainer from '../../../components/security/certificate-form-container'
import SSLList from '../../../components/security/ssl-list'

import LoadingSpinner from '../../../components/loading-spinner/loading-spinner'

import {
  UPLOAD_CERTIFICATE,
  EDIT_CERTIFICATE,
  DELETE_CERTIFICATE
} from '../../../constants/account-management-modals.js'

class TabSslCertificate extends Component {
  constructor(props) {
    super(props)

    this.onDelete = this.onDelete.bind(this)
    this.fetchData = this.fetchData.bind(this)
    this.showNotification = this.showNotification.bind(this)

    this.notificationTimeout = null
  }

  componentWillMount() {
    this.fetchData(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.params) !== JSON.stringify(this.props.params)) {
      this.fetchData(nextProps)
    }
  }

  fetchData(props) {
    const { securityActions, params: { brand, account, group } } = props
    securityActions.startFetching()
    securityActions.fetchSSLCertificates(brand, Number(account), Number(group))
  }

  showNotification(message) {
    clearTimeout(this.notificationTimeout)
    this.props.changeNotification(message)
    this.notificationTimeout = setTimeout(this.props.changeNotification, 10000)
  }

  onDelete(toDelete) {
    const {securityActions, toggleModal} = this.props

    toggleModal(null)

    return securityActions.deleteSSLCertificate('udn', toDelete.get('account'), toDelete.get('group'), toDelete.get('cn'))
      .then((res) => {
        if (res.error) {
          this.showNotification(this.props.intl.formatMessage(
                                {id: 'portal.security.ssl.updateFailed.text'},
                                {reason: parseResponseError(res.payload)}))
        } else {
          this.showNotification(<FormattedMessage id="portal.security.ssl.sslIsRemoved.text" />)
        }
        securityActions.resetCertificateToEdit()
      })
  }

  render() {
    const {
      activeModal,
      activeCertificates,
      fetchAccount,
      groups,
      isFetching,
      toggleModal,
      securityActions: { toggleActiveCertificates, fetchSSLCertificate },
      sslCertificates,
      toDelete
      } = this.props


    const modalTitle = activeModal === EDIT_CERTIFICATE
      ? <FormattedMessage id="portal.security.editCertificate.text"/>
      : <FormattedMessage id="portal.security.uploadCertificate.text"/>

    if (!this.props.params.group) {
      return (
      <p className='text-center'>
        <FormattedMessage id="portal.security.ssl.selectGroup.text" />
      </p>
      )
    }

    if (isFetching) {
      return <LoadingSpinner />
    }


    return (
      <div className='ssl-certificate-tab'>

        <SSLList
          groups={groups}
          activeModal={activeModal}
          activeCertificates={activeCertificates}
          certificates={sslCertificates}
          isFetching={isFetching}
          onCheck={commonName => toggleActiveCertificates(commonName)}
          uploadCertificate={() => toggleModal(UPLOAD_CERTIFICATE)}
          editCertificate={(...args) => fetchSSLCertificate(...args).then(() => toggleModal(EDIT_CERTIFICATE))}
          deleteCertificate={(...args) => fetchSSLCertificate(...args).then(() => toggleModal(DELETE_CERTIFICATE))}
        />

        {(activeModal === EDIT_CERTIFICATE || activeModal === UPLOAD_CERTIFICATE) &&
          <CertificateFormContainer
            title={modalTitle}
            showNotification={this.showNotification}
            activeAccount={this.props.params.account}
            activeGroup={this.props.params.group}
            fetchAccount={fetchAccount}
            toggleModal={toggleModal}
          />
        }

        {activeModal === DELETE_CERTIFICATE &&
          <ModalWindow
            title={<FormattedMessage id="portal.deleteModal.header.text" values={{itemToDelete: "Certificate"}}/>}
            cancelButton={true}
            deleteButton={true}
            cancel={() => toggleModal(null)}
            onSubmit={() => this.onDelete(toDelete)}
            invalid={true}
            verifyDelete={true}>
            <p>
              <FormattedMessage id="portal.deleteModal.warning.text" values={{itemToDelete: "Certificate"}}/>
            </p>
          </ModalWindow>
        }
      </div>
    )
  }
}

TabSslCertificate.displayName = 'TabSslCertificate'

TabSslCertificate.propTypes = {
  activeCertificates: PropTypes.instanceOf(List),
  activeModal: PropTypes.string,
  changeNotification: PropTypes.func,
  fetchAccount: PropTypes.func,
  groups: PropTypes.instanceOf(List),
  intl: React.PropTypes.object,
  isFetching: PropTypes.bool,
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
    groups: getGroupByAccount(state, ownProps.params.account),
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
  const changeNotification = uiActions.changeNotification

  return {
    fetchAccount,
    securityActions,
    toggleModal,
    changeNotification
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(TabSslCertificate))
