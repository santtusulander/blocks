import React from 'react'

class Group extends React.Component {
  constructor(props) {
    super(props);

    this.deleteGroup = this.deleteGroup.bind(this)
  }
  deleteGroup(e) {
    e.stopPropagation()
    e.preventDefault()
    this.props.delete()
  }
  render() {
    return (
      <tr onClick={this.props.toggleActive}>
        <td>{this.props.id}</td>
        <td>{this.props.name}</td>
        <td>{this.props.description}</td>
        <td>
          <a href="#" onClick={this.deleteGroup}>Delete</a>
        </td>
      </tr>
    )
  }
}

Group.displayName = 'Group'
Group.propTypes = {
  delete: React.PropTypes.func,
  description: React.PropTypes.string,
  id: React.PropTypes.number,
  name: React.PropTypes.string,
  toggleActive: React.PropTypes.func
}

module.exports = Group
