import React from 'react'
import { Input, Modal } from 'react-bootstrap'
import Immutable from 'immutable'

import Select from '../../select'

class IpAddress extends React.Component {
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
          <h1>MIME Type</h1>
          <p>Match one or more IP Numbers or Ranges like 127.0.0.1,
            63.55.23.1/24, 2001:0:9d38:6ab8:38bb:38d0:7e3f:4fb9</p>
        </Modal.Header>
        <Modal.Body>

          <Input type="textarea" label="Media Type"
            placeholder="127.0.0.1, 63.55.23.1/24,
              2001:0:9d38:6ab8:38bb:38d0:7e3f:4fb9"
            id="matches_mime-type"
            value={this.props.match.get('cases').get(0).get(0)}
            onChange={this.handleChange(
              this.props.path.concat(['cases', 0, 0])
            )}/>

          <Input type="checkbox" label="Include X-Forwarded-For value"
            onChange={this.handleChange(
              ['edge_configuration', 'cache_rule', 'matches', 'ip_address_include_x_forwarded_for']
            )}/>

          <Select className="input-select"
            onSelect={this.handleSelectChange(
              ['edge_configuration', 'cache_rule', 'matches', 'ip_address']
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

IpAddress.displayName = 'IpAddress'
IpAddress.propTypes = {
  changeValue: React.PropTypes.func,
  match: React.PropTypes.instanceOf(Immutable.Map),
  path: React.PropTypes.array
}

module.exports = IpAddress
