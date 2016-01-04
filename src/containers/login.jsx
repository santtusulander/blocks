import React from 'react'

// React-Bootstrap
// ===============

import {
  Button,
  Col,
  Input,
  Row
} from 'react-bootstrap';


class Login extends React.Component {
  onSubmit() {
    alert('form submitted');
  }
  render() {
    return (

      <div className="container">

        <h1 className="page-header">Login</h1>

        <form onSubmit={this.onSubmit}>


          {/* Username*/}

          <Row>
            <Col xs={6}>
              <Input type="text" id="login__username" label="Username" />
            </Col>
          </Row>


          {/* Password */}

          <Row>
            <Col xs={6}>
              <Input type="password" id="login__password" label="Password" />
            </Col>
          </Row>


          {/* Action buttons */}

          <Button type="submit" bsStyle="primary">Login</Button>

        </form>

      </div>

    );
  }
}

Login.displayName = 'Login'
Login.propTypes = {}

module.exports = Login
