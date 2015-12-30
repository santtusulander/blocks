import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as serviceActionCreators from '../../redux/modules/service'

// React-Bootstrap
// ===============

import {
  Button,
  ButtonToolbar,
  Col,
  FormControls,
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
    this.submitForm = this.submitForm.bind(this)
  }
  handleChange(change) {
    let activeService = this.props.activeService
    this.props.serviceActions.changeActiveService(
      activeService.mergeDeep(change)
    )
  }
  submitForm() {
    alert('form submitted');
  }
  render() {
    let activeService = this.props.activeService
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
                  value={activeService.get('origin_host_name')}
                  onChange={e => {
                    this.handleChange({origin_host_name: e.target.value})
                  }}/>
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
                  value={activeService.get('origin_host_port')}
                  onChange={e => {
                    this.handleChange({origin_host_port: e.target.value})
                  }}/>
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
                  value={activeService.get('host_header')}
                  onChange={e => {
                    this.handleChange({host_header: e.target.value})
                  }}>
                  <option value="origin_host_name">Use Origin Hostname</option>
                  <option value="published_name">Use Published Hostname</option>
                  <option value="other">Use Other Hostname Value</option>
                </Input>
                <Input type="text" placeholder="origin.foo.com"
                  style={activeService.get('host_header') === 'other' ? {} : {display:'none'}}/>
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
                <Input type="text" id="configure__edge__hostname__origin-forward-path" label="Origin Forward Path (optional)" />
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
                <Input type="text" id="configure__edge__hostname__origin-forward-path" label="Published Hostname Value" buttonAfter={<Button bsStyle="success">Add</Button>} />
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

          </Panel>


          {/* SECTION - Cache Rules */}

          <Panel>


            {/* Origin Cache Control */}

            <h2>Origin Cache Control</h2>

            <Row>
              <Col xs={12}>


                { /* Honor Origin Cache Control */}

                <Input type="checkbox" id="configure__edge__cache-rules__honor-origin-cache-control" label="Honor Origin Cache Control" />


                { /* Ignore case from origin */}

                <Input type="checkbox" id="configure__edge__cache-rules__ignore-case-from-origin" label="Ignore case from origin" />


                { /* Enable e-Tag support */}

                <Input type="checkbox" id="configure__edge__cache-rules__enable-e-tag-support" label="Enable e-Tag support" />

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
  activeService: React.PropTypes.instanceOf(Immutable.Map),
  serviceActions: React.PropTypes.object
}

function mapStateToProps(state) {
  return {
    activeService: state.service.get('activeService')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    serviceActions: bindActionCreators(serviceActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Edge);
