import React from 'react'
import {Button, Input, Row, Col} from 'react-bootstrap'

class AddHost extends React.Component {
  constructor(props) {
    super(props);

    this.createHost = this.createHost.bind(this)
  }
  createHost(e) {
    e.preventDefault()
    this.props.createHost(this.refs.new_host_name.getValue())
  }
  render() {
    return (
      <form onSubmit={this.createHost}>
        <Row>
          <Col sm={6}>
            <Input type="text" label="New Host Name" id="new_host_name"
              ref="new_host_name"/>
          </Col>
          <Col sm={6}>
            <Button type="submit">Add New</Button>
          </Col>
        </Row>
      </form>
    )
  }
}

AddHost.displayName = 'AddHost'
AddHost.propTypes = {
  createHost: React.PropTypes.func
}

module.exports = AddHost
