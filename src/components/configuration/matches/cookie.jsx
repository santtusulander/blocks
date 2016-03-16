import React from 'react'
import { Input, Modal, Panel } from 'react-bootstrap'
import Immutable from 'immutable'

import Select from '../../select'
import InputConnector from '../../input-connector'

class Cookie extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeFilter: 'exists'
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
            value={this.props.match.get('cases').get(0).get(0)}
            onChange={this.handleChange(
              this.props.path.concat(['cases', 0, 0])
            )}/>

          <hr />

          <div className="form-groups">
            <InputConnector show={hasContainingRule} noLabel={true} />
            <div className="form-group">
              <Select className="input-select"
                onSelect={this.handleSelectChange(
                  ['edge_configuration', 'cache_rule', 'matches', 'cookie_rule']
                )}
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
              onChange={this.handleChange(
                ['edge_configuration', 'cache_rule', 'matches', 'cookie_rule_value']
              )}/>
            </Panel>
          </div>

        </Modal.Body>
      </div>
    )
  }
}

Cookie.displayName = 'Cookie'
Cookie.propTypes = {
  changeValue: React.PropTypes.func,
  match: React.PropTypes.instanceOf(Immutable.Map),
  path: React.PropTypes.array
}

module.exports = Cookie
