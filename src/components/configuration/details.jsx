import React from 'react'
import {Button, Input, Row, Col, OverlayTrigger, Popover} from 'react-bootstrap'
import Immutable from 'immutable'

class ConfigurationDetails extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this)
    this.handleSave = this.handleSave.bind(this)
  }
  handleChange(path) {
    return e => this.props.changeValue(path, e.target.value)
  }
  handleSave(e) {
    e.preventDefault()
    this.props.saveChanges()
  }
  render() {
    if(!this.props.edgeConfiguration) {
      return (
        <div className="container">Loading...</div>
      )
    }
    const isOtherHostHeader = ['origin_host_name', 'published_name'].indexOf(
        this.props.edgeConfiguration.get('host_header')
      ) === -1;
    return (
      <form className="configuration-details" onSubmit={this.handleSave}>

        {/* Origin Hostname */}

        <Row>
          <Col xs={10}>
            <Input type="text" label="Origin Hostname"
              value={this.props.edgeConfiguration.get('origin_host_name')}
              onChange={this.handleChange(
                ['edge_configuration', 'origin_host_name']
              )}/>
          </Col>
          <Col xs={2}>
            <OverlayTrigger trigger="click" placement="top" rootClose={true}
              overlay={
                <Popover id="popover-origin-port" title="Info">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </Popover>
              }>
              <Button bsStyle="info">?</Button>
            </OverlayTrigger>
          </Col>
        </Row>


        {/* Origin Port */}

        <Row>
          <Col xs={10}>
            <Input type="number" label="Origin Port"
              value={this.props.edgeConfiguration.get('origin_host_port')}
              onChange={this.handleChange(
                ['edge_configuration', 'origin_host_port']
              )}/>
          </Col>
          <Col xs={2}>
            <OverlayTrigger trigger="click" placement="top" rootClose={true}
              overlay={
                <Popover id="popover-origin-port" title="Info">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </Popover>
              }>
              <Button bsStyle="info">?</Button>
            </OverlayTrigger>
          </Col>
        </Row>


        {/* Origin Hostname Value */}

        <Row>
          <Col xs={10}>
            <Input type="select" label="Origin Hostname Value"
              value={this.props.edgeConfiguration.get('host_header')}
              onChange={this.handleChange(
                ['edge_configuration', 'host_header']
              )}>
              <option value="">Use Other Hostname Value</option>
              <option value="origin_host_name">Use Origin Hostname</option>
              <option value="published_name">Use Published Hostname</option>
            </Input>
            <Input type="text" placeholder="origin.foo.com"
              value={this.props.edgeConfiguration.get('host_header')}
              onChange={this.handleChange(
                ['edge_configuration', 'host_header']
              )}
              style={isOtherHostHeader ? {} : {display:'none'}}/>
          </Col>
          <Col xs={2}>
            <OverlayTrigger trigger="click" placement="top" rootClose={true}
              overlay={
                <Popover id="popover-origin-port" title="Info">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </Popover>
              }>
              <Button bsStyle="info">?</Button>
            </OverlayTrigger>
          </Col>
        </Row>


        {/* Origin Forward Path (optional) */}

        <Row>
          <Col xs={10}>
            <Input type="text" label="Origin Forward Path (optional)"
              value={this.props.edgeConfiguration.get('origin_path_append')}
              onChange={this.handleChange(
                ['edge_configuration', 'origin_path_append']
              )}/>
          </Col>
          <Col xs={2}>
            <OverlayTrigger trigger="click" placement="top" rootClose={true}
              overlay={
                <Popover id="popover-origin-port" title="Info">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </Popover>
              }>
              <Button bsStyle="info">?</Button>
            </OverlayTrigger>
          </Col>
        </Row>


        {/* Published Hostname Value */}

        <Row>
          <Col xs={10}>
            <Input type="text" label="Published Hostname Value"
              value={this.props.edgeConfiguration.get('published_name')}
              onChange={this.handleChange(
                ['edge_configuration', 'published_name']
              )}/>
          </Col>
          <Col xs={2}>
            <OverlayTrigger trigger="click" placement="top" rootClose={true}
              overlay={
                <Popover id="popover-origin-port" title="Info">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </Popover>
              }>
              <Button bsStyle="info">?</Button>
            </OverlayTrigger>
          </Col>
        </Row>

        <Button type="submit">Done</Button>
      </form>
    )
  }
}

ConfigurationDetails.displayName = 'ConfigurationDetails'
ConfigurationDetails.propTypes = {
  changeValue: React.PropTypes.func,
  edgeConfiguration: React.PropTypes.instanceOf(Immutable.Map),
  saveChanges: React.PropTypes.func
}

module.exports = ConfigurationDetails
