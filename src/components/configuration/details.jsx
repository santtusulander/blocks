import React from 'react'
import Immutable from 'immutable'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { Col, ControlLabel, FormControl, FormGroup, InputGroup, Panel, Row } from 'react-bootstrap'
import classNames from 'classnames'

import HelpTooltip from '../../components/help-tooltip'
import InputConnector from '../../components/input-connector'
import Select from '../../components/select'
import Toggle from '../toggle'
import LoadingSpinner from '../loading-spinner/loading-spinner'

class ConfigurationDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      useUDNOrigin : true
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleNumericChange = this.handleNumericChange.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.toggleUDNOrigin = this.toggleUDNOrigin.bind(this)
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

  toggleUDNOrigin(val) {
    this.setState({ useUDNOrigin: val })
  }

  render() {
    if(!this.props.edgeConfiguration) {
      return (
        <LoadingSpinner/>
      )
    }
    const { readOnly } = this.props
    const isOtherHostHeader = ['option_origin_host_name', 'option_published_name'].indexOf(
        this.props.edgeConfiguration.get('host_header')
      ) === -1;
    return (
      <form
        className="configuration-details form-horizontal"
        onSubmit={this.handleSave}>

        <Row>
          <FormGroup>
            <Col xs={3}>
              <ControlLabel>
                <FormattedMessage id="portal.configuration.details.deploymentMode.text"/>
              </ControlLabel>
            </Col>
            <Col xs={9}>
              <FormControl.Static>{this.props.deploymentMode}</FormControl.Static>
            </Col>
          </FormGroup>
        </Row>

        <Row>
          <FormGroup>
            <Col xs={3}>
              <ControlLabel>
                <FormattedMessage id="portal.configuration.details.useUDNOrigin.text"/>
              </ControlLabel>
            </Col>
            <Col xs={9}>
              <Toggle
                readonly={readOnly}
                value={this.state.useUDNOrigin}
                changeValue={this.toggleUDNOrigin}
              />
            </Col>
          </FormGroup>
        </Row>

        { !this.state.useUDNOrigin &&
          <Row>
            <FormGroup>
              <Col xs={3}>
                <ControlLabel>
                  <FormattedMessage id="portal.configuration.details.customerOrigin.text"/>
                </ControlLabel>
              </Col>
              <Col xs={9}>
                <InputGroup>
                  <FormControl
                    type="text"
                    disabled={readOnly}
                    value={this.props.edgeConfiguration.get('origin_host_name')}
                    onChange={this.handleChange(
                      ['edge_configuration', 'origin_host_name']
                    )}/>
                  <InputGroup.Addon>
                    <HelpTooltip
                      id="tooltip_origin_host_name"
                      title={<FormattedMessage id="portal.configuration.details.customerOrigin.text"/>}>
                      <FormattedMessage id="portal.configuration.details.customerOrigin.help.text" />
                    </HelpTooltip>
                  </InputGroup.Addon>
                </InputGroup>
              </Col>
            </FormGroup>
          </Row>
        }

        { this.state.useUDNOrigin &&
          <Row>
            <FormGroup>
              <Col xs={3}>
                <ControlLabel>
                  <FormattedMessage id="portal.configuration.details.UDNOrigin.text"/>
                </ControlLabel>
              </Col>
              <Col xs={9}>
                <InputGroup>
                  <Select
                    className="input-select"
                    disabled={readOnly}
                    onSelect={this.handleSelectChange(
                      ['edge_configuration', 'origin_storage'])}
                    value={this.props.edgeConfiguration.get('origin_storage')}
                    options={[
                      ['option_new_storage',
                        <FormattedMessage id="portal.configuration.details.UDNOrigin.storage.new.text" />]
                    ]}/>
                  <InputGroup.Addon>
                    <HelpTooltip
                      id="tooltip_udn_origin"
                      title={<FormattedMessage id="portal.configuration.details.UDNOrigin.text"/>}>
                      <FormattedMessage id="portal.configuration.details.UDNOrigin.help.text" />
                    </HelpTooltip>
                  </InputGroup.Addon>
                </InputGroup>
              </Col>
            </FormGroup>
          </Row>
        }

        <Row>
          <FormGroup>
            <Col xs={3}>
              <ControlLabel>
                <FormattedMessage id="portal.configuration.details.originPort.text"/>
              </ControlLabel>
            </Col>
            <Col xs={9}>
              <InputGroup>
                <FormControl
                  type="text"
                  disabled={readOnly}
                  value={this.props.edgeConfiguration.get('origin_host_port')}
                  onChange={this.handleNumericChange(
                    ['edge_configuration', 'origin_host_port']
                  )}/>
                <InputGroup.Addon>
                  <HelpTooltip
                    id="tooltip_origin_host_port"
                    title={<FormattedMessage id="portal.configuration.details.originPort.text"/>}>
                    <FormattedMessage id="portal.configuration.details.originPort.help.text" />
                  </HelpTooltip>
                </InputGroup.Addon>
              </InputGroup>
            </Col>
          </FormGroup>
        </Row>

        <Row className="form-groups">
          <InputConnector
            className={classNames(
              'col-xs-offset-3',
              {'show': isOtherHostHeader})} />

          <FormGroup>
            <Col xs={3}>
              <ControlLabel>
                <FormattedMessage id="portal.configuration.details.hostHeaderValue.text"/>
              </ControlLabel>
            </Col>
            <Col xs={9} xsOffset={3}>
              <InputGroup>
                <Select
                  className="input-select"
                  disabled={readOnly}
                  onSelect={this.handleSelectChange(
                    ['edge_configuration', 'host_header'])}
                  value={this.props.edgeConfiguration.get('host_header')}
                  options={[
                    [isOtherHostHeader ?
                      this.props.edgeConfiguration.get('host_header') : '',
                      <FormattedMessage id="portal.configuration.details.useOtherHostnameValue.text" />],
                    ['option_origin_host_name',
                      <FormattedMessage id="portal.configuration.details.useOriginHostname.text" />],
                    ['option_published_name',
                      <FormattedMessage id="portal.configuration.details.usePublishedHostname.text" />]
                  ]}/>
                <InputGroup.Addon>
                  <HelpTooltip
                    id="tooltip_origin_path_append"
                    title={<FormattedMessage id="portal.configuration.details.hostHeaderValue.text"/>}>
                    <FormattedMessage id="portal.configuration.details.hostHeaderValue.help.text" />
                  </HelpTooltip>
                </InputGroup.Addon>
              </InputGroup>
            </Col>
          </FormGroup>

          <Panel collapsible={true} expanded={isOtherHostHeader}>
            <FormGroup>
              <Col xs={9} xsOffset={3}>
                <InputGroup>
                  <FormControl
                    type="text"
                    placeholder={this.props.intl.formatMessage({ id: 'portal.configuration.details.enterHostnameValue.text' })}
                    disabled={readOnly}
                    value={this.props.edgeConfiguration.get('host_header')}
                    onChange={this.handleChange(
                      ['edge_configuration', 'host_header']
                    )}/>
                  <InputGroup.Addon />
                </InputGroup>
              </Col>
            </FormGroup>
          </Panel>
        </Row>

        <Row>
          <FormGroup>
            <Col xs={3}>
              <ControlLabel>
                <FormattedMessage id="portal.configuration.details.originForwardPath.text"/>
              </ControlLabel>
            </Col>
            <Col xs={9}>
              <InputGroup>
                <FormControl
                  type="text"
                  disabled={readOnly}
                  value={this.props.edgeConfiguration.get('origin_path_append')}
                  onChange={this.handleChange(
                    ['edge_configuration', 'origin_path_append']
                  )}/>
                <InputGroup.Addon>
                  <HelpTooltip
                    id="tooltip_origin_path_append"
                    title={<FormattedMessage id="portal.configuration.details.originForwardPath.text"/>}>
                    <FormattedMessage id="portal.configuration.details.originForwardPath.help.text" />
                  </HelpTooltip>
                </InputGroup.Addon>
              </InputGroup>
            </Col>
          </FormGroup>
        </Row>

        <Row>
          <FormGroup>
            <Col xs={3}>
              <ControlLabel>
                <FormattedMessage id="portal.configuration.details.originTestPath.text"/>
              </ControlLabel>
            </Col>
            <Col xs={9}>
              <InputGroup>
                <FormControl
                  type="text"
                  disabled={readOnly}
                  value={this.props.edgeConfiguration.get('origin_test_path')}
                  onChange={this.handleChange(
                    ['edge_configuration', 'origin_test_path']
                  )}
                />
                <InputGroup.Addon>
                  <HelpTooltip
                    id="tooltip_origin_test_path"
                    title={<FormattedMessage id="portal.configuration.details.originTestPath.text"/>}>
                    <FormattedMessage id="portal.configuration.details.originTestPath.help.text" />
                  </HelpTooltip>
                </InputGroup.Addon>
              </InputGroup>
            </Col>
          </FormGroup>
        </Row>

        <Row className="form-groups">
          <InputConnector className="col-xs-offset-3 show"/>

          <FormGroup>
            <Col xs={3}>
              <ControlLabel>
                <FormattedMessage id="portal.configuration.details.publishedHostnameValue.text"/>
              </ControlLabel>
            </Col>
            <Col xs={9}>
              <InputGroup>
                <FormControl
                  type="text"
                  disabled={true}
                  value={this.props.edgeConfiguration.get('published_name')}
                  onChange={this.handleChange(
                    ['edge_configuration', 'published_name']
                  )}/>
                <InputGroup.Addon>
                  <HelpTooltip
                    id="tooltip_published_name"
                    title={<FormattedMessage id="portal.configuration.details.publishedHostnameValue.text"/>}>
                    <FormattedMessage id="portal.configuration.details.publishedHostnameValue.help.text" />
                  </HelpTooltip>
                </InputGroup.Addon>
              </InputGroup>
            </Col>
          </FormGroup>

          <FormGroup>
            <Col xs={3}>
              <ControlLabel>
                <FormattedMessage id="portal.configuration.details.targetCname.text"/>
              </ControlLabel>
            </Col>
            <Col xs={9}>
              <InputGroup>
                <FormControl
                  type="text"
                  disabled={true}
                  value={this.props.edgeConfiguration.get('customer_cname')}
                  onChange={this.handleChange(
                    ['edge_configuration', 'customer_cname']
                  )}
                />
                <InputGroup.Addon>
                  <HelpTooltip
                    id="tooltip_origin_target_cname"
                    title={<FormattedMessage id="portal.configuration.details.targetCname.text"/>}>
                    <FormattedMessage id="portal.configuration.details.targetCname.help.text" />
                  </HelpTooltip>
                </InputGroup.Addon>
              </InputGroup>
            </Col>
          </FormGroup>
        </Row>

      </form>
    )
  }
}
// TODO: Provide help text for origin test path, target cname
ConfigurationDetails.displayName = 'ConfigurationDetails'
ConfigurationDetails.propTypes = {
  changeValue: React.PropTypes.func,
  deploymentMode: React.PropTypes.string,
  edgeConfiguration: React.PropTypes.instanceOf(Immutable.Map),
  intl: intlShape.isRequired,
  readOnly: React.PropTypes.bool,
  saveChanges: React.PropTypes.func
}

export default injectIntl(ConfigurationDetails)
