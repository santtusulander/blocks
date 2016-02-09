import React from 'react'
import { Button, ButtonToolbar, Input } from 'react-bootstrap'

class AddHost extends React.Component {
  constructor(props) {
    super(props);

    this.cancelChanges = this.cancelChanges.bind(this)
    this.createHost = this.createHost.bind(this)
  }
  createHost(e) {
    e.preventDefault()
    this.props.createHost(this.refs.new_host_name.getValue())
  }
  cancelChanges(e) {
    e.preventDefault()
    this.props.cancelChanges()
  }
  render() {
    return (
      <form onSubmit={this.createHost}>
        <Input type="text" label="New Host Name" id="new_host_name"
          ref="new_host_name"/>
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
