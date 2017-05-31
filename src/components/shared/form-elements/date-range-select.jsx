import React, { PropTypes } from 'react'
import moment from 'moment'
import { injectIntl, intlShape } from 'react-intl'
import { MultiMonthView } from 'react-date-picker'
import { Dropdown } from 'react-bootstrap'
import DateRanges, {
  startOfThisMonth,
  endOfThisDay,
  startOfLastMonth,
  endOfLastMonth,
  startOfLast28,
  startOfLastWeek,
  endOfLastWeek,
  startOfThisWeek,
  endOfThisWeek
} from '../../../constants/date-ranges'
import { DATE_FORMATS } from '../../../constants/date-formats'

import IconCalendar from '../icons/icon-calendar'
import IconSelectCaret from '../icons/icon-select-caret'

const DATE_FORMAT = 'MM/DD/YYYY'
const LIMIT_VALUE = 4
const LIMIT_TYPE = 'months'

class DateRangeSelect extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeDateRange: this.constructActiveDateRange(DateRanges.MONTH_TO_DATE),
      endDate: null,
      maxDate: null,
      minDate: null,
      open: false,
      selectingRange: false,
      startDate: null
    }

    this.applyChanges = this.applyChanges.bind(this)
    this.constructActiveDateRange = this.constructActiveDateRange.bind(this)
    this.handleActiveDateChange = this.handleActiveDateChange.bind(this)
    this.handleDateChange = this.handleDateChange.bind(this)
    this.handlePresetChange = this.handlePresetChange.bind(this)
    this.makeLocal = this.makeLocal.bind(this)
    this.matchActiveDateRange = this.matchActiveDateRange.bind(this)
    this.toggleDropdown = this.toggleDropdown.bind(this)
    this.defaultViewDate = this.defaultViewDate.bind(this)
  }

  componentWillMount() {
    const { endDate, startDate } = this.props

    this.setState({
      activeDateRange: this.matchActiveDateRange(startDate, endDate),
      endDate: endDate,
      startDate: startDate
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
    const { endDate, startDate } = this.state
    const activeDateRange = this.matchActiveDateRange(startDate, endDate)

    this.props.changeDateRange(startDate, endDate, activeDateRange.id)
    this.toggleDropdown()
  }

  constructActiveDateRange(id, value) {
    return {
      id: id,
      value: value || this.props.intl.formatMessage({ id: id })
    }
  }

  handleActiveDateChange(dateValue, date) {
    const { selectingRange } = this.state
    const newSelectingRangeVal = !selectingRange

    this.setState({
      maxDate: null,
      minDate: null,
      selectingRange: newSelectingRangeVal
    }, () => {
      // selectingRange is used to determine wether the user clicked on the
      // start date or end date. We only apply the limitation after the start
      // date has been chosen
      if (newSelectingRangeVal && this.props.limitRange) {
        this.setState({
          maxDate: date.dateMoment.clone().add(LIMIT_VALUE, LIMIT_TYPE).subtract(1, 'day'),
          minDate: date.dateMoment.clone().subtract(LIMIT_VALUE, LIMIT_TYPE).add(1, 'day')
        })
      }
    })
  }

  handleDateChange(dateValues) {
    const startMoment = moment.utc(dateValues[0], DATE_FORMAT).startOf('day')
    const endMoment = moment.utc(dateValues[1], DATE_FORMAT).endOf('day')

    if (dateValues.length !== 0) {
      this.setState({
        endDate: endMoment,
        startDate: startMoment
      }, () => {
        this.applyChanges()
      })
    }
  }

  handlePresetChange(value) {
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
      activeDateRange: this.constructActiveDateRange(value),
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
    let dateRange = ''
    if (this.props.availableRanges.indexOf(DateRanges.MONTH_TO_DATE) !== -1 &&
      (!start && !end ||
      startOfThisMonth().isSame(start, 'day') && endOfThisDay().isSame(end, 'day'))) {
      dateRange = this.constructActiveDateRange(DateRanges.MONTH_TO_DATE)
    } else if (this.props.availableRanges.indexOf(DateRanges.THIS_WEEK) !== -1 &&
      startOfThisWeek().isSame(start, 'hour') && endOfThisWeek().isSame(end, 'hour')) {
      dateRange = this.constructActiveDateRange(DateRanges.THIS_WEEK)
    } else if (this.props.availableRanges.indexOf(DateRanges.LAST_MONTH) !== -1 &&
      startOfLastMonth().isSame(start, 'day') && endOfLastMonth().isSame(end, 'day')) {
      dateRange = this.constructActiveDateRange(DateRanges.LAST_MONTH)
    } else if (this.props.availableRanges.indexOf(DateRanges.LAST_WEEK) !== -1 &&
      startOfLastWeek().isSame(start, 'hour') && endOfLastWeek().isSame(end, 'hour')) {
      dateRange = this.constructActiveDateRange(DateRanges.LAST_WEEK)
    } else if (this.props.availableRanges.indexOf(DateRanges.LAST_28) !== -1 &&
      startOfLast28().isSame(start, 'day') && endOfThisDay().isSame(end, 'day')) {
      dateRange = this.constructActiveDateRange(DateRanges.LAST_28)
    } else {
      const startDate = this.props.intl.formatDate(start, DATE_FORMATS.FULL_DATE_UTC)
      const endDate = this.props.intl.formatDate(end, DATE_FORMATS.FULL_DATE_UTC)
      dateRange = this.constructActiveDateRange(DateRanges.CUSTOM_TIMERANGE, startDate + (startDate !== endDate ? ` - ${endDate}` : ''))
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
        maxDate: null,
        minDate: null,
        selectingRange: false,
        startDate: startDate
      })
    }

    this.setState({
      open: !open
    })
  }

  defaultViewDate(endDate) {
    // UDNP-2106 - In date picker, move current month to the right
    // We should make the current month appear on the right side of the date picker,
    // so the user has more immediate access to the previous month.
    const localEndDate = this.makeLocal(endDate)

    return localEndDate.subtract(1, 'month')
  }

  render() {
    const { activeDateRange, endDate, maxDate, minDate, open, startDate } = this.state
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
          {activeDateRange.value}
          <IconSelectCaret/>
        </Dropdown.Toggle>
        <Dropdown.Menu className="date-picker-dropdown-menu multi-month-view">
          <div className="date-range-select-header">
            {ranges.map((range, i) =>
              <a
                className="date-range-select-link"
                key={`date-range-select-link-${i}`}
                onClick={() => this.handlePresetChange(range[0])}>
                {range[1]}
              </a>
            )}
          </div>
          {open &&
            <MultiMonthView
              dateFormat={DATE_FORMAT}
              defaultRange={[this.makeLocal(startDate), this.makeLocal(endDate)]}
              defaultViewDate={this.defaultViewDate(endDate)}
              enableHistoryView={false}
              highlightRangeOnMouseMove={true}
              highlightToday={true}
              highlightWeekends={false}
              minDate={minDate}
              maxDate={maxDate}
              onActiveDateChange={this.handleActiveDateChange}
              onRangeChange={this.handleDateChange}
              theme={null}
              weekNumbers={false}
              weekStartDay={0} />
          }
        </Dropdown.Menu>
      </Dropdown>
    )
  }
}

DateRangeSelect.displayName = 'DateRangeSelect'
DateRangeSelect.propTypes = {
  availableRanges: PropTypes.array,
  changeDateRange: PropTypes.func.isRequired,
  endDate: PropTypes.instanceOf(moment),
  intl: intlShape.isRequired,
  limitRange: PropTypes.bool,
  startDate: PropTypes.instanceOf(moment)
}
DateRangeSelect.defaultProps = {
  availableRanges: [],
  endDate: endOfThisDay(),
  startDate: startOfThisMonth()
}

export default injectIntl(DateRangeSelect)
