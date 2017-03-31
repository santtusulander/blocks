import React, { PropTypes, Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {
  change,
  Fields,
  getFormValues,
  propTypes as reduxFormPropTypes,
  reduxForm,
  reset
} from 'redux-form'
import { List, Map } from 'immutable'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Modal } from 'react-bootstrap'

import * as securityActionCreators from '../../redux/modules/security'

import CertificateForm from './certificate-form'

const validate = values => {
  const errors = {}
  const { title, privateKey, certificate, group } = values

  if (!group || group === '') {
    errors.group = <FormattedMessage id='portal.security.ssl.validation.groupRequired.text'/>
  }
  if (!title) {
    errors.title = <FormattedMessage id='portal.security.ssl.validation.certTitleRequired.text'/>
  }
  if (!privateKey) {
    errors.privateKey = <FormattedMessage id='portal.security.ssl.validation.privateKeyRequired.text'/>
  }
  if (!certificate) {
    errors.certificate = <FormattedMessage id='portal.security.ssl.validation.certificateRequired.text'/>
  }
  return errors
}

class CertificateFormContainer extends Component {

  constructor(props) {
    super(props)

    this.handleFormSubmit = this.handleFormSubmit.bind(this)
  }

  componentWillMount() {
    this.props.fetchGroups('udn', this.props.activeAccount.get('id'))
  }

  handleFormSubmit(values) {
    const { certificateToEdit, upload, edit, securityActions, resetForm, toggleModal, showNotification } = this.props
    const cert = certificateToEdit && certificateToEdit.get('cn')
    const data = [
      'udn',
      Number(values.account),
      Number(values.group),
      {
        title: values.title,
        private_key: values.privateKey,
        certificate: values.certificate,
        intermediate_certificates: values.intermediateCertificates
      }
    ]

    if (cert) {
      data.push(cert)
    }

    if (cert) {
      return edit(data).then(res => {
        if (res.error) {
          showNotification(this.props.intl.formatMessage(
                                {id: 'portal.security.ssl.updateFailed.text'},
                                {reason: res.payload.data.message}))
        } else {
          showNotification(<FormattedMessage id="portal.security.ssl.sslIsUpdated.text" />)
        }
        securityActions.resetCertificateToEdit()
        return resetForm(toggleModal)
      });
    }

    return upload(data).then(res => {
      if (res.error) {
        showNotification(this.props.intl.formatMessage(
                              {id: 'portal.security.ssl.updateFailed.text'},
                              {reason: res.payload.data.message}))
      } else {
        showNotification(<FormattedMessage id="portal.security.ssl.sslIsCreated.text" />)
      }
      securityActions.resetCertificateToEdit()
      return resetForm(toggleModal)
    });
  }

  render() {
    const { title, formValues, certificateToEdit, cancel, toggleModal, handleSubmit, ...formProps } = this.props

    return (
      <Modal show={true} dialogClassName="modal-form-panel">
        <Modal.Header>
          <h1>{title}</h1>
          {!certificateToEdit.isEmpty() && formValues && <p>{formValues.title}</p>}
        </Modal.Header>
        <Modal.Body>
          <Fields
            names={[
              'group',
              'title',
              'privateKey',
              'certificate',
              'intermediateCertificates'
            ]}
            component={CertificateForm}
            editMode={!certificateToEdit.isEmpty()}
            onCancel={() => cancel(toggleModal)}
            onSubmit={handleSubmit(values => this.handleFormSubmit(values))}
            {...formProps}
          />
        </Modal.Body>
      </Modal>
    )
  }
}

CertificateFormContainer.displayName = "CertificateFormContainer"
CertificateFormContainer.propTypes = {
  ...reduxFormPropTypes,
  accounts: PropTypes.instanceOf(List),
  activeAccount: PropTypes.instanceOf(Map),
  cancel: PropTypes.func,
  certificateToEdit: PropTypes.instanceOf(Map),
  edit: PropTypes.func,
  fetchGroups: PropTypes.func,
  fields: PropTypes.object,
  formValues: PropTypes.object,
  groups: PropTypes.instanceOf(List),
  showNotification: PropTypes.func,
  title: PropTypes.object,
  toggleModal: PropTypes.func,
  upload: PropTypes.func
}
CertificateFormContainer.defaultProps = {
  accounts: List(),
  activeAccount: Map(),
  certificateToEdit: Map(),
  groups: List()
}

const mapStateToProps = (state) => {
  const certificateToEdit = state.security.get('certificateToEdit')
  const activeAccount = state.account.get('activeAccount') && state.account.get('activeAccount').get('id')
  const activeGroup = state.group.get('activeGroup') && state.group.get('activeGroup').get('id')

  return {
    certificateToEdit,
    initialValues: {
      title: certificateToEdit.get('title'),
      account: certificateToEdit.get('account') || activeAccount,
      group: certificateToEdit.get('group') || activeGroup,
      privateKey: certificateToEdit.get('privateKey') || null,
      certificate: certificateToEdit.get('certificate') || null,
      intermediateCertificates: certificateToEdit.get('intermediateCertificates') || null
    },
    formValues: getFormValues('certificateForm')(state),
    groups: state.security.get('groups')
  }
}

const mapDispatchToProps = (dispatch) => {
  const securityActions = bindActionCreators(securityActionCreators, dispatch)

  return {
    fetchGroups: (...params) => {
      securityActions.fetchGroupsForModal(...params)
      return () => dispatch(change('certificateForm', 'group', null))
    },
    cancel: toggleModal => {
      securityActions.resetCertificateToEdit()
      toggleModal(null)
      dispatch(reset('certificateForm'))
    },
    securityActions,
    upload: data => securityActions.uploadSSLCertificate(...data),
    edit: data => securityActions.editSSLCertificate(...data),
    resetForm: toggleModal => {
      toggleModal(null)
      dispatch(reset('certificateForm'))
    }
  }
}

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    reduxForm({
      form: 'certificateForm',
      validate
    })(CertificateFormContainer)
  )
)
