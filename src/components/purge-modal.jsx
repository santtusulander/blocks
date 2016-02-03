import React from 'react'
import { Modal, Input, Button, ButtonToolbar, Row, Col } from 'react-bootstrap';

class PurgeModal extends React.Component {
  render() {
    return (
      <Modal show={true} dialogClassName="purge-modal configuration-sidebar"
        backdrop={false}
        onHide={this.props.hideAction}>
        <Modal.Header>
          <h1>Purge Content</h1>
          <p>Lorem ipsum dolor</p>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={this.submitForm}>

            {/* SECTION - What do you want to purge? */}
            <Row>
              <Col sm={6}>
                <h3>What do you want to purge?</h3>
              </Col>
              <Col sm={6} className="text-right">
                Up to 100 URLs, separated by comma
              </Col>
            </Row>
            <Row>
              <Col sm={3}>
                <Input type="radio" name="purge__content-what-url"
                  label="URL(s)" />
                <Input type="radio" name="purge__content-what-directory"
                  label="A directory" />
              </Col>
              <Col sm={9}>
                <Input type="textarea" id="purge__url"
                  placeholder="http://www.foo.com/logo.gif"/>
                <Input type="text" id="purge__directory"
                  placeholder="/images/*" />
              </Col>
            </Row>

            <hr/>

            {/* SECTION - Content Removal Method */}
            <h3>Content Removal Method</h3>

            {/* Invalidate content on platform */}

            <Input type="radio" name="purge__content-removal-method-invalidate"
              label="Invalidate content" />

            {/* Delete content from platform */}

            <Input type="radio" name="purge__content-removal-method-delete"
              label="Delete content" />

            <hr/>

            {/* SECTION - Notification */}

            <h3>Notification</h3>

            {/* Don't send me any notification upon completion */}

            <Input type="checkbox" name="purge__notification"
              label="Notify me when purge is completed" />

            {/* Email Address */}

            <Input type="text" />

            {/* Action buttons */}

            <ButtonToolbar className="text-right">
              <Button bsStyle="primary" onClick={this.props.hideAction}>
                Cancel
              </Button>
              <Button type="submit" bsStyle="primary">Purge</Button>
            </ButtonToolbar>

          </form>
        </Modal.Body>
      </Modal>
    );
  }
}

PurgeModal.displayName = 'PurgeModal'
PurgeModal.propTypes = {
  hideAction: React.PropTypes.func
}

module.exports = PurgeModal
