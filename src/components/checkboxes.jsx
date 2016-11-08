import React, { PropTypes } from 'react'
import { Input } from 'react-bootstrap'

const CheckboxArray = ({ disabled, inline, iterable, field, headerText }) => {
  const handleChange = (option, hasValue, index, e) => {
    const copy = [...field.value]
    if (!hasValue && e.target.checked) {
      field.onChange(copy.concat(option.value))
    } else if (!event.target.checked) {
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
      let values = []
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

  let classNames = ['checkbox-array']
  if (headerText) {
    classNames.push('checkbox-array--table')
  }

  let checkboxDivClassName = ['checkbox-div']
  if (inline) {
    checkboxDivClassName .push('inline')
  }
  if(disabled) {
    checkboxDivClassName .push('disabled')
  }
  checkboxDivClassName.join(' ')

  return (
    <div className={classNames.join(' ')}>
      {headerText &&
      <div className="checkbox-array__header">
        <Input
          type="checkbox"
          label={headerText}
          checked={isAllChecked()}
          onChange={toggleAll}/>
      </div>
      }
      <div className="checkbox-array__items">
        {iterable.map((checkbox, i) => {
          const index = field.value.indexOf(checkbox.value)
          const hasValue = index >= 0
          return (
            <div key={i} className={checkboxDivClassName}>
              <Input
                type="checkbox"
                checked={hasValue}
                disabled={disabled}
                label={checkbox.label}
                onChange={e => handleChange(checkbox, hasValue, index, e)}/>
            </div>
          )
        })}
      </div>
    </div>
  )
}

CheckboxArray.propTypes = {
  disabled: PropTypes.bool,
  field: PropTypes.object,
  headerText: PropTypes.string,
  inline: PropTypes.bool,
  iterable: PropTypes.array
}

export default CheckboxArray
