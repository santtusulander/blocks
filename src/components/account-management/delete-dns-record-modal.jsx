import React, { PropTypes } from 'react'
import { Button, ButtonToolbar, Modal } from 'react-bootstrap'

import keyStrokeSupport from '../../decorators/key-stroke-decorator'
import { FormattedMessage } from 'react-intl'

const DeleteDnsRecordModal = ({ itemToDelete, submit, cancel }) =>
  <Modal show={true}>
    <Modal.Header>
      <h1><FormattedMessage id="portal.dnsRecord.delete.title"/></h1>
    </Modal.Header>
    <Modal.Body>
      <p>
        <FormattedMessage id="portal.dnsRecord.delete.disclaimer.text" values={{itemToDelete: itemToDelete}}/>
      </p>
    </Modal.Body>
    <Modal.Footer>
      <ButtonToolbar className="pull-right">
        <Button onClick={cancel} className="btn-secondary">
          <FormattedMessage id="portal.button.cancel"/>
        </Button>
        <Button onClick={submit}
                type="submit"
                bsStyle="danger">
          <FormattedMessage id="portal.button.delete"/>
        </Button>
      </ButtonToolbar>
    </Modal.Footer>
  </Modal>

DeleteDnsRecordModal.propTypes = {
  cancel: PropTypes.func,
  fields: PropTypes.object,
  itemToDelete: PropTypes.string,
  submit: PropTypes.func
}

export default keyStrokeSupport(DeleteDnsRecordModal)
