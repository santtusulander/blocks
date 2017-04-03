import React, { Component, PropTypes } from 'react'
import { Modal } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

import IconClose from '../../icons/icon-close'
import keyStrokeSupport from '../../../decorators/key-stroke-decorator'
import IconCaretRight from '../../icons/icon-caret-right'

import ContinentMatchConditionForm from './continent-match-form'
import CountryMatchConditionForm from './country-match-form'
import ASNMatchConditionForm from './asn-match-form'
import CIDRMatchConditionForm from './ipv4cidr-match-form'
import AddressMatchConditionForm from './ipv4address-match-form'

const matches = [
  { matchType: 'continent', label: <FormattedMessage id="portal.configuration.traffic.rules.match.continent" /> },
  { matchType: 'country', label: <FormattedMessage id="portal.configuration.traffic.rules.match.country" /> },
  { matchType: 'ipv4address', label: <FormattedMessage id="portal.configuration.traffic.rules.match.ipv4address" /> },
  { matchType: 'ipv4cidr', label: <FormattedMessage id="portal.configuration.traffic.rules.match.ipv4cidr" /> },
  { matchType: 'asn', label: <FormattedMessage id="portal.configuration.traffic.rules.match.asn" /> }
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

  constructor(props) {
    super(props)
    this.MatchSelection = this.MatchSelection.bind(this)
  }

  MatchSelection() {
    return (
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
  }

  render() {

    const { chosenMatch, onCancel, saveMatch } = this.props

    let title = <FormattedMessage id="portal.configuration.traffic.rules.matches.modal.title" />
    let subtitle = <FormattedMessage id="portal.configuration.traffic.rules.matches.modal.subtitle" />
    let matchType = undefined
    let Form = this.MatchSelection

    switch (this.props.chosenMatch.matchType) {

      case 'continent':
        title = <FormattedMessage id="portal.configuration.traffic.rules.match.continent" />
        subtitle = <FormattedMessage id="portal.configuration.traffic.rules.match.continent.modal.subtitle"/>
        matchType = chosenMatch.matchType
        Form = ContinentMatchConditionForm
        break

      case 'country':
        title = <FormattedMessage id="portal.configuration.traffic.rules.match.country" />
        subtitle = <FormattedMessage id="portal.configuration.traffic.rules.match.country.modal.subtitle"/>
        matchType = chosenMatch.matchType
        Form = CountryMatchConditionForm
        break

      case 'ipv4address':
        title = <FormattedMessage id="portal.configuration.traffic.rules.match.ipv4address"/>
        subtitle = <FormattedMessage id="portal.configuration.traffic.rules.match.ipv4address.modal.subtitle"/>
        matchType = chosenMatch.matchType
        Form = AddressMatchConditionForm
        break

      case 'ipv4cidr':
        title = <FormattedMessage id="portal.configuration.traffic.rules.match.ipv4cidr"/>
        subtitle = <FormattedMessage id="portal.configuration.traffic.rules.match.ipv4cidr.modal.subtitle"/>
        matchType = chosenMatch.matchType
        Form = CIDRMatchConditionForm
        break

      case 'asn':
        title = <FormattedMessage id="portal.configuration.traffic.rules.match.asn" />
        subtitle = <FormattedMessage id="portal.configuration.traffic.rules.match.asn.modal.subtitle"/>
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
