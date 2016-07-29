import React, { PropTypes } from 'react'
import { Input } from 'react-bootstrap'

const PermissionSelection = ({ className, disabled, onChange, permissions }) => {
  const handleChange = (value) => {
    onChange(value)
  }
  let classNames = 'permission-selection'
  if(className) {
    classNames += ' ' + className
  }
  if(disabled) {
    classNames += ' disabled'
  }

  let permission = 0

  // List and Show == Read
  if(permissions.get('show').get('allowed')) {
    permission = 1

    // List, Show, Create, Modify and Delete == Read/Write
    if(permissions.getIn(['list', 'allowed'])
      && permissions.getIn(['create', 'allowed'])
      && permissions.getIn(['modify', 'allowed'])
      && permissions.getIn(['delete', 'allowed'])) {
      permission = 2
    }
  }
  return (
    <div className={classNames}>
      <Input
        type='checkbox'
        checked={permission === 0}
        disabled={disabled}
        label="x"
        onChange={e => handleChange(e.target.value)}/>
      <Input
        type='checkbox'
        checked={permission === 1}
        disabled={disabled}
        label="R"
        onChange={e => handleChange(e.target.value)}/>
      <Input
        type='checkbox'
        checked={permission === 2}
        disabled={disabled}
        label="R/W"
        onChange={e => handleChange(e.target.value)}/>
    </div>
  )
}

PermissionSelection.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  permissions: PropTypes.object
}

export default PermissionSelection
