import React from 'react'
import Datetime from 'react-datetime'
import moment from 'moment'

import { Dropdown } from 'react-bootstrap'

import IconSelectCaret from './icons/icon-select-caret'
import IconClock from './icons/icon-clock'

const TimePicker = ({ time, onChange, isUTC }) => {
  const value = `${time.format('hh:mma')} ${isUTC ? 'UTC' : ''}`

  return (
    <Dropdown className="dropdown-select">
        <Dropdown.Toggle
          className="has-left-icon"
          noCaret={true}
        >
          <IconClock className="left"/>
          {value}
          <IconSelectCaret/>
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdown-menu">
          <Datetime
            className="time-picker"
            dateFormat={false}
            value={time}
            onChange={onChange}
            input={false}
            utc={isUTC}
          />
        </Dropdown.Menu>
      </Dropdown>
  )
}

TimePicker.displayName = 'TimePicker'
TimePicker.propTypes = {
  isUTC: React.PropTypes.bool,
  onChange: React.PropTypes.func,
  time: React.PropTypes.instanceOf(moment)
}
TimePicker.defaultProps = {
  isUTC: true,
  time: moment().utc()
}

export default TimePicker
