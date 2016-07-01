import React, { PropTypes, Component } from 'react'
import { Modal } from 'react-bootstrap'
import { reduxForm, getValues, reset } from 'redux-form'
import { bindActionCreators } from 'redux'
import { List, Map } from 'immutable'

import * as groupActionCreators from '../../redux/modules/group'
import * as securityActionCreators from '../../redux/modules/security'

import CertificateForm from './certificate-form'

let errors = {}
const validate = values => {
  errors = {}
  const { sslCertTitle, privateKey, certificate, account, group } = values
  if (!account) {
    errors.account = 'Required'
  }
  if (!group || group === '') {
    errors.group = 'Required'
  }
  if (!sslCertTitle) {
    errors.sslCertTitle = 'Required'
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

  componentWillReceiveProps(nextProps) {
    const nextAccountValue = nextProps.fields.account.value
    const thisAccountValue = this.props.fields.account.value
    if(nextAccountValue && nextAccountValue !== thisAccountValue) {
      this.props.fetchGroups('udn', parseInt(nextAccountValue))
    }
  }
  render() {
    const { title, formValues, upload, edit, cancel, toggleModal, toEdit, ...formProps } = this.props
    const buttonFunctions = {
      onCancel: () => cancel(toggleModal),
      onSave: () => {
        toggleModal(null)
        formValues.account = parseInt(formValues.account)
        formValues.group = parseInt(formValues.group)
        toEdit ? edit(formValues) : upload(formValues)
      }
    }
    return (
      <Modal show={true} dialogClassName="soa-edit-form-sidebar">
        <Modal.Header>
          <h1>{title}</h1>
          {toEdit && <p>{formProps.fields.title.value}</p>}
        </Modal.Header>
        <Modal.Body>
          <CertificateForm { ...buttonFunctions }{ ...errors }{ ...formProps }/>
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
  fetchGroups: PropTypes.func,
  fields: PropTypes.object,
  formValues: PropTypes.object,
  groups: PropTypes.instanceOf(List),
  title: PropTypes.string,
  toEdit: PropTypes.bool,
  toggleModal: PropTypes.func,
  upload: PropTypes.func
}

export default reduxForm({
  fields: ['account', 'group', 'title', 'interMediateCert', 'privateKey', 'certificate'],
  form: 'certificateForm',
  validate
}, function mapStateToProps(state) {
  const toEdit = state.security.get('certificateToEdit')
  const activeAccount = state.account.get('activeAccount') && state.account.get('activeAccount').get('id')
  const activeGroup = state.group.get('activeGroup') && state.group.get('activeGroup').get('id')
  return {
    toEdit: !toEdit.isEmpty(),
    initialValues: {
      title: toEdit.get('title'),
      account: toEdit.get('account') || activeAccount,
      group: toEdit.get('group') || activeGroup
    },
    formValues: getValues(state.form.certificateForm),
    groups: state.group.get('allGroups')
  }
}, function mapDispatchToProps(dispatch) {
  const groupActions = bindActionCreators(groupActionCreators, dispatch)
  const securityActions = bindActionCreators(securityActionCreators, dispatch)
  return {
    fetchGroups: groupActions.fetchGroups,
    cancel: toggleModal => {
      securityActions.resetCertificateToEdit()
      toggleModal(null)
      dispatch(reset('certificateForm'))
    },
    upload: formValues =>
      securityActions.uploadSSLCertificate(
        'udn',
        formValues.account,
        formValues.group,
        {
          title: formValues.title,
          private_key: formValues.privateKey,
          certificate: formValues.certificate
        }).then(() => dispatch(reset('certificateForm'))),
    edit: formValues =>
      securityActions.editSSLCertificate(formValues).then(() => dispatch(reset('certificateForm')))
  }
}
)(CertificateFormContainer)
