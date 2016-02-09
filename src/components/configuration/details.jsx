import React from 'react'

import { Button, Col, Input, OverlayTrigger, Panel, Tooltip } from 'react-bootstrap'
import Select from '../../components/select'
import Immutable from 'immutable'

class ConfigurationDetails extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.originHostValue = ''
  }
  handleChange(path) {
    return e => this.props.changeValue(path, e.target.value)
  }
  handleSelectChange(path) {
    return value => {
      this.props.changeValue(path, value)
    }
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
    const isOtherHostHeader = ['option_origin_host_name', 'option_published_name'].indexOf(
        this.props.edgeConfiguration.get('host_header')
      ) === -1;
    return (
      <form className="configuration-details form-horizontal"
        onSubmit={this.handleSave}>


        {/* Origin Hostname */}

        <Input type="text" label="Origin Hostname"
          id="origin_host_name"
          labelClassName="col-xs-3"
          wrapperClassName="col-xs-9"
          addonAfter={
            <OverlayTrigger placement="top" overlay={
              <Tooltip id="tooltip_origin_host_name">
                <div className="tooltip-header">Origin Hostname</div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </Tooltip>
            }>
              <Button bsStyle="link" className="btn-icon">
                ?
              </Button>
            </OverlayTrigger>
          }
          value={this.props.edgeConfiguration.get('origin_host_name')}
          onChange={this.handleChange(
            ['edge_configuration', 'origin_host_name']
          )}/>


        {/* Origin Port */}

        <Input type="text" label="Origin Port"
          id="origin_host_port"
          labelClassName="col-xs-3"
          wrapperClassName="col-xs-9"
          addonAfter={
            <OverlayTrigger placement="top" overlay={
              <Tooltip id="tooltip_origin_host_port">
                <div className="tooltip-header">Origin Port</div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </Tooltip>
            }>
              <Button bsStyle="link" className="btn-icon">
                ?
              </Button>
            </OverlayTrigger>
          }
          value={this.props.edgeConfiguration.get('origin_host_port')}
          onChange={this.handleChange(
            ['edge_configuration', 'origin_host_port']
          )}/>


        {/* Origin Hostname Value */}

        <div className="form-groups">
          <div className={'input-connector col-xs-offset-3' +
            (isOtherHostHeader ? ' show' : '')}></div>

          <div className="form-group">
            <label className="col-xs-3 control-label">Origin Hostname Value</label>
            <Col xs={9} xsOffset={3}>
              <div className="input-group">
                <Select className="input-select"
                  onSelect={this.handleSelectChange(
                    ['edge_configuration', 'host_header'])}
                  value={this.props.edgeConfiguration.get('host_header')}
                  addonAfter=' '
                  options={[
                    [isOtherHostHeader ?
                      this.props.edgeConfiguration.get('host_header') : '',
                      'Use Other Hostname Value'],
                    ['option_origin_host_name', 'Use Origin Hostname'],
                    ['option_published_name', 'Use Published Hostname']]}/>
                <span className="input-group-addon">
                  <OverlayTrigger placement="top" overlay={
                    <Tooltip id="tooltip_origin_path_append">
                      <div className="tooltip-header">Origin Hostname Value</div>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </Tooltip>
                  }>
                    <Button bsStyle="link" className="btn-icon">
                      ?
                    </Button>
                  </OverlayTrigger>
                </span>
              </div>
            </Col>
          </div>

          <Panel collapsible={true} expanded={isOtherHostHeader}>
            <Input type="text" placeholder="origin.foo.com"
              wrapperClassName="col-xs-9 col-xs-offset-3"
              addonAfter=' '
              value={this.props.edgeConfiguration.get('host_header')}
              onChange={this.handleChange(
                ['edge_configuration', 'host_header']
              )}/>
          </Panel>
        </div>


        {/* Origin Forward Path (optional) */}

        <Input type="text" label="Origin Forward Path (optional)"
          id="origin_path_append"
          labelClassName="col-xs-3"
          wrapperClassName="col-xs-9"
          addonAfter={
            <OverlayTrigger placement="top" overlay={
              <Tooltip id="tooltip_origin_path_append">
                <div className="tooltip-header">Origin Forward Path</div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </Tooltip>
            }>
              <Button bsStyle="link" className="btn-icon">
                ?
              </Button>
            </OverlayTrigger>
          }
          value={this.props.edgeConfiguration.get('origin_path_append')}
          onChange={this.handleChange(
            ['edge_configuration', 'origin_path_append']
          )}/>


        {/* Published Hostname Value */}

        <Input type="text" label="Published Hostname Value"
          id="published_name"
          labelClassName="col-xs-3"
          wrapperClassName="col-xs-9"
          addonAfter={
            <OverlayTrigger placement="top" overlay={
              <Tooltip id="tooltip_published_name">
                <div className="tooltip-header">Published Hostname Value</div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </Tooltip>
            }>
              <Button bsStyle="link" className="btn-icon">
                ?
              </Button>
            </OverlayTrigger>
          }
          value={this.props.edgeConfiguration.get('published_name')}
          onChange={this.handleChange(
            ['edge_configuration', 'published_name']
          )}/>

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
