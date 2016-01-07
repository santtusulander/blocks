import React from 'react'
import { Link } from 'react-router'

class Host extends React.Component {
  constructor(props) {
    super(props);

    this.deleteHost = this.deleteHost.bind(this)
  }
  deleteHost(e) {
    e.stopPropagation()
    e.preventDefault()
    this.props.delete()
  }
  render() {
    return (
      <tr>
        <td>{this.props.id}</td>
        <td>{this.props.name}</td>
        <td>{this.props.description}</td>
        <td>
          <Link to={`/configure/${this.props.brand}/${this.props.account}/${this.props.group}/${this.props.id}`}>
            Configure
          </Link> <a href="#" onClick={this.deleteHost}>Delete</a>
        </td>
      </tr>
    )
  }
}

Host.displayName = 'Host'
Host.propTypes = {
  account: React.PropTypes.string,
  brand: React.PropTypes.string,
  delete: React.PropTypes.func,
  description: React.PropTypes.string,
  group: React.PropTypes.string,
  id: React.PropTypes.string,
  name: React.PropTypes.string
}

module.exports = Host
