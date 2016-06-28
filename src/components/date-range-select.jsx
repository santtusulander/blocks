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

function matchActiveDateRange(start, end) {
  if(!start && !end ||
    startOfThisMonth().isSame(start) && endOfThisDay().isSame(end, 'day')) {
    return 'month_to_date'
  }
  if(startOfThisDay().isSame(start) && endOfThisDay().isSame(end, 'hour')) {
    return 'today'
  }
  if(startOfYesterday().isSame(start) && endOfYesterday().isSame(end, 'hour')) {
    return 'yesterday'
  }
  if(startOfLastMonth().isSame(start) && endOfLastMonth().isSame(end, 'day')) {
    return 'last_month'
  }
  return 'custom_timerange'
}

export class DateRangeSelect extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeDateRange: 'month_to_date',
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
      activeDateRange: matchActiveDateRange(this.props.startDate, this.props.endDate),
      endDate: this.props.endDate || endOfThisDay(),
      startDate: this.props.startDate || startOfThisMonth()
    })
  }

  componentWillReceiveProps(nextProps) {
    const nextState = {}
    if(this.state.activeDateRange !== 'custom_timerange') {
      nextState.activeDateRange = matchActiveDateRange(nextProps.startDate, nextProps.endDate)
    }
    if(nextState.startDate && !this.state.startDate.isSame(nextProps.startDate)) {
      nextState.startDate = nextProps.startDate
    }
    if(nextState.endDate && !this.state.endDate.isSame(nextProps.endDate)) {
      nextState.endDate = nextProps.endDate
    }
    this.setState(nextState)
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
    if(value === 'month_to_date') {
      startDate = startOfThisMonth()
      endDate   = endOfThisDay()
    }
    else if(value === 'today') {
      startDate = startOfThisDay()
      endDate   = endOfThisDay()
    }
    else if(value === 'yesterday') {
      startDate = startOfYesterday()
      endDate   = endOfYesterday()
    }
    else if(value === 'last_month') {
      startDate = startOfLastMonth()
      endDate   = endOfLastMonth()
    }
    this.setState({
      activeDateRange: value,
      endDate: endDate,
      startDate: startDate
    }, () => {
      this.props.changeDateRange(startDate, endDate)
    })
  }

  render() {
    return (
      <div className="date-range-select">
        <Select className="btn-block"
                onSelect={this.handleTimespanChange}
                value={this.state.activeDateRange}
                options={[
            ['month_to_date', DateRanges.MONTH_TO_DATE],
            ['last_month', DateRanges.LAST_MONTH],
            ['today', DateRanges.TODAY],
            ['yesterday', DateRanges.YESTERDAY],
            ['custom_timerange', DateRanges.CUSTOM_TIMERANGE]]}/>
        {this.state.activeDateRange === 'custom_timerange' ?
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
  changeDateRange: React.PropTypes.func,
  endDate: React.PropTypes.instanceOf(moment),
  startDate: React.PropTypes.instanceOf(moment)
}

module.exports = DateRangeSelect
