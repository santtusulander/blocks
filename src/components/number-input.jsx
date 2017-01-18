import React, { PropTypes } from 'react'
import { Button, FormControl, InputGroup } from 'react-bootstrap'
import classNames from 'classnames'

import IconArrowDown from './icons/icon-arrow-down'
import IconArrowUp from './icons/icon-arrow-up'

const NumberInput = (props) => {
  return (
    <InputGroup className="number-input-group">

      <FormControl
        {...props}
        className={classNames(
          props.className,
          'number-input'
        )}
        type="number" />

      <InputGroup.Addon>
        <Button className="number-input-increase" onClick={() => {
          props.onChange(Number(props.value) + 1)
        }}>
          <IconArrowUp width={18} height={18} />
        </Button>
        <Button className="number-input-decrease" onClick={() => {
          props.onChange(Number(props.value) - 1)
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
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

export default NumberInput
