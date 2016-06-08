import React from 'react'
import { Button, ButtonToolbar, Input, Modal } from 'react-bootstrap'
import Immutable from 'immutable'

import Select from '../../select'

class Hostname extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeFilter: 'matches',
      hostname: props.match.get('cases').get(0).get(0)
    }

    this.handleHostnameChange = this.handleHostnameChange.bind(this)
    this.handleMatchesChange = this.handleMatchesChange.bind(this)
    this.saveChanges = this.saveChanges.bind(this)
  }
  handleHostnameChange(e) {
    this.setState({hostname: e.target.value})
  }
  handleMatchesChange(value) {
    this.setState({
      activeFilter: value
    })
  }
  saveChanges() {
    this.props.changeValue(
      this.props.path.concat(['cases', 0, 0]),
      this.state.hostname
    )
    this.props.close()
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
            placeholder="Enter Hostname"
            id="matches_hostname"
            value={this.state.hostname}
            onChange={this.handleHostnameChange}/>

          <Select className="input-select"
            onSelect={this.handleMatchesChange}
            value={this.state.activeFilter}
            options={[
              ['matches', 'Matches'],
              ['does_not_match', 'Does not match']]}/>

          <ButtonToolbar className="text-right">
            <Button bsStyle="default" onClick={this.props.close}>
              Cancel
            </Button>
            <Button bsStyle="primary" onClick={this.saveChanges}>
              Save Match
            </Button>
          </ButtonToolbar>
        </Modal.Body>
      </div>
    )
  }
}

Hostname.displayName = 'Hostname'
Hostname.propTypes = {
  changeValue: React.PropTypes.func,
  close: React.PropTypes.func,
  match: React.PropTypes.instanceOf(Immutable.Map),
  path: React.PropTypes.array
}

module.exports = Hostname
