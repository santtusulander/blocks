import React, { PropTypes, Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {
  change,
  Field,
  getFormValues,
  propTypes as reduxFormPropTypes,
  reduxForm,
  reset
} from 'redux-form'
import { List, Map } from 'immutable'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Button } from 'react-bootstrap'

import { parseResponseError } from '../../redux/util'

import FieldFormGroup from '../shared/form-fields/field-form-group'
import FormFooterButtons from '../shared/form-elements/form-footer-buttons'
import FieldFormGroupSelect from '../shared/form-fields/field-form-group-select'
import SidePanel from '../shared/side-panel'
import IconAdd from '../shared/icons/icon-add.jsx'
import IconFile from '../shared/icons/icon-file'
import IconPassword from '../shared/icons/icon-password'
import IconClose from '../shared/icons/icon-close'

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

    this.state = {
      privateKey: '',
      certificate: '',
      intermediateCertificates: '',
      showManuallModal: false
    }

    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.handleManualAdding = this.handleManualAdding.bind(this)
    this.toggleManuallModal = this.toggleManuallModal.bind(this)
    this.uploadWithFileDialog = this.uploadWithFileDialog.bind(this)
    this.deleteItem = this.deleteItem.bind(this)
  }

  componentWillMount() {
    this.props.fetchGroups('udn', this.props.activeAccount)
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
                                {reason: parseResponseError(res.payload)}))
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
                              {reason: parseResponseError(res.payload)}))
      } else {
        showNotification(<FormattedMessage id="portal.security.ssl.sslIsCreated.text" />)
      }
      securityActions.resetCertificateToEdit()
      return resetForm(toggleModal)
    });
  }

  handleManualAdding(values) {
    this.setState({
      privateKey: values.privateKey,
      certificate: values.certificate,
      intermediateCertificates: values.intermediateCertificates
    })
    this.toggleManuallModal()
  }

  toggleManuallModal() {
    this.setState({showManuallModal: !this.state.showManuallModal})
  }

  uploadWithFileDialog() {
    const input = document.createElement('input');
    input.type = 'file';
    input.addEventListener('change', (e) => {
      const file = e.target.files[0]
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileNameArr = file.name.split('.')
        const fileExtension = fileNameArr[fileNameArr.length-1]
        const content = e.target.result;

        if (fileExtension === 'crt') {
          if (this.state.certificate) {
            this.setState({intermediateCertificates: content})
          } else {
            this.setState({certificate: content})
          }
        } else if (fileExtension === 'key') {
          this.setState({privateKey: content})
        }
      }
      reader.readAsText(file);
    });
    input.click();
  }

  deleteItem(item) {
    switch (item) {
      case 'privateKey':
        this.setState({privateKey: ''})
        break
      case 'certificate':
        this.setState({certificate: ''})
        break
      case 'intermediateCertificates':
        this.setState({intermediateCertificates: ''})
        break
    }
  }

  render() {
    const { title, formValues, certificateToEdit, cancel, toggleModal, handleSubmit,invalid, submitting } = this.props
    const groupsOptions = this.props.groups.map(group => [
      group.get('id'),
      group.get('name')
    ])

    return (
      <div>
        <SidePanel show={true} title={title} subTitle={!certificateToEdit.isEmpty() && formValues && <p>{formValues.title}</p>}>
            <form className="upload-certificate-form" onSubmit={handleSubmit(values => this.handleFormSubmit(values))}>
              <Field
                name="group"
                className="input-select"
                component={FieldFormGroupSelect}
                options={groupsOptions.toJS()}
                label={<FormattedMessage id="portal.security.ssl.edit.assign.text"/>}
                disabled={!certificateToEdit.isEmpty()}
              />
              <hr/>
              <Field
                name="title"
                type="text"
                component={FieldFormGroup}
                label={<FormattedMessage id="portal.security.ssl.edit.certTitle.text"/>}
              />
              <hr/>

              <label><FormattedMessage id="portal.security.ssl.edit.privateKeyAndCertificates.text"/></label>
              <Button bsStyle="success" className="btn-icon" onClick={this.uploadWithFileDialog}>
                <IconAdd />
              </Button>
              <div className="key-and-certificates-list">
                {this.state.privateKey &&
                  <div>
                    <IconPassword />
                    <FormattedMessage id="portal.security.ssl.edit.privateKey.text"/>
                      <Button
                        onClick={() => this.deleteItem('privateKey')}
                        className="btn btn-icon">
                        <IconClose/>
                      </Button>
                  </div>
                }
                {this.state.certificate &&
                  <div>
                    <IconFile />
                    <FormattedMessage id="portal.security.ssl.edit.certificate.text"/>
                    <Button
                      onClick={() => this.deleteItem('certificate')}
                      className="btn btn-icon">
                      <IconClose/>
                    </Button>
                  </div>
                }
                {this.state.intermediateCertificates &&
                  <div>
                    <IconFile />
                    <FormattedMessage id="portal.security.ssl.edit.intermediateCertificates.text"/>
                    <Button
                      onClick={() => this.deleteItem('intermediateCertificates')}
                      className="btn btn-icon">
                      <IconClose/>
                    </Button>
                  </div>
                }
              </div>

              <a onClick={this.toggleManuallModal}><FormattedMessage id="portal.security.ssl.edit.addManually.text"/></a>

              <FormFooterButtons className="text-right extra-margin-top" bsClass="btn-toolbar">
                <Button
                  id="cancel_button"
                  className="btn-secondary"
                  onClick={() => cancel(toggleModal)}>
                  <FormattedMessage id="portal.common.button.cancel"/>
                </Button>
                <Button
                  id="save_button"
                  type="submit"
                  bsStyle="primary"
                  disabled={invalid || submitting}>
                  {submitting ? <FormattedMessage id='portal.common.button.saving' />
                              : <FormattedMessage id='portal.common.button.save' />
                  }
                </Button>
              </FormFooterButtons>
            </form>
        </SidePanel>

        {this.state.showManuallModal &&
          <SidePanel show={true} title={title} subTitle={!certificateToEdit.isEmpty() && formValues && <p>{formValues.title}</p>}>
            <form onSubmit={handleSubmit(values => this.handleManualAdding(values))}>
              <Field
                name="privateKey"
                type="textarea"
                className="fixed-size-textarea"
                component={FieldFormGroup}
                label={<FormattedMessage id="portal.security.ssl.edit.privateKey.text"/>}
              />

              <hr/>

              <Field
                name="intermediateCertificates"
                type="textarea"
                className="fixed-size-textarea"
                component={FieldFormGroup}
                required={false}
                label={<FormattedMessage id="portal.security.ssl.edit.intermediateCertificates.text"/>}
              />

              <hr/>

              <Field
                name="certificate"
                type="textarea"
                className="fixed-size-textarea"
                component={FieldFormGroup}
                label={<FormattedMessage id="portal.security.ssl.edit.certificate.text"/>}
              />

              <FormFooterButtons className="text-right extra-margin-top" bsClass="btn-toolbar">
                <Button
                  id="cancel_button"
                  className="btn-secondary"
                  onClick={this.toggleManuallModal}>
                  <FormattedMessage id="portal.common.button.cancel"/>
                </Button>
                <Button
                  id="save_button"
                  type="submit"
                  bsStyle="primary"
                  disabled={invalid || submitting}>
                  {submitting ? <FormattedMessage id='portal.button.adding' />
                              : <FormattedMessage id='portal.button.add' />
                  }
                </Button>
              </FormFooterButtons>
            </form>
          </SidePanel>
        }
      </div>
    )
  }
}

/*
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
  fromSubmitting={submitting}
  {...formProps}
/>
*/

CertificateFormContainer.displayName = "CertificateFormContainer"
CertificateFormContainer.propTypes = {
  ...reduxFormPropTypes,
  accounts: PropTypes.instanceOf(List),
  activeAccount: PropTypes.string,
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
  activeAccount: '',
  certificateToEdit: Map(),
  groups: List()
}

/* istanbul ignore next */
const mapStateToProps = (state, ownProps) => {
  const certificateToEdit = state.security.get('certificateToEdit')

  return {
    certificateToEdit,
    initialValues: {
      title: certificateToEdit.get('title'),
      account: certificateToEdit.get('account') || ownProps.activeAccount,
      group: certificateToEdit.get('group') || Number(ownProps.activeGroup),
      privateKey: certificateToEdit.get('privateKey') || null,
      certificate: certificateToEdit.get('certificate') || null,
      intermediateCertificates: certificateToEdit.get('intermediateCertificates') || null
    },
    formValues: getFormValues('certificateForm')(state),
    groups: state.security.get('groups')
  }
}

/* istanbul ignore next */
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

const form = reduxForm({
  form: 'certificateForm',
  validate
})(CertificateFormContainer)

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(form)
)
