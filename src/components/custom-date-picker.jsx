import React from 'react'
import moment from 'moment'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { Calendar } from 'react-date-picker'
import { Dropdown, Nav, NavItem } from 'react-bootstrap'

import IconCalendar from './icons/icon-calendar'
import IconSelectCaret from './icons/icon-select-caret'

export class CustomDatePicker extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeTab: 'day',
      datepickerOpen: false,
      forceOpen: false,
      open: false
    }

    this.isForceOpen = false
    this.changeTab = this.changeTab.bind(this)
    this.forceOpen = this.forceOpen.bind(this)
    this.toggleDropdown = this.toggleDropdown.bind(this)
    this.handleDateChange = this.handleDateChange.bind(this)
  }

  componentWillMount() {
    this.setState({
      endDate: this.props.endDate,
      startDate: this.props.startDate
    })
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

  handleDateChange(dateValue, date) {
    const startMoment = date.dateMoment.clone().startOf('day')
    const endMoment = date.dateMoment.clone().endOf('day')

    this.props.changeDateRange(startMoment, endMoment)
    this.props.changeInputValue(dateValue)
    this.toggleDropdown(false)
  }

  toggleDropdown(val) {
    if (this.isForceOpen) {
      this.forceOpen(false)
    } else {
      this.setState({
        open: val
      })
    }
  }

  render() {
    const { intl, startDate, value } = this.props
    const { activeTab, open } = this.state

    moment.locale('custom-locale', {
      weekdaysShort : [
        intl.formatMessage({id: 'portal.common.weekdayShort.sunday'}),
        intl.formatMessage({id: 'portal.common.weekdayShort.monday'}),
        intl.formatMessage({id: 'portal.common.weekdayShort.tuesday'}),
        intl.formatMessage({id: 'portal.common.weekdayShort.wednesday'}),
        intl.formatMessage({id: 'portal.common.weekdayShort.thursday'}),
        intl.formatMessage({id: 'portal.common.weekdayShort.friday'}),
        intl.formatMessage({id: 'portal.common.weekdayShort.saturday'})
      ]
    })

    return (
      <Dropdown
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
              dateFormat="MM/DD/YYYY"
              date={startDate}
              onChange={this.handleDateChange}
              weekNumbers={false}
              weekStartDay={0}
              highlightWeekends={false}
              highlightToday={false}
              theme={null}
              locale="custom-locale" />
          : activeTab === 'month' ?
            <p>Month picker</p>
          : null}
        </Dropdown.Menu>
      </Dropdown>
    )
  }
}

CustomDatePicker.displayName = 'DateRangeSelect'
CustomDatePicker.propTypes = {
  changeDateRange: React.PropTypes.func,
  changeInputValue: React.PropTypes.func,
  endDate: React.PropTypes.instanceOf(moment),
  intl: intlShape.isRequired,
  startDate: React.PropTypes.instanceOf(moment),
  value: React.PropTypes.string
}

export default injectIntl(CustomDatePicker)
