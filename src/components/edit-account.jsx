import React from 'react'
import Immutable from 'immutable'
import { Button, ButtonToolbar, Input } from 'react-bootstrap'

import { FormattedMessage } from 'react-intl'

class EditAccount extends React.Component {
  constructor(props) {
    super(props);

    this.changeValue = this.changeValue.bind(this)
    this.saveChanges = this.saveChanges.bind(this)
    this.cancelChanges = this.cancelChanges.bind(this)
  }
  changeValue(valPath) {
    return (e) => {
      this.props.changeValue(valPath, e.target.value)
    }
  }
  saveChanges(e) {
    e.preventDefault()
    this.props.saveChanges()
  }
  cancelChanges(e) {
    e.preventDefault()
    this.props.cancelChanges()
  }
  render() {
    return (
      <form onSubmit={this.saveChanges}>
        <Input type="text" label="Name" id="edit_account__name"
          value={this.props.account.getIn(['name'])}
          onChange={this.changeValue(['name'])}/>
        <Input type="textarea" label="Description" id="edit_account__description"
          value={this.props.account.getIn(['description'])}
          onChange={this.changeValue(['description'])}/>
        <Input type="text" label="Address Line 1" id="edit_account__address1"
          value={this.props.account.getIn(['address_lines', 0])}
          onChange={this.changeValue(['address_lines', 0])}/>
        <Input type="text" label="Address Line 2" id="edit_account__address2"
          value={this.props.account.getIn(['address_lines', 1])}
          onChange={this.changeValue(['address_lines', 1])}/>
        <Input type="text" label="City" id="edit_account__city"
          value={this.props.account.getIn(['city'])}
          onChange={this.changeValue(['city'])}/>
        <Input type="text" label="Postal Code" id="edit_account__postal_code"
          value={this.props.account.getIn(['postal_code'])}
          onChange={this.changeValue(['postal_code'])}/>
        <ButtonToolbar>
          <Button bsStyle="primary" onClick={this.cancelChanges}><FormattedMessage id="portal.button.cancel"/></Button>
          <Button type="submit" bsStyle="primary"><FormattedMessage id="portal.button.save"/></Button>
        </ButtonToolbar>
      </form>
    )
  }
}

EditAccount.displayName = 'EditAccount'
EditAccount.propTypes = {
  account: React.PropTypes.instanceOf(Immutable.Map),
  cancelChanges: React.PropTypes.func,
  changeValue: React.PropTypes.func,
  saveChanges: React.PropTypes.func
}

module.exports = EditAccount
