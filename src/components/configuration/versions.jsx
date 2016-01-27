import React from 'react'
import Immutable from 'immutable'
import { Table } from 'react-bootstrap'

export class ConfigurationVersions extends React.Component {
  constructor(props) {
    super(props);

    this.activate = this.activate.bind(this)
    this.delete = this.delete.bind(this)
  }
  activate(index) {
    return e => {
      e.stopPropagation()
      this.props.activate(index)
    }
  }
  delete(id) {
    return e => {
      e.stopPropagation()
      this.props.delete(id)
    }
  }
  render() {
    return (
      <div className="configuration-versions">
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {this.props.fetching ?
              <tr><td colSpan="4">Loading...</td></tr> :
              this.props.configurations.map((configuration, i) =>
                <tr key={i}>
                  <td>{configuration.get('config_id')}</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>
                    <a href="#" onClick={this.activate(i)}>edit</a>
                    &nbsp;
                    <a href="#" onClick={this.delete(configuration.get('config_id'))}>delete</a>
                  </td>
                </tr>
              )}
          </tbody>
        </Table>
      </div>
    );
  }
}

ConfigurationVersions.displayName = 'ConfigurationVersions'
ConfigurationVersions.propTypes = {
  activate: React.PropTypes.func,
  configurations: React.PropTypes.instanceOf(Immutable.List),
  delete: React.PropTypes.func,
  fetching: React.PropTypes.bool
}

module.exports = ConfigurationVersions
