import React, { PropTypes } from 'react'
import { Col, Input } from 'react-bootstrap'

const CheckboxArray = ({ iterable, field }) => {
  const copy = [...field.value]
  const handleChange = (option, hasValue, index, e) => {
    if(!hasValue && e.target.checked) {
      field.onChange([...field.value].concat(option.value))
    }
    else if(!event.target.checked) {
      copy.splice(index, 1)
      field.onChange(copy)
    }
  }
  return (
    <div>
      {iterable.map((checkbox, i) => {
        const index = field.value.indexOf(checkbox.value)
        const hasValue = index >= 0
        return (
          <div key={i} className='checkbox-div'>
            <Input
              type='checkbox'
              checked={hasValue}
              label={checkbox.label}
              onChange={e => handleChange(checkbox, hasValue, index, e)}/>
          </div>
        )
      })}
    </div>
  )
}

CheckboxArray.propTypes = {
  iterable: PropTypes.array,
  field: PropTypes.object
}

export default CheckboxArray
