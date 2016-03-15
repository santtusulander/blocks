import React from 'react'
import { Input, Modal, Panel } from 'react-bootstrap'
import Immutable from 'immutable'

import Select from '../../select'

class Header extends React.Component {
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
          <h1>Header</h1>
          <p>Match a header like originvalue</p>
        </Modal.Header>
        <Modal.Body>

          <Input type="text" label="Name"
            placeholder="Enter Header Name"
            id="matches_header"
            value={this.props.match.get('cases').get(0).get(0)}
            onChange={this.handleChange(
              this.props.path.concat(['cases', 0, 0])
            )}/>

          <hr />

          <div className="form-groups">
            <div className={'input-connector no-label' +
              (hasContainingRule ? ' show' : '')}></div>
            <div className="form-group">
              <Select className="input-select"
                onSelect={this.handleSelectChange(
                  ['edge_configuration', 'cache_rule', 'matches', 'header_rule']
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
                placeholder="Enter Rule Value"
                onChange={this.handleChange(
                  ['edge_configuration', 'cache_rule', 'matches', 'header_rule_value']
                )}/>
            </Panel>
          </div>

        </Modal.Body>
      </div>
    )
  }
}

Header.displayName = 'Header'
Header.propTypes = {
  changeValue: React.PropTypes.func,
  match: React.PropTypes.instanceOf(Immutable.Map),
  path: React.PropTypes.array
}

module.exports = Header
