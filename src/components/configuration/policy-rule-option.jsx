import React from 'react'
import { FormattedMessage } from 'react-intl'
import classNames from 'classnames'

import IconCaretRight from '../icons/icon-caret-right'
import IsAdmin from '../is-admin'

/**
 * A component designed for displaying possible match/action options when creating
 * a new property config policy.
 */
const PolicyRuleOption = ({ checkIfEnabled, onClick, option, policyType }) => {
  const {
    key,
    name,
    compatibleWith,
    notYetImplemented,
    requiresAdmin
  } = option

  if (compatibleWith.indexOf(policyType) < 0) {
    // TODO: replace this with `return null` — UDNP-1852
    return <noscript />
  }

  const isEnabled = checkIfEnabled(key) && !notYetImplemented
  const className = classNames({
    inactive: !isEnabled
  })
  const listItem = (
    <li>
      <a href="#" className={className} onClick={isEnabled ? onClick(key) : null}>
        <IconCaretRight width={28} height={28} />
        <FormattedMessage id={name} />
      </a>
    </li>
  )

  return requiresAdmin ? <IsAdmin>{listItem}</IsAdmin> : listItem
}

PolicyRuleOption.displayName = 'PolicyRuleOption'
PolicyRuleOption.propTypes = {
  /**
   * A function that is executed on render to determine the active state of the
   * component. If this function returns `false`, the component will appear to be
   * disabled and will not deploy the `onClick` handler as part of the component.
   */
  checkIfEnabled: React.PropTypes.func.isRequired,
  /**
   * A click handler for the option. Will only be used by the component if `checkIfEnabled`
   * passes AND `option.notYetEnabled` is `false`.
   */
  onClick: React.PropTypes.func.isRequired,
  /**
   * An object containing the parameters of a property configuration match or action.
   * These options are defined in the property-config constants file.
   */
  option: React.PropTypes.shape({
    /**
     * The key of the match/action to be included in the property config JSON.
     */
    key: React.PropTypes.string,
    /**
     * The `id` for the FormattedMessage label.
     */
    name: React.PropTypes.string.isRequired,
    /**
     * An array of rule types that this option is compatible with (see `POLICY_TYPES`
     * in property-config constants file for acceptable values).
     */
    compatibleWith: React.PropTypes.arrayOf(
      React.PropTypes.string
    ).isRequired,
    /**
     * If true, the component will be disabled and have no `onClick` handler.
     */
    notYetImplemented: React.PropTypes.bool,
    /**
     * If true, will wrap this list item in an `<IsAdmin>` component.
     */
    requiresAdmin: React.PropTypes.bool
  }).isRequired,
  /**
   * The current policy type for the match/action to appear in (see `POLICY_TYPES`
   * in property-config constants file for acceptable values).
   */
  policyType: React.PropTypes.string.isRequired
}

export default PolicyRuleOption
