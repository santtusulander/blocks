import React, { PropTypes } from 'react'
import { ButtonToolbar, Modal } from 'react-bootstrap'

class InfoModal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { title, content, buttons } = this.props

    return (
      <Modal show={this.props.showErrorDialog} className="error-modal" onHide={ this.closeModal }>
        <Modal.Header className="login-header">
          <div className="logo-ericsson">Ericsson</div>
          <h1>{title}</h1>
          <p></p>
          <div className="login-header-gradient"></div>
        </Modal.Header>

        <Modal.Body>
          <p>{content}</p>
        </Modal.Body>

        <Modal.Footer>
          <ButtonToolbar className="pull-right">
            {buttons}
          </ButtonToolbar>
        </Modal.Footer>
      </Modal>
    );
  }
}

InfoModal.displayName = 'InfoModal'
InfoModal.propTypes = {
  uiActions: React.PropTypes.object,
  showInfoDialog: React.PropTypes.bool
}

InfoModal.propTypes = {
  children: PropTypes.array,
  content: PropTypes.string,
  title: PropTypes.string
}

export default InfoModal
