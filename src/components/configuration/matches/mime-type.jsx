import React from 'react'
import { ControlLabel, FormControl, Modal } from 'react-bootstrap'
import Immutable from 'immutable'

import Select from '../../shared/form-elements/select'

import { FormattedMessage, injectIntl } from 'react-intl'

class MimeType extends React.Component {
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
          <h1><FormattedMessage id="portal.policy.edit.mimetype.header"/></h1>
          <p><FormattedMessage id="portal.policy.edit.mimetype.disclaimer"/></p>
        </Modal.Header>
        <Modal.Body>

          <ControlLabel>
            <FormattedMessage id="portal.policy.edit.mimetype.mimetype.text"/>
          </ControlLabel>
          <FormControl
            componentClass="textarea"
            placeholder={this.props.intl.formatMessage({id: 'portal.policy.edit.mimetype.mimetype.placeholder'})}
            id="matches_mime-type"
            value={this.props.match.get('cases').get(0).get(0)}
            onChange={this.handleChange(
              this.props.path.concat(['cases', 0, 0])
            )}/>

          <Select className="input-select"
            onSelect={this.handleSelectChange(
              ['edge_configuration', 'cache_rule', 'matches', 'mime_types']
            )}
            value={this.state.activeFilter}
            options={[
              ['matches', <FormattedMessage id="portal.policy.edit.mimetype.matches.text"/>],
              ['does_not_match', <FormattedMessage id="portal.policy.edit.mimetype.doesntMatch.text"/>]]}/>

        </Modal.Body>
      </div>
    )
  }
}

MimeType.displayName = 'MimeType'
MimeType.propTypes = {
  changeValue: React.PropTypes.func,
  intl: React.PropTypes.object,
  match: React.PropTypes.instanceOf(Immutable.Map),
  path: React.PropTypes.array
}

module.exports = injectIntl(MimeType)
