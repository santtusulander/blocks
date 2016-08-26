import React from 'react'
import { Link } from 'react-router'

import {FormattedMessage} from 'react-intl'

class Host extends React.Component {
  constructor(props) {
    super(props);

    this.deleteHost = this.deleteHost.bind(this)
  }
  deleteHost(e) {
    e.stopPropagation()
    e.preventDefault()
    this.props.delete(this.props.id)
  }
  render() {
    return (
      <tr>
        <td>{this.props.id}</td>
        <td>{this.props.name}</td>
        <td>{this.props.description}</td>
        <td>
          <Link to={`/configurations/${this.props.brand}/${this.props.account}/${this.props.group}/${this.props.id}`}>
            <FormattedMessage id="portal.button.configure"/>
          </Link> <a href="#" onClick={this.deleteHost}><FormattedMessage id="portal.button.delete"/></a>
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
