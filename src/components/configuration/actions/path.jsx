import React from 'react'
import { Input, Modal } from 'react-bootstrap'
import Immutable from 'immutable'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'

import Select from '../../select'
import InputConnector from '../../input-connector'


class Path extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeActivity: 'add',
      activeDirection: 'to_origin'
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
  }
  handleChange(path) {
    return e => {
      this.props.changeValue(path, e.target.value)
    }
  }
  handleSelectChange(key, path) {
    return key, value => {
      if (key === 'activeActivity') {
        this.setState({
          activeActivity: value
        })
      } else if (key === 'activeDirection') {
        this.setState({
          activeDirection: value
        })
      }
      this.props.changeValue(path, value)
    }
  }
  render() {
    return (
      <div>
        <Modal.Header>
          <h1><FormattedMessage id="portal.policy.edit.path.header'"/></h1>
        </Modal.Header>
        <Modal.Body>

          <div className="form-groups">
            <InputConnector show={true} />
            <div className="form-group">
              <label className="control-label"><FormattedMessage id="portal.policy.edit.path.activity.text"/></label>
              <Select className="input-select"
                onSelect={this.handleSelectChange('activeActivity',
                  ['edge_configuration', 'cache_rule', 'actions', 'path_activity']
                )}
                value={this.state.activeActivity}
                options={[
                  ['add', <FormattedMessage id="portal.policy.edit.path.add.text"/>],
                  ['modify', <FormattedMessage id="portal.policy.edit.path.modify.text"/>],
                  ['remove', <FormattedMessage id="portal.policy.edit.path.remove.text"/>]]}/>
            </div>

            <Input type="text" label={this.props.intl.formatMessage({id: 'portal.policy.edit.path.path.text'})}
              placeholder={this.props.intl.formatMessage({id: 'portal.policy.edit.path.path.placeholder'})}
              onChange={this.handleChange(
                ['edge_configuration', 'cache_rule', 'actions', 'path_value']
              )}/>
          </div>

        <hr />

        <div className="form-group">
          <label className="control-label">Direction</label>
          <Select className="input-select"
            onSelect={this.handleSelectChange('activeDirection',
              ['edge_configuration', 'cache_rule', 'actions', 'path_direction']
            )}
            value={this.state.activeDirection}
            options={[
              ['to_origin', <FormattedMessage id="portal.policy.edit.path.toOrigin.text"/>],
              ['to_client', <FormattedMessage id="portal.policy.edit.path.toClient.text"/>],
              ['to_both', <FormattedMessage id="portal.policy.edit.path.toBoth.text"/>]]}/>
        </div>

        </Modal.Body>
      </div>
    )
  }
}

Path.displayName = 'Path'
Path.propTypes = {
  changeValue: React.PropTypes.func,
  intl: intlShape.isREquired,
  path: React.PropTypes.instanceOf(Immutable.List),
  set: React.PropTypes.instanceOf(Immutable.Map)
}

module.exports = injectIntl(Path)
