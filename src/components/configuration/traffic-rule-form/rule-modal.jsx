import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { reduxForm, formValueSelector, arrayPush, arraySplice } from 'redux-form'

import MatchesForm from './matches-form'
import SidePanel from '../../../components/side-panel'
import RuleForm from './rule-form'

class TrafficRuleFormContainer extends Component {

  state = { chosenMatch: undefined }

  onSaveRule = (values) => {
    return this.props.initialValues
      ? console.log('edit', values)
      : console.log('create', values)
  }

  chooseMatch = (chosenMatch) => {
    this.setState({ chosenMatch })
  }

  saveMatch = (match, index) => {
    typeof index === 'number' ? this.props.editMatch(index, match) : this.props.addMatch(match)
  }

  render() {
    const { initialValues, onCancel, handleSubmit, hasMatches } = this.props
    const { chosenMatch } = this.state

    return (
      <div>
        <SidePanel show={true} title={'blaceholder'} subTitle={''} cancel={!chosenMatch && onCancel}>
          <RuleForm
            hasMatches={hasMatches}
            chooseMatch={this.chooseMatch}
            initialValues={initialValues}
            handleSubmit={handleSubmit}
            onSubmit={this.onSaveRule}
            onCancel={onCancel}/>
        </SidePanel>
        {chosenMatch &&
          <MatchesForm
            chooseMatch={this.chooseMatch}
            saveMatch={this.saveMatch}
            chosenMatch={chosenMatch}/>}
      </div>
    )
  }
}

TrafficRuleFormContainer.displayName = "TrafficRuleFormContainer"

const stateToProps = state => {
  const matchArrayValues = formValueSelector('traffic-rule-form')(state, 'matchArray')
  return {
    state,
    hasMatches: matchArrayValues && !!matchArrayValues.length,
    //until integrated into UI
    onCancel: () => console.log('cancel')
  }
}

const dispatchToProps = dispatch => ({
  addMatch: match => dispatch(arrayPush('traffic-rule-form', 'matchArray', match)),
  editMatch: (index, match) => dispatch(arraySplice('traffic-rule-form', 'matchArray', index, 1, match))
})

const form = reduxForm({ form: 'traffic-rule-form', validate: () => ({}) })(TrafficRuleFormContainer)

export default connect(
  stateToProps,
  dispatchToProps
)(form)
