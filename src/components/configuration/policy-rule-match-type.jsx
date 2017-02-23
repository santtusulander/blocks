import React, { Component } from 'react'
import { FormattedMessage, injectIntl} from 'react-intl'
import { FormGroup, ControlLabel } from 'react-bootstrap'
import Select from '../select'

class PolicyRuleMatchType extends Component {
  constructor (props) {
    super(props)

    this.state = {
      type: props.ruleMatchType
    }

    this.handleTypeChange = this.handleTypeChange.bind(this)
  }

  handleTypeChange(e) {
    console.log(e)

    this.props.changeActiveRuleMatchType(this.state.type);
  }

  render() {
    return (
      <div>
        <FormGroup>
          <ControlLabel>
            <FormattedMessage id="portal.policy.edit.policies.matchContentTargeting.action.text"/>
          </ControlLabel>
          <Select
            className="input-select"
            onSelect={this.handleTypeChange}
            value={this.state.type}
            options={[
              {value: 'all', label: this.props.intl.formatMessage({id: 'portal.policy.edit.policies.matchType.action.all'})},
              {value: 'any', label: this.props.intl.formatMessage({id: 'portal.policy.edit.policies.matchType.action.any'})}
            ]}/>
        </FormGroup>
      </div>
    )
  }
}

PolicyRuleMatchType.displayName = 'PolicyRuleMatchType'
PolicyRuleMatchType.propTypes = {
  changeActiveRuleMatchType: React.PropTypes.func,
  intl: React.PropTypes.object,
  ruleMatchType: React.PropTypes.string
}


module.exports = injectIntl(PolicyRuleMatchType)
