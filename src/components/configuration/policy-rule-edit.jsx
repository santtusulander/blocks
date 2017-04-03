import React from 'react'
import {Button, ControlLabel, FormControl, FormGroup, Modal, Row, Col, ButtonToolbar} from 'react-bootstrap'
import Immutable from 'immutable'

import ActionButtons from '../action-buttons'
import IconAdd from '../icons/icon-add.jsx'
import TruncatedTitle from '../truncated-title'

import { parsePolicy, getConditionFilterText } from '../../util/policy-config'
import Select from '../select'
import {
  POLICY_TYPES,
  DEFAULT_CONDITION_JS,
  DEFAULT_RULE
} from '../../constants/property-config'

import { FormattedMessage } from 'react-intl'
import country_list from '../../constants/country-list'

const getFormattedCountry = (item) => {
  const country = country_list.find(ctr => ctr.id === item)

  return country ? country.label : ''
}

class ConfigurationPolicyRuleEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      originalConfig: props.config
    }

    this.handleChange = this.handleChange.bind(this)
    this.addCondition = this.addCondition.bind(this)
    this.addAction = this.addAction.bind(this)
    this.deleteMatch = this.deleteMatch.bind(this)
    this.deleteSet = this.deleteSet.bind(this)
    this.moveSet = this.moveSet.bind(this)
    this.activateMatch = this.activateMatch.bind(this)
    this.activateSet = this.activateSet.bind(this)
    this.submitForm = this.submitForm.bind(this)
    this.renderConditionName = this.renderConditionName.bind(this)
    this.renderActions = this.renderActions.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (!Immutable.is(this.state.originalConfig, nextProps.config)) {
      this.setState({
        originalConfig: nextProps.config
      })
    }
  }

  handleChange(path) {
    return e => this.props.changeValue(path, e.target.value)
  }

  addCondition() {
    return e => {
      e.preventDefault()
      const path = ['rule_body', 'conditions']
      const newIndex = this.props.rule.getIn(path, Immutable.List()).size
      const newPath = this.props.rulePath.concat(path, [newIndex])
      const newCondition = Immutable.fromJS(DEFAULT_CONDITION_JS)
      const conditions = this.props.config.getIn(this.props.rulePath.concat(path), Immutable.List()).push(newCondition)
 
      this.props.changeValue([],
        this.props.config.setIn(this.props.rulePath.concat(path), conditions)
      )
      this.props.activateMatch(newPath)
    }
  }

  addAction(path) {
    return e => {
      e.preventDefault()

      const newIndex = this.props.rule.getIn(path, Immutable.List()).size
      const newPath = this.props.rulePath.concat(path, [newIndex])
      const actions = this.props.config.getIn(this.props.rulePath.concat(path), Immutable.List()).push(Immutable.Map({_temp: true}))
 
      this.props.changeValue([],
        this.props.config.setIn(this.props.rulePath.concat(path), actions)
      )
      this.props.activateSet(newPath)
    }
  }

  deleteMatch(path) {
    return e => {
      e.preventDefault()
      e.stopPropagation()

      const parentPath = path.slice(0, -1)
      const index = path.last()
      const filtered = this.props.config.getIn(parentPath)
        .filterNot((val, i) => i === index)
 
      this.props.changeValue(parentPath, filtered)
      this.props.activateMatch(null)
    }
  }

  deleteSet(path) {
    return e => {
      e.preventDefault()
      e.stopPropagation()

      const parentPath = path.slice(0, -1)
      const index = path.last()
      const filtered = this.props.config.getIn(parentPath)
        .filterNot((val, i) => i === index)
 
      this.props.changeValue(parentPath, filtered)
      this.props.activateSet(null)
    }
  }

  moveSet(path, newIndex) {
    return e => {
      e.preventDefault()
      e.stopPropagation()

      const set = this.props.config.getIn(path)
      const oldIndex = path.get(path.size - 1)
      const updated = this.props.config
        .getIn(path.slice(0, -1))
        .delete(oldIndex)
        .insert(newIndex, set)

      this.props.changeValue(path.slice(0, -1), updated)
      this.props.activateSet(null)
    }
  }

  activateMatch(newPath) {
    return () => {
      this.props.cancelActiveEditForm()
      this.props.activateMatch(newPath)
    }
  }

  activateSet(newPath) {
    return () => {
      this.props.cancelActiveEditForm()
      this.props.activateSet(newPath)
    }
  }

  submitForm(e) {
    e.preventDefault()
    this.props.hideAction()
  }

  renderConditionName(match) {
    if (match.field === 'content_targeting_country_code') {
      let filterType = ''

      if (match.filterType === 'in') {
        filterType = <FormattedMessage id="portal.policy.edit.rule.matcher.from.text"/>
      } else {
        filterType = <FormattedMessage id="portal.policy.edit.rule.matcher.notFrom.text"/>
      }

      return (
        <div className="condition-name">
          {filterType}&nbsp;
          {<FormattedMessage id="portal.policy.edit.policies.contentTargeting.countries.items"/>}:&nbsp;
          <TruncatedTitle
            content={match.values.map(getFormattedCountry).join(', ')}
          />
        </div>
      )
    }
    
    return (
      <div className="condition-name">
        {match.field}:&nbsp;
        <TruncatedTitle
          content={match.fieldDetail ? match.fieldDetail : match.values.join(', ')}
        />
      </div>
    )
  }

  renderActions(actions) {
    return (
      <div className="conditions">
        {actions.map((set, i) => {
          let active = false
          if (Immutable.fromJS(set.path).equals(this.props.activeSetPath)) {
            active = true
          }
          return (
            <div key={i}
              className={active ? 'condition clearfix active' : 'condition clearfix'}
              onClick={this.activateSet(set.path)}>
              <Col xs={8}>
                <p>{i + 1} {set.name}</p>
              </Col>
              <Col xs={4} className="text-right">
                <ActionButtons
                  className="secondary"
                  onArrowUp={i > 0 ? this.moveSet(set.path, i-1) : () => false}
                  arrowUpDisabled={i <= 0}
                  onArrowDown={i < actions.length - 1 ?
                    this.moveSet(set.path, i+1) : () => false}
                  arrowDownDisabled={i >= actions.length - 1}
                  onDelete={this.deleteSet(set.path)}
                  deleteDisabled={actions.length === 1}
                />
              </Col>
            </div>
          )
        })}
      </div>
    )
  }

  render() {
    const ModalTitle = this.props.isEditingRule ? 'portal.policy.edit.editRule.editPolicy.text' : 'portal.policy.edit.editRule.addPolicy.text';
    const flattenedPolicy = parsePolicy(this.props.rule, this.props.rulePath)

    const disableButton = () => {
      return !this.props.config.getIn(this.props.rulePath.concat(['rule_name'])) ||
        !flattenedPolicy.sets.length 
    }

    const ruleType = this.props.rulePath.get(0, null)
    const ruleMatchType = this.props.rule.get('rule_body').get('match_type', 'or')
    const ruleTypeOptions = [
      { label: <FormattedMessage id="portal.configuration.policies.requestFromClient.text" />, value: POLICY_TYPES.REQUEST },
      { label: <FormattedMessage id="portal.configuration.policies.requestToOrigin.text" />, value: POLICY_TYPES.FINAL_REQUEST },
      { label: <FormattedMessage id="portal.configuration.policies.responseFromOrigin.text" />, value: POLICY_TYPES.RESPONSE },
      { label: <FormattedMessage id="portal.configuration.policies.responseToClient.text" />, value: POLICY_TYPES.FINAL_RESPONSE }
    ]
    const ruleMatchTypeOptions = [
      {value: 'and', label: <FormattedMessage id="portal.policy.edit.policies.matchType.action.all" />},
      {value: 'or', label: <FormattedMessage id="portal.policy.edit.policies.matchType.action.any" />}
    ]

    return (
      <form className="configuration-rule-edit" onSubmit={this.submitForm}>
        <Modal.Header>
          <h1><FormattedMessage id={ModalTitle}/></h1>
        </Modal.Header>
        <Modal.Body>

          <FormGroup controlId="configure__edge__add-cache-rule__rule-name">
            <ControlLabel><FormattedMessage id="portal.policy.edit.editRule.ruleName.text" /></ControlLabel>
            <FormControl
              value={this.props.config.getIn(this.props.rulePath.concat(['rule_name']), '')}
              onChange={this.handleChange(this.props.rulePath.concat(['rule_name']))}/>
          </FormGroup>

          <FormGroup>
            <ControlLabel><FormattedMessage id="portal.policy.edit.editRule.type.text"/></ControlLabel>
            <Select
              className="input-select"
              value={ruleType}
              onSelect={this.props.changeActiveRuleType}
              options={ruleTypeOptions}
            />
          </FormGroup>

          <Row className="header-btn-row">
            <Col sm={8}>
              <h3><FormattedMessage id="portal.policy.edit.editRule.matchConditions.text"/></h3>
            </Col>
            <Col sm={4} className="text-right">
              <Button
                bsStyle="primary"
                className="btn-icon btn-add-new"
                onClick={this.addCondition()}
              >
                <IconAdd />
              </Button>
            </Col>
          </Row>

          <div className="conditions">
            {flattenedPolicy.matches.map((match, i) => {
              let active = false
              if (Immutable.fromJS(match.path).equals(this.props.activeMatchPath)) {
                active = true
              }

              return (
                <div key={i}
                  className={active ? 'condition clearfix active' : 'condition clearfix'}
                  onClick={this.activateMatch(match.path)}>
                  <Col xs={7}>
                    {match.field
                      ? this.renderConditionName(match)
                      : <p><FormattedMessage id="portal.policy.edit.editRule.chooseCondition.text"/></p>
                    }
                  </Col>
                  <Col xs={3}>
                    <p>
                      {getConditionFilterText(match)}
                    </p>
                  </Col>
                  <Col xs={2} className="text-right">
                    <ActionButtons
                      className="secondary"
                      onDelete={this.deleteMatch(match.path)}
                    />
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
              <Button
                bsStyle="primary"
                className="btn-icon btn-add-new"
                onClick={this.addAction(['rule_body', 'actions'])}
              >
                <IconAdd />
              </Button>
            </Col>
          </Row>
          {this.renderActions(flattenedPolicy.sets)}

          <Row className="header-btn-row">
            <Col xs={8}>
              <h3><FormattedMessage id="portal.policy.edit.editRule.defaultActions.text"/></h3>
            </Col>
            <Col xs={4} className="text-right">
              <Button
                bsStyle="primary"
                className="btn-icon btn-add-new"
                onClick={this.addAction(['rule_body', 'else_actions'])}
              >
                <IconAdd />
              </Button>
            </Col>
          </Row>
          {this.renderActions(flattenedPolicy.default_sets)}

          <FormGroup>
            <ControlLabel>
              <FormattedMessage id="portal.policy.edit.editRule.applyActions.text"/>
            </ControlLabel>
            <Select
              className="input-select"
              onSelect={value => this.props.changeValue(this.props.rulePath.concat(['rule_body', 'match_type']), value)}
              value={ruleMatchType}
              disabled={flattenedPolicy.matches.length < 2}
              options={ruleMatchTypeOptions}
            />
          </FormGroup>

          <ButtonToolbar className="text-right">
            <Button
              bsStyle="primary"
              onClick={this.props.cancelAction}
            >
              <FormattedMessage id="portal.button.cancel"/>
            </Button>
            <Button
              bsStyle="primary"
              onClick={this.props.hideAction}
              disabled={disableButton()}
            >
              {this.props.isEditingRule ? <FormattedMessage id="portal.button.save"/> : <FormattedMessage id="portal.button.add"/>}
            </Button>
          </ButtonToolbar>

        </Modal.Body>
      </form>
    )
  }
}

ConfigurationPolicyRuleEdit.defaultProps = {
  rule: DEFAULT_RULE
}

ConfigurationPolicyRuleEdit.displayName = 'ConfigurationPolicyRuleEdit'
ConfigurationPolicyRuleEdit.propTypes = {
  activateMatch: React.PropTypes.func,
  activateSet: React.PropTypes.func,
  activeMatchPath: React.PropTypes.instanceOf(Immutable.List),
  activeSetPath: React.PropTypes.instanceOf(Immutable.List),
  cancelAction: React.PropTypes.func,
  cancelActiveEditForm: React.PropTypes.func,
  changeActiveRuleType: React.PropTypes.func,
  changeValue: React.PropTypes.func,
  config: React.PropTypes.instanceOf(Immutable.Map),
  hideAction: React.PropTypes.func,
  isEditingRule: React.PropTypes.bool,
  rule: React.PropTypes.instanceOf(Immutable.Map),
  rulePath: React.PropTypes.instanceOf(Immutable.List)
}

module.exports = ConfigurationPolicyRuleEdit
