import React from 'react'
import { Button, ButtonToolbar, Input, Modal, Panel } from 'react-bootstrap'
import Immutable from 'immutable'

import Select from '../../select'
import InputConnector from '../../input-connector'

const matchFilterChildPaths = {
  'exists': ['cases', 0, 1],
  'contains': ['cases', 0, 1],
  'does_not_exist': ['default'],
  'does_not_contain': ['cases', 1, 1]
}

function getMatchFilterType(match) {
  if(match.get('default')) {
    return 'does_not_exist'
  }
  if(match.get('cases').size > 1) {
    return 'does_not_contain'
  }
  return match.getIn(['cases', 0, 0]) === '.*' ? 'exists' : 'contains'
}

class Matcher extends React.Component {
  constructor(props) {
    super(props);
    const fieldDetail = props.match.get('field_detail')
    const caseKey = props.match.getIn(['cases', 0, 0])
    const containsVal = fieldDetail ? caseKey : ''

    this.state = {
      activeFilter: getMatchFilterType(props.match),
      containsVal: containsVal,
      val: fieldDetail ? fieldDetail : caseKey
    }

    this.handleValChange = this.handleValChange.bind(this)
    this.handleMatchesChange = this.handleMatchesChange.bind(this)
    this.handleContainsValChange = this.handleContainsValChange.bind(this)
    this.saveChanges = this.saveChanges.bind(this)
  }
  handleValChange(e) {
    this.setState({val: e.target.value})
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
    // matches with a contain value put val in field_detail and use containsVal
    // as child key
    if(this.props.contains) {
      const children = this.props.match
        .getIn(matchFilterChildPaths[getMatchFilterType(this.props.match)])
      let newMatch = this.props.match
        .set('field_detail', this.state.val)
      switch (this.state.activeFilter) {
        case 'exists':
          newMatch = newMatch
            .set('cases', Immutable.fromJS([
              ['.*', children]
            ]))
            .delete('default')
          break
        case 'contains':
          newMatch = newMatch
            .set('cases', Immutable.fromJS([
              [this.state.containsVal, children]
            ]))
            .delete('default')
          break
        case 'does_not_exist':
          newMatch = newMatch
            .set('cases', Immutable.fromJS([
              ['.*', []]
            ]))
            .set('default', children)
          break
        case 'does_not_contain':
          newMatch = newMatch
            .set('cases', Immutable.fromJS([
              [this.state.containsVal, []],
              ['.*', children]
            ]))
            .delete('default')
          break
      }
      // console.log(newMatch.toJS())
      this.props.changeValue(this.props.path, newMatch)
    }
    // if there's no contain value, use val as the child key
    else {
      this.props.changeValue(
        this.props.path.concat(['cases', 0, 0]),
        this.state.val
      )
    }
    this.props.close()
  }
  render() {
    const hasContainingRule = this.state.activeFilter === 'contains' ||
      this.state.activeFilter === 'does_not_contain';
    let matchOpts = [
      ['exists', 'Exists'],
      ['does_not_exist', 'Does not exist']
    ]
    if(this.props.contains) {
      matchOpts.push(['contains', 'Contains'])
      matchOpts.push(['does_not_contain', 'Does not contain'])
    }
    return (
      <div>
        <Modal.Header>
          <h1>{this.props.name}</h1>
          <p>{this.props.description}</p>
        </Modal.Header>
        <Modal.Body>

          <Input type="text" label="Name"
            placeholder={`Enter ${this.props.name} Name`}
            id="matches_val"
            value={this.state.val}
            onChange={this.handleValChange}/>

          <hr />

          <div className="form-groups">
            <InputConnector show={hasContainingRule} noLabel={true} />
            <div className="form-group">
              <Select className="input-select"
                onSelect={this.handleMatchesChange}
                value={this.state.activeFilter}
                options={matchOpts}/>
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

Matcher.displayName = 'Matcher'
Matcher.propTypes = {
  changeValue: React.PropTypes.func,
  close: React.PropTypes.func,
  contains: React.PropTypes.bool,
  description: React.PropTypes.string,
  match: React.PropTypes.instanceOf(Immutable.Map),
  name: React.PropTypes.string,
  path: React.PropTypes.array
}

module.exports = Matcher
