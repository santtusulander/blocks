import React from 'react'
import Immutable from 'immutable'
import { Modal, Input, Button, ButtonToolbar, Panel, Row, Col } from 'react-bootstrap';

import { isValidFQDN } from '../util/helpers'

import Select from './select'

class PurgeModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      purgeObjectsError: '',
      purgeObjectsWarning: '',
      purgeEmailError: '',
      type: ''
    }

    this.emailValidationTimeout = null
    this.purgeObjectsValidationTimeout = null
    this.change = this.change.bind(this)
    this.parsePurgeObjects = this.parsePurgeObjects.bind(this)
    this.submitForm = this.submitForm.bind(this)
    this.toggleNotification = this.toggleNotification.bind(this)
    this.validateEmail = this.validateEmail.bind(this)
    this.validatePurgeObjects = this.validatePurgeObjects.bind(this)
    this.purgeObjInput = this.purgeObjInput.bind(this)
  }
  change(path) {
    return (e) => {
      if(path[1] === 'email') {
        clearTimeout(this.emailValidationTimeout)
        if(this.state.purgeEmailError !== '') {
          this.setState({
            purgeEmailError: ''
          })
        }
        this.emailValidationTimeout = setTimeout(this.validateEmail, 1000)
      }
      this.props.changePurge(this.props.activePurge.setIn(path, e.target.value))
    }
  }
  parsePurgeObjects(e) {
    const maxObjects = 100
    const value = e.target.value
    const parsedObjs = value.split(',').map(val => val.trim())
    if(this.state.purgeObjectsError !== '') {
      this.setState({
        purgeObjectsError: ''
      })
    }
    if(this.state.purgeObjectsWarning === '' && parsedObjs.length > maxObjects) {
      this.setState({
        purgeObjectsWarning: 'Maximum amount of purge objects exceeded'
      })
    } else if (this.state.purgeObjectsWarning !== '' && parsedObjs.length <= maxObjects) {
      this.setState({
        purgeObjectsWarning: ''
      })
    }
    if(parsedObjs.length <= maxObjects) {
      this.props.changePurge(
        this.props.activePurge.set('objects', Immutable.List(parsedObjs))
      )
    }
  }
  validatePurgeObjects(e) {
    const value = e.target.value
    const values = value.split(',').map(val => val.trim().replace(/\r?\n|\r/g, ''))
    if(!value) {
      this.setState({
        purgeObjectsError: 'Specify at least one purge object'
      })
      return true
    }
    const errors = values.filter(val => {
      return !isValidFQDN(val)
    })

    if(errors.length){
      this.setState({
        purgeObjectsError: `Check url${errors.length > 1 ? 's' : ''} ${errors.join(', ')}`
      })
      return true
    }
  }
  validateEmail() {
    if(this.props.activePurge.get('feedback') &&
      (!this.props.activePurge.getIn(['feedback','email']) ||
      !(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(this.props.activePurge.getIn(['feedback','email'])))) {
      this.setState({
        purgeEmailError: 'Enter a valid Email address'
      })
      return true
    }
  }
  submitForm(e) {
    e.preventDefault()
    let hasErrors = false;
    hasErrors = this.validateEmail() ? true : hasErrors
    if(!hasErrors) {
      this.props.savePurge()
    }
  }
  toggleNotification() {
    let feedback = null
    if(!this.props.activePurge.get('feedback')) {
      feedback = Immutable.Map({email: ''})
    }
    this.setState({
      purgeEmailError: ''
    })
    this.props.changePurge(this.props.activePurge.set('feedback', feedback))
  }
  purgeObjInput({title, help, placeholder}) {
    return (
      <div>
        <Row>
          <Col sm={6}>
            <h3>{title}</h3>
          </Col>
          <Col sm={6} className="text-right">{help}</Col>
        </Row>
        <Input type="textarea" id="purge__objects"
          bsStyle={this.state.purgeObjectsError ? 'error' : 'warning'}
          help={this.state.purgeObjectsError || this.state.purgeObjectsWarning}
          placeholder={placeholder}
          value={this.props.activePurge.get('objects').join(',\n')}
          onBlur={this.validatePurgeObjects}
          onChange={this.parsePurgeObjects}/>
        <hr/>
      </div>
    )
  }
  render() {
    const showPropertySelect = this.props.availableProperties && this.props.changeProperty
    return (
      <Modal show={true} dialogClassName="purge-modal configuration-sidebar"
        onHide={this.props.hideAction}>
        <Modal.Header>
          <h1>Purge Content</h1>
        </Modal.Header>
        <Modal.Body>
          {this.props.activePurge ?
            <form onSubmit={this.submitForm}>

              {/* SECTION - Property */}
              {showPropertySelect ?
                <div>
                  <h3>Property</h3>

                  {/* If it's possible to change the property, show a list */}
                  <Select className="input-select"
                    value={''+this.props.activeProperty}
                    options={this.props.availableProperties.map(
                      property => [property, property]
                    ).toJS()}
                    onSelect={this.props.changeProperty}/>
                  <hr/>
                </div>
                : ''
              }

              {/* SECTION - What do you want to purge? */}
              <h3>What do you want to purge?</h3>
              <Select className="input-select"
                value={this.state.type}
                options={[
                  ['url', 'URLs'],
                  ['directory', 'Directories'],
                  ['hostname', 'Hostnames'],
                  ['group', 'Entire Group']
                ]}
                onSelect={type => this.setState({type: type})}/>
              <hr/>

              {this.state.type && this.state.type !== 'hostname'
                && this.state.type !== 'group' && <div>

                {this.state.type === 'url' && <this.purgeObjInput
                  title="URLs to Purge"
                  help="Up to 100 urls, separated by comma"
                  placeholder="Enter URLs"/>}

                {this.state.type === 'directory' && <this.purgeObjInput
                  title="Directories to Purge"
                  help="Up to 100 directories, separated by comma"
                  placeholder="Enter directory paths"/>}

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
                <Input type="checkbox" name="purge__notification"
                  label="Notify me when purge is completed"
                  checked={!!this.props.activePurge.get('feedback')}
                  onChange={this.toggleNotification}/>

                {/* Email Address */}
                <Panel className="form-panel" collapsible={true}
                  expanded={!!this.props.activePurge.get('feedback')}>
                  <Input type="text"
                    bsStyle={this.state.purgeEmailError ? 'error' : null}
                    help={this.state.purgeEmailError}
                    placeholder="Enter Email address"
                    value={this.props.activePurge.getIn(['feedback','email'])}
                    onChange={this.change(['feedback','email'])}/>
                </Panel>
                <hr/>
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
                  <Button type="submit" bsStyle="primary"
                    disabled={this.state.purgeObjectsError || this.state.purgeEmailError
                      ? true : false}>
                    Purge
                  </Button>
                </ButtonToolbar>
              </div>}

              {this.state.type === 'hostname' && <div>
                Purge by hostname will be supported in a future version.
              </div>}

              {this.state.type === 'group' && <div>
                Purge entire group will be supported in a future version.
              </div>}

            </form>
            : 'Loading...'
          }
        </Modal.Body>
      </Modal>
    );
  }
}

PurgeModal.displayName = 'PurgeModal'
PurgeModal.propTypes = {
  activeProperty: React.PropTypes.string,
  activePurge: React.PropTypes.instanceOf(Immutable.Map),
  availableProperties: React.PropTypes.instanceOf(Immutable.List),
  changeProperty: React.PropTypes.func,
  changePurge: React.PropTypes.func,
  hideAction: React.PropTypes.func,
  savePurge: React.PropTypes.func,
  showNotification: React.PropTypes.func
}

module.exports = PurgeModal
