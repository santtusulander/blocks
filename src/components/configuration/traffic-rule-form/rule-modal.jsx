/*eslint-disable no-console*/

import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { Modal } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { formValueSelector, arrayPush, arraySplice } from 'redux-form'

import MatchesForm from './matches-form'
import RuleForm from './rule-form'

class TrafficRuleFormContainer extends Component {

  constructor(props) {
    super(props)
    this.state = { chosenMatch: undefined }
    this.onSaveRule = this.onSaveRule.bind(this)
    this.chooseMatch = this.chooseMatch.bind(this)
    this.onSaveMatch = this.onSaveMatch.bind(this)
  }

  onSaveRule(values) {
    return this.props.initialValues.name
      ? this.props.editRule(values)
      : this.props.addRule(values)
  }

  chooseMatch(chosenMatch) {
    this.setState({ chosenMatch })
  }

  onSaveMatch(match, index) {
    typeof index === 'number' ? this.props.editMatch(index, match) : this.props.addMatch(match)
  }

  render() {
    const { activeCondition, initialValues, onCancel, hasMatches } = this.props
    const { chosenMatch } = this.state
    const titleId = this.props.initialValues.name
      ? "portal.configuration.traffic.rules.rule.modal.edit.title"
      : "portal.configuration.traffic.rules.rule.modal.create.title"

    const cancelMatch = () => this.chooseMatch()
    const disabled = !!chosenMatch

    return (
      <Modal show={true} dialogClassName="side-panel double-side-modal-container">
        <div className={classnames("primary-side-modal", { disabled })}>
          <Modal.Header>
            <h1><FormattedMessage id={titleId}/></h1>
            <p>{this.props.initialValues.name}</p>
          </Modal.Header>
          <Modal.Body>
            <RuleForm
              edit={this.props.initialValues.name}
              hasMatches={hasMatches}
              activeCondition={activeCondition}
              disabled={disabled}
              chooseMatch={this.chooseMatch}
              initialValues={initialValues}
              onSubmit={this.onSaveRule}
              onCancel={!disabled && onCancel}/>
          </Modal.Body>
        </div>
        {chosenMatch &&
          <MatchesForm
            onCancel={cancelMatch}
            chooseMatch={this.chooseMatch}
            saveMatch={this.onSaveMatch}
            chosenMatch={chosenMatch}/>}
      </Modal>
    )
  }
}

TrafficRuleFormContainer.displayName = "TrafficRuleFormContainer"
TrafficRuleFormContainer.propTypes = {
  activeCondition: PropTypes.string,
  addMatch: PropTypes.func,
  addRule: PropTypes.func,
  editMatch: PropTypes.func,
  editRule: PropTypes.func,
  hasMatches: PropTypes.bool,
  initialValues: PropTypes.object,
  onCancel: PropTypes.func
}

//until integrated into UI
TrafficRuleFormContainer.defaultProps = { onCancel: () => console.log('onCancel') }

const stateToProps = (state, { rule }) => {

  const matchArrayValues = formValueSelector('traffic-rule-form')(state, 'matchArray')
  const activeCondition = formValueSelector('traffic-rule-form')(state, 'condition')
  const ruleValues = rule.values || {}

  return {
    activeCondition,
    initialValues: { condition: 'or', ...ruleValues },
    hasMatches: matchArrayValues && !!matchArrayValues.length
  }
}

const dispatchToProps = (dispatch, { rule, onCancel }) => ({
  addRule: values => {
    dispatch(arrayPush('gtmForm', 'rules', values))
    onCancel()
  },
  editRule: values => {
    dispatch(arraySplice('gtmForm', 'rules', rule.index, 1, values))
    onCancel()
  },
  addMatch: match => dispatch(arrayPush('traffic-rule-form', 'matchArray', match)),
  editMatch: (index, match) => dispatch(arraySplice('traffic-rule-form', 'matchArray', index, 1, match))
})

export default connect(
  stateToProps,
  dispatchToProps
)(TrafficRuleFormContainer)
