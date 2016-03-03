import React from 'react'
import { Input, Modal, Panel } from 'react-bootstrap'

import Select from '../../select'
import InputConnector from '../../input-connector'

class QueryString extends React.Component {
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
          <h1>Query String</h1>
          <p>Lorem ipsum dolor sit amet</p>
        </Modal.Header>
        <Modal.Body>

          <div className="form-groups">
            <InputConnector show={true}
              hasTwoEnds={this.state.activeActivity !== 'remove'} />
            <div className="form-group">
              <label className="control-label">Activity</label>
              <Select className="input-select"
                onSelect={this.handleSelectChange('activeActivity',
                  ['edge_configuration', 'cache_rule', 'actions', 'query_string']
                )}
                value={this.state.activeActivity}
                options={[
                  ['add', 'Add'],
                  ['modify', 'Modify'],
                  ['remove', 'Remove']]}/>
            </div>

            <Input type="text" label="Name"
              onChange={this.handleChange(
                ['edge_configuration', 'cache_rule', 'actions', 'query_string_name']
              )}/>
            <Panel className="form-panel" collapsible={true}
              expanded={this.state.activeActivity !== 'remove'}>
              <Input type="text" label="Value"
                onChange={this.handleChange(
                  ['edge_configuration', 'cache_rule', 'actions', 'query_string_value']
                )}/>
            </Panel>

          </div>

        <hr />

        <div className="form-group">
          <label className="control-label">Direction</label>
          <Select className="input-select"
            onSelect={this.handleSelectChange('activeDirection',
              ['edge_configuration', 'cache_rule', 'actions', 'query_string_direction']
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

QueryString.displayName = 'QueryString'
QueryString.propTypes = {
  changeValue: React.PropTypes.func
}

module.exports = QueryString
