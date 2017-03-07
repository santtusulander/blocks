import React from 'react'
import Datetime from 'react-datetime'
import moment from 'moment'

import { Dropdown } from 'react-bootstrap'

import IconSelectCaret from './icons/icon-select-caret'
import IconClock from './icons/icon-clock'

export class TimePicker extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { time, onChange } = this.props
    const value = `${time.format('hh:mma')} UTC`

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
              utc={true}
            />
          </Dropdown.Menu>
        </Dropdown>
    )
  }
}

TimePicker.displayName = 'TimePicker'
TimePicker.propTypes = {
  onChange: React.PropTypes.func,
  time: React.PropTypes.instanceOf(moment)
}
TimePicker.defaultProps = {
  time: moment().utc()
}

export default TimePicker
