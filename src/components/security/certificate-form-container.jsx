import React, { PropTypes, Component } from 'react'
import { Modal } from 'react-bootstrap'
import { reduxForm, getValues, reset } from 'redux-form'
import { bindActionCreators } from 'redux'
import { List, Map, fromJS } from 'immutable'

import * as groupActionCreators from '../../redux/modules/group'
import * as securityActionCreators from '../../redux/modules/security'

import CertificateForm from './certificate-form'

let errors = {}
const validate = values => {
  errors = {}
  const {
    sslCertTitle,
    privateKey,
    certificate } = values
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
    if(this.props.groups.isEmpty()) {
      // this.props.fetchGroups('udn', this.props.activeAccount.get('id'))
    }
  }
  render() {
    const { subtitle, title, formValues, upload, edit, toggleModal, toEdit, ...formProps } = this.props
    const buttonFunctions = {
      onCancel: () => toggleModal(null),
      onSave: () => {
        toggleModal(null)
        toEdit ?
          edit(formValues.set('commonName', '*.unifieddelivery.net')) :
          upload(formValues.set('commonName', '*.unifieddelivery.net'))
      }
    }
    return (
      <Modal show={true} dialogClassName="soa-edit-form-sidebar">
        <Modal.Header>
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
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
  edit: PropTypes.func,
  fetchGroups: PropTypes.func,
  fields: PropTypes.object,
  formValues: PropTypes.object,
  groups: PropTypes.instanceOf(List),
  subtitle: PropTypes.string,
  title: PropTypes.string,
  toEdit: PropTypes.number,
  toggleModal: PropTypes.func,
  upload: PropTypes.func
}

export default reduxForm({
  fields: ['account', 'group', 'title', 'interMediateCert', 'privateKey', 'certificate'],
  form: 'certificateForm',
  validate
}, function mapStateToProps(state) {
  const toEdit = state.security.get('editingCertificate')
  const initialValues = state.security.getIn(['sslCertificates', 'items'])
    .find(item => item.get('id') === toEdit)
  return {
    toEdit,
    initialValues: initialValues && initialValues.toJS(),
    formValues: fromJS(getValues(state.form.certificateForm)),
    // Only for development while the API is broken; accounts come from parent
    groups: fromJS([
      {id: '1', name: 'aaa'},
      {id: '2', name: 'bbb'}
    ]),
    accounts: fromJS([
      {id: '1', name: 'aaa'},
      {id: '2', name: 'bbb'}
    ])
    // Actual data:
    // groups: state.group.get('allGroups')
  }
}, function mapDispatchToProps(dispatch) {
  const groupActions = bindActionCreators(groupActionCreators, dispatch)
  const securityActions = bindActionCreators(securityActionCreators, dispatch)
  return {
    fetchGroups: groupActions.fetchGroups,
    upload: (formValues) =>
      securityActions.uploadSSLCertificate(formValues).then(() => dispatch(reset('certificateForm'))),
    edit: (formValues) =>
      securityActions.editSSLCertificate(formValues).then(() => dispatch(reset('certificateForm')))
  }
}
)(CertificateFormContainer)
