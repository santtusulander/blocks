import React from 'react'
import { ControlLabel, FormControl, FormGroup, Modal } from 'react-bootstrap'
import Immutable from 'immutable'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'

import Select from '../../shared/form-elements/select'


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

          <FormGroup controlId="matches_file-name">
            <ControlLabel>
              <FormattedMessage id="portal.policy.edit.fileName.fileName.text" />
            </ControlLabel>
            <FormControl
              componentClass="textarea"
              placeholder={this.props.intl.formatMessage({id: 'portal.policy.edit.fileName.fileName.placeholder'})}
              value={this.props.match.get('cases').get(0).get(0)}
              onChange={this.handleChange(
                this.props.path.concat(['cases', 0, 0])
              )}/>
          </FormGroup>

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
  intl: intlShape.isRequired,
  match: React.PropTypes.instanceOf(Immutable.Map),
  path: React.PropTypes.array
}

module.exports = injectIntl(Filename)
