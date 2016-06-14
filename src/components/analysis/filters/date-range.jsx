import React from 'react'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import { Col, Row } from 'react-bootstrap'

import Select from '../../../components/select'
import DateRanges from '../../../constants/date-ranges'

export class FilterDateRange extends React.Component {
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
      endDate: this.props.endDate,
      startDate: this.props.startDate
    })
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
    let endDate   = moment().utc().endOf('day')
    if(value === 'month_to_date') {
      startDate = moment().utc().startOf('month')
    }
    else if(value === 'today') {
      startDate = moment().utc().startOf('day')
    }
    else if(value === 'yesterday') {
      startDate = moment().utc().startOf('day').subtract(1, 'day')
      endDate   = moment().utc().endOf('day').subtract(1, 'day')
    }
    else if(value === 'last_month') {
      startDate = moment().utc().startOf('month').subtract(1, 'month')
      endDate   = moment().utc().endOf('month').subtract(1, 'month')
    }
    this.props.changeDateRange(startDate, endDate)
    this.setState({
      activeDateRange: value,
      endDate: endDate,
      startDate: startDate
    })
  }
  
  render() {
    return (
      <div>
        <div className="sidebar-section-header">
          Date Range
        </div>
        <div className="sidebar-content">
          <div className="form-group">
            <Select className="btn-block"
                    onSelect={this.handleTimespanChange}
                    value={this.state.activeDateRange}
                    options={[
                ['month_to_date', DateRanges.MONTH_TO_DATE],
                ['last_month', DateRanges.LAST_MONTH],
                ['today', DateRanges.TODAY],
                ['yesterday', DateRanges.YESTERDAY],
                ['custom_timerange', DateRanges.CUSTOM_TIMERANGE]]}/>
          </div>
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
      </div>
    )
  }
}

FilterDateRange.displayName = 'FilterDateRange'
FilterDateRange.propTypes = {
  changeDateRange: React.PropTypes.func,
  endDate: React.PropTypes.instanceOf(moment),
  startDate: React.PropTypes.instanceOf(moment)
}

module.exports = FilterDateRange
