import React from 'react'
import Immutable from 'immutable'
import { Modal, Input, Button, ButtonToolbar, Panel, Row, Col } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl'

import Select from './select'
import { isValidEmail } from '../util/validators'

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
    this.showPurgeOption = this.showPurgeOption.bind(this)
    this.change = this.change.bind(this)
    this.parsePurgeObjects = this.parsePurgeObjects.bind(this)
    this.submitForm = this.submitForm.bind(this)
    this.toggleNotification = this.toggleNotification.bind(this)
    this.validateEmail = this.validateEmail.bind(this)
    this.validatePurgeObjects = this.validatePurgeObjects.bind(this)
    this.purgeObjInput = this.purgeObjInput.bind(this)
  }
  showPurgeOption(type) {
    this.setState({type: type})

    if (type == 'url' || type == 'directory') {
      this.props.changePurge(this.props.activePurge.set('published_host_id', this.props.activeHost.get('published_host_id')))
    } else {
      this.props.changePurge(this.props.activePurge.delete('published_host_id'))
    }
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
    clearTimeout(this.purgeObjectsValidationTimeout)
    this.purgeObjectsValidationTimeout = setTimeout(() => {
      this.validatePurgeObjects(value)
    }, 1000)
    if(this.state.purgeObjectsWarning === '' && parsedObjs.length > maxObjects) {
      this.setState({
        purgeObjectsWarning: <FormattedMessage id="portal.analytics.purgeModal.maxAmount.error"/>
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
  validatePurgeObjects(value) {
    if(!value) {
      this.setState({
        purgeObjectsError: <FormattedMessage id="portal.analytics.purgeModal.minAmount.error"/>
      })
      return true
    }
  }
  validateEmail() {
    if(this.props.activePurge.get('feedback') &&
      (!this.props.activePurge.getIn(['feedback', 'email']) || !isValidEmail(this.props.activePurge.getIn(['feedback', 'email'])))) {
      this.setState({
        purgeEmailError: <FormattedMessage id="portal.analytics.purgeModal.email.error"/>
      })
      return true
    }
  }
  submitForm(e) {
    e.preventDefault()
    let hasErrors = false;
    hasErrors = this.validatePurgeObjects(this.props.activePurge.get('objects').get('0')) ? true : false
    hasErrors = this.validateEmail() ? true : hasErrors
    if(!hasErrors) {
      this.props.savePurge()
    }
  }
  toggleNotification() {
    if(!this.props.activePurge.get('feedback')) {
      this.props.changePurge(this.props.activePurge.set('feedback', Immutable.Map({email: ''})))
    } else {
      this.props.changePurge(this.props.activePurge.delete('feedback'))
    }
    this.setState({
      purgeEmailError: ''
    })
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
          <h1><FormattedMessage id="portal.analytics.purgeModal.title.text"/></h1>
        </Modal.Header>
        <Modal.Body>
          {this.props.activePurge &&
            <form onSubmit={this.submitForm}>

              {/* SECTION - Property */}
              {showPropertySelect ?
                <div>
                  <h3><FormattedMessage id="portal.analytics.purgeModal.property.text"/></h3>

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
              <h3><FormattedMessage id="portal.analytics.purgeModal.whatDoYouWantToPurge.text"/></h3>
              <Select className="input-select"
                value={this.state.type}
                options={[
                  ['url', this.props.intl.formatMessage({id: 'portal.analytics.purgeModal.whatDoYouWantToPurge.selection.url.text'})],
                  ['directory', this.props.intl.formatMessage({id: 'portal.analytics.purgeModal.whatDoYouWantToPurge.selection.directory.text'})],
                  ['hostname', this.props.intl.formatMessage({id: 'portal.analytics.purgeModal.whatDoYouWantToPurge.selection.hostname.text'})],
                  ['group', this.props.intl.formatMessage({id: 'portal.analytics.purgeModal.whatDoYouWantToPurge.selection.group.text'})]
                ]}
                onSelect={(type) => this.showPurgeOption(type)}/>
              <hr/>

              {this.state.type && this.state.type !== 'hostname'
                && this.state.type !== 'group' && <div>

                {this.state.type === 'url' && <this.purgeObjInput
                  title={this.props.intl.formatMessage({id: 'portal.analytics.purgeModal.url.title'})}
                  help={this.props.intl.formatMessage({id: 'portal.analytics.purgeModal.url.help'})}
                  placeholder={this.props.intl.formatMessage({id: 'portal.analytics.purgeModal.url.placeholder'})}/>}

                {this.state.type === 'directory' && <this.purgeObjInput
                  title={this.props.intl.formatMessage({id: 'portal.analytics.purgeModal.directory.title'})}
                  help={this.props.intl.formatMessage({id: 'portal.analytics.purgeModal.directory.help'})}
                  placeholder={this.props.intl.formatMessage({id: 'portal.analytics.purgeModal.directory.placeholder'})}/>}

                {/* SECTION - Content Removal Method */}
                <h3><FormattedMessage id="portal.analytics.purgeModal.invalidate.section.title"/></h3>

                {/* Invalidate content on platform */}
                <Input type="radio" name="purge__content-removal-method-invalidate"
                  label={this.props.intl.formatMessage({id: 'portal.analytics.purgeModal.invalidate.label'})}
                  value="invalidate"
                  checked={this.props.activePurge.get('action') === 'invalidate'}
                  onChange={this.change(['action'])}/>

                {/* Delete content from platform */}
                <Input type="radio" name="purge__content-removal-method-delete"
                  label={this.props.intl.formatMessage({id: 'portal.analytics.purgeModal.delete.label'})}
                  value="purge"
                  checked={this.props.activePurge.get('action') === 'purge'}
                  onChange={this.change(['action'])}/>
                <hr/>

                {/* SECTION - Notification */}
                <h3><FormattedMessage id="portal.analytics.purgeModal.notification.section.title"/></h3>
                <Input type="checkbox" name="purge__notification"
                  label={this.props.intl.formatMessage({id: 'portal.analytics.purgeModal.notification.label'})}
                  checked={!!this.props.activePurge.get('feedback')}
                  onChange={this.toggleNotification}/>

                {/* Email Address */}
                <Panel className="form-panel" collapsible={true}
                  expanded={!!this.props.activePurge.get('feedback')}>
                  <Input type="text"
                    bsStyle={this.state.purgeEmailError ? 'error' : null}
                    help={this.state.purgeEmailError}
                    placeholder={this.props.intl.formatMessage({id: 'portal.analytics.purgeModal.email.label'})}
                    value={this.props.activePurge.getIn(['feedback','email'])}
                    onChange={this.change(['feedback','email'])}/>
                </Panel>
                <hr/>
                <h3><FormattedMessage id="portal.analytics.purgeModal.note.section.title"/></h3>
                <Input type="textarea" id="purge__note"
                  placeholder={this.props.intl.formatMessage({id: 'portal.analytics.purgeModal.note.placeholder'})}
                  value={this.props.activePurge.get('note')}
                  onChange={this.change(['note'])}/>

                {/* Action buttons */}
                <ButtonToolbar className="text-right">
                  <Button bsStyle="primary" onClick={this.props.hideAction}>
                    <FormattedMessage id="portal.common.button.cancel"/>
                  </Button>
                  <Button type="submit" bsStyle="primary"
                    disabled={this.state.purgeObjectsError || this.state.purgeEmailError
                      ? true : false}>
                    <FormattedMessage id="portal.analytics.purgeModal.button.purge.text"/>
                  </Button>
                </ButtonToolbar>
              </div>}

              {this.state.type === 'hostname' && <div>
                <FormattedMessage id="portal.analytics.purgeModal.hostName.text"/>
              </div>}

              {this.state.type === 'group' && <div>
                <FormattedMessage id="portal.analytics.purgeModal.group.text"/>
              </div>}

            </form>
          }
        </Modal.Body>
      </Modal>
    );
  }
}

PurgeModal.displayName = 'PurgeModal'
PurgeModal.propTypes = {
  activeHost: React.PropTypes.instanceOf(Immutable.Map),
  activeProperty: React.PropTypes.string,
  activePurge: React.PropTypes.instanceOf(Immutable.Map),
  availableProperties: React.PropTypes.instanceOf(Immutable.List),
  changeProperty: React.PropTypes.func,
  changePurge: React.PropTypes.func,
  hideAction: React.PropTypes.func,
  intl: React.PropTypes.object,
  savePurge: React.PropTypes.func,
  showNotification: React.PropTypes.func
}

export default injectIntl(PurgeModal)
