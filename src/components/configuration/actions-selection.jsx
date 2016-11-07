import React from 'react'
import { Modal } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import Immutable from 'immutable'
import IconCaretRight from '../icons/icon-caret-right'
import { parsePolicy, policyIsCompatibleWithAction } from '../../util/policy-config'
import IsAdmin from '../is-admin'

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
    const flattenedPolicy = parsePolicy(this.props.rule, [])
    const enableTokenAuth = policyIsCompatibleWithAction(flattenedPolicy, 'tokenauth')
    const tokenAuthClassName = enableTokenAuth ? null : "inactive"
    const tokenAuthOnClick = enableTokenAuth ? this.setSetKey('tokenauth') : this.setSetKey(null)
    const iconCaretRight = <IconCaretRight width={28} height={28} />

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
                {iconCaretRight}
                <FormattedMessage id="portal.policy.edit.actionSelection.cache.text"/>
              </a>
            </li>
            <li>
              <a href="#" onClick={this.setSetKey('cache_name')}>
                {iconCaretRight}
                <FormattedMessage id="portal.policy.edit.actionSelection.cacheKeyQueryString.text"/>
              </a>
            </li>
            <li>
              <a href="#" onClick={this.setSetKey('header')}>
                {iconCaretRight}
                <FormattedMessage id="portal.policy.edit.actionSelection.header.text"/>
              </a>
            </li>
            <IsAdmin>
              <li>
                <a href="#" className={tokenAuthClassName} onClick={tokenAuthOnClick}>
                  {iconCaretRight}
                  <FormattedMessage id="portal.policy.edit.actionSelection.tokenauth.text"/>
                </a>
              </li>
            </IsAdmin>
            <li>
              <a href="#" className="inactive" onClick={this.setSetKey(null)}>
                {iconCaretRight}
                <FormattedMessage id="portal.policy.edit.actionSelection.redirection.text"/>
              </a>
            </li>
            <li>
              <a href="#" className="inactive" onClick={this.setSetKey(null)}>
                {iconCaretRight}
                <FormattedMessage id="portal.policy.edit.actionSelection.originHostname.text"/>
              </a>
            </li>
            <li>
              <a href="#" className="inactive" onClick={this.setSetKey(null)}>
                {iconCaretRight}
                <FormattedMessage id="portal.policy.edit.actionSelection.compression.text"/>
              </a>
            </li>
            <li>
              <a href="#" className="inactive" onClick={this.setSetKey(null)}>
                {iconCaretRight}
                <FormattedMessage id="portal.policy.edit.actionSelection.path.text"/>
              </a>
            </li>
            <li>
              <a href="#" className="inactive" onClick={this.setSetKey(null)}>
                {iconCaretRight}
                <FormattedMessage id="portal.policy.edit.actionSelection.queryString.text"/>
              </a>
            </li>
            <li>
              <a href="#" className="inactive" onClick={this.setSetKey(null)}>
                {iconCaretRight}
                <FormattedMessage id="portal.policy.edit.actionSelection.removeVary.text"/>
              </a>
            </li>
            <li>
              <a href="#" className="inactive" onClick={this.setSetKey(null)}>
                {iconCaretRight}
                <FormattedMessage id="portal.policy.edit.actionSelection.allowBlock.text"/>
              </a>
            </li>
            <li>
              <a href="#" className="inactive" onClick={this.setSetKey(null)}>
                {iconCaretRight}
                <FormattedMessage id="portal.policy.edit.actionSelection.postSupport.text"/>
              </a>
            </li>
            <li>
              <a href="#" className="inactive" onClick={this.setSetKey(null)}>
                {iconCaretRight}
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
  path: React.PropTypes.instanceOf(Immutable.List),
  rule: React.PropTypes.instanceOf(Immutable.Map)
}

module.exports = ActionsSelection
