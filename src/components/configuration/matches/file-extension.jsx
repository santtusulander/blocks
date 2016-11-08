import React from 'react'
import { Input, Modal } from 'react-bootstrap'
import Immutable from 'immutable'

import Select from '../../select'

import { FormattedMessage, injectIntl, intlShape } from 'react-intl'

class FileExtension extends React.Component {
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
          <h1><FormattedMessage id="portal.policy.edit.fileExtension.header"/></h1>
          <p><FormattedMessage id="portal.policy.edit.fileExtension.disclaimer.text"/></p>
        </Modal.Header>
        <Modal.Body>

          <Input type="textarea" label={this.props.intl.formatMessage({id: 'portal.policy.edit.fileExtension.fileExtension.text'})}
            placeholder={this.props.intl.formatMessage({id: 'portal.policy.edit.fileExtension.fileExtension.placeholder'})}
            id="matches_file-extension"
            value={this.props.match.get('cases').get(0).get(0)}
            onChange={this.handleChange(
              this.props.path.concat(['cases', 0, 0])
            )}/>

          <Input type="checkbox" label={this.props.intl.formatMessage({id: 'portal.policy.edit.fileExtension.ignoreCase.text'})}
            onChange={this.handleChange(
              ['edge_configuration', 'cache_rule', 'matches', 'file_extension_ignore_case']
            )}/>

          <Select className="input-select"
            onSelect={this.handleSelectChange(
              ['edge_configuration', 'cache_rule', 'matches', 'file_extension']
            )}
            value={this.state.activeFilter}
            options={[
              ['matches', <FormattedMessage id="portal.policy.edit.fileExtension.matches.text"/>],
              ['does_not_match', <FormattedMessage id="portal.policy.edit.fileExtension.doesntMatch.text"/>]]}/>

        </Modal.Body>
      </div>
    )
  }
}

FileExtension.displayName = 'FileExtension'
FileExtension.propTypes = {
  changeValue: React.PropTypes.func,
  intl: intlShape.isRequired,
  match: React.PropTypes.instanceOf(Immutable.Map),
  path: React.PropTypes.array
}

module.exports = injectIntl(FileExtension)
