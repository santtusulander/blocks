import React, { PropTypes, Component } from 'react'
import { Modal } from 'react-bootstrap'
import { reduxForm } from 'redux-form'
import { bindActionCreators } from 'redux'
import { List, Map } from 'immutable'
import CertificateForm from './certificate-form'
import * as groupActionCreators from '../../redux/modules/group'

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
    const { subtitle, title, ...formProps } = this.props
    return (
      <Modal show={true} dialogClassName="soa-form-sidebar">
        <Modal.Header>
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </Modal.Header>
        <Modal.Body>
          <CertificateForm { ...errors }{ ...formProps }/>
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
  groups: PropTypes.instanceOf(List),
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
    groups: state.group.get('allGroups')
  }
}, function mapDispatchToProps(dispatch) {
  const groupActions = bindActionCreators(groupActionCreators, dispatch)
  return {
    fetchGroups: groupActions.fetchGroups
  }
}
)(CertificateFormContainer)
