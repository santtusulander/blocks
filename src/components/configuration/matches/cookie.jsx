import React from 'react'
import { Button, ButtonToolbar, Input, Modal, Panel } from 'react-bootstrap'
import Immutable from 'immutable'

import Select from '../../select'
import InputConnector from '../../input-connector'

class Cookie extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeFilter: 'exists',
      containsVal: '',
      cookie: props.match.get('cases').get(0).get(0)
    }

    this.handleCookieChange = this.handleCookieChange.bind(this)
    this.handleMatchesChange = this.handleMatchesChange.bind(this)
    this.handleContainsValChange = this.handleContainsValChange.bind(this)
    this.saveChanges = this.saveChanges.bind(this)
  }
  handleCookieChange(e) {
    this.setState({cookie: e.target.value})
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
      this.state.cookie
    )
    this.props.close()
  }
  render() {
    const hasContainingRule = this.state.activeFilter === 'contains' ||
      this.state.activeFilter === 'does_not_contain';
    return (
      <div>
        <Modal.Header>
          <h1>Cookie</h1>
          <p>Match a cookie like tracking</p>
        </Modal.Header>
        <Modal.Body>

          <Input type="text" label="Name"
            placeholder="Enter Cookie Name"
            id="matches_cookie"
            value={this.state.cookie}
            onChange={this.handleCookieChange}/>

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

Cookie.displayName = 'Cookie'
Cookie.propTypes = {
  changeValue: React.PropTypes.func,
  close: React.PropTypes.func,
  match: React.PropTypes.instanceOf(Immutable.Map),
  path: React.PropTypes.array
}

module.exports = Cookie
