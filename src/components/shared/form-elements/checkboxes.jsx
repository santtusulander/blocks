import React, { PropTypes } from 'react'
import classnames from 'classnames'

import Checkbox from './checkbox'

const CheckboxArray = ({ disabled, inline, iterable, field, headerText }) => {
  const handleChange = (option, hasValue, index, e) => {
    const copy = [...field.value]

    if (!hasValue && e.target.checked) {
      field.onChange(copy.concat(option.value))
    } else if (!e.target.checked) {
      copy.splice(index, 1)
      field.onChange(copy)
    }
  }
  /**
   * onChange handler for header checkbox.
   * Either checks all options or unchecks them.
   * @param e
   */
  const toggleAll = (e) => {
    if (!e.target.checked) {
      field.onChange([])
    } else {
      const values = []
      iterable.forEach((option) => {
        values.push(option.value)
      })
      field.onChange(values)
    }
  }

  /**
   * Checks if all options are checked.
   * @returns {boolean}
   */
  const isAllChecked = () => {
    if (iterable.length > field.value.length) {
      return false
    }

    let allChecked = true
    iterable.forEach((option) => {
      if (field.value.indexOf(option.value) < 0) {
        allChecked = false
        return false
      }
    })
    return allChecked
  }

  const classNames = classnames(
    'checkbox-array',
    { 'checkbox-array--table': headerText }
  )
  const checkboxDivClassName = classnames('checkbox-div', { inline, disabled })

  return (
    <div className={classNames}>
      {headerText &&
      <div className="checkbox-array__header">
        <Checkbox
          checked={isAllChecked()}
          onChange={toggleAll}>
          {headerText}
        </Checkbox>
      </div>
      }
      <div className="checkbox-array__items">
        {iterable.map((checkbox, i) => {
          const index = field.value.indexOf(checkbox.value)
          const hasValue = index >= 0
          return (
            <div key={i} className={classnames(checkboxDivClassName, { disabled: checkbox.disabled })}>
              <Checkbox
                checked={hasValue}
                disabled={disabled || checkbox.disabled}
                onChange={e => handleChange(checkbox, hasValue, index, e)}>
                {checkbox.label}
              </Checkbox>
            </div>
          )
        })}
      </div>
    </div>
  )
}

CheckboxArray.displayName = "CheckboxArray"
CheckboxArray.propTypes = {
  disabled: PropTypes.bool,
  field: PropTypes.object,
  headerText: PropTypes.string,
  inline: PropTypes.bool,
  iterable: PropTypes.array
}

export default CheckboxArray
