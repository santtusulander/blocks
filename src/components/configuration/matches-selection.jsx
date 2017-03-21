import React from 'react'
import { Modal } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import Immutable from 'immutable'

import PolicyRuleOption from './policy-rule-option'
import {
  FILE_EXTENSION_DEFAULT_CASE
} from '../../util/policy-config'
import { availableMatches } from '../../constants/property-config'

class MatchesSelection extends React.Component {
  constructor(props) {
    super(props);

    this.setMatchField = this.setMatchField.bind(this)
    this.setMatchFieldForFileExtension = this.setMatchFieldForFileExtension.bind(this)
  }
  setMatchField(field) {
    if (field === 'file_extension') {
      return this.setMatchFieldForFileExtension()
    }
    return e => {
      e.preventDefault()
      this.props.changeValue(this.props.path.concat(['field']), field)
    }
  }

  setMatchFieldForFileExtension() {
    const { path, rule } = this.props

    return e => {
      e.preventDefault()
      const match = Immutable.fromJS({
        value: FILE_EXTENSION_DEFAULT_CASE,
        field: 'request_url'
      })
      this.props.changeValue(path, rule.getIn(path.slice(3)).merge(match))
    }
  }
  render() {
    const {
      path
    } = this.props

    const policyType = path.get(0)


    return (
      <div>
        <Modal.Header>
          <h1><FormattedMessage id="portal.policy.edit.matchesSelection.chooseCondition.text"/></h1>
          <p><FormattedMessage id="portal.policy.edit.matchesSelection.chooseCondition.disclaimer"/></p>
        </Modal.Header>
        <Modal.Body>
          <ul className="condition-selection list-unstyled">
            {availableMatches.map((match, index) => {
              return (
                <PolicyRuleOption
                  key={`match-${index}`}
                  policyType={policyType}
                  option={match}
                  onClick={this.setMatchField}
                />
              )
            })}
          </ul>
        </Modal.Body>
      </div>
    )
  }
}

MatchesSelection.displayName = 'MatchesSelection'
MatchesSelection.propTypes = {
  changeValue: React.PropTypes.func,
  path: React.PropTypes.instanceOf(Immutable.List),
  rule: React.PropTypes.instanceOf(Immutable.Map)
}

module.exports = MatchesSelection
