import React from 'react'
import { Button, ButtonToolbar, Modal } from 'react-bootstrap'

import { FormattedMessage } from 'react-intl'

class ErrorModal extends React.Component {
  constructor(props) {
    super(props);

    this.reloadPage = this.reloadPage.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  reloadPage() {
    location.reload(true);
  }

  closeModal() {
    this.props.uiActions.hideErrorDialog();
  }

  render() {
    return (
      <Modal show={this.props.showErrorDialog} onHide={ this.closeModal }>
        <Modal.Header className="login-header">
          <h1><FormattedMessage id="portal.errorModal.errorOccured.text"/></h1>
        </Modal.Header>

        <Modal.Body>
          <p><FormattedMessage id="portal.errorModal.reloadNote.text"/></p>
        </Modal.Body>

        <Modal.Footer>
          <ButtonToolbar className="pull-right">
            <Button onClick={ this.closeModal } className="btn-secondary"><FormattedMessage id="portal.button.close"/></Button>
            <Button onClick={ this.reloadPage } bsStyle="primary"><FormattedMessage id="portal.button.reload"/></Button>
          </ButtonToolbar>
        </Modal.Footer>
      </Modal>
    );
  }
}

ErrorModal.displayName = 'ErrorModal'
ErrorModal.propTypes = {
  uiActions: React.PropTypes.object,
  showErrorDialog: React.PropTypes.bool
}

module.exports = ErrorModal
