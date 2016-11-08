import React, { PropTypes, Component } from 'react'
import { Modal } from 'react-bootstrap'
import { reduxForm, getValues, reset } from 'redux-form'
import { bindActionCreators } from 'redux'
import { List, Map } from 'immutable'

import * as securityActionCreators from '../../redux/modules/security'

import CertificateForm from './certificate-form'

let errors = {}
const validate = values => {
  errors = {}
  const { title, privateKey, certificate } = values

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
  render() {
    const { title, formValues, upload, toEdit, edit, cancel, toggleModal, ...formProps } = this.props
    const buttonFunctions = {
      onCancel: () => cancel(toggleModal),
      onSave: () => {
        const cert = toEdit && toEdit.get('cn')
        const data = [
          'udn',
          Number(formValues.account),
          { title: formValues.title, private_key: formValues.privateKey, certificate: formValues.certificate }
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

CertificateFormContainer.propTypes = {
  accounts: PropTypes.instanceOf(List),
  activeAccount: PropTypes.instanceOf(Map),
  cancel: PropTypes.func,
  edit: PropTypes.func,
  fields: PropTypes.object,
  formValues: PropTypes.object,
  title: PropTypes.object,
  toEdit: PropTypes.instanceOf(Map),
  toggleModal: PropTypes.func,
  upload: PropTypes.func
}

export default reduxForm({
  fields: ['account', 'title', 'privateKey', 'certificate'],
  form: 'certificateForm',
  validate
}, function mapStateToProps(state) {
  const toEdit = state.security.get('certificateToEdit')
  const activeAccount = state.account.get('activeAccount') && state.account.get('activeAccount').get('id')

  return {
    toEdit,
    initialValues: {
      title: toEdit.get('title'),
      account: toEdit.get('account') || activeAccount
    },
    formValues: getValues(state.form.certificateForm)
  }
}, function mapDispatchToProps(dispatch) {
  const securityActions = bindActionCreators(securityActionCreators, dispatch)
  return {
    cancel: toggleModal => {
      securityActions.resetCertificateToEdit()
      toggleModal(null)
      dispatch(reset('certificateForm'))
    },
    upload: data =>
      securityActions.uploadSSLCertificate(...data).then(() => dispatch(reset('certificateForm'))),
    edit: data =>
      securityActions.editSSLCertificate(...data).then(() => dispatch(reset('certificateForm')))
  }
}
)(CertificateFormContainer)
