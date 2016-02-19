import React from 'react'
import Immutable from 'immutable'
import { Modal, Input, Button, ButtonToolbar, Row, Col } from 'react-bootstrap';

import Select from './select'

class PurgeModal extends React.Component {
  constructor(props) {
    super(props);

    this.change = this.change.bind(this)
    this.parsePurgeObjects = this.parsePurgeObjects.bind(this)
    this.submitForm = this.submitForm.bind(this)
    this.toggleNotification = this.toggleNotification.bind(this)
  }
  change(path) {
    return (e) => {
      this.props.changePurge(this.props.activePurge.setIn(path, e.target.value))
    }
  }
  parsePurgeObjects(e) {
    const parsedObjs = e.target.value.split(',').map(val => val.trim())
    this.props.changePurge(
      this.props.activePurge.set('objects', Immutable.List(parsedObjs))
    )
  }
  submitForm(e) {
    e.preventDefault()
    this.props.savePurge()
  }
  toggleNotification() {
    let feedback = null
    if(!this.props.activePurge.get('feedback')) {
      feedback = Immutable.Map({email: ''})
    }
    this.props.changePurge(this.props.activePurge.set('feedback', feedback))
  }
  render() {
    const showPropertySelect = this.props.availableProperties && this.props.changeProperty
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

            {/* SECTION - Property */}
            {showPropertySelect ?
              <div>
                <h3>Property</h3>

                {/* If it's possible to change the property, show a list */}
                <Select className="input-select"
                  value={''+this.props.activeProperty}
                  options={this.props.availableProperties.map(
                    (property, i) => [''+i, property.get('property')]
                  ).toJS()}
                  onSelect={this.props.changeProperty}/>

                <hr/>
              </div>
              : ''
            }

            {/* SECTION - What do you want to purge? */}
            <Row>
              <Col sm={6}>
                <h3>What do you want to purge?</h3>
              </Col>
              <Col sm={6} className="text-right">
                Up to 100 URLs, separated by comma
              </Col>
            </Row>
            <Input type="textarea" id="purge__objects"
              placeholder="/images/*"
              value={this.props.activePurge.get('objects').join(',\n')}
              onChange={this.parsePurgeObjects}/>

            <hr/>

            {/* SECTION - Content Removal Method */}
            <h3>Content Removal Method</h3>

            {/* Invalidate content on platform */}

            <Input type="radio" name="purge__content-removal-method-invalidate"
              label="Invalidate content"
              value="invalidate"
              checked={this.props.activePurge.get('action') === 'invalidate'}
              onChange={this.change(['action'])}/>

            {/* Delete content from platform */}

            <Input type="radio" name="purge__content-removal-method-delete"
              label="Delete content"
              value="purge"
              checked={this.props.activePurge.get('action') === 'purge'}
              onChange={this.change(['action'])}/>

            <hr/>

            {/* SECTION - Notification */}

            <h3>Notification</h3>

            {/* Don't send me any notification upon completion */}

            <Input type="checkbox" name="purge__notification"
              label="Notify me when purge is completed"
              checked={!!this.props.activePurge.get('feedback')}
              onChange={this.toggleNotification}/>

            {/* Email Address */}

            <Input type="text"
              className={!this.props.activePurge.get('feedback') ? 'hidden' : ''}
              value={this.props.activePurge.getIn(['feedback','email'])}
              onChange={this.change(['feedback','email'])}/>

            <hr/>

            {/* Note */}
            <h3>Note</h3>

            <Input type="textarea" id="purge__note"
              placeholder="A note about the purge"
              value={this.props.activePurge.get('note')}
              onChange={this.change(['note'])}/>

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
  activeProperty: React.PropTypes.number,
  activePurge: React.PropTypes.instanceOf(Immutable.Map),
  availableProperties: React.PropTypes.instanceOf(Immutable.List),
  changeProperty: React.PropTypes.func,
  changePurge: React.PropTypes.func,
  hideAction: React.PropTypes.func,
  savePurge: React.PropTypes.func
}

module.exports = PurgeModal
