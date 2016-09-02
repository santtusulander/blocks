import React from 'react'
import {Button, Input, Modal, Row, Col, ButtonToolbar} from 'react-bootstrap'
import Immutable from 'immutable'

import IconAdd from '../icons/icon-add.jsx'
import IconTrash from '../icons/icon-trash.jsx'
import IconArrowUp from '../icons/icon-arrow-up.jsx'
import IconArrowDown from '../icons/icon-arrow-down.jsx'
import TruncatedTitle from '../truncated-title'
import {
  matchFilterChildPaths,
  parsePolicy
} from '../../util/policy-config'

import { FormattedMessage } from 'react-intl'

class ConfigurationPolicyRuleEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      originalConfig: props.config
    }

    this.handleChange = this.handleChange.bind(this)
    this.addMatch = this.addMatch.bind(this)
    this.addAction = this.addAction.bind(this)
    this.deleteMatch = this.deleteMatch.bind(this)
    this.deleteSet = this.deleteSet.bind(this)
    this.moveSet = this.moveSet.bind(this)
    this.activateMatch = this.activateMatch.bind(this)
    this.activateSet = this.activateSet.bind(this)
    this.cancelChanges = this.cancelChanges.bind(this)
    this.submitForm = this.submitForm.bind(this)
  }
  handleChange(path) {
    return e => this.props.changeValue(path, e.target.value)
  }
  addMatch(deepestMatch) {
    return e => {
      e.preventDefault()
      const childPath = matchFilterChildPaths[deepestMatch.filterType]
      const newPath = deepestMatch.path.concat(childPath)
      const currentSet = this.props.config.getIn(newPath)
      let newMatch = Immutable.fromJS([
        {match: {field: null, cases: [['',[]]]}}
      ])
      if(currentSet) {
        const newSetPath = [0, 'match'].concat(childPath)
        newMatch = newMatch.setIn(newSetPath, currentSet)
      }
      this.props.changeValue([],
        this.props.config.setIn(
          newPath,
          newMatch
        )
      )
      this.props.activateMatch(newPath.concat([0, 'match']))
    }
  }
  addAction(deepestMatch) {
    return e => {
      e.preventDefault()
      const childPath = matchFilterChildPaths[deepestMatch.filterType]
      const newPath = deepestMatch.path.concat(childPath)
      const currentSets = this.props.config.getIn(newPath)
      const newSets = currentSets.push(Immutable.fromJS({set: {"": {}}}))
      this.props.changeValue([],
        this.props.config.setIn(
          newPath,
          newSets
        )
      )
      this.props.activateSet(newPath.concat([newSets.size - 1, 'set', '']))
    }
  }
  deleteMatch(path) {
    return e => {
      e.preventDefault()
      e.stopPropagation()
      const children = this.props.config.getIn(path.concat(['cases', 0, 1]))
      this.props.changeValue(
        path.slice(0, -2),
        children
      )
      this.props.activateMatch(null)
    }
  }
  deleteSet(path) {
    return e => {
      e.preventDefault()
      e.stopPropagation()
      const setContainerPath = path.slice(0, -3)
      const filtered = this.props.config.getIn(setContainerPath)
        .filterNot((val, i) => i === path[path.length-3])
      this.props.changeValue(setContainerPath, filtered)
      this.props.activateSet(null)
    }
  }
  moveSet(path, newIndex) {
    return e => {
      e.preventDefault()
      e.stopPropagation()
      const set = this.props.config.getIn(path.slice(0, -2))
      const updated = this.props.config
        .getIn(path.slice(0, -3))
        .filterNot((val, i) => i === path[path.length-3])
        .insert(newIndex, set)
      this.props.changeValue(path.slice(0, -3), updated)
      this.props.activateSet(null)
    }
  }
  activateMatch(newPath) {
    return () => this.props.activateMatch(newPath)
  }
  activateSet(newPath) {
    return () => this.props.activateSet(newPath)
  }
  cancelChanges() {
    // If this started out as an empty rule, remove it
    if(Immutable.is(
      this.state.originalConfig.getIn(this.props.rulePath),
      Immutable.fromJS(
        {match: {field: null, cases: [['',[]]]}}
      )
    )) {
      const parentPath = this.props.rulePath.slice(0, -1)
      const newConfig = this.state.originalConfig.setIn(
        parentPath,
        this.state.originalConfig.getIn(parentPath)
          .splice(this.props.rulePath[this.props.rulePath.length - 1], 1)
      )
      this.props.changeValue([], newConfig)
    }
    else {
      this.props.changeValue([], this.state.originalConfig)
    }
    this.props.hideAction()
  }
  submitForm(e) {
    e.preventDefault()
    this.props.hideAction()
  }
  render() {
    const flattenedPolicy = parsePolicy(this.props.rule, this.props.rulePath)
    return (
      <form className="configuration-policy-rule-edit" onSubmit={this.submitForm}>

        {/* [
          ['request_method', 'Request Method'],
          ['request_scheme', 'Request Scheme'],
          ['request_url', 'Request URL'],
          ['request_host', 'Request Host'],
          ['request_path', 'Request Path'],
          ['request_query', 'Request Query'],
          ['request_query_arg', 'Request Query Argument'],
          ['request_header', 'Request Header'],
          ['request_cookie', 'Request Cookie'],
          ['response_code', 'Response Code'],
          ['response_header', 'Response Header']
        ] */}
        <Modal.Header>
          <h1><FormattedMessage id="portal.policy.edit.editRule.addPolicy.text"/></h1>
          <p>
            {this.props.location.query.name}
          </p>
        </Modal.Header>
        <Modal.Body>

          <h3><FormattedMessage id="portal.policy.edit.editRule.ruleName.text"/></h3>

          <Input type="text" id="configure__edge__add-cache-rule__rule-name"
            value={this.props.config.getIn(this.props.rulePath.concat(['rule_name']))}
            onChange={this.handleChange(this.props.rulePath.concat(['rule_name']))}/>

          <Row className="header-btn-row">
            <Col sm={8}>
              <h3><FormattedMessage id="portal.policy.edit.editRule.matchConditions.text"/></h3>
            </Col>
            <Col sm={4} className="text-right">
              <Button bsStyle="primary" className="btn-icon btn-add-new"
                onClick={this.addMatch(flattenedPolicy.matches[0])}>
                <IconAdd />
              </Button>
            </Col>
          </Row>

          <div className="conditions">
            {flattenedPolicy.matches.map((match, i) => {
              let values = match.values[0]
              if(match.values.length > 1) {
                values = `${values} and ${match.values.length - 1} others`
              }
              let active = false
              if(Immutable.fromJS(match.path).equals(Immutable.fromJS(this.props.activeMatchPath))) {
                active = true
              }
              let filterText = ''
              if(match.filterType === 'exists') {
                filterText = 'Exists'
              }
              else if(match.filterType === 'does_not_exist') {
                filterText = 'Does not exist'
              }
              else if(match.filterType === 'contains') {
                filterText = `Contains ${match.containsVal}`
              }
              else if(match.filterType === 'does_not_contain') {
                filterText = `Does not contain ${match.containsVal}`
              }
              return (
                <div key={i}
                  className={active ? 'condition clearfix active' : 'condition clearfix'}
                  onClick={this.activateMatch(match.path)}>
                  <Col xs={7}>
                    {match.field ?
                      <div className="condition-name">
                        {match.field}&nbsp;:&nbsp;
                        <TruncatedTitle
                          content={match.fieldDetail ? match.fieldDetail : match.values.join(', ')}/>
                      </div>
                      : <p><FormattedMessage id="portal.policy.edit.editRule.chooseCondition.text"/></p>
                    }
                  </Col>
                  <Col xs={3}>
                    <p>
                      {filterText}
                    </p>
                  </Col>
                  <Col xs={2} className="text-right">
                    <Button onClick={this.deleteMatch(match.path)} bsStyle="primary"
                      disabled={flattenedPolicy.matches.length < 2}
                      className="btn-link btn-icon">
                      <IconTrash/>
                    </Button>
                  </Col>
                </div>
              )
            })}
          </div>

          <Row className="header-btn-row">
            <Col xs={8}>
              <h3><FormattedMessage id="portal.policy.edit.editRule.actions.text"/></h3>
            </Col>
            <Col xs={4} className="text-right">
              <Button bsStyle="primary" className="btn-icon btn-add-new"
                onClick={this.addAction(flattenedPolicy.matches[0])}>
                <IconAdd />
              </Button>
            </Col>
          </Row>

          <div className="conditions">
            {flattenedPolicy.sets.map((set, i) => {
              let active = false
              if(Immutable.fromJS(set.path).equals(Immutable.fromJS(this.props.activeSetPath))) {
                active = true
              }
              return (
                <div key={i}
                  className={active ? 'condition clearfix active' : 'condition clearfix'}
                  onClick={this.activateSet(set.path)}>
                  <Col xs={8}>
                    <p>{i + 1} {set.setkey}</p>
                  </Col>
                  <Col xs={4} className="text-right">
                    <Button
                      disabled={i <= 0}
                      onClick={i > 0 ? this.moveSet(set.path, i-1) : ''}
                      bsStyle="primary"
                      className="btn-link btn-icon">
                      <IconArrowUp/>
                    </Button>
                    <Button
                      disabled={i >= flattenedPolicy.sets.length - 1}
                      onClick={i < flattenedPolicy.sets.length - 1 ?
                        this.moveSet(set.path, i+1) : ''}
                      bsStyle="primary"
                      className="btn-link btn-icon">
                      <IconArrowDown/>
                    </Button>
                    <Button onClick={this.deleteSet(set.path)} bsStyle="primary"
                      className="btn-link btn-icon">
                      <IconTrash/>
                    </Button>
                  </Col>
                </div>
              )
            })}
          </div>

          <ButtonToolbar className="text-right">
            <Button bsStyle="primary" onClick={this.cancelChanges}>
              <FormattedMessage id="portal.button.cancel"/>
            </Button>
            <Button bsStyle="primary" onClick={this.props.hideAction}>
              <FormattedMessage id="portal.button.add"/>
            </Button>
          </ButtonToolbar>

        </Modal.Body>
      </form>
    )
  }
}

ConfigurationPolicyRuleEdit.displayName = 'ConfigurationPolicyRuleEdit'
ConfigurationPolicyRuleEdit.propTypes = {
  activateMatch: React.PropTypes.func,
  activateSet: React.PropTypes.func,
  activeMatchPath: React.PropTypes.array,
  activeSetPath: React.PropTypes.array,
  changeActiveRuleType: React.PropTypes.func,
  changeValue: React.PropTypes.func,
  config: React.PropTypes.instanceOf(Immutable.Map),
  hideAction: React.PropTypes.func,
  location: React.PropTypes.object,
  rule: React.PropTypes.instanceOf(Immutable.Map),
  rulePath: React.PropTypes.array,
  saveChanges: React.PropTypes.func
}

module.exports = ConfigurationPolicyRuleEdit
