import React from 'react'
import { Button, ButtonToolbar, Modal } from 'react-bootstrap'

class ErrorModal extends React.Component {
  constructor(props) {
    super(props);
  }

  reloadPage() {
    location.reload(true);
  }

  closeModal() {
    this.props.uiActions.hideErrorDialog();
  }

  render() {
    console.log('render - props', this.props);

    return (
      <Modal show={this.props.showErrorDialog} className="error-modal" onHide={() => {  this.closeModal(); } }>
        <Modal.Header className="login-header">
          <div className="logo-ericsson">Ericsson</div>
          <h1>An error occured</h1>
          <p>Ericsson UDN Service</p>
          <div className="login-header-gradient"></div>
        </Modal.Header>

        <Modal.Body>
          <p>Note: Reloading may lose all unsaved changes</p>
        </Modal.Body>

        <Modal.Footer>
          <ButtonToolbar className="pull-right">
            <Button onClick={ () => { this.closeModal(); } } bsStyle="primary" >Close</Button>
            <Button onClick={ () => { this.reloadPage(); } } bsStyle="primary" >Reload</Button>
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
