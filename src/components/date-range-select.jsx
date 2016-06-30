import React from 'react'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import { Col, Row } from 'react-bootstrap'

import Select from './select'
import DateRanges from '../constants/date-ranges'

const startOfThisMonth = () => moment().utc().startOf('month')
const startOfThisDay = () => moment().utc().startOf('day')
const endOfThisDay = () => moment().utc().endOf('day')
const startOfYesterday = () => startOfThisDay().subtract(1, 'day')
const endOfYesterday = () => endOfThisDay().subtract(1, 'day')
const startOfLastMonth = () => startOfThisMonth().subtract(1, 'month')
const endOfLastMonth = () => moment().utc().endOf('month').subtract(1, 'month')
const startOfLast28 = () => endOfThisDay().add(1,'second').subtract(28, 'days')

export class DateRangeSelect extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeDateRange: DateRanges.MONTH_TO_DATE,
      datepickerOpen: false,
      endDate: null,
      startDate: null
    }

    this.handleStartDateChange         = this.handleStartDateChange.bind(this)
    this.handleEndDateChange           = this.handleEndDateChange.bind(this)
    this.handleOnFocus                 = this.handleOnFocus.bind(this)
    this.handleOnBlur                  = this.handleOnBlur.bind(this)
    this.handleTimespanChange          = this.handleTimespanChange.bind(this)
  }

  componentWillMount() {
    this.setState({
      activeDateRange: this.matchActiveDateRange(this.props.startDate, this.props.endDate),
      endDate: this.props.endDate || endOfThisDay(),
      startDate: this.props.startDate || startOfThisMonth()
    })
  }

  componentWillReceiveProps(nextProps) {
    const nextState = {}
    let dateChanged = false
    if(nextProps.startDate &&
      (!this.props.startDate || !this.props.startDate.isSame(nextProps.startDate, 'day'))) {
      nextState.startDate = nextProps.startDate
      dateChanged = true
    }
    if(nextProps.endDate &&
      (!this.props.endDate || !this.props.endDate.isSame(nextProps.endDate, 'day'))) {
      nextState.endDate = nextProps.endDate
      dateChanged = true
    }
    if(dateChanged) {
      nextState.activeDateRange = this.matchActiveDateRange(nextProps.startDate, nextProps.endDate)
    }
    this.setState(nextState)
  }

  matchActiveDateRange(start, end) {
    if(this.props.availableRanges.indexOf(DateRanges.MONTH_TO_DATE) !== -1 &&
      (!start && !end ||
      startOfThisMonth().isSame(start, 'day') && endOfThisDay().isSame(end, 'day'))) {
      return DateRanges.MONTH_TO_DATE
    }
    if(this.props.availableRanges.indexOf(DateRanges.TODAY) !== -1 &&
      startOfThisDay().isSame(start, 'hour') && endOfThisDay().isSame(end, 'hour')) {
      return DateRanges.TODAY
    }
    if(this.props.availableRanges.indexOf(DateRanges.YESTERDAY) !== -1 &&
      startOfYesterday().isSame(start, 'hour') && endOfYesterday().isSame(end, 'hour')) {
      return DateRanges.YESTERDAY
    }
    if(this.props.availableRanges.indexOf(DateRanges.LAST_MONTH) !== -1 &&
      startOfLastMonth().isSame(start, 'day') && endOfLastMonth().isSame(end, 'day')) {
      return DateRanges.LAST_MONTH
    }
    if(this.props.availableRanges.indexOf(DateRanges.LAST_28) !== -1 &&
      startOfLast28().isSame(start, 'day') && endOfThisDay().isSame(end, 'day')) {
      return DateRanges.LAST_28
    }
    return DateRanges.CUSTOM_TIMERANGE
  }

  handleStartDateChange(startDate) {
    this.setState({ startDate: startDate.utc().startOf('day') })
    this.refs.endDateHolder.getElementsByTagName('input')[0].focus()
    this.refs.endDateHolder.getElementsByTagName('input')[0].click()
  }

  handleEndDateChange(endDate) {
    this.setState({ endDate: endDate.utc().endOf('day') })
    if(this.state.datepickerOpen) {
      this.setState({
        datepickerOpen: false
      })
    }
    setTimeout(() => {
      this.handleOnBlur()
    }, 200)
  }

  handleOnFocus() {
    this.setState({
      datepickerOpen: true
    })
  }

  handleOnBlur() {
    if(this.props.startDate !== this.state.startDate ||
      this.props.endDate !== this.state.endDate) {
      this.props.changeDateRange(this.state.startDate, this.state.endDate)
    }
    if(this.state.datepickerOpen) {
      this.setState({
        datepickerOpen: false
      })
    }
  }

  handleTimespanChange(value) {
    let startDate = this.props.startDate
    let endDate   = this.props.endDate
    if(value === DateRanges.MONTH_TO_DATE) {
      startDate = startOfThisMonth()
      endDate   = endOfThisDay()
    }
    else if(value === DateRanges.TODAY) {
      startDate = startOfThisDay()
      endDate   = endOfThisDay()
    }
    else if(value === DateRanges.YESTERDAY) {
      startDate = startOfYesterday()
      endDate   = endOfYesterday()
    }
    else if(value === DateRanges.LAST_MONTH) {
      startDate = startOfLastMonth()
      endDate   = endOfLastMonth()
    }
    else if(value === DateRanges.LAST_28) {
      startDate = startOfLast28()
      endDate   = endOfThisDay()
    }
    this.setState({
      activeDateRange: value
    }, () => {
      this.props.changeDateRange(startDate, endDate)
    })
  }

  render() {
    const ranges = this.props.availableRanges.map(range => [range, range])
    return (
      <div className="date-range-select">
        <Select className="btn-block"
                onSelect={this.handleTimespanChange}
                value={this.state.activeDateRange}
                options={ranges}/>
        {this.state.activeDateRange === DateRanges.CUSTOM_TIMERANGE ?
          <Row className="no-gutters">
            <Col xs={6}>
              <p className="text-sm">FROM</p>
              <div ref="startDateHolder"
                   className={'datepicker-input-wrapper start-date' +
                (this.state.datepickerOpen ?
                ' datepicker-open' : '')}>
                <DatePicker
                  dateFormat="MM/DD/YYYY"
                  selected={this.state.startDate}
                  startDate={this.state.startDate}
                  endDate={this.state.endDate}
                  onChange={this.handleStartDateChange}
                  onFocus={this.handleOnFocus}
                  onBlur={this.handleOnBlur}/>
              </div>
            </Col>
            <Col xs={6}>
              <p className="text-sm">TO</p>
              <div ref="endDateHolder"
                   className={'datepicker-input-wrapper end-date' +
                (this.state.datepickerOpen ?
                ' datepicker-open' : '')}>
                <DatePicker
                  popoverAttachment='top right'
                  popoverTargetAttachment='bottom right'
                  dateFormat="MM/DD/YYYY"
                  selected={this.state.endDate}
                  startDate={this.state.startDate}
                  endDate={this.state.endDate}
                  onChange={this.handleEndDateChange}
                  onFocus={this.handleOnFocus}
                  onBlur={this.handleOnBlur}/>
              </div>
            </Col>
          </Row>
          : null
        }
      </div>
    )
  }
}

DateRangeSelect.displayName = 'DateRangeSelect'
DateRangeSelect.propTypes = {
  availableRanges: React.PropTypes.array,
  changeDateRange: React.PropTypes.func,
  endDate: React.PropTypes.instanceOf(moment),
  startDate: React.PropTypes.instanceOf(moment)
}

module.exports = DateRangeSelect
