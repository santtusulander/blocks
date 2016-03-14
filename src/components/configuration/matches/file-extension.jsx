import React from 'react'
import { Input, Modal } from 'react-bootstrap'
import Immutable from 'immutable'

import Select from '../../select'

class FileExtension extends React.Component {
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
          <h1>File Extension</h1>
          <p>Match one or more file extensions like .GIF, JPG, .MOV, .MP3</p>
        </Modal.Header>
        <Modal.Body>

          <Input type="text" label="File extension"
            placeholder="png, gif, jpg"
            id="matches_file-extension"
            value={this.props.match.get('cases').get(0).get(0)}
            onChange={this.handleChange(
              this.props.path.concat(['cases', 0, 0])
            )}/>

          <Input type="checkbox" label="Ignore case"
            onChange={this.handleChange(
              ['edge_configuration', 'cache_rule', 'matches', 'file_extension_ignore_case']
            )}/>

          <Select className="input-select"
            onSelect={this.handleSelectChange(
              ['edge_configuration', 'cache_rule', 'matches', 'file_extension']
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

FileExtension.displayName = 'FileExtension'
FileExtension.propTypes = {
  changeValue: React.PropTypes.func,
  match: React.PropTypes.instanceOf(Immutable.Map),
  path: React.PropTypes.array
}

module.exports = FileExtension
