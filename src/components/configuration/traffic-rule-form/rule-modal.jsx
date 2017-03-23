/*eslint-disable no-console*/

import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { Modal } from 'react-bootstrap'
import { reduxForm, propTypes, formValueSelector, arrayPush, arraySplice } from 'redux-form'

import MatchesForm from './matches-form'
import RuleForm from './rule-form'

class TrafficRuleFormContainer extends Component {

  state = { chosenMatch: undefined }

  onSaveRule = (values) => {
    return this.props.initialValues.name
      ? console.log('edit rule', values)
      : console.log('create rule', values)
  }

  chooseMatch = (chosenMatch) => this.setState({ chosenMatch })

  cancelMatch = () => this.setState({ chosenMatch: undefined })

  saveMatch = (match, index) => {
    typeof index === 'number' ? this.props.editMatch(index, match) : this.props.addMatch(match)
  }

  render() {
    const { activeCondition, initialValues, onCancel, handleSubmit, hasMatches } = this.props
    const { chosenMatch } = this.state
    const disabled = !!chosenMatch

    return (
      <Modal show={true} dialogClassName="side-panel double-side-modal-container">
        <div className={classnames("primary-side-modal", { disabled })}>
          <Modal.Header>
            <h1>Add Traffic Rule</h1>
            <p>placeholder subtitle</p>
          </Modal.Header>
          <Modal.Body>
            <RuleForm
              hasMatches={hasMatches}
              activeCondition={activeCondition}
              disabled={disabled}
              chooseMatch={this.chooseMatch}
              initialValues={initialValues}
              handleSubmit={handleSubmit}
              onSubmit={this.onSaveRule}
              onCancel={!disabled && onCancel}/>
          </Modal.Body>
        </div>
        {chosenMatch &&
          <MatchesForm
            onCancel={this.cancelMatch}
            chooseMatch={this.chooseMatch}
            saveMatch={this.saveMatch}
            chosenMatch={chosenMatch}/>}
      </Modal>
    )
  }
}

TrafficRuleFormContainer.displayName = "TrafficRuleFormContainer"
TrafficRuleFormContainer.propTypes = {
  addMatch: PropTypes.func,
  editMatch: PropTypes.func,
  handleSubmit: PropTypes.func,
  hasMatches: PropTypes.bool,
  onCancel: PropTypes.func,
  ...propTypes
}

//until integrated into UI
TrafficRuleFormContainer.defaultProps = { onCancel: () => console.log('onCancel') }

const stateToProps = state => {
  const matchArrayValues = formValueSelector('traffic-rule-form')(state, 'matchArray')
  const activeCondition = formValueSelector('traffic-rule-form')(state, 'condition')
  return {
    state,
    activeCondition,
    initialValues: { condition: 'or' },
    hasMatches: matchArrayValues && !!matchArrayValues.length
  }
}

const dispatchToProps = dispatch => ({
  addMatch: match => dispatch(arrayPush('traffic-rule-form', 'matchArray', match)),
  editMatch: (index, match) => dispatch(arraySplice('traffic-rule-form', 'matchArray', index, 1, match))
})

const form = reduxForm({ form: 'traffic-rule-form' })(TrafficRuleFormContainer)

export default connect(
  stateToProps,
  dispatchToProps
)(form)
