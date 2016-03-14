import React from 'react'
import { Input, Modal } from 'react-bootstrap'
import Immutable from 'immutable'

import Select from '../../select'

class Hostname extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeFilter: 'matches'
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
  }
  handleChange(path) {
    return e => {
      this.props.changeValue(path, e.target.value)
    }
  }
  handleSelectChange(path) {
    return value => {
      this.setState({
        activeFilter: value
      })
      this.props.changeValue(path, value)
    }
  }
  render() {
    return (
      <div>
        <Modal.Header>
          <h1>Hostname</h1>
          <p>Match a hostname like www.foobar.com</p>
        </Modal.Header>
        <Modal.Body>

          <Input type="text" label="Hostname"
            placeholder="www.foobar.com"
            id="matches_hostname"
            value={this.props.match.get('cases').get(0).get(0)}
            onChange={this.handleChange(
              this.props.path.concat(['cases', 0, 0])
            )}/>

          <Select className="input-select"
            onSelect={this.handleSelectChange(
              ['edge_configuration', 'cache_rule', 'matches', 'hostname']
            )}
            value={this.state.activeFilter}
            options={[
              ['matches', 'Matches'],
              ['does_not_match', 'Does not match']]}/>

        </Modal.Body>
      </div>
    )
  }
}

Hostname.displayName = 'Hostname'
Hostname.propTypes = {
  changeValue: React.PropTypes.func,
  match: React.PropTypes.instanceOf(Immutable.Map),
  path: React.PropTypes.array
}

module.exports = Hostname
