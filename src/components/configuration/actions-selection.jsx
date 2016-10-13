import React from 'react'
import { Modal } from 'react-bootstrap'
import Immutable from 'immutable'

import { FormattedMessage } from 'react-intl'

class ActionsSelection extends React.Component {
  constructor(props) {
    super(props);

    this.setSetKey = this.setSetKey.bind(this)
  }
  setSetKey(key) {
    return e => {
      e.preventDefault()
      const parentPath = this.props.path.slice(0, -1)
      const currentVal = this.props.config.getIn(this.props.path)
      this.props.changeValue(parentPath, Immutable.Map().set(
        key,
        currentVal
      ))
      this.props.activateSet(parentPath.concat([key]))
    }
  }
  render() {
    return (
      <div>
        <Modal.Header>
          <h1><FormattedMessage id="portal.policy.edit.actionSelection.chooseActions.text"/></h1>
          <p><FormattedMessage id="portal.policy.edit.actionSelection.selecetActionType.text"/></p>
        </Modal.Header>
        <Modal.Body>
          <ul className="condition-selection list-unstyled">
            <li>
              <a href="#" onClick={this.setSetKey('cache_control')}>
                <FormattedMessage id="portal.policy.edit.actionSelection.cache.text"/>
              </a>
            </li>
            <li>
              <a href="#" onClick={this.setSetKey('cache_name')}>
                <FormattedMessage id="portal.policy.edit.actionSelection.cacheKeyQueryString.text"/>
              </a>
            </li>
            <li>
              <a href="#" onClick={this.setSetKey('header')}>
                <FormattedMessage id="portal.policy.edit.actionSelection.header.text"/>
              </a>
            </li>
            <li>
              <a href="#" onClick={this.setSetKey('tokenauth')}>
                <FormattedMessage id="portal.policy.edit.actionSelection.tokenauth.text"/>
              </a>
            </li>
            <li>
              <a href="#" className="inactive" onClick={this.setSetKey(null)}>
                <FormattedMessage id="portal.policy.edit.actionSelection.redirection.text"/>
              </a>
            </li>
            <li>
              <a href="#" className="inactive" onClick={this.setSetKey(null)}>
                <FormattedMessage id="portal.policy.edit.actionSelection.originHostname.text"/>
              </a>
            </li>
            <li>
              <a href="#" className="inactive" onClick={this.setSetKey(null)}>
                <FormattedMessage id="portal.policy.edit.actionSelection.compression.text"/>
              </a>
            </li>
            <li>
              <a href="#" className="inactive" onClick={this.setSetKey(null)}>
                <FormattedMessage id="portal.policy.edit.actionSelection.path.text"/>
              </a>
            </li>
            <li>
              <a href="#" className="inactive" onClick={this.setSetKey(null)}>
                <FormattedMessage id="portal.policy.edit.actionSelection.queryString.text"/>
              </a>
            </li>
            <li>
              <a href="#" className="inactive" onClick={this.setSetKey(null)}>
                <FormattedMessage id="portal.policy.edit.actionSelection.removeVary.text"/>
              </a>
            </li>
            <li>
              <a href="#" className="inactive" onClick={this.setSetKey(null)}>
                <FormattedMessage id="portal.policy.edit.actionSelection.allowBlock.text"/>
              </a>
            </li>
            <li>
              <a href="#" className="inactive" onClick={this.setSetKey(null)}>
                <FormattedMessage id="portal.policy.edit.actionSelection.postSupport.text"/>
              </a>
            </li>
            <li>
              <a href="#" className="inactive" onClick={this.setSetKey(null)}>
                <FormattedMessage id="portal.policy.edit.actionSelection.cors.text"/>
              </a>
            </li>
          </ul>
        </Modal.Body>
      </div>
    )
  }
}

ActionsSelection.displayName = 'ActionsSelection'
ActionsSelection.propTypes = {
  activateSet: React.PropTypes.func,
  changeValue: React.PropTypes.func,
  config: React.PropTypes.instanceOf(Immutable.Map),
  path: React.PropTypes.instanceOf(Immutable.List)
}

module.exports = ActionsSelection
