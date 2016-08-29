import React from 'react'

import {FormattedMessage} from 'react-intl'

class Group extends React.Component {
  constructor(props) {
    super(props);

    this.deleteGroup = this.deleteGroup.bind(this)
  }
  deleteGroup(e) {
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
          <a href="#" onClick={this.deleteGroup}><FormattedMessage id="portal.button.delete"/></a>
        </td>
      </tr>
    )
  }
}

Group.displayName = 'Group'
Group.propTypes = {
  delete: React.PropTypes.func,
  description: React.PropTypes.string,
  id: React.PropTypes.string,
  name: React.PropTypes.string,
  toggleActive: React.PropTypes.func
}

module.exports = Group
