import React from 'react'
import { Button, ButtonToolbar, Input, Modal, Panel } from 'react-bootstrap'
import Immutable from 'immutable'

import Select from '../../select'
import InputConnector from '../../input-connector'

class CacheKeyQueryString extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeFilter: 'include_all_query_parameters',
      queryArgs: Immutable.List()
    }

    this.handleChangeArg = this.handleChangeArg.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.saveChanges = this.saveChanges.bind(this)
  }
  handleChangeArg(index) {
    return e => {
      const newArgs = this.state.queryArgs.set(index, e.target.value)
      this.setState({queryArgs: newArgs})
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
  saveChanges() {
    let newName = [
      {field: 'request_host'},
      {field: 'request_path'}
    ]
    if(this.state.activeFilter === 'include_all_query_parameters') {
      newName.push({field: 'request_query'})
    }
    else if(this.state.activeFilter === 'include_some_parameters') {
      this.state.queryArgs.forEach(queryArg => newName.push({
        field: 'request_query_arg',
        field_detail: queryArg
      }))
    }
    console.log(newName)
    this.props.changeValue(
      this.props.path,
      Immutable.fromJS({name: newName})
    )
    this.props.close()
  }
  render() {
    const hasContainingRule =
      this.state.activeFilter === 'include_some_parameters'
    return (
      <div>
        <Modal.Header>
          <h1>Cache Key - Query String</h1>
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
                  ['include_some_parameters', 'Include some parameters']]}/>
            </div>

            <Panel className="form-panel" collapsible={true}
              expanded={hasContainingRule}>
              <Input type="text" label="Query Name"
                placeholder="Enter Query Name"
                onChange={this.handleChangeArg(0)}/>
            </Panel>
          </div>

          <ButtonToolbar className="text-right">
            <Button bsStyle="default" onClick={this.props.close}>
              Cancel
            </Button>
            <Button bsStyle="primary" onClick={this.saveChanges}>
              Save Action
            </Button>
          </ButtonToolbar>

        </Modal.Body>
      </div>
    )
  }
}

CacheKeyQueryString.displayName = 'CacheKeyQueryString'
CacheKeyQueryString.propTypes = {
  changeValue: React.PropTypes.func,
  close: React.PropTypes.func,
  path: React.PropTypes.array,
  set: React.PropTypes.instanceOf(Immutable.Map)
}

module.exports = CacheKeyQueryString
