import React from 'react'
import { Checkbox, ControlLabel, FormControl, FormGroup, Modal } from 'react-bootstrap'
import Immutable from 'immutable'

import Select from '../../shared/form-elements/select'

import { FormattedMessage, injectIntl } from 'react-intl'

class IpAddress extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeFilter: 'matches'
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
  }
  handleChange(path) {
    return e => {
      this.props.changeValue(path, e.target.value)
    }
  }
  handleSelectChange(path) {
    return value => {
      this.setState({
        activeFilter: value
      })
      this.props.changeValue(path, value)
    }
  }
  render() {
    return (
      <div>
        <Modal.Header>
          <h1><FormattedMessage id="portal.policy.edit.idAddress.header"/></h1>
          <p><FormattedMessage id="portal.policy.edit.idAddress.disclaimer.text"/></p>
        </Modal.Header>
        <Modal.Body>

          <FormGroup>
            <ControlLabel>
              <FormattedMessage id="portal.policy.edit.idAddress.mediaType.text"/>
            </ControlLabel>
            <FormControl
              componentClass="textarea"
              placeholder={this.props.intl.formatMessage({id: 'portal.policy.edit.idAddress.mediaType.disclaimer'})}
              value={this.props.match.get('cases').get(0).get(0)}
              onChange={this.handleChange(
                this.props.path.concat(['cases', 0, 0])
              )}/>
          </FormGroup>

          <FormGroup>
            <ControlLabel>
              <FormattedMessage id="portal.policy.edit.idAddress.includeXforwardedFor.text"/>
            </ControlLabel>
            <Checkbox
              onChange={this.handleChange(
                ['edge_configuration', 'cache_rule', 'matches', 'ip_address_include_x_forwarded_for']
              )}/>
          </FormGroup>

          <Select className="input-select"
            onSelect={this.handleSelectChange(
              ['edge_configuration', 'cache_rule', 'matches', 'ip_address']
            )}
            value={this.state.activeFilter}
            options={[
              ['matches', <FormattedMessage id="portal.policy.edit.idAddress.matches.text"/>],
              ['does_not_match', <FormattedMessage id="portal.policy.edit.idAddress.doesntMatch.text"/>]]}/>

        </Modal.Body>
      </div>
    )
  }
}

IpAddress.displayName = 'IpAddress'
IpAddress.propTypes = {
  changeValue: React.PropTypes.func,
  intl: React.PropTypes.object,
  match: React.PropTypes.instanceOf(Immutable.Map),
  path: React.PropTypes.array
}

module.exports = injectIntl(IpAddress)
