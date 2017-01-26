import React, { PropTypes } from 'react'
import { Button, FormControl, InputGroup } from 'react-bootstrap'
import classNames from 'classnames'

import IconArrowDown from './icons/icon-arrow-down'
import IconArrowUp from './icons/icon-arrow-up'

const NumberInput = (props) => {
  const { max, min, onChange, value } = props

  const handleChange = (enteredValue, isIncrement) => {
    let newValue = 0

    if (isIncrement) {
      newValue = Number(value) + enteredValue
    } else {
      if (enteredValue === '') {
        newValue = 0
      } else if (enteredValue == parseInt(enteredValue, 10)) {
        newValue = Number(enteredValue)
      } else {
        newValue = value
      }
    }

    if (newValue < min) {
      return onChange(min)
    } else if (newValue > max) {
      return onChange(max)
    } else {
      return onChange(newValue)
    }
  }

  const handleKeyDown = e => {
    // e.keyCode 38 = UP, 40 = DOWN
    if (e.keyCode === 38) {
      e.preventDefault()
      handleChange(1, true)
    } else if (e.keyCode === 40) {
      e.preventDefault()
      handleChange(-1, true)
    }
  }

  return (
    <InputGroup className="number-input-group">

      <FormControl
        {...props}
        className={classNames(
          props.className,
          'number-input'
        )}
        onChange={e => handleChange(e.target.value)}
        onKeyDown={e => handleKeyDown(e)}
        type="text" />

      <InputGroup.Addon>
        <Button
          disabled={value >= max}
          className="number-input-increase" onClick={() => {
            handleChange(1, true)
          }}>
          <IconArrowUp width={18} height={18} />
        </Button>
        <Button
          disabled={value <= min}
          className="number-input-decrease" onClick={() => {
            handleChange(-1, true)
          }}>
          <IconArrowDown width={18} height={18} />
        </Button>
      </InputGroup.Addon>

    </InputGroup>
  )
}

NumberInput.displayName = 'NumberInput'
NumberInput.propTypes = {
  className: PropTypes.string,
  max: PropTypes.number,
  min: PropTypes.number,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

export default NumberInput
