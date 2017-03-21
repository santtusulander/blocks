import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { SubmissionError, reduxForm, arrayPush } from 'redux-form'

import SidePanel from '../../../components/side-panel'
import RuleForm from './rule-form'

class TrafficRuleFormContainer extends Component {

  onSave = (values) => {
    return this.props.initialValues
      ? console.log('edit', values)
      : console.log('create', values)
  }

  addMatch = match => {
    this.props.addMatch(match)
  }

  render() {
    const { initialValues, onCancel = () => console.log('kankel'), handleSubmit } = this.props

    return (
      <div>
        <SidePanel show={true} title={'blaceholder'} subTitle={''} cancel={onCancel}>
          <button onClick={() => this.addMatch({ label: 'qwe' })}>ADD MATCH</button>
          <RuleForm
            handleSubmit={handleSubmit}
            initialValues={initialValues}
            onSubmit={this.onSave}
            onCancel={onCancel}/>
        </SidePanel>
      </div>
    )
  }
}

TrafficRuleFormContainer.displayName = "TrafficRuleFormContainer"

const form = reduxForm({
  form: 'traffic-rule-form',
  validate: () => ({})
})(TrafficRuleFormContainer)

export default connect(
  () => ({}),
  (dispatch) => ({ addMatch: match => dispatch(arrayPush('traffic-rule-form', 'matchArray', match)) })
)(form)
