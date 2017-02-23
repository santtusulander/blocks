import React from 'react'
import {Button, ControlLabel, FormControl, FormGroup, Modal, Row, Col, ButtonToolbar} from 'react-bootstrap'
import Immutable from 'immutable'

import ActionButtons from '../action-buttons'
import IconAdd from '../icons/icon-add.jsx'
import TruncatedTitle from '../truncated-title'
import PolicyRuleMatchType from './policy-rule-match-type'
import {
  parsePolicy,
  policyContainsSetComponent,
  policyIsCompatibleWithAction,
  getRuleMatchType
} from '../../util/policy-config'
import Select from '../select'
import {
  POLICY_TYPES,
  DEFAULT_CONDITION_JS
} from '../../constants/property-config'

import { FormattedMessage } from 'react-intl'

class ConfigurationPolicyRuleEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      originalConfig: props.config
    }

    this.handleChange = this.handleChange.bind(this)
    this.addCondition = this.addCondition.bind(this)
    this.addAction = this.addAction.bind(this)
   // this.addContentTargetingAction = this.addContentTargetingAction.bind(this)
    this.deleteMatch = this.deleteMatch.bind(this)
    this.deleteSet = this.deleteSet.bind(this)
    //this.deleteContentTargetingSet = this.deleteContentTargetingSet.bind(this)
    this.moveSet = this.moveSet.bind(this)
    //this.moveContentTargetingSet = this.moveContentTargetingSet.bind(this)
    this.activateMatch = this.activateMatch.bind(this)
    this.activateSet = this.activateSet.bind(this)
    this.submitForm = this.submitForm.bind(this)
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
      let newCondition = Immutable.fromJS(DEFAULT_CONDITION_JS)
      const conditions = this.props.config.getIn(this.props.rulePath.concat(path), Immutable.List()).push(newCondition)
 
      this.props.changeValue([],
        this.props.config.setIn(this.props.rulePath.concat(path), conditions)
      )
      this.props.activateMatch(newPath)
    }
  }

  addAction() {
    return e => {
      e.preventDefault()

      const path = ['rule_body', 'actions']
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
  // deleteContentTargetingSet(path) {
  //   return e => {
  //     e.preventDefault()
  //     e.stopPropagation()
  //     const setIndex = path.last()
  //     const setContainerPath = path.slice(0, -1)
  //     const filtered = this.props.config.getIn(setContainerPath).delete(setIndex)
  //     this.props.changeValue(setContainerPath, filtered)
  //     this.props.activateSet(null)
  //   }
  // }
  moveSet(path, newIndex) {
    const flattenedPolicy = parsePolicy(this.props.rule, [])
    if (policyIsCompatibleWithAction(flattenedPolicy, 'content_targeting')) {
      return this.moveContentTargetingSet(path, newIndex)
    }
    return e => {
      e.preventDefault()
      e.stopPropagation()
      const set = this.props.config.getIn(path.slice(0, -2))
      const updated = this.props.config
        .getIn(path.slice(0, -3))
        .filterNot((val, i) => i === path.get(path.size-3))
        .insert(newIndex, set)
      this.props.changeValue(path.slice(0, -3), updated)
      this.props.activateSet(null)
    }
  }
  // moveContentTargetingSet(path, newIndex) {
  //   return e => {
  //     e.preventDefault()
  //     e.stopPropagation()
  //     const currentIndex = path.last()
  //     const containerPath = path.slice(0, -1)
  //     const set = this.props.config.getIn(path)
  //     const updated = this.props.config
  //       .getIn(containerPath)
  //       .filterNot((val, i) => i === currentIndex)
  //       .insert(newIndex, set)
  //     this.props.changeValue(containerPath, updated)
  //     this.props.activateSet(null)
  //   }
  // }
  activateMatch(newPath) {
    return () => this.props.activateMatch(newPath)
  }
  activateSet(newPath) {
    return () => this.props.activateSet(newPath)
  }
  submitForm(e) {
    e.preventDefault()
    this.props.hideAction()
  }
  render() {
    const ModalTitle = this.props.isEditingRule ? 'portal.policy.edit.editRule.editPolicy.text' : 'portal.policy.edit.editRule.addPolicy.text';
    const flattenedPolicy = parsePolicy(this.props.rule, this.props.rulePath)
    const ruleMatchType = getRuleMatchType(this.props.rule)

    const disableAddMatchButton = () => {
      // token auth
      if (policyContainsSetComponent(flattenedPolicy, 'tokenauth')) {
        return true

      // content targeting
      } 

      if (flattenedPolicy.sets.length === 0) {
        return true
      }
      // else {
      //   const config = this.props.config
      //   const rootMatchInfo = flattenedPolicy.matches[0]

      //   if (rootMatchInfo) {
      //     const rootMatch = config.getIn(rootMatchInfo.path)

      //     // if (rootMatch) {
      //     //   return matchIsContentTargeting(rootMatch)
      //     // }
      //   }
      // }

      return false
    }

    // const disableAddActionButton = () => {
    //   return !flattenedPolicy.matches[0].field ||
    //           policyContainsSetComponent(flattenedPolicy, 'tokenauth')
    // }

    const disableAddActionButton = () => {
      return policyContainsSetComponent(flattenedPolicy, 'tokenauth')
    }

    const disableButton = () => {

      return !this.props.config.getIn(this.props.rulePath.concat(['rule_name'])) ||
        //!flattenedPolicy.matches[0].field ||
        !flattenedPolicy.sets.length ||
        flattenedPolicy.sets[0].setkey === '' ||
        flattenedPolicy.sets[0].setkey == null
    }

    const ruleType = this.props.rulePath.get(0, null)

    return (
      <form className="configuration-policy-rule-edit" onSubmit={this.submitForm}>
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

          {ruleType !== POLICY_TYPES.DEFAULT &&
            <FormGroup>
              <ControlLabel><FormattedMessage id="portal.policy.edit.editRule.type.text"/></ControlLabel>
              <Select
                className="input-select"
                value={ruleType}
                onSelect={this.props.changeActiveRuleType}
                options={[
                  { label: <FormattedMessage id="portal.configuration.policies.requestFromClient.text" />, value: POLICY_TYPES.REQUEST },
                  { label: <FormattedMessage id="portal.configuration.policies.requestToOrigin.text" />, value: POLICY_TYPES.FINAL_REQUEST },
                  { label: <FormattedMessage id="portal.configuration.policies.responseFromOrigin.text" />, value: POLICY_TYPES.RESPONSE },
                  { label: <FormattedMessage id="portal.configuration.policies.responseToClient.text" />, value: POLICY_TYPES.FINAL_RESPONSE }
                ]}
              />
            </FormGroup>
          }

          <Row className="header-btn-row">
            <Col xs={8}>
              <h3><FormattedMessage id="portal.policy.edit.editRule.actions.text"/></h3>
            </Col>
            <Col xs={4} className="text-right">
              <Button bsStyle="primary"
                      className="btn-icon btn-add-new"
                      onClick={this.addAction(flattenedPolicy.matches[0])}
                      disabled={disableAddActionButton()}>
                <IconAdd />
              </Button>
            </Col>
          </Row>

          <div className="conditions">
            {flattenedPolicy.sets.map((set, i) => {
              let active = false
              if(Immutable.fromJS(set.path).equals(this.props.activeSetPath)) {
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
                      onArrowDown={i < flattenedPolicy.sets.length - 1 ?
                        this.moveSet(set.path, i+1) : () => false}
                      arrowDownDisabled={i >= flattenedPolicy.sets.length - 1}
                      onDelete={this.deleteSet(set.path)}
                      deleteDisabled={flattenedPolicy.sets.length === 1 && flattenedPolicy.matches.length > 0}
                    />
                  </Col>
                </div>
              )
            })}
          </div>

          <Row className="header-btn-row">
            <Col sm={8}>
              <h3><FormattedMessage id="portal.policy.edit.editRule.matchConditions.text"/></h3>
            </Col>
            <Col sm={4} className="text-right">
              <Button bsStyle="primary" className="btn-icon btn-add-new"
                onClick={this.addCondition()}
                disabled={disableAddMatchButton()}>
                <IconAdd />
              </Button>
            </Col>
          </Row>

          <div className="conditions">
            {flattenedPolicy.matches.map((match, i) => {
              let active = false
              if(Immutable.fromJS(match.path).equals(this.props.activeMatchPath)) {
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

              let matchName = (<div className="condition-name">
                {match.field}
                <TruncatedTitle
                  content={match.fieldDetail ? match.fieldDetail : match.values.join(', ')}/>
              </div>)

              //const matchCondition = this.props.config.getIn(match.path)
              //const isContentTargeting = matchCondition && matchIsContentTargeting(matchCondition)

              // if (isContentTargeting) {
              //   matchName = <div className="condition-name">Content Targeting</div>
              //   filterText = null
              // }
              return (
                <div key={i}
                  className={active ? 'condition clearfix active' : 'condition clearfix'}
                  onClick={this.activateMatch(match.path)}>
                  <Col xs={7}>
                    {match.field ?
                      matchName
                      : <p><FormattedMessage id="portal.policy.edit.editRule.chooseCondition.text"/></p>
                    }
                  </Col>
                  <Col xs={3}>
                    <p>
                      {filterText}
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

          <PolicyRuleMatchType
            ruleMatchType={ruleMatchType}
            changeActiveRuleMatchType={this.props.changeActiveRuleMatchType}
            disabled={flattenedPolicy.matches.length < 2}
          />

          <ButtonToolbar className="text-right">
            <Button
              bsStyle="primary"
              onClick={this.props.cancelAction}>
              <FormattedMessage id="portal.button.cancel"/>
            </Button>
            <Button
              bsStyle="primary"
              onClick={this.props.hideAction}
              disabled={disableButton()}>
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
  activeMatchPath: React.PropTypes.instanceOf(Immutable.List),
  activeSetPath: React.PropTypes.instanceOf(Immutable.List),
  cancelAction: React.PropTypes.func,
  changeActiveRuleMatchType: React.PropTypes.func,
  changeActiveRuleType: React.PropTypes.func,
  changeValue: React.PropTypes.func,
  config: React.PropTypes.instanceOf(Immutable.Map),
  hideAction: React.PropTypes.func,
  isEditingRule: React.PropTypes.bool,
  rule: React.PropTypes.instanceOf(Immutable.Map),
  rulePath: React.PropTypes.instanceOf(Immutable.List)
}

module.exports = ConfigurationPolicyRuleEdit
