import React from 'react'
import { Button, ButtonToolbar, Input, Modal, Panel } from 'react-bootstrap'
import Immutable from 'immutable'

import Select from '../../select'
import InputConnector from '../../input-connector'
import {
  matchFilterChildPaths,
  getMatchFilterType,
  WILDCARD_REGEXP
} from '../../../util/policy-config'

import { FormattedMessage } from 'react-intl'

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
  componentWillReceiveProps(nextProps) {
    if(!Immutable.is(nextProps.match, this.props.match)) {
      const fieldDetail = nextProps.match.get('field_detail')
      const caseKey = nextProps.match.getIn(['cases', 0, 0])
      const containsVal = fieldDetail ? caseKey : ''
      this.setState({
        activeFilter: getMatchFilterType(nextProps.match),
        containsVal: containsVal,
        val: fieldDetail ? fieldDetail : caseKey
      })
    }
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
    const children = this.props.match
      .getIn(matchFilterChildPaths[getMatchFilterType(this.props.match)])
    let newMatch = this.props.match
    if(this.props.contains) {
      newMatch = newMatch.set('field_detail', this.state.val)
      switch (this.state.activeFilter) {
        case 'exists':
          newMatch = newMatch
            .set('cases', Immutable.fromJS([
              [WILDCARD_REGEXP, children]
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
              [WILDCARD_REGEXP, []]
            ]))
            .set('default', children)
          break
        case 'does_not_contain':
          newMatch = newMatch
            .set('cases', Immutable.fromJS([
              [this.state.containsVal, []],
              [WILDCARD_REGEXP, children]
            ]))
            .delete('default')
          break
      }
    }
    // if there's no contain value, use val as the child key
    else {
      newMatch = newMatch.delete('field_detail')
      switch (this.state.activeFilter) {
        case 'exists':
          newMatch = newMatch
            .set('cases', Immutable.fromJS([
              [this.state.val || WILDCARD_REGEXP, children]
            ]))
            .delete('default')
          break
        case 'does_not_exist':
          newMatch = newMatch
            .set('cases', Immutable.fromJS([
              [this.state.val || WILDCARD_REGEXP, []]
            ]))
            .set('default', children)
          break
      }
    }
    this.props.changeValue(this.props.path, newMatch)
    this.props.close()
  }
  render() {
    const hasContainingRule = this.state.activeFilter === 'contains' ||
      this.state.activeFilter === 'does_not_contain';
    let matchOpts = [
      ['exists', <FormattedMessage id="portal.policy.edit.matcher.exists.text"/>],
      ['does_not_exist', <FormattedMessage id="portal.policy.edit.matcher.doesntExist.text"/>]
    ]
    if(this.props.contains) {
      matchOpts.push(['contains', <FormattedMessage id="portal.policy.edit.matcher.contains.text"/>])
      matchOpts.push(['does_not_contain', <FormattedMessage id="portal.policy.edit.matcher.doesntContain.text"/>])
    }
    return (
      <div>
        <Modal.Header>
          <h1>{this.props.name}</h1>
          <p>{this.props.description}</p>
        </Modal.Header>
        <Modal.Body>
          <Input type="text" label={this.props.label}
            placeholder={this.props.placeholder}
            id="matches_val"
            value={this.state.val}
            onChange={this.handleValChange}/>

          <hr />

          {!this.props.disableRuleSelector &&
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
          }

          <ButtonToolbar className="text-right">
            <Button bsStyle="default" onClick={this.props.close}>
              <FormattedMessage id="portal.policy.edit.policies.cancel.text" />
            </Button>
            <Button bsStyle="primary" onClick={this.saveChanges}>
              <FormattedMessage id="portal.policy.edit.policies.saveMatch.text" />
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
  disableRuleSelector: React.PropTypes.bool,
  label: React.PropTypes.string,
  match: React.PropTypes.instanceOf(Immutable.Map),
  name: React.PropTypes.string,
  path: React.PropTypes.instanceOf(Immutable.List),
  placeholder: React.PropTypes.string
}

module.exports = Matcher
