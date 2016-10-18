import React from 'react'
import { Modal } from 'react-bootstrap'
import Immutable from 'immutable'

import { FormattedMessage } from 'react-intl'

class MatchesSelection extends React.Component {
  constructor(props) {
    super(props);

    this.setMatchField = this.setMatchField.bind(this)
  }
  setMatchField(field) {
    return e => {
      e.preventDefault()
      this.props.changeValue(this.props.path.concat(['field']), field)
    }
  }
  render() {
    return (
      <div>
        <Modal.Header>
          <h1><FormattedMessage id="portal.policy.edit.matchesSelection.chooseCondition.text"/></h1>
          <p><FormattedMessage id="portal.policy.edit.matchesSelection.chooseCondition.disclaimer"/></p>
        </Modal.Header>
        <Modal.Body>
          <ul className="condition-selection list-unstyled">
            <li>
              <a href="#" onClick={this.setMatchField('request_host')}>
                <FormattedMessage id="portal.policy.edit.matchesSelection.hostname.text"/>
              </a>
            </li>
            <li>
              <a href="#" onClick={this.setMatchField('request_url')}>
                <FormattedMessage id="portal.policy.edit.matchesSelection.url.text"/>
              </a>
            </li>
            <li>
              <a href="#" onClick={this.setMatchField('request_path')}>
                <FormattedMessage id="portal.policy.edit.matchesSelection.directoryPath.text"/>
              </a>
            </li>
            <li>
              <a href="#" onClick={this.setMatchField('request_query_arg')}>
                <FormattedMessage id="portal.policy.edit.matchesSelection.queryString.text"/>
              </a>
            </li>
            <li>
              <a href="#" onClick={this.setMatchField('request_header')}>
                <FormattedMessage id="portal.policy.edit.matchesSelection.header.text"/>
              </a>
            </li>
            <li>
              <a href="#" onClick={this.setMatchField('request_cookie')}>
                <FormattedMessage id="portal.policy.edit.matchesSelection.cookie.text"/>
              </a>
            </li>
            {/*<li>
              <a href="#" onClick={this.setMatchField(null)}>
                IP Address NEEDS_API
              </a>
            </li>*/}
            {/*<li>
              <a href="#" onClick={this.setMatchField(null)}>
                MIME Type NEEDS_API
              </a>
            </li>*/}
            <li>
              <a href="#" className="inactive" onClick={this.setMatchField(null)}>
                <FormattedMessage id="portal.policy.edit.matchesSelection.fileExtension.text"/>
              </a>
            </li>
            <li>
              <a href="#" className="inactive" onClick={this.setMatchField(null)}>
                <FormattedMessage id="portal.policy.edit.matchesSelection.fileName.text"/>
              </a>
            </li>
            <li>
              <a href="#" className="inactive" onClick={this.setMatchField(null)}>
                <FormattedMessage id="portal.policy.edit.matchesSelection.fileType.text"/>
              </a>
            </li>
          </ul>
        </Modal.Body>
      </div>
    )
  }
}

MatchesSelection.displayName = 'MatchesSelection'
MatchesSelection.propTypes = {
  changeValue: React.PropTypes.func,
  path: React.PropTypes.instanceOf(Immutable.List)
}

module.exports = MatchesSelection
