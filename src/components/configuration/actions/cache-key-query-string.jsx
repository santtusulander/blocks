import React from 'react'
import { Input, Modal, Panel } from 'react-bootstrap'
import Immutable from 'immutable'

import Select from '../../select'
import InputConnector from '../../input-connector'

class CacheKeyQueryString extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeFilter: 'include_all_query_parameters'
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
    const hasContainingRule =
      this.state.activeFilter === 'include_some_parameters' ||
      this.state.activeFilter === 'ignore_some_parameters'
    return (
      <div>
        <Modal.Header>
          <h1>Cache Key - Query String</h1>
          <p>Lorem ipsum dolor sit amet</p>
        </Modal.Header>
        <Modal.Body>

          <div className="form-groups">
            <InputConnector show={hasContainingRule} />
            <div className="form-group">
              <label className="control-label">Cache Key</label>
              <Select className="input-select"
                onSelect={this.handleSelectChange(
                  ['edge_configuration', 'cache_rule', 'actions', 'cache_key']
                )}
                value={this.state.activeFilter}
                options={[
                  ['include_all_query_parameters', 'Include all query parameters'],
                  ['ignore_all_query_parameters', 'Ignore all query parameters'],
                  ['include_some_parameters', 'Include some parameters'],
                  ['ignore_some_parameters', 'Ignore some parameters']]}/>
            </div>

            <Panel className="form-panel" collapsible={true}
              expanded={hasContainingRule}>
              <Input type="text" label="Query Name"
                placeholder="Enter Query Name"
                onChange={this.handleChange(
                  ['edge_configuration', 'cache_rule', 'actions', 'cache_key_value']
                )}/>
            </Panel>
          </div>

        </Modal.Body>
      </div>
    )
  }
}

CacheKeyQueryString.displayName = 'CacheKeyQueryString'
CacheKeyQueryString.propTypes = {
  changeValue: React.PropTypes.func,
  path: React.PropTypes.array,
  set: React.PropTypes.instanceOf(Immutable.Map)
}

module.exports = CacheKeyQueryString
