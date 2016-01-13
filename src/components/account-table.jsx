import React from 'react'

class AccountTable extends React.Component {
  constructor(props) {
    super(props);

    this.deleteAccount = this.deleteAccount.bind(this)
  }
  deleteAccount(e) {
    e.stopPropagation()
    e.preventDefault()
    this.props.delete(this.props.id)
  }
  render() {
    return (
      <tr onClick={this.props.toggleActive}>
        <td>{this.props.id}</td>
        <td>{this.props.name}</td>
        <td>{this.props.description}</td>
        <td>
          <a href="#" onClick={this.deleteAccount}>Delete</a>
        </td>
      </tr>
    )
  }
}

AccountTable.displayName = 'Account'
AccountTable.propTypes = {
  delete: React.PropTypes.func,
  description: React.PropTypes.string,
  id: React.PropTypes.string,
  name: React.PropTypes.string,
  toggleActive: React.PropTypes.func
}

module.exports = AccountTable
