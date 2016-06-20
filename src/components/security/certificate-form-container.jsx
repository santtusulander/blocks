import React, { PropTypes, Component } from 'react'
import { Modal } from 'react-bootstrap'
import { reduxForm, getValues } from 'redux-form'
import { bindActionCreators } from 'redux'
import { List, Map } from 'immutable'

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
      this.props.fetchGroups('udn', this.props.activeAccount.get('id'))
    }
  }
  render() {
    const { subtitle, title, formValues, save, toggleModal, ...formProps } = this.props
    const buttonFunctions = {
      onCancel: () => toggleModal(null),
      onSave: () => {
        save(formValues)
        toggleModal(null)
      }
    }

    return (
      <Modal show={true} dialogClassName="soa-form-sidebar">
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
  children: PropTypes.array,
  fetchGroups: PropTypes.func,
  fields: PropTypes.object,
  formValues: PropTypes.object,
  groups: PropTypes.instanceOf(List),
  save: PropTypes.func,
  subtitle: PropTypes.string,
  title: PropTypes.string,
  toggleModal: PropTypes.func
}

export default reduxForm({
  fields: ['account', 'group', 'sslCertTitle', 'interMediateCert', 'privateKey', 'certificate'],
  form: 'certificateForm',
  validate
}, function mapStateToProps(state) {
  return {
    formValues: getValues(state.form.certificateForm),
    groups: state.group.get('allGroups')
  }
}, function mapDispatchToProps(dispatch) {
  const groupActions = bindActionCreators(groupActionCreators, dispatch)
  const securityActions = bindActionCreators(securityActionCreators, dispatch)
  return {
    fetchGroups: groupActions.fetchGroups,
    save: securityActions.uploadSSLCertificate
  }
}
)(CertificateFormContainer)
