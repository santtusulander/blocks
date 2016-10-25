import React from 'react'
import { Modal } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import Immutable from 'immutable'

import IconCaretRight from '../icons/icon-caret-right'

import { parsePolicy, policyIsCompatibleWithMatch, WILDCARD_REGEXP } from '../../util/policy-config'

class MatchesSelection extends React.Component {
  constructor(props) {
    super(props);

    this.setMatchField = this.setMatchField.bind(this)
    this.setMatchFieldForContentTargeting = this.setMatchFieldForContentTargeting.bind(this)
  }
  setMatchField(field) {
    return e => {
      e.preventDefault()
      this.props.changeValue(this.props.path.concat(['field']), field)
    }
  }
  setMatchFieldForContentTargeting() {
    return e => {
      e.preventDefault()
      const match = Immutable.fromJS({
        cases: [
          [WILDCARD_REGEXP, [{
            script_lua: {
              target: { }
            }
          }]]
        ],
        field: 'request_host'
      })
      this.props.changeValue(this.props.path, match)
    }
  }
  render() {
    const flattenedPolicy = parsePolicy(this.props.rule, [])
    const enableContentTargeting = policyIsCompatibleWithMatch(flattenedPolicy, 'content_targeting')
    const contentTargetingClassName = enableContentTargeting ? null : "inactive"
    const contentTargetingOnClick = enableContentTargeting ?
                                      this.setMatchFieldForContentTargeting()
                                      : this.setMatchField(null)
    const iconCaretRight = <IconCaretRight width={28} height={28} />

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
                {iconCaretRight}
                <FormattedMessage id="portal.policy.edit.matchesSelection.hostname.text"/>
              </a>
            </li>
            <li>
              <a href="#" onClick={this.setMatchField('request_url')}>
                {iconCaretRight}
                <FormattedMessage id="portal.policy.edit.matchesSelection.url.text"/>
              </a>
            </li>
            <li>
              <a href="#" onClick={this.setMatchField('request_path')}>
                {iconCaretRight}
                <FormattedMessage id="portal.policy.edit.matchesSelection.directoryPath.text"/>
              </a>
            </li>
            <li>
              <a href="#" onClick={this.setMatchField('request_query_arg')}>
                {iconCaretRight}
                <FormattedMessage id="portal.policy.edit.matchesSelection.queryString.text"/>
              </a>
            </li>
            <li>
              <a href="#" onClick={this.setMatchField('request_header')}>
                {iconCaretRight}
                <FormattedMessage id="portal.policy.edit.matchesSelection.header.text"/>
              </a>
            </li>
            <li>
              <a href="#" onClick={this.setMatchField('request_cookie')}>
                {iconCaretRight}
                <FormattedMessage id="portal.policy.edit.matchesSelection.cookie.text"/>
              </a>
            </li>
            <li>
              <a href="#" className={contentTargetingClassName} onClick={contentTargetingOnClick}>
                {iconCaretRight}
                <FormattedMessage id="portal.policy.edit.matchesSelection.contentTargeting.text"/>
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
                {iconCaretRight}
                <FormattedMessage id="portal.policy.edit.matchesSelection.fileExtension.text"/>
              </a>
            </li>
            <li>
              <a href="#" className="inactive" onClick={this.setMatchField(null)}>
                {iconCaretRight}
                <FormattedMessage id="portal.policy.edit.matchesSelection.fileName.text"/>
              </a>
            </li>
            <li>
              <a href="#" className="inactive" onClick={this.setMatchField(null)}>
                {iconCaretRight}
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
  path: React.PropTypes.instanceOf(Immutable.List),
  rule: React.PropTypes.instanceOf(Immutable.Map)
}

module.exports = MatchesSelection
