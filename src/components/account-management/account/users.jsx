import React from 'react'
import Immutable from 'immutable'
import {Button, Row, Col} from 'react-bootstrap'

import IconAdd from '../../icons/icon-add.jsx'

class AccountManagementAccountUsers extends React.Component {
  render() {
    return (
      <div className="account-management-account-users">
        <Row className="header-btn-row">
          <Col sm={8}>
            <h3>
              {this.props.users.size} User{this.props.users.size === 1 ? '' : 's'}
            </h3>
          </Col>
          <Col sm={4} className="text-right">
            <Button bsStyle="success" className="btn-icon btn-add-new"
              onClick={this.addUser}>
              <IconAdd />
            </Button>
          </Col>
        </Row>
      </div>
    )
  }
}

AccountManagementAccountUsers.displayName = 'AccountManagementAccountUsers'
AccountManagementAccountUsers.propTypes = {
  users: React.PropTypes.instanceOf(Immutable.List)
}
AccountManagementAccountUsers.defaultProps = {
  users: Immutable.List([])
}

module.exports = AccountManagementAccountUsers
