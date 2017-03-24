import React, { PropTypes } from 'react'
import { Button, ButtonToolbar, Modal } from 'react-bootstrap'
import { FormattedMessage, injectIntl } from 'react-intl'
import { reduxForm, Field, propTypes as reduxFormPropTypes } from 'redux-form'
import classnames from 'classnames'

import DefaultErrorBlock from './form/default-error-block'
import FieldFormGroup from './form/field-form-group'
import keyStrokeSupport from '../decorators/key-stroke-decorator'
import IconClose from './icons/icon-close.jsx'

class ModalWindow extends React.Component {

  componentDidMount() {
    this.props.verifyDelete && this.deleteInput.focus()
  }

  render() {
    const {
      auxiliaryButton,
      auxiliaryButtonHandler,
      auxiliaryButtonText,
      cancel,
      cancelButton,
      children,
      className,
      closeButton,
      closeButtonSecondary,
      closeModal,
      content,
      continueButton,
      deleteButton,
      error,
      handleSubmit,
      intl,
      invalid,
      loading,
      loginButton,
      okButton,
      onSubmit,
      reloadButton,
      stayButton,
      submitButton,
      submitting,
      title,
      verifyDelete
    } = this.props

    return (
      <Modal show={true} dialogClassName={classnames('modal-window', className)}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header>
            <h1>{title}</h1>
          </Modal.Header>

          <Modal.Body>
            {error && <DefaultErrorBlock error={error}/>}
            {children}
            {content &&
              <p>{content}</p>
            }
            {verifyDelete &&
              <Field
                label={<FormattedMessage id="portal.deleteModal.validation.label" />}
                name="modalField"
                required={false}
                inputRef={ref => this.deleteInput = ref}
                placeholder={intl.formatMessage({id: 'portal.deleteModal.validation.placeholder'})}
                component={FieldFormGroup}/>
            }
          </Modal.Body>

          <Modal.Footer>
            <ButtonToolbar className="pull-right modal-button-toolbar">
              {closeButton &&
              <Button
                bsStyle="primary"
                onClick={cancel}>
                <FormattedMessage id="portal.button.close"/>
              </Button>}

              {submitButton &&
              <Button
                autoFocus={!verifyDelete}
                bsStyle="primary"
                type="submit">
                <FormattedMessage id="portal.button.submt"/>
              </Button>}

              {stayButton &&
              <Button
                className="btn-secondary"
                onClick={cancel}>
                <FormattedMessage id="portal.button.stay"/>
              </Button>}

              {continueButton &&
              <Button
                autoFocus={!verifyDelete}
                bsStyle="primary"
                type="submit">
                <FormattedMessage id="portal.button.continue"/>
              </Button>}

              {cancelButton &&
              <Button
                className="btn-secondary"
                onClick={cancel}>
                <FormattedMessage id="portal.button.cancel"/>
              </Button>}

              {deleteButton &&
              <Button
                autoFocus={!verifyDelete}
                bsStyle="danger"
                type="submit"
                disabled={submitting || loading || (verifyDelete ? invalid : false)}>
                {loading ? <FormattedMessage id='portal.common.button.deleting' /> : <FormattedMessage id="portal.button.delete"/>}
              </Button>}

              {okButton &&
              <Button
                bsStyle="primary"
                onClick={cancel}>
                <FormattedMessage id="portal.button.ok"/>
              </Button>}

              {loginButton &&
              <a href="/login">
                <Button bsStyle="primary">
                  <FormattedMessage id='portal.common.error.tokenExpire.button'/>
                </Button>
              </a>}

              {closeButtonSecondary &&
              <Button
                className="btn-secondary"
                onClick={cancel}>
                <FormattedMessage id="portal.button.close"/>
              </Button>}

              {reloadButton &&
              <Button
                autoFocus={!verifyDelete}
                bsStyle="primary"
                type="submit">
                <FormattedMessage id="portal.button.reload"/>
              </Button>}

              {auxiliaryButton &&
              <Button
                className="btn-secondary pull-left"
                onClick={auxiliaryButtonHandler}
                >
                {auxiliaryButtonText}
              </Button>}
            </ButtonToolbar>
          </Modal.Footer>
        </form>

        {closeModal &&
        <a
          className="close-modal"
          onClick={cancel}>
          <IconClose />
        </a>}
      </Modal>
    );
  }
}

ModalWindow.displayName = 'ModalWindow'
ModalWindow.propTypes = {
  auxiliaryButton: PropTypes.bool,
  auxiliaryButtonHandler: PropTypes.func,
  auxiliaryButtonText: PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.node
  ]),
  cancel: PropTypes.func,
  cancelButton: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  closeButton: PropTypes.bool,
  closeButtonSecondary: PropTypes.bool,
  closeModal: PropTypes.bool,
  content: PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.object
  ]),
  continueButton: PropTypes.bool,
  deleteButton: PropTypes.bool,
  intl: React.PropTypes.object,
  invalid: PropTypes.bool,
  loading: PropTypes.bool,
  loginButton: PropTypes.bool,
  okButton: PropTypes.bool,
  onSubmit: PropTypes.func,
  reloadButton: PropTypes.bool,
  stayButton: PropTypes.bool,
  submitButton: PropTypes.bool,
  title: PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.node
  ]),
  verifyDelete: PropTypes.bool,
  ...reduxFormPropTypes
}

ModalWindow.defaultProps = { onSubmit() {} }

export default reduxForm({
  form: 'ModalWindow',
  validate: ({ modalField }) => {
    if (!modalField || modalField.toLowerCase() !== 'delete') {
      return { modalField: true }
    }
  }
})(keyStrokeSupport(injectIntl(ModalWindow)))
