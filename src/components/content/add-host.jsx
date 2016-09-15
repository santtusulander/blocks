import React from 'react'
import { Button, ButtonToolbar, Input } from 'react-bootstrap'

import {FormattedMessage, injectIntl} from 'react-intl'

class AddHost extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      deploymentMode: 'trial'
    }

    this.cancelChanges = this.cancelChanges.bind(this)
    this.createHost = this.createHost.bind(this)
    this.setDeploymentMode = this.setDeploymentMode.bind(this)
  }
  createHost(e) {
    e.preventDefault()
    this.props.createHost(
      this.refs.new_host_name.getValue(),
      this.state.deploymentMode
    )
  }
  cancelChanges(e) {
    e.preventDefault()
    this.props.cancelChanges()
  }
  setDeploymentMode(mode) {
    return () => this.setState({deploymentMode: mode})
  }
  render() {
    return (
      <form onSubmit={this.createHost}>
        <Input type="text" label={this.props.intl.formatMessage({id: 'portal.content.addHost.newHostanme.text'})} id="new_host_name"
          ref="new_host_name"/>
        <label><FormattedMessage id="portal.content.addHost.deploymentMode.text"/></label>
        <Input type="radio"
          label={this.props.intl.formatMessage({id: 'portal.content.addHost.trial.text'})}
          onChange={this.setDeploymentMode('trial')}
          checked={this.state.deploymentMode === 'trial'}/>
        <Input type="radio"
          label={this.props.intl.formatMessage({id: 'portal.content.addHost.production.text'})}
          onChange={this.setDeploymentMode('production')}
          checked={this.state.deploymentMode === 'production'}/>
        <ButtonToolbar className="text-right extra-margin-top">
          <Button bsStyle="primary" onClick={this.cancelChanges}><FormattedMessage id="portal.button.cancel"/></Button>
          <Button
            disabled={this.props.saving}
            type="submit"
            bsStyle="primary">
            {this.props.saving ?
              <FormattedMessage id="portal.button.saving"/>
            : <FormattedMessage id="portal.button.save"/>}
            </Button>
        </ButtonToolbar>
      </form>
    )
  }
}

AddHost.displayName = 'AddHost'
AddHost.propTypes = {
  cancelChanges: React.PropTypes.func,
  createHost: React.PropTypes.func,
  intl: React.PropTypes.object,
  saving: React.PropTypes.bool
}

module.exports = injectIntl(AddHost)
