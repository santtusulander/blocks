import React, { PropTypes } from 'react'
import { Input } from 'react-bootstrap'

const CheckboxArray = ({ disabled, inline, iterable, field }) => {
  const handleChange = (option, hasValue, index, e) => {
    const copy = [...field.value]
    if(!hasValue && e.target.checked) {
      field.onChange(copy.concat(option.value))
    }
    else if(!event.target.checked) {
      copy.splice(index, 1)
      field.onChange(copy)
    }
  }
  let className = 'checkbox-div'
  if(inline) {
    className += ' inline'
  }
  return (
    <div>
      {iterable.map((checkbox, i) => {
        const index = field.value.indexOf(checkbox.value)
        const hasValue = index >= 0
        return (
          <div key={i} className={className}>
            <Input
              type='checkbox'
              checked={hasValue}
              disabled={disabled}
              label={checkbox.label}
              onChange={e => handleChange(checkbox, hasValue, index, e)}/>
          </div>
        )
      })}
    </div>
  )
}

CheckboxArray.propTypes = {
  disabled: PropTypes.bool,
  field: PropTypes.object,
  inline: PropTypes.bool,
  iterable: PropTypes.array
}

export default CheckboxArray
