import React from 'react'

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
} from 'react-bootstrap';


class AddCacheRule extends React.Component {
  onSubmit() {
    alert('form submitted');
  }
  render() {
    return (
      <div className="container">

        <h1 className="page-header">Configure - Add Cache Rule</h1>

          <form onSubmit={this.onSubmit}>

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
              <Col xs={2}>
                <OverlayTrigger trigger="click" placement="top" rootClose={true} overlay={
                  <Popover id="popover-rule-type" title="Info">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </Popover>
                }>
                  <Button bsStyle="info">?</Button>
                </OverlayTrigger>
              </Col>
            </Row>


            {/* Rule Value */}

            <Row>
              <Col xs={10}>
                <Input type="text" id="configure__edge__add-cache-rule__rule-value" label="Rule Value" placeholder="text/html" />
              </Col>
              <Col xs={2}>
                <OverlayTrigger trigger="click" placement="top" rootClose={true} overlay={
                  <Popover id="popover-rule-value" title="Info">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </Popover>
                }>
                  <Button bsStyle="info">?</Button>
                </OverlayTrigger>
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
              <Col xs={2}>
                <OverlayTrigger trigger="click" placement="top" rootClose={true} overlay={
                  <Popover id="popover-rule-type" title="Info">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </Popover>
                }>
                  <Button bsStyle="info">?</Button>
                </OverlayTrigger>
              </Col>
            </Row>


            {/* No-Store */}

            <Row>
              <Col xs={10}>
                <Input type="checkbox" id="configure__edge__add-cache-rule__no-store" label="No-Store" />
              </Col>
              <Col xs={2}>
                <OverlayTrigger trigger="click" placement="top" rootClose={true} overlay={
                  <Popover id="popover-rule-type" title="Info">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </Popover>
                }>
                  <Button bsStyle="info">?</Button>
                </OverlayTrigger>
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
              <Col xs={2}>
                <OverlayTrigger trigger="click" placement="top" rootClose={true} overlay={
                  <Popover id="popover-rule-value" title="Info">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </Popover>
                }>
                  <Button bsStyle="info">?</Button>
                </OverlayTrigger>
              </Col>
            </Row>


            {/* Action buttons */}

            <ButtonToolbar className="text-center">
              <Button>Cancel</Button>
              <Button type="submit" bsStyle="primary">Add</Button>
            </ButtonToolbar>

          </Panel>


          {/* Action buttons */}

          <ButtonToolbar>
            <Button>Save</Button>
            <Button>Cancel</Button>
            <Button type="submit" bsStyle="primary">Publish</Button>
          </ButtonToolbar>

        </form>

      </div>
    );
  }
}

AddCacheRule.displayName = 'AddCacheRule'
AddCacheRule.propTypes = {}

module.exports = AddCacheRule
