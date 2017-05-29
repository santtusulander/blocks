import React from 'react'
import Datetime from 'react-datetime'
import moment from 'moment'
import { injectIntl } from 'react-intl'

import { Dropdown } from 'react-bootstrap'

import IconSelectCaret from '../icons/icon-select-caret'
import IconClock from '../icons/icon-clock'

import { TIME_FORMATS } from '../../../constants/date-formats'

const TimePicker = ({ time, onChange, isUTC, intl }) => {
  const value = `${intl.formatTime(time, TIME_FORMATS.TIME_12_UTC)} ${isUTC ? 'UTC' : ''}`

  return (
    <Dropdown id="" className="dropdown-select">
        <Dropdown.Toggle
          className="has-left-icon"
          noCaret={true}
        >
          <IconClock className="left" />

          {value}

          <IconSelectCaret />
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
  intl: React.PropTypes.object,
  isUTC: React.PropTypes.bool,
  onChange: React.PropTypes.func,
  time: React.PropTypes.instanceOf(moment)
}
TimePicker.defaultProps = {
  isUTC: true,
  time: moment().utc()
}

export default injectIntl(TimePicker)
