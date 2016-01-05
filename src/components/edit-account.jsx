import React from 'react'

// React-Bootstrap
// ===============

import {
  Button,
  Input
} from 'react-bootstrap';


class EditAccount extends React.Component {
  render() {
    return (
      <form onSubmit={this.props.saveChanges}>
        <Input type="text" label="Address Line 1" id="edit_account__address1"/>
        <Input type="text" label="Address Line 2" id="edit_account__address2"/>
        <Button type="submit" bsStyle="primary">Save</Button>
      </form>

    );
  }
}

EditAccount.displayName = 'EditAccount'
EditAccount.propTypes = {
  changeValue: React.PropTypes.func,
  saveChanges: React.PropTypes.func
}

module.exports = EditAccount
