import React, { PropTypes } from 'react'
import { Button, FormControl, InputGroup } from 'react-bootstrap'
import classNames from 'classnames'

import IconArrowDown from './icons/icon-arrow-down'
import IconArrowUp from './icons/icon-arrow-up'

const KEY_UP = 38
const KEY_DOWN = 40

const NumberInput = (props) => {
  const { disabled, max, min, onChange, value } = props
  const { onlyInteger, ...inputProps } = props

  const handleChange = (enteredValue, isIncrement = false) => {
    let newValue = 0
    let parsedPrevValue = parseFloat(value)

    if (isIncrement) {
      if (isNaN(parsedPrevValue)) {
        parsedPrevValue = 0
      }
      newValue = parsedPrevValue + enteredValue
    } else if (enteredValue === '') {
      newValue = null
    } else {
      const parsedEnteredValue = parseFloat(enteredValue)
      if (isNaN(parsedEnteredValue)) {
        newValue = isNaN(parsedPrevValue) ? null : parsedPrevValue
      } else {
        newValue = parsedEnteredValue
      }
    }

    if (newValue !== null && onlyInteger) {
      newValue = Math.trunc ? Math.trunc(newValue) : Math.round(newValue)
    }

    if (newValue !== null && newValue < min) {
      newValue = min
    } else if (newValue && newValue > max) {
      newValue = max
    }

    return onChange(newValue)
  }

  const handleKeyDown = e => {
    if (e.keyCode === KEY_UP || e.keyCode === KEY_DOWN) {
      e.preventDefault()
      handleChange(e.keyCode === KEY_UP ? 1 : -1, true)
    }
  }

  return (
    <InputGroup className="number-input-group">

      <FormControl
        {...inputProps}
        className={classNames(
          props.className,
          'number-input'
        )}
        onChange={e => handleChange(e.target.value)}
        onKeyDown={e => handleKeyDown(e)}
        autoComplete="off"
        inputMode="numeric"
        type="text" />

      <InputGroup.Addon>
        <Button
          disabled={disabled || value >= max}
          className="number-input-increase" onClick={() => {
            handleChange(1, true)
          }}>
          <IconArrowUp width={18} height={18} />
        </Button>
        <Button
          disabled={disabled || value <= min}
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
  disabled: PropTypes.bool,
  max: PropTypes.number,
  min: PropTypes.number,
  onChange: PropTypes.func,
  onlyInteger: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}
NumberInput.defaultProps = {
  max: Infinity,
  min: -Infinity,
  onlyInteger: true
}

export default NumberInput
