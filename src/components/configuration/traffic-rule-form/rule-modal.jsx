import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { reduxForm, arrayPush, arraySplice } from 'redux-form'

import MatchesForm from './matches-form'
import SidePanel from '../../../components/side-panel'
import RuleForm from './rule-form'

class TrafficRuleFormContainer extends Component {

  state = { chosenMatch: false }

  onSaveRule = (values) => {
    return this.props.initialValues
      ? console.log('edit', values)
      : console.log('create', values)
  }

  chooseMatch = (chosenMatch = {}) => {
    this.setState({ chosenMatch })
  }

  saveMatch = (match, index) => {
    typeof index === 'number' ? this.props.editMatch(index, match) : this.props.addMatch(match)
  }

  render() {
    const { initialValues, onCancel = () => console.log('kankel'), handleSubmit } = this.props

    return (
      <div>
        <SidePanel show={true} title={'blaceholder'} subTitle={''} cancel={onCancel}>
          <RuleForm
            openMatchModal={this.chooseMatch}
            handleSubmit={handleSubmit}
            initialValues={initialValues}
            onSubmit={this.onSaveRule}
            onCancel={onCancel}/>
        </SidePanel>
        {this.state.chosenMatch && <MatchesForm
          chooseMatch={this.chooseMatch}
          saveMatch={this.saveMatch}
          chosenMatch={this.state.chosenMatch}/>}
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
  (dispatch) => ({
    addMatch: match => dispatch(arrayPush('traffic-rule-form', 'matchArray', match)),
    editMatch: (index, match) => dispatch(arraySplice('traffic-rule-form', 'matchArray', index, 1, match))
  })
)(form)
