import React from 'react'
import { Button, ButtonToolbar, Input } from 'react-bootstrap'

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
        <Input type="text" label="New Host Name" id="new_host_name"
          ref="new_host_name"/>
        <Input label="Deployment Mode">
          <Input type="radio"
            label="Trial"
            onChange={this.setDeploymentMode('trial')}
            checked={this.state.deploymentMode === 'trial'}/>
          <Input type="radio"
            label="Production"
            onChange={this.setDeploymentMode('production')}
            checked={this.state.deploymentMode === 'production'}/>
        </Input>
        <ButtonToolbar>
          <Button bsStyle="primary" onClick={this.cancelChanges}>Cancel</Button>
          <Button type="submit" bsStyle="primary">Save</Button>
        </ButtonToolbar>
      </form>
    )
  }
}

AddHost.displayName = 'AddHost'
AddHost.propTypes = {
  cancelChanges: React.PropTypes.func,
  createHost: React.PropTypes.func
}

module.exports = AddHost
