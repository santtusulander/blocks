import React from 'react'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import { Dropdown, MenuItem } from 'react-bootstrap'
import IconSelectCaret from '../../../../components/icons/icon-select-caret.jsx'
import DateRanges from '../../../../constants/date-ranges'

import './date-range-filter.scss'

const options = [
  ['month_to_date', DateRanges.MONTH_TO_DATE],
  ['last_month', DateRanges.LAST_MONTH],
  ['today', DateRanges.TODAY],
  ['yesterday', DateRanges.YESTERDAY]
];

export class DateRangeFilter extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeDateRange: 'month_to_date',
      datepickerOpen: true,
      endDate: null,
      startDate: null,
      dropdownOpen: false
    }

    this.handleStartDateChange = this.handleStartDateChange.bind(this)
    this.handleEndDateChange   = this.handleEndDateChange.bind(this)
    this.handleOnBlur          = this.handleOnBlur.bind(this)
    this.handleTimespanChange  = this.handleTimespanChange.bind(this)
  }

  componentWillMount() {
    this.setState({
      endDate: this.props.endDate,
      startDate: this.props.startDate
    })
  }

  handleStartDateChange(startDate) {
    this.setState({
      activeDateRange: `${startDate.format('MM/DD/YYYY')} - ${this.state.endDate.format('MM/DD/YYYY')}`,
      startDate: startDate.utc().startOf('day')
    })
    this.setEndDateActive()
  }

  handleEndDateChange(endDate) {
    this.setState({
      activeDateRange: `${this.state.startDate.format('MM/DD/YYYY')} - ${endDate.format('MM/DD/YYYY')}`,
      endDate: endDate.utc().endOf('day')
    })

    this.toggleDropdown(this.state.dropdownOpen)
  }

  handleOnBlur() {
    if(this.props.startDate !== this.state.startDate || this.props.endDate !== this.state.endDate) {
      this.props.changeDateRange(this.state.startDate, this.state.endDate)
    }
  }

  toggleDropdown(val) {
    this.setState({ dropdownOpen: !val }, () => {
      setTimeout(() => {
        this.state.dropdownOpen && this.setStartDateActive()
      }, 1)
    })
  }

  setStartDateActive() {
    this.refs.startDateHolder.getElementsByTagName('input')[0].focus()
    this.refs.startDateHolder.getElementsByTagName('input')[0].click()
  }

  setEndDateActive() {
    this.refs.endDateHolder.getElementsByTagName('input')[0].focus()
    this.refs.endDateHolder.getElementsByTagName('input')[0].click()
  }

  handleTimespanChange(value) {

    let startDate = this.props.startDate
    let endDate   = moment().utc().endOf('day')

    if(value === 'month_to_date') {
      startDate = moment().utc().startOf('day').subtract(1, 'month')
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

    this.setState({
      activeDateRange: value,
      endDate: endDate,
      startDate: startDate
    }, this.toggleDropdown(this.state.dropdownOpen))
    this.props.changeDateRange(startDate, endDate)
  }

  render() {

    const { dropdownOpen, activeDateRange } = this.state

    let label     = 'Please Select'
    let className = 'dropdown-select dropdown-select-datepicker btn-block'

    const currentSelection = options.find(
      option => option[0] === this.state.activeDateRange
    )

    label = currentSelection ? currentSelection[1] : activeDateRange

    return (

      <div className="relative-positioned">
        <Dropdown id=""
                  open={dropdownOpen}
                  className={className}>
          <Dropdown.Toggle onClick={() => this.toggleDropdown(this.state.dropdownOpen)} noCaret={true}>
            <IconSelectCaret/>
            {label}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <div className="datepicker-container">
              <div ref="startDateHolder" className={'datepicker-input-wrapper start-date datepicker-open'}>
                <DatePicker
                  dateFormat="MM/DD/YYYY"
                  selected={this.state.startDate}
                  startDate={this.state.startDate}
                  endDate={this.state.endDate}
                  onChange={this.handleStartDateChange}
                  onBlur={this.handleOnBlur}/>
              </div>
              <div ref="endDateHolder" className={'datepicker-input-wrapper end-date datepicker-open'}>
                <DatePicker
                  open={true}
                  popoverAttachment='top right'
                  popoverTargetAttachment='bottom right'
                  dateFormat="MM/DD/YYYY"
                  selected={this.state.endDate}
                  startDate={this.state.startDate}
                  endDate={this.state.endDate}
                  onChange={this.handleEndDateChange}
                  onBlur={this.handleOnBlur}/>
              </div>
            </div>

            {options.map((options, i) =>
              <MenuItem key={i}
                        data-value={options[0]}
                        onClick={e => this.handleTimespanChange(e.target.getAttribute('data-value'))}
                        className={this.state.activeDateRange === options[0] && 'hidden'}>
                {options[1]}
              </MenuItem>
            )}

          </Dropdown.Menu>
        </Dropdown>
      </div>
    )
  }
}

DateRangeFilter.displayName = 'DateRangeFilter'
DateRangeFilter.propTypes   = {
  changeDateRange: React.PropTypes.func,
  endDate: React.PropTypes.instanceOf(moment),
  startDate: React.PropTypes.instanceOf(moment)
}

module.exports = DateRangeFilter
