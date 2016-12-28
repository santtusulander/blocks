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
import { injectIntl } from 'react-intl'
import { Modal } from 'react-bootstrap'

import * as securityActionCreators from '../../redux/modules/security'

import CertificateForm from './certificate-form'

const validate = values => {
  let errors = {}
  const { title, privateKey, certificate, intermediateCertificates, group } = values

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
  if (!intermediateCertificates) {
    errors.intermediateCertificates = 'Required'
  }
  return errors
}

class CertificateFormContainer extends Component {

  constructor(props){
    super(props)
  }

  componentWillMount() {
    this.props.fetchGroups('udn', this.props.activeAccount.get('id'))
  }

  render() {
    const { title, formValues, upload, certificateToEdit, edit, cancel, toggleModal, ...formProps } = this.props

    const buttonFunctions = {
      onCancel: () => cancel(toggleModal),
      onSave: () => {
        const cert = certificateToEdit && certificateToEdit.get('cn')
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
            {...formProps}
            {...buttonFunctions}
          />
        </Modal.Body>
      </Modal>
    )
  }
}

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
  title: PropTypes.object,
  toggleModal: PropTypes.func,
  upload: PropTypes.func
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

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(
    reduxForm({
      form: 'certificateForm',
      validate
    })(CertificateFormContainer)
  )
)
