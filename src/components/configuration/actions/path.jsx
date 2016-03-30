import React from 'react'
import { Input, Modal } from 'react-bootstrap'
import Immutable from 'immutable'

import Select from '../../select'
import InputConnector from '../../input-connector'

class Path extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeActivity: 'add',
      activeDirection: 'to_origin'
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
  }
  handleChange(path) {
    return e => {
      this.props.changeValue(path, e.target.value)
    }
  }
  handleSelectChange(key, path) {
    return key, value => {
      if (key === 'activeActivity') {
        this.setState({
          activeActivity: value
        })
      } else if (key === 'activeDirection') {
        this.setState({
          activeDirection: value
        })
      }
      this.props.changeValue(path, value)
    }
  }
  render() {
    return (
      <div>
        <Modal.Header>
          <h1>Path</h1>
          <p>Lorem ipsum dolor sit amet</p>
        </Modal.Header>
        <Modal.Body>

          <div className="form-groups">
            <InputConnector show={true} />
            <div className="form-group">
              <label className="control-label">Activity</label>
              <Select className="input-select"
                onSelect={this.handleSelectChange('activeActivity',
                  ['edge_configuration', 'cache_rule', 'actions', 'path_activity']
                )}
                value={this.state.activeActivity}
                options={[
                  ['add', 'Add'],
                  ['modify', 'Modify'],
                  ['remove', 'Remove']]}/>
            </div>

            <Input type="text" label="Path"
              placeholder="Enter Path"
              onChange={this.handleChange(
                ['edge_configuration', 'cache_rule', 'actions', 'path_value']
              )}/>
          </div>

        <hr />

        <div className="form-group">
          <label className="control-label">Direction</label>
          <Select className="input-select"
            onSelect={this.handleSelectChange('activeDirection',
              ['edge_configuration', 'cache_rule', 'actions', 'path_direction']
            )}
            value={this.state.activeDirection}
            options={[
              ['to_origin', 'To Origin'],
              ['to_client', 'To Client'],
              ['to_both', 'To Both']]}/>
        </div>

        </Modal.Body>
      </div>
    )
  }
}

Path.displayName = 'Path'
Path.propTypes = {
  changeValue: React.PropTypes.func,
  path: React.PropTypes.array,
  set: React.PropTypes.instanceOf(Immutable.Map)
}

module.exports = Path
