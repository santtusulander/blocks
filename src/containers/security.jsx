import React, { PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import { Map, List } from 'immutable'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getTabName } from '../util/helpers'

import * as accountActionCreators from '../redux/modules/account'
import * as securityActionCreators from '../redux/modules/security'
import * as uiActionCreators from '../redux/modules/ui'

import ModalWindow from '../components/modal'
import PageContainer from '../components/layout/page-container'
import SecurityPageHeader from '../components/security/security-page-header'
import CertificateForm from '../components/security/certificate-form-container'
import Content from '../components/layout/content'
import SSLList from '../components/security/ssl-list'

import { getUrl } from '../util/routes.js'

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
    const { securityActions, params: { brand, account } } = props
    securityActions.fetchSSLCertificates(brand, Number(account))
  }

  renderContent(certificateFormProps, sslListProps) {
    const params = this.props.params
    const subPage = getTabName(this.props.location.pathname)

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
      activeAccount,
      activeCertificates,
      activeModal,
      fetchAccount,
      onDelete,
      sslCertificates,
      securityActions: { toggleActiveCertificates, fetchSSLCertificate },
      toDelete,
      toggleModal
    } = this.props

    const certificateFormProps = {
      title: activeModal === EDIT_CERTIFICATE ? <FormattedMessage id="portal.security.editCertificate.text"/> : <FormattedMessage id="portal.security.uploadCertificate.text"/>,
      activeAccount,
      fetchAccount,
      toggleModal
    }

    const sslListProps = {
      activeModal,
      activeCertificates,
      certificates: sslCertificates,
      onCheck: commonName => toggleActiveCertificates(commonName),
      uploadCertificate: () => toggleModal(UPLOAD_CERTIFICATE),
      editCertificate: (...args) => fetchSSLCertificate(...args).then(() => toggleModal(EDIT_CERTIFICATE)),
      deleteCertificate: (...args) => fetchSSLCertificate(...args).then(() => toggleModal(DELETE_CERTIFICATE))
    }

    const itemSelectorFunc = (...params) => {
      this.props.router.push(getUrl('/security', ...params))
    }

    return (
      <Content>
        <SecurityPageHeader
          params={this.props.params}
          itemSelectorFunc={itemSelectorFunc}
          activeAccount={activeAccount} />

          <PageContainer>
            {this.renderContent(certificateFormProps, sslListProps)}
          </PageContainer>

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
      </Content>
    )
  }
}

Security.propTypes = {
  activeAccount: PropTypes.instanceOf(Map),
  activeCertificates: PropTypes.instanceOf(List),
  activeModal: PropTypes.string,
  fetchAccount: PropTypes.func,
  fetchListData: PropTypes.func,
  location: PropTypes.object,
  onDelete: PropTypes.func,
  params: PropTypes.object,
  router: React.PropTypes.object,
  securityActions: PropTypes.object,
  sslCertificates: PropTypes.instanceOf(Map),
  toDelete: PropTypes.instanceOf(Map),
  toggleModal: PropTypes.func
}

function mapStateToProps(state) {
  return {
    toDelete: state.security.get('certificateToEdit'),
    activeCertificates: state.security.get('activeCertificates'),
    activeModal: state.ui.get('accountManagementModal'),
    activeAccount: state.account.get('activeAccount') || Map({}),
    sslCertificates: state.security.get('sslCertificates')
  };
}

function mapDispatchToProps(dispatch) {
  const fetchAccount = bindActionCreators(accountActionCreators, dispatch).fetchAccount
  const securityActions = bindActionCreators(securityActionCreators, dispatch)
  const uiActions = bindActionCreators(uiActionCreators, dispatch)
  const toggleModal = uiActions.toggleAccountManagementModal
  function onDelete(toDelete) {
    toggleModal(null)
    securityActions.deleteSSLCertificate('udn', toDelete.get('account'), toDelete.get('cn'))
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Security))
