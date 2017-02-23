import React from 'react'
import { Button, ButtonToolbar, ControlLabel, FormControl, FormGroup, Modal } from 'react-bootstrap'
import Immutable from 'immutable'
import { FormattedMessage, injectIntl } from 'react-intl'

import Select from '../../../components/select'
import country_list from '../../../constants/country-list'
import * as StatusCodes from '../../../util/status-codes'
import Typeahead from '../../../components/typeahead'

class ContentTargeting extends React.Component {
  constructor(props) {
    super(props)

    this.state = this.stateFromProps(props)

    this.handleCountryChange = this.handleCountryChange.bind(this)
    this.handleTypeChange = this.handleTypeChange.bind(this)
    this.handleInclusionChange = this.handleInclusionChange.bind(this)
    this.handleRedirectURLChange = this.handleRedirectURLChange.bind(this)
    this.handleStatusCodeChange = this.handleStatusCodeChange.bind(this)
    this.disableSaveButton = this.disableSaveButton.bind(this)
    this.saveChanges = this.saveChanges.bind(this)
  }
  componentWillReceiveProps(nextProps) {
    if (!Immutable.is(nextProps.set, this.props.set)) {
      this.setState(this.stateFromProps(nextProps))
    }
  }
  stateFromProps(props) {
    const inclusion = props.set.keySeq().toArray().filter(key => key !== 'response')[0]
    const countryCodes = props.set.get(inclusion)
    const countries = countryCodes.map(countryCode => country_list.find(country => country.id === countryCode))
    const countryOptions = country_list.filter(country => countries.indexOf(country) < 0)
    const type = this.getTypeFromStatusCode(props.set.getIn(['response', 'code']))
    const status_code = props.set.getIn(['response', 'code'])
    const redirectURL = props.set.getIn(['response', 'headers', 'Location'])

    return { inclusion, countries, countryOptions, type, status_code, redirectURL }
  }
  getTypeFromStatusCode(status_code) {
    if (status_code >= 200 && status_code <= 299) {
      return 'allow'
    } else if (status_code >= 300 && status_code <= 399) {
      return 'redirect'
    } else if (status_code >= 400 && status_code <= 499) {
      return 'deny'
    }

    return null
  }
  defaultStatusCodeForType(type) {
    switch (type) {
      case 'deny':
        return 401
      case 'redirect':
        return 302
      case 'allow':
      default:
        return 200
    }
  }
  handleCountryChange() {
    return countries => {
      const countryOptions = country_list.filter(country => countries.indexOf(country) < 0)
      this.setState({
        countries,
        countryOptions
      })
    }
  }
  handleTypeChange() {
    return type => {
      const status_code = this.defaultStatusCodeForType(type)
      const redirectURL = type === 'redirect' ? "" : undefined
      this.setState({
        type,
        status_code,
        redirectURL
      })
    }
  }
  handleInclusionChange() {
    return inclusion => {
      this.setState({
        inclusion
      })
    }
  }
  handleRedirectURLChange() {
    return e => {
      const redirectURL = e.target.value === "" ? null : e.target.value
      this.setState({
        redirectURL
      })
    }
  }
  handleStatusCodeChange() {
    return status_code => {
      this.setState({
        status_code
      })
    }
  }
  disableSaveButton() {
    return this.state.countries.count() === 0
            || (this.state.type === 'redirect' && !this.state.redirectURL)
  }
  saveChanges() {
    const countries = this.state.countries.map(country => country.id)
    const updatedSet = {
      response: {
        code: this.state.status_code
      }
    }
    updatedSet[this.state.inclusion] = countries
    if (this.state.type === 'redirect') {
      updatedSet.response.headers = { Location: this.state.redirectURL }
    }
    this.props.changeValue(
      this.props.path,
      Immutable.fromJS(updatedSet)
    )
    this.props.close()
  }
  render() {
    const statusCodeOptions = StatusCodes
                                .getPickedResponseCodes([401, 403, 404], false)
                                .map(code => { return { value: code.code, label: code.message } })

    return (
      <div>
        <Modal.Header>
          <h1><FormattedMessage id="portal.policy.edit.policies.matchContentTargeting.title.text"/></h1>
          <p><FormattedMessage id="portal.policy.edit.policies.matchContentTargeting.description.text"/></p>
        </Modal.Header>
        <Modal.Body>

          <FormGroup>
            <ControlLabel>
              <FormattedMessage id="portal.policy.edit.policies.matchContentTargeting.action.text"/>
            </ControlLabel>
            <Select
              className="input-select"
              onSelect={this.handleTypeChange()}
              value={this.state.type}
              options={[
                {value: 'allow', label: this.props.intl.formatMessage({id: 'portal.policy.edit.policies.matchContentTargeting.action.allow'})},
                {value: 'redirect', label: this.props.intl.formatMessage({id: 'portal.policy.edit.policies.matchContentTargeting.action.redirect'})},
                {value: 'deny', label: this.props.intl.formatMessage({id: 'portal.policy.edit.policies.matchContentTargeting.action.deny'})}
              ]}/>
          </FormGroup>

          <FormGroup>
            <Select
              className="input-select"
              onSelect={this.handleInclusionChange()}
              value={this.state.inclusion}
              options={[
                {value: 'in', label: this.props.intl.formatMessage({id: 'portal.policy.edit.policies.matchContentTargeting.inclusion.usersFrom'})},
                {value: 'not_in', label: this.props.intl.formatMessage({id: 'portal.policy.edit.policies.matchContentTargeting.inclusion.usersNotFrom'})}
              ]}/>
          </FormGroup>

          <FormGroup>
            <Typeahead
              className={this.state.type === 'deny' ? 'exclude' : null}
              multiple={true}
              selected={this.state.countries}
              onChange={this.handleCountryChange()}
              options={this.state.countryOptions}/>
          </FormGroup>

          {this.state.type === 'redirect' && // REDIRECT FORM
            <div>
              <p><FormattedMessage id="portal.policy.edit.policies.matchContentTargeting.redirect.to.text"/></p>

              <FormGroup>
                <FormControl
                  placeholder="Enter URL"
                  onChange={this.handleRedirectURLChange()}
                  value={this.state.redirectURL} />
              </FormGroup>
            </div>
          }

          {this.state.type === 'deny' && // DENY FORM
            <div>
              <p><FormattedMessage id="portal.policy.edit.policies.matchContentTargeting.redirect.andPresent.text"/></p>

              <FormGroup>
                <Select
                  className="input-select"
                  onSelect={this.handleStatusCodeChange()}
                  numericValues={true}
                  value={this.state.status_code}
                  options={statusCodeOptions}/>
              </FormGroup>
            </div>
          }

          <ButtonToolbar className="text-right">
            <Button className="btn-secondary" id="close-button" onClick={this.props.close}>
              <FormattedMessage id="portal.button.cancel"/>
            </Button>
            <Button
              bsStyle="primary"
              id="save-button"
              disabled={this.disableSaveButton()}
              onClick={this.saveChanges}>
              <FormattedMessage id="portal.button.saveAction"/>
            </Button>
          </ButtonToolbar>

        </Modal.Body>
      </div>
    )
  }
}

ContentTargeting.displayName = 'ContentTargetingAction'
ContentTargeting.propTypes = {
  changeValue: React.PropTypes.func,
  close: React.PropTypes.func,
  intl: React.PropTypes.object,
  path: React.PropTypes.instanceOf(Immutable.List),
  set: React.PropTypes.instanceOf(Immutable.Map)
}

export default injectIntl(ContentTargeting)
