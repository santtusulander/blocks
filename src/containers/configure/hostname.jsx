import React from 'react'

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
} from 'react-bootstrap';




class Hostname extends React.Component {
  onSubmit() {
    alert('form submitted');
  }
  render() {
    return (
      <div className="container">

        <h1 className="page-header">Configure - Hostname</h1>

        <form onSubmit={this.onSubmit}>

          <Panel>


            {/* Origin Hostname */}

            <Row>
              <Col xs={10}>
                <Input type="text" id="configure__edge__hostname__origin-hostname" label="Origin Hostname" />
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
                <Input type="number" id="configure__edge__hostname__origin-port" label="Origin Port" />
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
                <Input type="select" id="configure__edge__hostname__origin-hostname-value" label="Origin Hostname Value">
                  <option value="1">Use Origin Hostname</option>
                  <option value="2">Use Published Hostname</option>
                  <option value="3">Use Other Hostname Value</option>
                </Input>
                <Input type="text" id="configure__edge__hostname__origin-hostname-value-other" placeholder="origin.foo.com" />
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

Hostname.displayName = 'Hostname'
Hostname.propTypes = {}

module.exports = Hostname
