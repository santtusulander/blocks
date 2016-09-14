import React, { PropTypes } from 'react'
import { Button, ButtonToolbar, Modal } from 'react-bootstrap'

import keyStrokeSupport from '../../decorators/key-stroke-decorator'
import { FormattedMessage } from 'react-intl'

const DeleteDomainModal = ({ itemToDelete, submit, cancel }) =>
  <Modal show={true} className="delete-modal">
    <Modal.Header className="delete-modal-header">
      <h1><FormattedMessage id="portal.dnsDomain.delete.title"/></h1>
    </Modal.Header>
    <Modal.Body className="delete-modal-body">
      <p>
        <FormattedMessage id="portal.dnsDomain.delete.disclaimer.text"/>
      </p>
    </Modal.Body>
    <Modal.Footer className="delete-modal-footer">
      <ButtonToolbar className="pull-right">
        <Button onClick={cancel} className="btn-outline"><FormattedMessage id="portal.button.cancel"/></Button>
        <Button onClick={submit}
                type="submit"
                bsStyle="secondary"
                className="delete-modal-submit delete-user-submit">
          <FormattedMessage id="portal.button.delete"/>
        </Button>
      </ButtonToolbar>
    </Modal.Footer>
  </Modal>

DeleteDomainModal.propTypes = {
  cancel: PropTypes.func,
  fields: PropTypes.object,
  itemToDelete: PropTypes.string,
  submit: PropTypes.func
}

export default keyStrokeSupport(DeleteDomainModal)
