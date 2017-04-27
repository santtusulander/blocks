import React from 'react'
import moment from 'moment'
import { FormattedMessage } from 'react-intl'
import { Calendar } from 'react-date-picker'
import { Dropdown, Nav, NavItem } from 'react-bootstrap'

import MonthPicker from './month-picker'
import IconCalendar from '../icons/icon-calendar'
import IconSelectCaret from '../icons/icon-select-caret'

const DATE_FORMAT = 'MM/DD/YYYY';

export class CustomDatePicker extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeTab: 'day',
      dateRangeType: 'day',
      forceOpen: false,
      open: false,
      value: props.startDate.format('MM/DD/YYYY')
    }

    this.isForceOpen = false
    this.changeTab = this.changeTab.bind(this)
    this.forceOpen = this.forceOpen.bind(this)
    this.toggleDropdown = this.toggleDropdown.bind(this)
    this.handleDateChange = this.handleDateChange.bind(this)
    this.handleMonthChange = this.handleMonthChange.bind(this)
  }

  changeTab(key) {
    this.forceOpen(true)
    this.setState({
      activeTab: key
    })
  }

  forceOpen(val) {
    this.isForceOpen = val
  }

  handleDateChange(dateValue) {
    const startMoment = moment(dateValue, DATE_FORMAT).startOf('day')
    const endMoment = moment(dateValue, DATE_FORMAT).endOf('day')

    this.props.changeDateRange(startMoment, endMoment)
    this.setState({
      dateRangeType: 'day',
      value: dateValue
    })
  }

  handleMonthChange(startDate, endDate) {
    const monthValue = `${moment().month(startDate.get('month')).format("MMMM")} ${startDate.get('year')}`

    this.props.changeDateRange(startDate, endDate)
    this.setState({
      dateRangeType: 'month',
      value: monthValue
    })
  }

  toggleDropdown(val) {
    if (this.isForceOpen) {
      this.forceOpen(false)
    } else {
      this.setState({
        activeTab: this.state.dateRangeType,
        open: val
      })
    }
  }

  render() {
    const { startDate } = this.props
    const { activeTab, dateRangeType, open, value } = this.state

    // This is to fix a problem in the react-date-picker component
    // (https://github.com/zippyui/react-date-picker/issues/167) which results
    // from the component using local time, not utc. All the dates we use are utc,
    // so we have to convert the startDate to local and offset it accordingly
    // for the calendar to display selected days correctly
    const startDateLocal = startDate ? startDate.clone().local().subtract(moment().utcOffset(), 'minutes') : null

    const calendarDate = dateRangeType === 'day' ? startDateLocal : null
    const monthDate = dateRangeType === 'month' && startDate ? startDate : null

    return (
      <Dropdown
        id="custom-date-picker"
        className="custom-date-picker dropdown-select"
        open={open}
        onToggle={this.toggleDropdown}>
        <Dropdown.Toggle
          className="date-picker-dropdown-toggle has-left-icon"
          noCaret={true}>
          <IconCalendar className="left" />
          {value}
          <IconSelectCaret/>
        </Dropdown.Toggle>
        <Dropdown.Menu className="date-picker-dropdown-menu">
          <Nav bsStyle="tabs"
            className="dropdown-tabs"
            activeKey={activeTab}
            onSelect={this.changeTab}>
            <NavItem eventKey="day">
              <FormattedMessage id='portal.common.time.day' />
            </NavItem>
            <NavItem eventKey="month">
              <FormattedMessage id='portal.common.time.month' />
            </NavItem>
          </Nav>
          {activeTab === 'day' ?
            <Calendar
              dateFormat={DATE_FORMAT}
              date={calendarDate}
              enableHistoryView={false}
              onChange={this.handleDateChange}
              weekNumbers={false}
              weekStartDay={0}
              highlightWeekends={false}
              highlightToday={true}
              theme={null} />
          : activeTab === 'month' ?
            <MonthPicker
              date={monthDate}
              onChange={this.handleMonthChange} />
          : null}
        </Dropdown.Menu>
      </Dropdown>
    )
  }
}

CustomDatePicker.displayName = 'CustomDatePicker'
CustomDatePicker.propTypes = {
  changeDateRange: React.PropTypes.func,
  startDate: React.PropTypes.instanceOf(moment)
}

export default CustomDatePicker
