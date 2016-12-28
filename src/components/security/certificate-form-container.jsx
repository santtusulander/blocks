import React, { PropTypes, Component } from 'react'
import { Modal } from 'react-bootstrap'
import { reduxForm, getValues, reset, change } from 'redux-form'
import { bindActionCreators } from 'redux'
import { List, Map } from 'immutable'

import * as securityActionCreators from '../../redux/modules/security'

import CertificateForm from './certificate-form'

let errors = {}
const validate = values => {
  errors = {}
  const { title, privateKey, certificate, group } = values

  if (!group || group === '') {
    errors.group = 'Required'
  }
  if (!title) {
    errors.title = 'Required'
  }
  if (!privateKey) {
    errors.privateKey = 'Required'
  }
  if (!certificate) {
    errors.certificate = 'Required'
  }
  return errors
}

class CertificateFormContainer extends Component {
  componentWillMount() {
    this.props.fetchGroups('udn', this.props.activeAccount.get('id'))
  }

  render() {
    const { title, formValues, upload, toEdit, edit, cancel, toggleModal, ...formProps } = this.props
    const buttonFunctions = {
      onCancel: () => cancel(toggleModal),
      onSave: () => {
        const cert = toEdit && toEdit.get('cn')
        const data = [
          'udn',
          Number(formValues.account),
          Number(formValues.group),
          {
            title: formValues.title,
            private_key: formValues.privateKey,
            certificate: formValues.certificate,
            intermediate_certificates: formValues.intermediateCertificates
          }
        ]
        if(cert) {
          data.push(cert)
        }
        toggleModal(null)
        cert ? edit(data) : upload(data)
      }
    }
    return (
      <Modal show={true} dialogClassName="modal-form-panel">
        <Modal.Header>
          <h1>{title}</h1>
          {!toEdit.isEmpty() && <p>{formProps.fields.title.value}</p>}
        </Modal.Header>
        <Modal.Body>
          <CertificateForm editMode={!toEdit.isEmpty()}{...buttonFunctions}{...errors}{...formProps}/>
        </Modal.Body>
      </Modal>
    )
  }
}

CertificateFormContainer.displayName = "CertificateFormContainer"
CertificateFormContainer.propTypes = {
  accounts: PropTypes.instanceOf(List),
  activeAccount: PropTypes.instanceOf(Map),
  cancel: PropTypes.func,
  edit: PropTypes.func,
  fetchGroups: PropTypes.func,
  fields: PropTypes.object,
  formValues: PropTypes.object,
  groups: PropTypes.instanceOf(List),
  title: PropTypes.object,
  toEdit: PropTypes.instanceOf(Map),
  toggleModal: PropTypes.func,
  upload: PropTypes.func
}

export default reduxForm({
  fields: ['account', 'group', 'title', 'privateKey', 'certificate', 'intermediateCertificates'],
  form: 'certificateForm',
  validate
}, function mapStateToProps(state) {
  const toEdit = state.security.get('certificateToEdit')
  const activeAccount = state.account.get('activeAccount') && state.account.get('activeAccount').get('id')
  const activeGroup = state.group.get('activeGroup') && state.group.get('activeGroup').get('id')

  return {
    toEdit,
    initialValues: {
      title: toEdit.get('title'),
      account: toEdit.get('account') || activeAccount,
      group: toEdit.get('group') || activeGroup
    },
    formValues: getValues(state.form.certificateForm),
    groups: state.security.get('groups')
  }
}, function mapDispatchToProps(dispatch) {
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
    upload: data =>
      securityActions.uploadSSLCertificate(...data).then(() => {
        securityActions.resetCertificateToEdit()
        dispatch(reset('certificateForm'))
      }),
    edit: data =>
      securityActions.editSSLCertificate(...data).then(() => {
        securityActions.resetCertificateToEdit()
        dispatch(reset('certificateForm'))
      })
  }
}
)(CertificateFormContainer)
