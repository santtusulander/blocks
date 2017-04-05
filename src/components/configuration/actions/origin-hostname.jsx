import React from 'react'
import { ControlLabel, FormControl, FormGroup, Modal, Panel } from 'react-bootstrap'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'

import Select from '../../shared/form-elements/select'
import InputConnector from '../../shared/page-elements/input-connector'

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
          <h1><FormattedMessage id="portal.policy.edit.originHostname.text" /></h1>
        </Modal.Header>
        <Modal.Body>

          <FormGroup>
            <ControlLabel>
              <FormattedMessage id="portal.policy.edit.originHostname.header"/>
            </ControlLabel>
            <p>origin.foo.com</p>
          </FormGroup>

          <hr />

          <FormGroup controlId="actions_origin-port">
            <ControlLabel>
              <FormattedMessage id="portal.policy.edit.originHostname.originPort.text" />
            </ControlLabel>
            <FormControl
              type="number"
              placeholder={this.props.intl.formatMessage({id: 'portal.policy.edit.originHostname.originPort.placeholder'})}
              onChange={this.handleChange(
                ['edge_configuration', 'cache_rule', 'actions', 'origin_hostname_port']
              )}/>
          </FormGroup>

          <hr />

          <div className="form-groups">
            <InputConnector show={isOtherHostHeader} />
            <FormGroup>
              <ControlLabel>
                <FormattedMessage id="portal.policy.edit.originHostname.originHostname.text"/>
              </ControlLabel>
              <Select className="input-select"
                onSelect={this.handleSelectChange(
                  ['edge_configuration', 'cache_rule', 'actions', 'origin_hostname']
                )}
                value={this.state.activeFilter}
                options={[
                  ['other_origin_hostname', <FormattedMessage id="portal.policy.edit.originHostname.useOtherHostname.text"/>],
                  ['origin_hostname', <FormattedMessage id="portal.policy.edit.originHostname.useOriginHostname.text"/>],
                  ['published_name', <FormattedMessage id="portal.policy.edit.originHostname.usePublishedHostname.text"/>]]}/>
            </FormGroup>

            <Panel className="form-panel" collapsible={true}
              expanded={isOtherHostHeader}>
              <FormControl
                placeholder={this.props.intl.formatMessage({id: 'portal.policy.edit.originHostname.enterHostname.text'})}
                onChange={this.handleChange(
                  ['edge_configuration', 'cache_rule', 'actions', 'origin_hostname_value']
                )}/>
            </Panel>
          </div>

          <hr />

          <FormGroup controlId="actions_origin-forward-path">
            <ControlLabel>
              <FormattedMessage id="portal.policy.edit.originHostname.originForwardPath.text"/>
            </ControlLabel>
            <FormControl
              placeholder={this.props.intl.formatMessage({id: 'portal.policy.edit.originHostname.originForwardPath.placeholder'})}
              onChange={this.handleChange(
                ['edge_configuration', 'cache_rule', 'actions', 'origin_hostname_forward_path']
              )}/>
          </FormGroup>

        </Modal.Body>
      </div>
    )
  }
}

OriginHostname.displayName = 'OriginHostname'
OriginHostname.propTypes = {
  changeValue: React.PropTypes.func,
  intl: intlShape.isRequired
}

module.exports = injectIntl(OriginHostname)
