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


class CacheRules extends React.Component {
  onSubmit() {
    alert('form submitted');
  }
  render() {
    return (
      <div className="container">

        <h1 className="page-header">Configure - Add Cache Rule</h1>

        <form onSubmit={this.onSubmit}>

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

CacheRules.displayName = 'CacheRules'
CacheRules.propTypes = {}

module.exports = CacheRules
