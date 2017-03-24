import React, { Component, PropTypes } from 'react'
import { Modal } from 'react-bootstrap'

import IconClose from '../../icons/icon-close'
import keyStrokeSupport from '../../../decorators/key-stroke-decorator'
import IconCaretRight from '../../icons/icon-caret-right'

import ContinentMatchConditionForm from './continent-match-form'
import CountryMatchConditionForm from './country-match-form'
import ASNMatchConditionForm from './asn-match-form'
import CIDRMatchConditionForm from './ipv4cidr-match-form'
import AddressMatchConditionForm from './ipv4address-match-form'

const matches = [
  { matchType: 'continent', label: 'Continent'},
  { matchType: 'country', label: 'Country'},
  { matchType: 'ipv4address', label: 'IPv4 Address'},
  { matchType: 'ipv4cidr', label: 'IPv4 CIDR'},
  { matchType: 'asn', label: 'ASN'}
]

class MatchesForm extends Component {

  static get displayName() {
    return 'MatchesForm'
  }

  static get propTypes() {
    return {
      chosenMatch: PropTypes.object,
      chooseMatch: PropTypes.func,
      onCancel: PropTypes.func,
      saveMatch: PropTypes.func
    }
  }

  renderMatchSelection = () => (
    <ul className="condition-selection list-unstyled">
      <li/>
      {matches.map(({ matchType, label }, i) =>
        <li key={i}>
          <a onClick={() => this.props.chooseMatch({ matchType })}>
            <IconCaretRight width={28} height={28} />
            {label}
          </a>
        </li>
      )}
    </ul>
  )

  render() {

    const { chosenMatch, onCancel, saveMatch } = this.props

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
        Form = CountryMatchConditionForm
        break

      case 'ipv4address':
        title = 'IPv4 Address'
        subtitle = 'Specify all continents that should be matched'
        matchType = chosenMatch.matchType
        Form = AddressMatchConditionForm
        break

      case 'ipv4cidr':
        title = 'IPv4 CIDR'
        subtitle = 'Specify all continents that should be matched'
        matchType = chosenMatch.matchType
        Form = CIDRMatchConditionForm
        break

      case 'asn':
        title = 'ASN'
        subtitle = 'Specify all continents that should be matched'
        matchType = chosenMatch.matchType
        Form = ASNMatchConditionForm
    }

    return (
      <div className="modal-content secondary-side-modal">
        <Modal.Header>
          <a onClick={onCancel} className="secondary-side-modal-close">
            <IconClose />
          </a>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSave={saveMatch}
            matchType={matchType}
            onCancel={onCancel}
            matchIndex={chosenMatch.index}
            initialValues={chosenMatch.values} />
        </Modal.Body>
      </div>

    )
  }
}

export default keyStrokeSupport(MatchesForm)
