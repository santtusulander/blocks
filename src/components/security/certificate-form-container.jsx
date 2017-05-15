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
import Dropzone from 'react-dropzone'

import FieldFormGroup from '../shared/form-fields/field-form-group'
import FormFooterButtons from '../shared/form-elements/form-footer-buttons'
import FieldFormGroupSelect from '../shared/form-fields/field-form-group-select'
import SidePanel from '../shared/side-panel'
import IconAdd from '../shared/icons/icon-add.jsx'
import IconFile from '../shared/icons/icon-file'
import IconPassword from '../shared/icons/icon-password'
import IconClose from '../shared/icons/icon-close'

import { ALLOWED_CERT_EXTENSIONS, ALLOWED_CERT_KEY_EXTENSIONS, CERT_MAX_FILE_COUNT } from '../../constants/security'

import * as securityActionCreators from '../../redux/modules/security'
import * as uiActionCreators from '../../redux/modules/ui'
import { parseResponseError } from '../../redux/util'

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
    this.uploadWithDialog = this.uploadWithDialog.bind(this)
    this.uploadWithDropZone = this.uploadWithDropZone.bind(this)
    this.isAllFilesAdded = this.isAllFilesAdded.bind(this)
    this.deleteItem = this.deleteItem.bind(this)
    this.showNotification = this.showNotification.bind(this)
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
        private_key: this.state.privateKey,
        certificate: this.state.certificate,
        intermediate_certificates: this.state.intermediateCertificates
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

  uploadWithDialog() {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.addEventListener('change', (e) => {
      const files = e.target.files
      if (files.length > CERT_MAX_FILE_COUNT) {
        this.showNotification(<FormattedMessage id="portal.security.ssl.uploadRestriction.text"/>)
      } else {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          this.readFile(file)
        }
      }
    });
    input.click();
  }

  uploadWithDropZone(files) {
    if (files.length > CERT_MAX_FILE_COUNT) {
      this.showNotification(<FormattedMessage id="portal.security.ssl.uploadRestriction.text"/>)
    } else {
      files.forEach(file => {
        this.readFile(file)
      })
    }
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

  readFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const fileExtension = this.getFileExtension(file.name)
      const content = e.target.result;
      const isValidCertExtension = ALLOWED_CERT_EXTENSIONS.some(extension => {
        return extension === fileExtension
      })

      if (isValidCertExtension) {
        if (this.state.certificate) {
          if (this.state.intermediateCertificates) {
            this.setState({intermediateCertificates: content})
            this.showNotification(<FormattedMessage id="portal.security.ssl.intermidCertsRewritten.text"/>)
          } else {
            this.setState({intermediateCertificates: content})
          }
        } else {
          this.setState({certificate: content})
        }
      } else if (fileExtension === ALLOWED_CERT_KEY_EXTENSIONS) {
        if (this.state.privateKey) {
          this.setState({privateKey: content})
          this.showNotification(<FormattedMessage id="portal.security.ssl.privateKeyRewritten.text"/>)
        } else {
          this.setState({privateKey: content})
        }
      } else {
        this.showNotification(
          <div>
            <FormattedMessage id="portal.security.ssl.notSupportedFile.text"/><br/>
            <FormattedMessage id="portal.security.ssl.supportedFileTypes.text"/>
          </div>
        )
      }
    }
    reader.readAsText(file);
  }

  getFileExtension(fileName) {
    const nameArr = fileName.split('.')
    return nameArr[nameArr.length-1]
  }

  isAllFilesAdded() {
    const {privateKey, certificate, intermediateCertificates} = this.state
    if (privateKey && certificate && intermediateCertificates) {
      return true
    }
    return false
  }

  showNotification(message) {
    clearTimeout(this.notificationTimeout)
    this.props.changeNotification(message)
    this.notificationTimeout = setTimeout(this.props.changeNotification, 5000)
  }


  render() {
    const { title, formValues, certificateToEdit, cancel, toggleModal, handleSubmit,invalid, submitting } = this.props
    const { privateKey, intermediateCertificates, certificate, showManuallModal} = this.state
    const groupsOptions = this.props.groups.map(group => [
      group.get('id'),
      group.get('name')
    ])
    const certRequiredText = (privateKey && certificate) ? null : <FormattedMessage id="portal.security.ssl.certRequired.text"/>
    const subTitle = !certificateToEdit.isEmpty() && formValues && formValues.title

    return (
      <div>
        <SidePanel show={true} title={title} subTitle={subTitle}>
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
              <Button
                bsStyle="success"
                className="btn-icon"
                onClick={this.uploadWithDialog}
                disabled={this.isAllFilesAdded()}>
                <IconAdd />
              </Button>
              <div className="key-and-certificates-list">
                {privateKey &&
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
                {certificate &&
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
                {intermediateCertificates &&
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

              {!this.isAllFilesAdded() &&
                <Dropzone
                  onDrop={this.uploadWithDropZone}
                  multiple={true}
                  disableClick={true}
                  className="upload-dropzone"
                  activeClassName="upload-dropzone-active">
                  <FormattedMessage id="portal.common.dropFilesHere.text"/>
                  {certRequiredText}
                </Dropzone>
              }

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
                  disabled={invalid || submitting || !certificate || !privateKey}>
                  {submitting ? <FormattedMessage id='portal.common.button.saving' />
                              : <FormattedMessage id='portal.common.button.save' />
                  }
                </Button>
              </FormFooterButtons>
            </form>
        </SidePanel>

        {showManuallModal &&
          <SidePanel show={true} title={title} subTitle={subTitle}>
            <CertificateForm
              submitting={submitting}
              invalid={invalid}
              groupsOptions={groupsOptions}
              certificateToEdit={certificateToEdit}
              onSubmit={handleSubmit(values => this.handleManualAdding(values))}
              onCancel={this.toggleManuallModal} />
          </SidePanel>
        }
      </div>
    )
  }
}


CertificateFormContainer.displayName = "CertificateFormContainer"
CertificateFormContainer.propTypes = {
  ...reduxFormPropTypes,
  accounts: PropTypes.instanceOf(List),
  activeAccount: PropTypes.string,
  cancel: PropTypes.func,
  certificateToEdit: PropTypes.instanceOf(Map),
  changeNotification: PropTypes.func,
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
  const uiActions = bindActionCreators(uiActionCreators, dispatch)

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
    },
    changeNotification: uiActions.changeSidePanelNotification
  }
}

const form = reduxForm({
  form: 'certificateForm',
  validate
})(CertificateFormContainer)

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(form))
