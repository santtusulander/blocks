import React, { PropTypes } from 'react'
import { Button, FormControl, InputGroup } from 'react-bootstrap'
import classNames from 'classnames'

import IconArrowDown from './icons/icon-arrow-down'
import IconArrowUp from './icons/icon-arrow-up'

const NumberInput = (props) => {
  const {max, min, onChange, value} = props
  const changeValue = increment => {
    const newValue = Number(value) + increment
    if (newValue < min) {
      return onChange(min)
    } else if (newValue > max) {
      return onChange(max)
    } else {
      return onChange(newValue)
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
        max={max}
        min={min}
        type="number" />

      <InputGroup.Addon>
        <Button
          disabled={value >= max}
          className="number-input-increase" onClick={() => {
            changeValue(1)
          }}>
          <IconArrowUp width={18} height={18} />
        </Button>
        <Button
          disabled={value <= min}
          className="number-input-decrease" onClick={() => {
            changeValue(-1)
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
