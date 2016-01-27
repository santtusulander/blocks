import React from 'react'
import Immutable from 'immutable'
import { Button, ButtonToolbar, Input } from 'react-bootstrap'

class EditGroup extends React.Component {
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
        <Input type="text" label="Name" id="edit_group__name"
          value={this.props.group.getIn(['name'])}
          onChange={this.changeValue(['name'])}/>
        <Input type="textarea" label="Description" id="edit_group__description"
          value={this.props.group.getIn(['description'])}
          onChange={this.changeValue(['description'])}/>
        <Input type="text" label="Address Line 1" id="edit_group__address1"
          value={this.props.group.getIn(['address_lines', 0])}
          onChange={this.changeValue(['address_lines', 0])}/>
        <Input type="text" label="Address Line 2" id="edit_group__address2"
          value={this.props.group.getIn(['address_lines', 1])}
          onChange={this.changeValue(['address_lines', 1])}/>
        <Input type="text" label="City" id="edit_group__city"
          value={this.props.group.getIn(['city'])}
          onChange={this.changeValue(['city'])}/>
        <Input type="text" label="Postal Code" id="edit_group__postal_code"
          value={this.props.group.getIn(['postal_code'])}
          onChange={this.changeValue(['postal_code'])}/>
        <ButtonToolbar>
          <Button bsStyle="primary" onClick={this.cancelChanges}>Cancel</Button>
          <Button type="submit" bsStyle="primary">Save</Button>
        </ButtonToolbar>
      </form>
    )
  }
}

EditGroup.displayName = 'EditGroup'
EditGroup.propTypes = {
  cancelChanges: React.PropTypes.func,
  changeValue: React.PropTypes.func,
  group: React.PropTypes.instanceOf(Immutable.Map),
  saveChanges: React.PropTypes.func
}

module.exports = EditGroup
