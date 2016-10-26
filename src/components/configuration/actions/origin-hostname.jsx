import React from 'react'
import { Input, Modal, Panel } from 'react-bootstrap'
import Immutable from 'immutable'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'

import Select from '../../select'
import InputConnector from '../../input-connector'

class OriginHostname extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeFilter: 'other_origin_hostname'
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
    const isOtherHostHeader = this.state.activeFilter === 'other_origin_hostname'
    return (
      <div>
        <Modal.Header>
          <h1>Origin Hostname</h1>
        </Modal.Header>
        <Modal.Body>

          <div className="form-group">
            <label className="control-label"><FormattedMessage id="portal.policy.edit.originHostname.header"/></label>
            <p>origin.foo.com</p>
          </div>

          <hr />

          <Input type="number" label="Origin Port"
            placeholder={this.props.intl.formatMessage({id: 'portal.policy.edit.originHostname.originPort.placeholder'})}
            id="actions_origin-port"
            onChange={this.handleChange(
              ['edge_configuration', 'cache_rule', 'actions', 'origin_hostname_port']
            )}/>

          <hr />

          <div className="form-groups">
            <InputConnector show={isOtherHostHeader} />
            <div className="form-group">
              <label className="control-label"><FormattedMessage id="portal.policy.edit.originHostname.originHostname.text"/></label>
              <Select className="input-select"
                onSelect={this.handleSelectChange(
                  ['edge_configuration', 'cache_rule', 'actions', 'origin_hostname']
                )}
                value={this.state.activeFilter}
                options={[
                  ['other_origin_hostname', <FormattedMessage id="portal.policy.edit.originHostname.useOtherHostname.text"/>],
                  ['origin_hostname', <FormattedMessage id="portal.policy.edit.originHostname.useOriginHostname.text"/>],
                  ['published_name', <FormattedMessage id="portal.policy.edit.originHostname.usePublishedHostname.text"/>]]}/>
            </div>

            <Panel className="form-panel" collapsible={true}
              expanded={isOtherHostHeader}>
              <Input type="text"
                placeholder={this.props.intl.formatMessage({id: 'portal.policy.edit.originHostname.enterHostname.text'})}
                onChange={this.handleChange(
                  ['edge_configuration', 'cache_rule', 'actions', 'origin_hostname_value']
                )}/>
            </Panel>
          </div>

        <hr />

        <Input type="text" label={this.props.intl.formatMessage({id: 'portal.policy.edit.originHostname.originForwardPath.text'})}
          placeholder={this.props.intl.formatMessage({id: 'portal.policy.edit.originHostname.originForwardPath.placeholder'})}
          id="actions_origin-forward-path"
          onChange={this.handleChange(
            ['edge_configuration', 'cache_rule', 'actions', 'origin_hostname_forward_path']
          )}/>

        </Modal.Body>
      </div>
    )
  }
}

OriginHostname.displayName = 'OriginHostname'
OriginHostname.propTypes = {
  changeValue: React.PropTypes.func,
  intl: intlShape.isRequired,
  path: React.PropTypes.instanceOf(Immutable.List),
  set: React.PropTypes.instanceOf(Immutable.Map)
}

module.exports = injectIntl(OriginHostname)
