import React from 'react'

// React-Bootstrap
// ===============

import {
  Button,
  ButtonToolbar,
  Col,
  Input,
  Panel,
  Row,
  Table,
} from 'react-bootstrap';


class AdvancedCacheRules extends React.Component {
  onSubmit() {
    alert('form submitted');
  }
  render() {
    return (
      <div className="container">

        <h1 className="page-header">Configure - Advanced Cache Rules</h1>

        <form onSubmit={this.onSubmit}>

          <Panel>


            {/* Header Manipulation */}

            <h2>Header Manipulation</h2>

            <Row>
              <Col xs={12}>


                {/* Remove VARY Header */}

                <Input type="checkbox" id="configure__edge__advanced-cache-rules__remove-vary-header" label="Remove VARY Header" />


                {/* End User IP Address */}

                <Input type="checkbox" id="configure__edge__advanced-cache-rules__end-user-ip-address" label="End User IP Address" />


                {/* True Client IP */}

                <Input type="text" id="configure__edge__advanced-cache-rules__true-client-ip" label="Header Value" placeholder="True Client IP" />
                
              </Col>
            </Row>


            {/* Custom Header Rules */}

            <h3>Custom Header Rules</h3>

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

            <Button bsStyle="primary">Add Advanced Cache Rule</Button>


            {/* Query String */}

            <h2>Query String</h2>


            {/* Query String Caching */}

            <Input type="select" id="configure__edge__advanced-cache-rules__query-string-caching" label="Query String Caching">
              <option value="1">include all parameters</option>
              <option value="2">exclude all parameters</option>
              <option value="3">include only specified parameters</option>
              <option value="4">exclude only specified parameters</option>
            </Input>


            {/* Parameters */}

            <Input type="text" id="configure__edge__advanced-cache-rules__parameters" label="Parameters" placeholder="query string value" />


            {/* Exact Match */}

            <Input type="checkbox" id="configure__edge__advanced-cache-rules__exact-match" label="Exact Match" />

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

AdvancedCacheRules.displayName = 'AdvancedCacheRules'
AdvancedCacheRules.propTypes = {}

module.exports = AdvancedCacheRules
