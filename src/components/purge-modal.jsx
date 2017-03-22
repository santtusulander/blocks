import React from 'react'
import Immutable from 'immutable'
import {
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock,
  Radio,
  Checkbox,
  Button,
  Panel } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl'

import Typeahead from './typeahead'
import Select from './select'
import SidePanel from './side-panel'
import FormFooterButtons from './form/form-footer-buttons'
import { isValidEmail, isValidRelativePath } from '../util/validators'

class PurgeModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      purgeObjectsError: '',
      purgeObjectsWarning: '',
      purgeEmailError: '',
      type: '',
      invalid: true
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
    this.parseTypeahead = this.parseTypeahead.bind(this)
  }
  showPurgeOption(type) {
    this.setState({
      purgeObjectsError: '',
      purgeObjectsWarning: '',
      type: type,
      invalid: true
    })
    if (type == 'url' || type == 'directory') {
      this.props.changePurge(this.props.activePurge.delete('published_hosts').set('objects', Immutable.List()).set('published_host_id', this.props.activeHost.get('published_host_id')))
    } else if (type == 'hostname') {
      this.props.changePurge(this.props.activePurge.delete('published_host_id').set('objects', Immutable.List(['/*'])).set('published_hosts', Immutable.List()))
    } else if (type == 'group') {
      this.setState({invalid: false})
      this.props.changePurge(this.props.activePurge.delete('published_host_id').set('objects', Immutable.List(['/*'])).set('published_hosts', (this.props.allHosts).toJS()))
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

    this.validatePurgeObjects(e)
  }
  parseTypeahead(e) {
    const parsedTypeahead = e.map(val => val.label)
    parsedTypeahead.length ? this.setState({invalid: false}) : this.setState({invalid: true})
    this.props.changePurge(this.props.activePurge.set('published_hosts', Immutable.List(parsedTypeahead)))
  }
  validatePurgeObjects(e) {
    const value = e.target.value
    this.setState({invalid: false})

    if(!value) {
      this.setState({
        purgeObjectsError: <FormattedMessage id="portal.analytics.purgeModal.minAmount.error"/>
      })
      return true
    }

    if(this.state.type === 'url' || this.state.type === 'directory' ) {
      const values = value.split(',').map(val => val.trim().replace(/\r?\n|\r/g, ''))
      const errors = values.filter(val => {
        return !isValidRelativePath(val)
      })

      if(errors.length){
        const errorList = errors.join(', ')
        this.setState({
          purgeObjectsError: this.state.type === 'url' ?
           <FormattedMessage id="portal.analytics.purgeModal.invalidate.urls" values={{ errors: errorList}} /> :
          <FormattedMessage id="portal.analytics.purgeModal.invalidate.directories" values={{ errors: errorList}} />
        })
        return true
      }
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
    help = this.state.purgeObjectsError || this.state.purgeObjectsWarning || help

    return (
      <div>
        <FormGroup
          controlId="purge__objects"
          validationState={this.state.purgeObjectsError ? 'error' : null}
        >
          <ControlLabel>{title}</ControlLabel>
          <HelpBlock className="pull-right">{help}</HelpBlock>
          <FormControl
            componentClass="textarea"
            placeholder={placeholder}
            value={this.props.activePurge.get('objects').join(',\n')}
            onChange={this.parsePurgeObjects}
          />
        </FormGroup>
        <hr/>
      </div>
    )
  }
  render() {
    const showPropertySelect = this.props.availableProperties && this.props.changeProperty
    const allHosts = this.props.allHosts
    const hostnamesArray = !allHosts ?
    [] :
    allHosts.map(host => {
      return {
        id: host.get('published_host_id'),
        label: host.get('published_host_id')
      }
    }).toJS();

    const title = <FormattedMessage id="portal.analytics.purgeModal.title.text"/>

    return (
      <SidePanel show={true} className="purge-modal" title={title} cancel={this.props.hideAction}>
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

            {this.state.type &&
            <div>
              {this.state.type === 'url' && <this.purgeObjInput
                title={this.props.intl.formatMessage({id: 'portal.analytics.purgeModal.url.title'})}
                help={this.props.intl.formatMessage({id: 'portal.analytics.purgeModal.url.help'})}
                placeholder={this.props.intl.formatMessage({id: 'portal.analytics.purgeModal.url.placeholder'})}/>}

              {this.state.type === 'directory' && <this.purgeObjInput
                title={this.props.intl.formatMessage({id: 'portal.analytics.purgeModal.directory.title'})}
                help={this.props.intl.formatMessage({id: 'portal.analytics.purgeModal.directory.help'})}
                placeholder={this.props.intl.formatMessage({id: 'portal.analytics.purgeModal.directory.placeholder'})}/>}

              {this.state.type === 'hostname' &&
              <div>
                <h3><FormattedMessage id="portal.analytics.purgeModal.hostname.title"/></h3>
                <Typeahead
                  multiple={true}
                  options={hostnamesArray}
                  onChange={this.parseTypeahead}/>
                <hr/>
              </div>}

              {/* SECTION - Content Removal Method */}
              <FormGroup>
                <ControlLabel><FormattedMessage id="portal.analytics.purgeModal.invalidate.section.title"/></ControlLabel>

                {/* Invalidate content on platform */}
                <Radio
                  id="purge__content-removal-method-invalidate"
                  value="invalidate"
                  checked={this.props.activePurge.get('action') === 'invalidate'}
                  onChange={this.change(['action'])}
                ><FormattedMessage id="portal.analytics.purgeModal.invalidate.label" /></Radio>

                {/* Delete content from platform */}
                <Radio
                  id="purge__content-removal-method-delete"
                  value="purge"
                  checked={this.props.activePurge.get('action') === 'purge'}
                  onChange={this.change(['action'])}
                ><FormattedMessage id="portal.analytics.purgeModal.delete.label" /></Radio>

              </FormGroup>

              <hr/>

              {/* SECTION - Notification */}
              <FormGroup controlId="purge__notification">
                <ControlLabel><FormattedMessage id="portal.analytics.purgeModal.notification.section.title"/></ControlLabel>
                <Checkbox
                  checked={!!this.props.activePurge.get('feedback')}
                  onChange={this.toggleNotification}
                ><FormattedMessage id="portal.analytics.purgeModal.notification.label" /></Checkbox>
              </FormGroup>

              {/* Email Address */}
              <Panel className="form-panel" collapsible={true}
                expanded={!!this.props.activePurge.get('feedback')}>
                <FormGroup controlId="purge__email">
                  {this.state.purgeEmailError &&
                    <HelpBlock>{this.state.purgeEmailError}</HelpBlock>
                  }
                  <FormControl
                    placeholder={this.props.intl.formatMessage({id: 'portal.analytics.purgeModal.email.label'})}
                    value={this.props.activePurge.getIn(['feedback','email'], "")}
                    onChange={this.change(['feedback','email'])}
                  />
                </FormGroup>
              </Panel>

              <hr/>

              {/* SECTION - Note */}
              <FormGroup controlId="purge__note">
                <ControlLabel><FormattedMessage id="portal.analytics.purgeModal.note.section.title"/></ControlLabel>
                <FormControl
                  componentClass="textarea"
                  placeholder={this.props.intl.formatMessage({id: 'portal.analytics.purgeModal.note.placeholder'})}
                  value={this.props.activePurge.get('note')}
                  onChange={this.change(['note'])}
                />
              </FormGroup>
            </div>}

            {/* Action buttons */}
            <FormFooterButtons>
              <Button
                className="btn-secondary"
                onClick={this.props.hideAction}>
                <FormattedMessage id="portal.button.cancel"/>
              </Button>

              <Button
                type="submit"
                bsStyle="primary"
                disabled={this.state.invalid || this.state.purgeObjectsError || this.state.purgeEmailError ? true : false}>
                <FormattedMessage id="portal.analytics.purgeModal.button.purge.text"/>
              </Button>
            </FormFooterButtons>
          </form>
        }
      </SidePanel>
    );
  }
}

PurgeModal.displayName = 'PurgeModal'
PurgeModal.propTypes = {
  activeHost: React.PropTypes.instanceOf(Immutable.Map),
  activeProperty: React.PropTypes.string,
  activePurge: React.PropTypes.instanceOf(Immutable.Map),
  allHosts: React.PropTypes.instanceOf(Immutable.List),
  availableProperties: React.PropTypes.instanceOf(Immutable.List),
  changeProperty: React.PropTypes.func,
  changePurge: React.PropTypes.func,
  hideAction: React.PropTypes.func,
  intl: React.PropTypes.object,
  savePurge: React.PropTypes.func
}

export default injectIntl(PurgeModal)
