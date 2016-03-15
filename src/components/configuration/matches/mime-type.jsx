import React from 'react'
import { Input, Modal } from 'react-bootstrap'
import Immutable from 'immutable'

import Select from '../../select'

class MimeType extends React.Component {
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
          <p>Match one or more MIME types like text/html, application/javascript</p>
        </Modal.Header>
        <Modal.Body>

          <Input type="textarea" label="Media Type"
            placeholder="Enter MIME Types separated by commas"
            id="matches_mime-type"
            value={this.props.match.get('cases').get(0).get(0)}
            onChange={this.handleChange(
              this.props.path.concat(['cases', 0, 0])
            )}/>

          <Select className="input-select"
            onSelect={this.handleSelectChange(
              ['edge_configuration', 'cache_rule', 'matches', 'mime_types']
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

MimeType.displayName = 'MimeType'
MimeType.propTypes = {
  changeValue: React.PropTypes.func,
  match: React.PropTypes.instanceOf(Immutable.Map),
  path: React.PropTypes.array
}

module.exports = MimeType
