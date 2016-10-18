import React from 'react'
import { Input, Button, ButtonToolbar, Modal } from 'react-bootstrap'
import Immutable from 'immutable'
import {FormattedMessage} from 'react-intl'
import Typeahead from 'react-bootstrap-typeahead'

import SelectWrapper from '../../../components/select-wrapper'
import country_list from '../../../constants/country-list'

class ContentTargeting extends React.Component {
  constructor(props) {
    super(props)

    this.state = this.stateFromProps(props)

    this.handleCountryChange = this.handleCountryChange.bind(this)
    this.handleTypeChange = this.handleTypeChange.bind(this)
    this.handleInclusionChange = this.handleInclusionChange.bind(this)
    this.handleRedirectURLChange = this.handleRedirectURLChange.bind(this)
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
    const type = this.getTypeFromStatusCode(props.set.getIn(['response', 'code']))
    const status_code = props.set.getIn(['response', 'code'])
    const redirectURL = props.set.getIn(['response', 'headers', 'Location'])

    return { inclusion, countries, type, status_code, redirectURL }
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
      this.setState({
        countries
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
      this.setState({
        redirectURL: e.target.value
      })
    }
  }
  saveChanges() {
    const countries = this.state.countries.map(country => country.id)
    const updatedSet = Immutable.fromJS({
      in: this.state.inclusion === 'in' ? countries : undefined,
      not_in: this.state.inclusion === 'not_in' ? countries : undefined,
      response: {
        code: this.state.status_code,
        headers: this.state.type === 'redirect' ? { Location: this.state.redirectURL } : undefined
      }
    })
    this.props.changeValue(
      this.props.path,
      updatedSet
    )
    this.props.close()
  }
  render() {
    return (
      <div>
        <Modal.Header>
          <h1>Content Targeting</h1>
          <p>Define content targeting action.</p>
        </Modal.Header>
        <Modal.Body>

          <div className="form-group">
            <label className="control-label">Action</label>
            <SelectWrapper
              className="input-select"
              onChange={this.handleTypeChange()}
              value={this.state.type}
              options={[
                ['allow', 'Allow'],
                ['redirect', 'Redirect'],
                ['deny', 'Deny']
              ]}/>
          </div>

          <div className="form-group">
            <SelectWrapper
              className="input-select"
              onChange={this.handleInclusionChange()}
              value={this.state.inclusion}
              options={[
                ['in', 'Users from'],
                ['not_in', 'Users NOT from']
              ]}/>
          </div>

          <div className="form-group">
            <Typeahead
              className={this.state.type === 'deny' ? 'exclude' : null}
              multiple={true}
              selected={this.state.countries}
              onChange={this.handleCountryChange()}
              options={country_list}/>
          </div>

          {this.state.type === 'redirect' && // REDIRECT FORM
            <div>
              <p>to</p>

              <div className="form-group">
                <Input type="text"
                  placeholder="Enter URL"
                  onChange={this.handleRedirectURLChange()}
                  value={this.state.redirectURL} />
              </div>
            </div>
          }

          {this.state.type === 'deny' && // DENY FORM
            <div>
              <p>and present</p>

              <div className="form-group">
                <SelectWrapper
                  className="input-select"
                  onChange={() => null}
                  value={this.state.status_code}
                  options={[
                    [401, '401'],
                    [403, '403'],
                    [404, '404']
                  ]}/>
              </div>
            </div>
          }

          <ButtonToolbar className="text-right">
            <Button bsStyle="default" id="close-button" onClick={this.props.close}>
              <FormattedMessage id="portal.button.cancel"/>
            </Button>
            <Button bsStyle="primary" id="save-button" onClick={this.saveChanges}>
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
  path: React.PropTypes.instanceOf(Immutable.List),
  set: React.PropTypes.instanceOf(Immutable.Map)
}

export default ContentTargeting
