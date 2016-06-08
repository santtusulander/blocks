import React from 'react'
import { Button, ButtonToolbar, Input, Modal, Panel } from 'react-bootstrap'
import Immutable from 'immutable'

import Select from '../../select'
import InputConnector from '../../input-connector'

class QueryString extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeFilter: 'exists',
      containsVal: '',
      queryString: props.match.get('cases').get(0).get(0)
    }

    this.handleQueryStringChange = this.handleQueryStringChange.bind(this)
    this.handleMatchesChange = this.handleMatchesChange.bind(this)
    this.handleContainsValChange = this.handleContainsValChange.bind(this)
    this.saveChanges = this.saveChanges.bind(this)
  }
  handleQueryStringChange(e) {
    this.setState({queryString: e.target.value})
  }
  handleContainsValChange(e) {
    this.setState({containsVal: e.target.value})
  }
  handleMatchesChange(value) {
    this.setState({
      activeFilter: value,
      containsVal: ''
    })
  }
  saveChanges() {
    this.props.changeValue(
      this.props.path.concat(['cases', 0, 0]),
      this.state.queryString
    )
    this.props.close()
  }
  render() {
    const hasContainingRule = this.state.activeFilter === 'contains' ||
      this.state.activeFilter === 'does_not_contain';
    return (
      <div>
        <Modal.Header>
          <h1>Query String</h1>
          <p>Match a query string like sessionID</p>
        </Modal.Header>
        <Modal.Body>

          <Input type="text" label="Name"
            placeholder="Enter Query String"
            id="matches_query-string"
            value={this.state.queryString}
            onChange={this.handleQueryStringChange}/>

          <hr />

          <div className="form-groups">
            <InputConnector show={hasContainingRule} noLabel={true} />
            <div className="form-group">
              <Select className="input-select"
                onSelect={this.handleMatchesChange}
                value={this.state.activeFilter}
                options={[
                  ['exists', 'Exists'],
                  ['does_not_exist', 'Does not exist'],
                  ['contains', 'Contains'],
                  ['does_not_contain', 'Does not contain']]}/>
            </div>

            <Panel className="form-panel" collapsible={true}
              expanded={hasContainingRule}>
              <Input type="text" label="Value"
                value={this.state.containsVal}
                onChange={this.handleContainsValChange}/>
            </Panel>
          </div>

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

QueryString.displayName = 'QueryString'
QueryString.propTypes = {
  changeValue: React.PropTypes.func,
  close: React.PropTypes.func,
  match: React.PropTypes.instanceOf(Immutable.Map),
  path: React.PropTypes.array
}

module.exports = QueryString
