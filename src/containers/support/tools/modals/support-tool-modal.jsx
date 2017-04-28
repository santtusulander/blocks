import React from 'react'
import { Button, ButtonToolbar, Modal } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

const SupportToolModal = ({ children, handleCloseModal, header }) => {
  return (
    <Modal dialogClassName="account-form-sidebar configuration-sidebar" show={true}>
      <Modal.Header>
        {header}
      </Modal.Header>

      <Modal.Body>
        {children}
        <ButtonToolbar className="text-right extra-margin-top">
          <Button bsStyle="primary" onClick={handleCloseModal}>
            <FormattedMessage id="portal.button.close" />
          </Button>
        </ButtonToolbar>
      </Modal.Body>
    </Modal>
  )
}

SupportToolModal.displayName = 'SupportToolModal'
SupportToolModal.propTypes = {
  children: React.PropTypes.node,
  handleCloseModal: React.PropTypes.func,
  header: React.PropTypes.node
}

export default SupportToolModal
