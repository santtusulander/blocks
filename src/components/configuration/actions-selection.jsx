import React from 'react'
import { Modal } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import Immutable from 'immutable'

import PolicyRuleOption from './policy-rule-option'
import { availableActions } from '../../constants/property-config'
import { parsePolicy, policyIsCompatibleWithAction } from '../../util/policy-config'

class ActionsSelection extends React.Component {
  constructor(props) {
    super(props)

    this.setSetKey = this.setSetKey.bind(this)
  }
  setSetKey(key) {
    return e => {
      e.preventDefault()
      const currentVal = this.props.config.getIn(this.props.path)
      this.props.changeValue(this.props.path, Immutable.Map({[key]: Immutable.Map()}).merge(currentVal))
      //this.props.activateSet(parentPath.concat([key]))
      this.props.activateSet(this.props.path)
    }
  }
  render() {
    const {
      path,
      rule
    } = this.props

    const policyType = path.get(0)
    const flattenedPolicy = parsePolicy(rule, [])
    const listItemIsEnabled = (flattenedPolicy) => {
      return action => policyIsCompatibleWithAction(flattenedPolicy, action)
    }

    return (
      <div>
        <Modal.Header>
          <h1><FormattedMessage id="portal.policy.edit.actionSelection.chooseActions.text"/></h1>
          <p><FormattedMessage id="portal.policy.edit.actionSelection.selecetActionType.text"/></p>
        </Modal.Header>
        <Modal.Body>
          <ul className="condition-selection list-unstyled">
            {availableActions.map((action, index) => {
              return (
                <PolicyRuleOption
                  key={`action-${index}`}
                  checkIfEnabled={listItemIsEnabled(flattenedPolicy)}
                  policyType={policyType}
                  option={action}
                  onClick={this.setSetKey}
                />
              )
            })}
          </ul>
        </Modal.Body>
      </div>
    )
  }
}

ActionsSelection.displayName = 'ActionsSelection'
ActionsSelection.propTypes = {
  activateSet: React.PropTypes.func,
  changeValue: React.PropTypes.func,
  config: React.PropTypes.instanceOf(Immutable.Map),
  path: React.PropTypes.instanceOf(Immutable.List),
  rule: React.PropTypes.instanceOf(Immutable.Map)
}

module.exports = ActionsSelection
