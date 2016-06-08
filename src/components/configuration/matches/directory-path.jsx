import React from 'react'
import { Button, ButtonToolbar, Input, Modal } from 'react-bootstrap'
import Immutable from 'immutable'

import Select from '../../select'

class DirectoryPath extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeFilter: 'matches',
      directory: props.match.get('cases').get(0).get(0)
    }

    this.handleDirectoryChange = this.handleDirectoryChange.bind(this)
    this.handleMatchesChange = this.handleMatchesChange.bind(this)
    this.saveChanges = this.saveChanges.bind(this)
  }
  handleDirectoryChange(e) {
    this.setState({directory: e.target.value})
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
          <h1>Directory Path</h1>
          <p>Match a directory path like /wp-admin/</p>
        </Modal.Header>
        <Modal.Body>

          <Input type="text" label="Path"
            placeholder="Enter Path"
            id="matches_directory-path"
            value={this.state.directory}
            onChange={this.handleDirectoryChange}/>

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

DirectoryPath.displayName = 'DirectoryPath'
DirectoryPath.propTypes = {
  changeValue: React.PropTypes.func,
  close: React.PropTypes.func,
  match: React.PropTypes.instanceOf(Immutable.Map),
  path: React.PropTypes.array
}

module.exports = DirectoryPath
