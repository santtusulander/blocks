import React from 'react'
import { Input, Modal } from 'react-bootstrap'
import Immutable from 'immutable'

import Select from '../../select'

import {FormattedMessage, formatMessage, injectIntl} from 'react-intl'

class Filename extends React.Component {
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
          <h1><FormattedMessage id="portal.policy.edit.fileName.header"/></h1>
          <p><FormattedMessage id="portal.policy.edit.fileName.disclaimer.text"/></p>
        </Modal.Header>
        <Modal.Body>

          <Input type="textarea" label={this.props.intl.formatMessage({id: 'portal.policy.edit.fileName.fileName.text'})}
            placeholder={this.props.intl.formatMessage({id: 'portal.policy.edit.fileName.fileName.placeholder'})}
            id="matches_file-name"
            value={this.props.match.get('cases').get(0).get(0)}
            onChange={this.handleChange(
              this.props.path.concat(['cases', 0, 0])
            )}/>

          <Select className="input-select"
            onSelect={this.handleSelectChange(
              ['edge_configuration', 'cache_rule', 'matches', 'file_name']
            )}
            value={this.state.activeFilter}
            options={[
              ['matches', <FormattedMessage id="portal.policy.edit.fileName.matches.text"/>],
              ['does_not_match', <FormattedMessage id="portal.policy.edit.fileName.doesntMatch.text"/>]]}/>

        </Modal.Body>
      </div>
    )
  }
}

Filename.displayName = 'Filename'
Filename.propTypes = {
  changeValue: React.PropTypes.func,
  match: React.PropTypes.instanceOf(Immutable.Map),
  path: React.PropTypes.array
}

module.exports = injectIntl(Filename)
