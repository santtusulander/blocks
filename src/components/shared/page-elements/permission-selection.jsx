import React, { PropTypes } from 'react'

import Checkbox from '../form-elements/checkbox'
import { FormattedMessage } from 'react-intl'

const PermissionSelection = ({ className, disabled, onChange, permissions }) => {
  const handleChange = (value) => {
    onChange(value)
  }
  let classNames = 'permission-selection'
  if (className) {
    classNames += ' ' + className
  }
  if (disabled) {
    classNames += ' disabled'
  }

  let permission = 0

  // List and Show == Read
  if (permissions.get('show').get('allowed')) {
    permission = 1

    // List, Show, Create, Modify and Delete == Read/Write
    if (permissions.getIn(['list', 'allowed'])
      && permissions.getIn(['create', 'allowed'])
      && permissions.getIn(['modify', 'allowed'])
      && permissions.getIn(['delete', 'allowed'])) {
      permission = 2
    }
  }
  return (
    <div className={classNames}>
      <Checkbox
        checked={permission === 0}
        disabled={disabled}
        label="x"
        onChange={e => handleChange(e.target.value)}>
        <FormattedMessage id='portal.shared.permissions.selection.permissions.x.text' />
      </Checkbox>
      <Checkbox
        checked={permission === 1}
        disabled={disabled}
        onChange={e => handleChange(e.target.value)}>
        <FormattedMessage id='portal.shared.permissions.selection.permissions.r.text' />
      </Checkbox>
      <Checkbox
        checked={permission === 2}
        disabled={disabled}
        onChange={e => handleChange(e.target.value)}>
        <FormattedMessage id='portal.shared.permissions.selection.permissions.rw.text' />
      </Checkbox>
    </div>
  )
}

PermissionSelection.displayName = "PermissionSelection"
PermissionSelection.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  permissions: PropTypes.object
}

export default PermissionSelection
