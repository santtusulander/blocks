import React from 'react'
import { Button, ButtonToolbar, ControlLabel, FormControl, FormGroup, Modal, Panel } from 'react-bootstrap'
import Immutable from 'immutable'

import Select from '../../shared/form-elements/select'
import InputConnector from '../../shared/page-elements/input-connector'
import {
  getMatchFilterType
} from '../../../util/policy-config'

import { FormattedMessage } from 'react-intl'

class Matcher extends React.Component {
  constructor(props) {
    super(props);
    const fieldDetail = props.match.get('field_detail')
    const value = props.match.get('value')

    const containsVal = fieldDetail ? value : ''

    this.state = {
      activeFilter: getMatchFilterType(props.match),
      containsVal: containsVal,
      val: fieldDetail || value
    }

    this.handleValChange = this.handleValChange.bind(this)
    this.handleMatchesChange = this.handleMatchesChange.bind(this)
    this.handleContainsValChange = this.handleContainsValChange.bind(this)
    this.validate = this.validate.bind(this)
    this.saveChanges = this.saveChanges.bind(this)
    this.renderValueField = this.renderValueField.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (!Immutable.is(nextProps.match, this.props.match)) {
      const fieldDetail = nextProps.match.get('field_detail')
      const value = nextProps.match.get('value')
      const containsVal = fieldDetail ? value : ''

      this.setState({
        activeFilter: getMatchFilterType(nextProps.match),
        containsVal: containsVal,
        val: fieldDetail || value
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

  validate() {
    const {
      activeFilter,
      val,
      containsVal
    } = this.state

    switch (activeFilter) {
      case 'contains':
      case 'does_not_contain':
        return !!val && !!containsVal
      default:
        return true
    }
  }

  saveChanges() {
    let newMatch = this.props.match

    newMatch = newMatch.delete('_temp')

    if (this.props.hasContains) {
      newMatch = newMatch.set('field_detail', this.state.val)
    }

    switch (this.state.activeFilter) {
      case 'exists':
        newMatch = newMatch.set('type', 'exists')
                           .set('value', '')
                           .set('inverted', false)
        break
      case 'contains':
        newMatch = newMatch.set('type', 'substr')
                           .set('value', this.state.containsVal)
                           .set('inverted', false)
        break
      case 'equals':
        newMatch = newMatch.set('type', 'equals')
                           .set('value', this.state.val)
                           .set('inverted', false)
        break
      case 'empty':
        newMatch = newMatch.set('type', 'empty')
                           .set('value', '')
                           .set('inverted', false)
        break
      case 'does_not_exist':
        newMatch = newMatch.set('type', 'exists')
                           .set('value', '')
                           .set('inverted', true)
        break
      case 'does_not_contain':
        newMatch = newMatch.set('type', 'substr')
                           .set('value', this.state.containsVal)
                           .set('inverted', true)
        break
      case 'does_not_equal':
        newMatch = newMatch.set('type', 'equals')
                           .set('value', this.state.val)
                           .set('inverted', true)
        break
      case 'does_not_empty':
        newMatch = newMatch.set('type', 'empty')
                           .set('value', '')
                           .set('inverted', true)
        break
    }

    this.props.changeValue(this.props.path, newMatch)
    this.props.activateMatch(null)
  }

  renderValueField() {
    const hasValueField = this.state.activeFilter === 'equals' ||
                          this.state.activeFilter === 'does_not_equal' ||
                          this.state.activeFilter === 'contains' ||
                          this.state.activeFilter === 'does_not_contain'

    return (
      <div>
        {(this.props.hasContains || hasValueField) &&
        <FormGroup controlId="matches_val">
          <ControlLabel>{this.props.label}</ControlLabel>
          <FormControl
            type="text"
            placeholder={this.props.placeholder}
            value={this.state.val}
            onChange={this.handleValChange}
          />
        </FormGroup>
        }

        <hr />
      </div>
    )
  }

  render() {
    const hasContainingRule = this.state.activeFilter === 'contains' ||
      this.state.activeFilter === 'does_not_contain'

    const matchOpts = []

    if (this.props.hasExists) {
      matchOpts.push(['exists', <FormattedMessage id="portal.policy.edit.matcher.exists.text"/>])
      matchOpts.push(['does_not_exist', <FormattedMessage id="portal.policy.edit.matcher.doesntExist.text"/>])
    }

    if (this.props.hasContains) {
      matchOpts.push(['contains', <FormattedMessage id="portal.policy.edit.matcher.contains.text"/>])
      matchOpts.push(['does_not_contain', <FormattedMessage id="portal.policy.edit.matcher.doesntContain.text"/>])
    }

    if (this.props.hasEquals) {
      matchOpts.push(['equals', <FormattedMessage id="portal.policy.edit.matcher.equals.text"/>])
      matchOpts.push(['does_not_equal', <FormattedMessage id="portal.policy.edit.matcher.doesntEqual.text"/>])
    }

    if (this.props.hasEmpty) {
      matchOpts.push(['empty', <FormattedMessage id="portal.policy.edit.matcher.empty.text"/>])
      matchOpts.push(['does_not_empty', <FormattedMessage id="portal.policy.edit.matcher.doesntEmpty.text"/>])
    }

    const isValid = this.validate()

    return (
      <div>
        <Modal.Header>
          <h1>{this.props.name}</h1>
          <p>{this.props.description}</p>
        </Modal.Header>
        <Modal.Body>
          {this.renderValueField()}

          {!this.props.disableRuleSelector &&
            <div className="form-groups">
              <InputConnector
                show={hasContainingRule}
                noLabel={true}
              />
              <FormGroup>
                <Select
                  className="input-select"
                  onSelect={this.handleMatchesChange}
                  value={this.state.activeFilter}
                  options={matchOpts}
                />
              </FormGroup>

              <Panel
                className="form-panel"
                collapsible={true}
                expanded={hasContainingRule}
              >
                <FormGroup>
                  <ControlLabel>
                    <FormattedMessage id="portal.policy.edit.matcher.value.text" />
                  </ControlLabel>
                  <FormControl
                    value={this.state.containsVal}
                    onChange={this.handleContainsValChange}
                  />
                </FormGroup>
              </Panel>
            </div>
          }

          <ButtonToolbar className="text-right">
            <Button
              className="btn-secondary"
              onClick={this.props.close}
            >
              <FormattedMessage id="portal.policy.edit.policies.cancel.text" />
            </Button>
            <Button
              bsStyle="primary"
              onClick={this.saveChanges}
              disabled={!isValid}
            >
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
  activateMatch: React.PropTypes.func,
  changeValue: React.PropTypes.func,
  close: React.PropTypes.func,
  description: React.PropTypes.string,
  disableRuleSelector: React.PropTypes.bool,
  hasContains: React.PropTypes.bool,
  hasEmpty: React.PropTypes.bool,
  hasEquals: React.PropTypes.bool,
  hasExists: React.PropTypes.bool,
  label: React.PropTypes.string,
  match: React.PropTypes.instanceOf(Immutable.Map),
  name: React.PropTypes.string,
  path: React.PropTypes.instanceOf(Immutable.List),
  placeholder: React.PropTypes.string
}

module.exports = Matcher
