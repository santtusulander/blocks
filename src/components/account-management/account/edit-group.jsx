import React from 'react'
import {Button, Input} from 'react-bootstrap'

class AccountManagementAccountEditGroup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: props.name
    }

    this.editName = this.editName.bind(this)
    this.focusInput = this.focusInput.bind(this)
    this.save = this.save.bind(this)
  }
  componentDidMount() {
    this.refs.input.refs.input.focus()
  }
  editName(e) {
    this.setState({name: e.target.value})
  }
  focusInput(e) {
    e.stopPropagation()
  }
  save(e) {
    e.stopPropagation()
    this.props.save(this.state.name)
  }
  render() {

    return (
      <tr className="edit-row">
        <td colSpan={2}>
          <Input type="text" value={this.state.name} onChange={this.editName}
            onClick={this.focusInput}
            placeholder="Enter name" ref="input"/>
        </td>
        <td>
          <Button onClick={this.save} bsStyle="primary" disabled={!this.state.name}>SAVE</Button>
        </td>
      </tr>
    )
  }
}

AccountManagementAccountEditGroup.displayName = 'AccountManagementAccountEditGroup'
AccountManagementAccountEditGroup.propTypes = {
  name: React.PropTypes.string,
  save: React.PropTypes.func
}

module.exports = AccountManagementAccountEditGroup
