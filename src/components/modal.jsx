import React, { PropTypes } from 'react'
import { Button, ButtonToolbar, Input, Modal } from 'react-bootstrap'
import { FormattedMessage, injectIntl } from 'react-intl'
import { reduxForm } from 'redux-form'

import keyStrokeSupport from '../decorators/key-stroke-decorator'
import IconClose from './icons/icon-close.jsx'

class ModalWindow extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { cancelButton, children, closeButton, closeModal, content, continueButton, deleteButton, fields: { modalField }, intl, invalid, show, stayButton, submitButton, title, verifyDelete } = this.props

    return (
      <Modal show={show} dialogClassName="modal-window">
        <Modal.Header>
          <h1>{title}</h1>
        </Modal.Header>

        <Modal.Body>
          {children}
          {content &&
          <p>{content}</p>}
          {verifyDelete &&
          <Input
            type="text"
            label={intl.formatMessage({id: 'portal.deleteModal.validation.label'})}
            placeholder={intl.formatMessage({id: 'portal.deleteModal.validation.placeholder'})}
            {...modalField} />
          }
        </Modal.Body>

        <Modal.Footer>
          <ButtonToolbar className="pull-right">
            {closeButton &&
            <Button
              className="btn-primary"
              onClick={closeButton}>
              <FormattedMessage id="portal.button.close"/>
            </Button>}

            {submitButton &&
            <Button
              className="btn-primary"
              onClick={submitButton}>
              <FormattedMessage id="portal.button.submt"/>
            </Button>}

            {stayButton &&
            <Button
              className="btn-secondary"
              onClick={stayButton}>
              <FormattedMessage id="portal.button.stay"/>
            </Button>}

            {continueButton &&
            <Button
              className="btn-primary"
              onClick={continueButton}>
              <FormattedMessage id="portal.button.continue"/>
            </Button>}

            {cancelButton &&
            <Button
              className="btn-secondary"
              onClick={cancelButton}>
              <FormattedMessage id="portal.button.cancel"/>
            </Button>}

            {deleteButton &&
            <Button
              bsStyle="danger"
              onClick={deleteButton}
              disabled={verifyDelete ? invalid : false}>
              <FormattedMessage id="portal.button.delete"/>
            </Button>}
          </ButtonToolbar>
        </Modal.Footer>

        {closeModal &&
        <a
          className="close-modal"
          onClick={closeModal}>
          <IconClose />
        </a>}
      </Modal>
    );
  }
}

ModalWindow.displayName = 'ModalWindow'
ModalWindow.propTypes = {
  cancelButton: PropTypes.func,
  children: PropTypes.node,
  closeButton: PropTypes.func,
  closeModal: PropTypes.func,
  content: PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.object
  ]),
  continueButton: PropTypes.func,
  deleteButton: PropTypes.func,
  fields: PropTypes.object,
  intl: React.PropTypes.object,
  invalid: PropTypes.bool,
  show: PropTypes.bool,
  stayButton: PropTypes.func,
  submitButton: PropTypes.func,
  title: PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.node
  ]),
  verifyDelete: PropTypes.bool
}

export default reduxForm({
  fields: ['modalField'],
  form: 'ModalWindow',
  validate: ({ modalField }) => {
    if (!modalField || modalField.toLowerCase() !== 'delete') {
      return { modalField: true }
    }
  }
})(keyStrokeSupport(injectIntl(ModalWindow)))
