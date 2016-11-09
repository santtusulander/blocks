import React from 'react'
import Immutable from 'immutable'
import { FormattedMessage } from 'react-intl'
import { Button, Col, Input, OverlayTrigger, Panel, Tooltip } from 'react-bootstrap'

import Select from '../../components/select'

class ConfigurationDetails extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this)
    this.handleNumericChange = this.handleNumericChange.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.originHostValue = ''
  }
  handleChange(path) {
    return e => this.props.changeValue(path, e.target.value)
  }
  handleNumericChange(path) {
    return e => this.props.changeValue(path, parseInt(e.target.value))
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
    const { readOnly } = this.props
    const isOtherHostHeader = ['option_origin_host_name', 'option_published_name'].indexOf(
        this.props.edgeConfiguration.get('host_header')
      ) === -1;
    return (
      <form className="configuration-details form-horizontal"
        onSubmit={this.handleSave}>

      {/* Deployment Mode */}

        <div className="form-group">
          <label className="control-label col-xs-3">
            <FormattedMessage id="portal.configuration.details.deploymentMode.text"/>
          </label>
          <div className="col-xs-9">
            {this.props.deploymentMode}
          </div>
        </div>
        {/* Origin Hostname */}

        <Input type="text" label="Customer Origin"
          id="origin_host_name"
          disabled={readOnly}
          labelClassName="col-xs-3"
          wrapperClassName="col-xs-9"
          addonAfter={
            <OverlayTrigger placement="top" overlay={
              <Tooltip id="tooltip_origin_host_name">
                <div className="tooltip-header">Customer Origin</div>
                <div className="text-sm">Customer Origin is the publicly
                  addressable Web server location where the UDN platform will
                  fetch content for delivery to end users. This value can either
                  be a Fully Qualified Domain Name (FQDN) or an IP address.
                  Usually, the customer origin value is a subdomain of the
                  delivery domain, e.g. origin.domain.com.</div>
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
          disabled={readOnly}
          labelClassName="col-xs-3"
          wrapperClassName="col-xs-9"
          addonAfter={
            <OverlayTrigger placement="top" overlay={
              <Tooltip id="tooltip_origin_host_port">
                <div className="tooltip-header">Origin Port</div>
                <div className="text-sm">Origin Port is the value of the port on
                  your origin Web server that UDN will use to fetch content for
                  delivery. By default, the UDN platform will use port 80 to
                  fetch HTTP content. The default port for HTTPS content is 443.
                </div>
              </Tooltip>
            }>
              <Button bsStyle="link" className="btn-icon">
                ?
              </Button>
            </OverlayTrigger>
          }
          value={this.props.edgeConfiguration.get('origin_host_port')}
          onChange={this.handleNumericChange(
            ['edge_configuration', 'origin_host_port']
          )}/>


        {/* Origin Hostname Value */}

        <div className="form-groups">
          <div className={'input-connector col-xs-offset-3' +
            (isOtherHostHeader ? ' show' : '')} />

          <div className="form-group">
            <label className="col-xs-3 control-label">Host Header Value</label>
            <Col xs={9} xsOffset={3}>
              <div className="input-group">
                <Select className="input-select"
                  disabled={readOnly}
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
                      <div className="tooltip-header">Host Header Value</div>
                      <div className="text-sm">Host Header Value is the value
                        that the UDN server will submit to the origin hostname.
                        There are 3 options that UDN allows: origin hostname
                        value, published hostname value, or a custom hostname
                        value. The value that UDN transmits is flexible to
                        support how you have your origin Web server setup. Most
                        origin Web servers use the origin hostname value.</div>
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
            <Input type="text" placeholder="Enter Other Hostname Value"
              wrapperClassName="col-xs-9 col-xs-offset-3"
              disabled={readOnly}
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
          disabled={readOnly}
          labelClassName="col-xs-3"
          wrapperClassName="col-xs-9"
          addonAfter={
            <OverlayTrigger placement="top" overlay={
              <Tooltip id="tooltip_origin_path_append">
                <div className="tooltip-header">Origin Forward Path</div>
                <div className="text-sm">The Origin Forward Path should be used
                  if the content on the origin Web server is not in the same
                  request path as the end user request. By default, the Origin
                  Forward Path will be the same path from the original end user
                  URI request.</div>
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
          disabled={true}
          id="published_name"
          labelClassName="col-xs-3"
          wrapperClassName="col-xs-9"
          addonAfter={
            <OverlayTrigger placement="top" overlay={
              <Tooltip id="tooltip_published_name">
                <div className="tooltip-header">Published Hostname Value</div>
                <div className="text-sm">The Published Hostname Value is the
                  hostname used to deliver content to end users, aka a vanity
                  hostname. The Published Hostname Value needs to a subdomain
                  value, e.g. www.doamin.com, and cannot be an apex domain,
                  e.g. domain.com.</div>
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

      </form>
    )
  }
}

ConfigurationDetails.displayName = 'ConfigurationDetails'
ConfigurationDetails.propTypes = {
  changeValue: React.PropTypes.func,
  edgeConfiguration: React.PropTypes.instanceOf(Immutable.Map),
  readOnly: React.PropTypes.bool,
  saveChanges: React.PropTypes.func
}

export default ConfigurationDetails
