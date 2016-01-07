import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as hostActionCreators from '../../redux/modules/host'

// React-Bootstrap
// ===============

import {
  Button,
  ButtonToolbar,
  Col,
  Input,
  OverlayTrigger,
  Panel,
  Popover,
  Row,
  Table
} from 'react-bootstrap';


export class Edge extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this)
    this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this)
    this.submitForm = this.submitForm.bind(this)
  }
  handleChange(path) {
    return e => {
      let activeHost = this.props.activeHost
      this.props.hostActions.changeActiveHost(
        activeHost.setIn(path, e.target.value)
      )
    }
  }
  handleChangeCheckbox(path) {
    return e => {
      let activeHost = this.props.activeHost
      this.props.hostActions.changeActiveHost(
        activeHost.setIn(path, e.target.checked)
      )
    }
  }
  submitForm() {
    alert('form submitted');
  }
  render() {
    let activeHost = this.props.activeHost;
    if(!activeHost || !activeHost.size) {
      return (
        <div className="container">Loading...</div>
      )
    }
    let edgeConfiguration = activeHost.get('edge_configuration');
    let defaultResponsePoliciesPath = Immutable.List([
      'response_policies',
      activeHost.get('response_policies')
        .findIndex(policyGroup => policyGroup.has('defaults')),
      'defaults',
      'policies']);
    let defaultResponsePoliciesPaths = {
      honor_origin_cache_policies: defaultResponsePoliciesPath
        .push(
          activeHost.getIn(defaultResponsePoliciesPath)
            .findIndex(policy => policy.has('honor_origin_cache_policies')),
            'honor_origin_cache_policies'),
      ignore_case: defaultResponsePoliciesPath
        .push(
          activeHost.getIn(defaultResponsePoliciesPath)
            .findIndex(policy => policy.has('ignore_case')),
            'ignore_case'),
      honor_etags: defaultResponsePoliciesPath
        .push(
          activeHost.getIn(defaultResponsePoliciesPath)
            .findIndex(policy => policy.has('honor_etags')),
            'honor_etags')
    };

    let isOtherHostHeader = ['origin_host_name', 'published_name'].indexOf(edgeConfiguration.get('host_header')) === -1;

    return (
      <div className="container">

        <h1 className="page-header">Configure - Hostname</h1>

        <form onSubmit={this.submitForm}>


          {/* SECTION - Hostname */}

          <Panel>


            {/* Origin Hostname */}

            <Row>
              <Col xs={10}>
                <Input type="text" label="Origin Hostname"
                  value={edgeConfiguration.get('origin_host_name')}
                  onChange={this.handleChange(
                    ['edge_configuration', 'origin_host_name']
                  )}/>
              </Col>
              <Col xs={2}>
                <OverlayTrigger trigger="click" placement="top" rootClose={true} overlay={
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
                  value={edgeConfiguration.get('origin_host_port')}
                  onChange={this.handleChange(
                    ['edge_configuration', 'origin_host_port']
                  )}/>
              </Col>
              <Col xs={2}>
                <OverlayTrigger trigger="click" placement="top" rootClose={true} overlay={
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
                  value={edgeConfiguration.get('host_header')}
                  onChange={this.handleChange(
                    ['edge_configuration', 'host_header']
                  )}>
                  <option value="">Use Other Hostname Value</option>
                  <option value="origin_host_name">Use Origin Hostname</option>
                  <option value="published_name">Use Published Hostname</option>
                </Input>
                <Input type="text" placeholder="origin.foo.com"
                  value={edgeConfiguration.get('host_header')}
                  onChange={this.handleChange(
                    ['edge_configuration', 'host_header']
                  )}
                  style={isOtherHostHeader ? {} : {display:'none'}}/>
              </Col>
              <Col xs={2}>
                <OverlayTrigger trigger="click" placement="top" rootClose={true} overlay={
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
                  value={edgeConfiguration.get('origin_path_append')}
                  onChange={this.handleChange(
                    ['edge_configuration', 'origin_path_append']
                  )}/>
              </Col>
              <Col xs={2}>
                <OverlayTrigger trigger="click" placement="top" rootClose={true} overlay={
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
                  value={edgeConfiguration.get('published_name')}
                  onChange={this.handleChange(
                    ['edge_configuration', 'published_name']
                  )}/>
              </Col>
              <Col xs={2}>
                <OverlayTrigger trigger="click" placement="top" rootClose={true} overlay={
                  <Popover id="popover-origin-port" title="Info">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </Popover>
                }>
                  <Button bsStyle="info">?</Button>
                </OverlayTrigger>
              </Col>
            </Row>

            {/* TODO: API supports only one value, but wireframe shows multiple
            <Row>
              <Col xs={10}>
                <FormControls.Static>foo.bar.com</FormControls.Static>
              </Col>
              <Col xs={2}>
                <ButtonToolbar>
                  <Button bsStyle="warning">Edit</Button>
                  <Button bsStyle="danger">Delete</Button>
                </ButtonToolbar>
              </Col>
            </Row>

            <Row>
              <Col xs={10}>
                <FormControls.Static>baz.qux.com</FormControls.Static>
              </Col>
              <Col xs={2}>
                <ButtonToolbar>
                  <Button bsStyle="warning">Edit</Button>
                  <Button bsStyle="danger">Delete</Button>
                </ButtonToolbar>
              </Col>
            </Row>
            */}

          </Panel>


          {/* SECTION - Cache Rules */}

          <Panel>


            {/* Origin Cache Control */}

            <h2>Origin Cache Control</h2>

            <Row>
              <Col xs={12}>


                { /* Honor Origin Cache Control */}

                <Input type="checkbox" label="Honor Origin Cache Control"
                  checked={activeHost.getIn(defaultResponsePoliciesPaths.honor_origin_cache_policies)}
                  onChange={this.handleChangeCheckbox(defaultResponsePoliciesPaths.honor_origin_cache_policies)}/>


                { /* Ignore case from origin */}

                <Input type="checkbox" label="Ignore case from origin"
                  checked={activeHost.getIn(defaultResponsePoliciesPaths.ignore_case)}
                  onChange={this.handleChangeCheckbox(defaultResponsePoliciesPaths.ignore_case)}/>


                { /* Enable e-Tag support */}

                <Input type="checkbox" label="Enable e-Tag support"
                  checked={activeHost.getIn(defaultResponsePoliciesPaths.honor_etags)}
                  onChange={this.handleChangeCheckbox(defaultResponsePoliciesPaths.honor_etags)}/>

              </Col>
            </Row>


            {/* Edge Cache Control */}

            <h2>Edge Cache Control</h2>


            {/* Default Cache Rules */}

            <h3>Default Cache Rules</h3>

            <Row>
              <Col xs={8}>
                <Table striped={true} bordered={true} hover={true}>
                  <thead>
                    <tr>
                      <th>Rule Type</th>
                      <th>TTL Value</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>DEFAULT</td>
                      <td>no-store</td>
                      <td><a href="#">edit</a></td>
                    </tr>
                    <tr>
                      <td>Error Response</td>
                      <td>10 s</td>
                      <td><a href="#">edit</a></td>
                    </tr>
                    <tr>
                      <td>Redirect</td>
                      <td>no-store</td>
                      <td><a href="#">edit</a></td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>


            {/* CDN Cache Rules */}

            <h3>CDN Cache Rules</h3>

            <Table striped={true} bordered={true} hover={true}>
              <thead>
                <tr>
                  <th>Rule Priority</th>
                  <th>Rule Type</th>
                  <th>Rule</th>
                  <th>TTL Value</th>
                  <th>Match Condition</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>extension</td>
                  <td>gif</td>
                  <td>1 day</td>
                  <td>positive</td>
                  <td><a href="#">edit</a> <a href="#">delete</a></td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>directory</td>
                  <td>/wp-content</td>
                  <td>no-store</td>
                  <td>positive</td>
                  <td><a href="#">edit</a> <a href="#">delete</a></td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>MIME-type</td>
                  <td>text/html</td>
                  <td>15 min</td>
                  <td>positive</td>
                  <td><a href="#">edit</a> <a href="#">delete</a></td>
                </tr>
              </tbody>
            </Table>

            <Button bsStyle="primary">Add Cache Rule</Button>

          </Panel>


          {/* SECTION - Add Cache Rule */}

          <Panel>


            {/* Rule Type */}

            <Row>
              <Col xs={10}>
                <Input type="select" id="configure__edge__add-cache-rule__rule-type" label="Rule Type">
                  <option value="1">Extension</option>
                  <option value="2">Directory</option>
                  <option value="3">File Type</option>
                  <option value="4">MIME-Type</option>
                </Input>
              </Col>
            </Row>


            {/* Rule Value */}

            <Row>
              <Col xs={10}>
                <Input type="text" id="configure__edge__add-cache-rule__rule-value" label="Rule Value" placeholder="text/html" />
              </Col>
            </Row>


            {/* Rule Match */}

            <Row>
              <Col xs={10}>
                <Input type="select" id="configure__edge__add-cache-rule__rule-match">
                  <option value="1">Matches</option>
                  <option value="2">Doesn't Match</option>
                </Input>
              </Col>
            </Row>


            {/* No-Store */}

            <Row>
              <Col xs={10}>
                <Input type="checkbox" id="configure__edge__add-cache-rule__no-store" label="No-Store" />
              </Col>
            </Row>


            {/* TTL Value */}

            <Row>
              <Col xs={10}>
                <Input label="TTL Value">
                  <Row>
                    <Col xs={6}>
                      <Input type="number" id="configure__edge__add-cache-rule__ttl-value" placeholder="number" />
                    </Col>
                    <Col xs={6}>
                      <Input type="select" id="configure__edge__add-cache-rule__ttl-value-extension">
                        <option value="1">seconds</option>
                        <option value="2">minutes</option>
                        <option value="3">hours</option>
                        <option value="4">days</option>
                      </Input>
                    </Col>
                  </Row>
                </Input>
              </Col>
            </Row>


            {/* Action buttons */}

            <ButtonToolbar className="text-center">
              <Button>Cancel</Button>
              <Button type="submit" bsStyle="primary">Add</Button>
            </ButtonToolbar>

          </Panel>


          {/* Action buttons */}

          <ButtonToolbar className="text-center">
            <Button>Save</Button>
            <Button>Cancel</Button>
            <Button type="submit" bsStyle="primary">Publish</Button>
          </ButtonToolbar>

        </form>

      </div>
    );
  }
}

Edge.displayName = 'Edge'
Edge.propTypes = {
  activeHost: React.PropTypes.instanceOf(Immutable.Map),
  hostActions: React.PropTypes.object
}

function mapStateToProps(state) {
  return {
    activeHost: state.host.get('activeHost')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hostActions: bindActionCreators(hostActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Edge);
