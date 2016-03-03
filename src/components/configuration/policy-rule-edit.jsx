import React from 'react'
import {Button, Input, Modal, Row, Col, ButtonToolbar} from 'react-bootstrap'
import Immutable from 'immutable'

import IconAdd from '../icons/icon-add.jsx'
import IconTrash from '../icons/icon-trash.jsx'
import IconArrowUp from '../icons/icon-arrow-up.jsx'
import IconArrowDown from '../icons/icon-arrow-down.jsx'

function parsePolicy(policy, path) {
  // if this is a match
  if(policy.has('match')) {
    let {matches, sets} = policy.get('match').get('cases').reduce((fields, policyCase, i) => {
      const {matches, sets} = policyCase.get(1).reduce((combinations, subcase, j) => {
        // build up a path to the nested rules
        const nextPath = path.concat(['match','cases',i,1,j])
        // recurse to parse the nested policy rules
        const {matches, sets} = parsePolicy(subcase, nextPath)
        // add any found matches / sets to the list
        combinations.matches = combinations.matches.concat(matches)
        combinations.sets = combinations.sets.concat(sets)
        return combinations
      }, {matches: [], sets: []})
      // add any found matches / sets to the list
      fields.matches = fields.matches.concat(matches)
      fields.sets = fields.sets.concat(sets)
      return fields
    }, {matches: [], sets: []})
    // add info about this match to the list of matches
    matches.push({
      field: policy.get('match').get('field'),
      values: policy.get('match').get('cases').map(matchCase => matchCase.get(0)).toJS(),
      path: path.concat(['match'])
    })
    return {
      matches: matches,
      sets: sets
    }
  }
  // if this is a set
  else if(policy.has('set')) {
    // sets are the deepest level, so just return data about the sets
    return {
      matches: [],
      sets: policy.get('set').keySeq().toArray().map((key) => {
        return {
          setkey: key,
          path: path.concat(['set', key])
        }
      })
    }
  }
  else {
    return {
      matches: [],
      sets: []
    }
  }
}

class ConfigurationPolicyRuleEdit extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.addMatch = this.addMatch.bind(this)
    this.addAction = this.addAction.bind(this)
    this.deleteMatch = this.deleteMatch.bind(this)
    this.deleteSet = this.deleteSet.bind(this)
    this.moveSet = this.moveSet.bind(this)
    this.activateMatch = this.activateMatch.bind(this)
    this.activateSet = this.activateSet.bind(this)
  }
  handleChange(path) {
    return e => this.props.changeValue(path, e.target.value)
  }
  handleSave(e) {
    e.preventDefault()
    this.props.saveChanges()
  }
  addMatch() {
    // add match
  }
  addAction() {
    // add match
  }
  deleteMatch(index) {
    return e => {
      e.preventDefault()
      console.log('delete the rule at '+index)
    }
  }
  deleteSet(index) {
    return e => {
      e.preventDefault()
      console.log('delete the setting at '+index)
    }
  }
  moveSet(index, newIndex) {
    return e => {
      e.preventDefault()
      console.log('move setting '+index+' to '+newIndex)
    }
  }
  activateMatch(newPath) {
    return () => this.props.activateMatch(newPath)
  }
  activateSet(newPath) {
    return () => this.props.activateSet(newPath)
  }
  render() {
    const flattenedPolicy = parsePolicy(this.props.rule, this.props.rulePath)
    return (
      <form className="configuration-policy-rule-edit" onSubmit={this.handleSave}>

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
          <h1>Add Policy</h1>
          <p>Lorem ipsum dolor</p>
        </Modal.Header>
        <Modal.Body>

          <h3>Rule Name</h3>

          <Input type="text" id="configure__edge__add-cache-rule__rule-name"
            onChange={this.handleChange(['path'])}/>

          <Row className="header-btn-row">
            <Col sm={8}>
              <h3>Match Conditions</h3>
            </Col>
            <Col sm={4} className="text-right">
              <Button bsStyle="primary" className="btn-icon btn-add-new"
                onClick={this.addMatch}>
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
              return (
                <div key={i}
                  className={active ? 'condition clearfix active' : 'condition clearfix'}
                  onClick={this.activateMatch(match.path)}>
                  <Col xs={7}>
                    <p>{match.field}: {match.values.join(', ')}</p>
                  </Col>
                  <Col xs={3}>
                    <p>NEEDS_API</p>
                  </Col>
                  <Col xs={2} className="text-right">
                    <Button onClick={this.deleteMatch(i)} bsStyle="primary"
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
              <h3>Actions</h3>
            </Col>
            <Col xs={4} className="text-right">
              <Button bsStyle="primary" className="btn-icon btn-add-new"
                onClick={this.addAction}>
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
                      onClick={i > 0 ? this.moveSet(i, i-1) : ''}
                      bsStyle="primary"
                      className="btn-link btn-icon">
                      <IconArrowUp/>
                    </Button>
                    <Button
                      disabled={i >= flattenedPolicy.sets.length - 1}
                      onClick={i < flattenedPolicy.sets.length - 1 ?
                        this.moveSet(i, i+1) : ''}
                      bsStyle="primary"
                      className="btn-link btn-icon">
                      <IconArrowDown/>
                    </Button>
                    <Button onClick={this.deleteSet(i)} bsStyle="primary"
                      className="btn-link btn-icon">
                      <IconTrash/>
                    </Button>
                  </Col>
                </div>
              )
            })}
          </div>

          <ButtonToolbar className="text-right">
            <Button bsStyle="primary" onClick={this.props.hideAction}>
              Cancel
            </Button>
            <Button type="submit" bsStyle="primary">
              Add
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
  hideAction: React.PropTypes.func,
  rule: React.PropTypes.instanceOf(Immutable.Map),
  rulePath: React.PropTypes.array,
  saveChanges: React.PropTypes.func
}

module.exports = ConfigurationPolicyRuleEdit
