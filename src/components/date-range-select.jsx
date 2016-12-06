import React from 'react'
import moment from 'moment'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { MultiMonthView } from 'react-date-picker'
import { Button, Dropdown } from 'react-bootstrap'
import DateRanges from '../constants/date-ranges'

import IconCalendar from './icons/icon-calendar'
import IconSelectCaret from './icons/icon-select-caret'

const startOfThisMonth = () => moment().utc().startOf('month')
const endOfThisDay = () => moment().utc().endOf('day')
const startOfLastMonth = () => startOfThisMonth().subtract(1, 'month')
const endOfLastMonth = () => moment().utc().subtract(1, 'month').endOf('month')
const startOfLast28 = () => endOfThisDay().add(1,'second').subtract(28, 'days')
const startOfLastWeek = () => moment().utc().startOf('week').subtract(1, 'week')
const endOfLastWeek = () => moment().utc().endOf('week').subtract(1, 'week')
const startOfThisWeek = () => moment().utc().startOf('week')
const endOfThisWeek = () => moment().utc().endOf('week')

const DATE_FORMAT = 'MM/DD/YYYY'

export class DateRangeSelect extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeDateRange: props.intl.formatMessage({ id: DateRanges.MONTH_TO_DATE }),
      endDate: null,
      open: false,
      startDate: null
    }

    this.applyChanges = this.applyChanges.bind(this)
    this.handleDateChange = this.handleDateChange.bind(this)
    this.handleTimespanChange = this.handleTimespanChange.bind(this)
    this.makeLocal = this.makeLocal.bind(this)
    this.matchActiveDateRange = this.matchActiveDateRange.bind(this)
    this.toggleDropdown = this.toggleDropdown.bind(this)
  }

  componentWillMount() {
    const { endDate, startDate } = this.props

    this.setState({
      activeDateRange: this.matchActiveDateRange(startDate, endDate),
      endDate: endDate || endOfThisDay(),
      startDate: startDate || startOfThisMonth()
    })
  }

  componentWillReceiveProps(nextProps) {
    const { endDate, startDate } = this.props
    // This is used when filters are resetted and this component re-mounted and
    // the filters prop might get updated after the mount with a delay
    // TODO: This is not now working on property summary page
    const nextState = {}
    let dateChanged = false
    if (nextProps.startDate && (!startDate || !startDate.isSame(nextProps.startDate, 'day'))) {
      nextState.startDate = nextProps.startDate || startOfThisMonth()
      dateChanged = true
    }
    if (nextProps.endDate && (!endDate || !endDate.isSame(nextProps.endDate, 'day'))) {
      nextState.endDate = nextProps.endDate || endOfThisDay()
      dateChanged = true
    }
    if (dateChanged) {
      nextState.activeDateRange = this.matchActiveDateRange(nextProps.startDate, nextProps.endDate)
    }
    this.setState(nextState)
  }

  applyChanges() {
    this.props.changeDateRange(this.state.startDate, this.state.endDate)
    this.toggleDropdown()
  }

  handleDateChange(dateValues) {
    const startMoment = moment.utc(dateValues[0], DATE_FORMAT).startOf('day')
    const endMoment = moment.utc(dateValues[1], DATE_FORMAT).endOf('day')

    if (dateValues.length !== 0) {
      this.setState({
        endDate: endMoment,
        startDate: startMoment
      }, () => {
        if (dateValues[0] === dateValues[1]) {
          this.applyChanges()
        }
      })
    }
  }

  handleTimespanChange(value) {
    let startDate = this.props.startDate
    let endDate   = this.props.endDate
    if (value === DateRanges.MONTH_TO_DATE) {
      startDate = startOfThisMonth()
      endDate   = endOfThisDay()
    } else if (value === DateRanges.THIS_WEEK) {
      startDate = startOfThisWeek()
      endDate   = endOfThisWeek()
    } else if (value === DateRanges.LAST_WEEK) {
      startDate = startOfLastWeek()
      endDate   = endOfLastWeek()
    } else if (value === DateRanges.LAST_MONTH) {
      startDate = startOfLastMonth()
      endDate   = endOfLastMonth()
    } else if (value === DateRanges.LAST_28) {
      startDate = startOfLast28()
      endDate   = endOfThisDay()
    }
    this.setState({
      activeDateRange: this.props.intl.formatMessage({ id: value }),
      endDate: endDate,
      startDate: startDate
    }, () => {
      this.applyChanges()
    })
  }

  makeLocal(date) {
    // This is to fix a problem in the react-date-picker component
    // (https://github.com/zippyui/react-date-picker/issues/167) which results
    // from the component using local time, not utc. All the dates we use are utc,
    // so we strip away the time altogether and create a new moment with the date
    return moment(date.format('YYYY-MM-DD'))
  }

  matchActiveDateRange(start, end) {
    const { intl } = this.props
    let dateRange = ''
    if (this.props.availableRanges.indexOf(DateRanges.MONTH_TO_DATE) !== -1 &&
      (!start && !end ||
      startOfThisMonth().isSame(start, 'day') && endOfThisDay().isSame(end, 'day'))) {
      dateRange = intl.formatMessage({ id: DateRanges.MONTH_TO_DATE })
    } else if (this.props.availableRanges.indexOf(DateRanges.THIS_WEEK) !== -1 &&
      startOfThisWeek().isSame(start, 'hour') && endOfThisWeek().isSame(end, 'hour')) {
      dateRange = intl.formatMessage({ id: DateRanges.THIS_WEEK })
    } else if (this.props.availableRanges.indexOf(DateRanges.LAST_MONTH) !== -1 &&
      startOfLastMonth().isSame(start, 'day') && endOfLastMonth().isSame(end, 'day')) {
      dateRange = intl.formatMessage({ id: DateRanges.LAST_MONTH })
    } else if (this.props.availableRanges.indexOf(DateRanges.LAST_WEEK) !== -1 &&
      startOfLastWeek().isSame(start, 'hour') && endOfLastWeek().isSame(end, 'hour')) {
      dateRange = intl.formatMessage({ id: DateRanges.LAST_WEEK })
    } else if (this.props.availableRanges.indexOf(DateRanges.LAST_28) !== -1 &&
      startOfLast28().isSame(start, 'day') && endOfThisDay().isSame(end, 'day')) {
      dateRange = intl.formatMessage({ id: DateRanges.LAST_28 })
    } else {
      const startDate = start.format('MM/DD/YYYY')
      const endDate = end.format('MM/DD/YYYY')
      dateRange = startDate + (startDate !== endDate ? ` - ${endDate}` : '')
    }
    return dateRange
  }

  toggleDropdown() {
    const { open } = this.state
    const { endDate, startDate } = this.props

    // Reset initial values if dropdown was closed without applying changes
    if (!open) {
      this.setState({
        endDate: endDate,
        startDate: startDate
      })
    }

    this.setState({
      open: !open
    })
  }

  render() {
    const { activeDateRange, endDate, open, startDate } = this.state
    const ranges = this.props.availableRanges.map(range => [range, this.props.intl.formatMessage({id: range})])

    return (
      <Dropdown
        id="date-picker"
        className="dropdown-select date-range-select"
        open={open}
        onToggle={this.toggleDropdown}>
        <Dropdown.Toggle
          className="date-picker-dropdown-toggle has-left-icon"
          noCaret={true}>
          <IconCalendar className="left" />
          {activeDateRange}
          <IconSelectCaret/>
        </Dropdown.Toggle>
        <Dropdown.Menu className="date-picker-dropdown-menu multi-month-view">
          <div className="date-range-select-header">
            {ranges.map((range, i) =>
              <a
                className="date-range-select-link"
                key={`date-range-select-link-${i}`}
                onClick={() => this.handleTimespanChange(range[0])}>
                {range[1]}
              </a>
            )}
          </div>
          <MultiMonthView
            dateFormat={DATE_FORMAT}
            defaultRange={[this.makeLocal(startDate), this.makeLocal(endDate)]}
            defaultViewDate={this.makeLocal(startDate)}
            enableHistoryView={false}
            highlightRangeOnMouseMove={true}
            highlightToday={true}
            highlightWeekends={false}
            onRangeChange={this.handleDateChange}
            theme={null}
            weekNumbers={false}
            weekStartDay={0} />
          <div className="date-range-select-footer">
            <Button bsStyle="primary" onClick={this.applyChanges}>
              <FormattedMessage id="portal.common.button.apply" />
            </Button>
          </div>
        </Dropdown.Menu>
      </Dropdown>
    )
  }
}

DateRangeSelect.displayName = 'DateRangeSelect'
DateRangeSelect.propTypes = {
  availableRanges: React.PropTypes.array,
  changeDateRange: React.PropTypes.func,
  endDate: React.PropTypes.instanceOf(moment),
  intl: intlShape.isRequired,
  startDate: React.PropTypes.instanceOf(moment)
}

export default injectIntl(DateRangeSelect)
