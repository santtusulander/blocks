import React, { Component } from 'react'

import SidePanel from '../../side-panel'
import IconCaretRight from '../../icons/icon-caret-right'
import ContinentMatchConditionForm from './continent-match-form'

const matches = [
  { matchType: 'continent', label: 'Continent'},
  { matchType: 'country', label: 'Country'},
  { matchType: 'ipv4address', label: 'IPv4 Address'},
  { matchType: 'ipv4cidr', label: 'IPv4 CIDR'},
  { matchType: 'asn', label: 'ASN'}
]

export default class MatchesForm extends Component {

  renderMatchSelection = () => (
    <ul className="condition-selection list-unstyled">
      {matches.map(({ matchType, label }) =>
        <li>
          <a onClick={() => this.props.chooseMatch({ matchType })}>
            <IconCaretRight width={28} height={28} />
            {label}
          </a>
        </li>
      )}
    </ul>
  )

  render() {

    const { onCancel, chosenMatch, chooseMatch, saveMatch } = this.props

    let title = 'Choose Match'
    let subtitle = 'Select the match type'
    let matchType = undefined
    let Form = this.renderMatchSelection

    switch(this.props.chosenMatch.matchType) {

      case 'continent':
        title = 'Continent'
        subtitle = 'Specify all continents that should be matched'
        matchType = chosenMatch.matchType
        Form = ContinentMatchConditionForm
        break

      case 'country':
        title = 'Country'
        subtitle = 'Specify all continents that should be matched'
        matchType = chosenMatch.matchType
        Form = ContinentMatchConditionForm
        break

      case 'ipv4address':
        title = 'IPv4 Address'
        subtitle = 'Specify all continents that should be matched'
        matchType = chosenMatch.matchType
        Form = ContinentMatchConditionForm
        break

      case 'ipv4cidr':
        title = 'IPv4 CIDR'
        subtitle = 'Specify all continents that should be matched'
        matchType = chosenMatch.matchType
        Form = ContinentMatchConditionForm
        break

      case 'asn':
        title = 'ASN'
        subtitle = 'Specify all continents that should be matched'
        matchType = chosenMatch.matchType
        Form = ContinentMatchConditionForm
    }

    return (
      <SidePanel
        show={true}
        title={title}
        subTitle={subtitle}
        cancel={onCancel}>
        <Form
          onSave={saveMatch}
          matchType={matchType}
          onCancel={() => chooseMatch(null)}
          matchIndex={chosenMatch.index}
          initialValues={chosenMatch.values} />
      </SidePanel>
    )
  }
}
