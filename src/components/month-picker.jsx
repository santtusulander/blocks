import React from 'react'
import moment from 'moment'
// import { injectIntl, FormattedMessage } from 'react-intl'
// import DatePicker from 'react-datepicker'

import IconArrowRight     from './icons/icon-arrow-right'
import IconArrowLeft     from './icons/icon-arrow-left'

export class MonthPicker extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedMonth: '',
      selectedYear: '',
      monthIndex: null,
      startDate: null,
      endDate: null
    }

    this.previousYear = this.previousYear.bind(this)
    this.nextYear = this.nextYear.bind(this)
    this.monthSelected = this.monthSelected.bind(this)
    this.setDates = this.setDates.bind(this)
  }

  componentWillMount() {
    this.setState({
      selectedMonth: moment().format('MMMM'),
      selectedYear: moment().year(),
      monthIndex: moment().month(),
      startDate: moment().utc().startOf('month').format('X'),
      endDate: moment().utc().endOf('month').format('X')
    })
  }

  previousYear() {
    const previousYear = this.state.selectedYear - 1
    this.setState({
      selectedYear: previousYear
    })
    this.setDates(previousYear, this.state.monthIndex);
  }

  nextYear() {
    const nextYear = this.state.selectedYear + 1
    this.setState({
      selectedYear: nextYear
    })

    this.setDates(nextYear, this.state.monthIndex);
  }

  monthSelected(monthIndex) {
    const currentMonth = moment().month(monthIndex).format("MMMM")
    this.setState({
      monthIndex: monthIndex,
      selectedMonth: currentMonth
    })

    this.setDates(this.state.selectedYear, monthIndex);
  }

  setDates(year, month) {
    this.setState({
      startDate: moment([year, month]).utc().startOf('month').format('X'),
      endDate: moment([year, month]).utc().endOf('month').format('X')
    })
  }

  render() {
    const months = []
    let monthIndex = 0
    while(monthIndex < 12) {
      months.push(moment().month(monthIndex++).format("MMM"))
    }

    return (
      <div className="month-picker">
        <div className="year-selector">
          <a className="btn btn-icon" onClick={this.previousYear}><IconArrowLeft /></a>
          <div className="current-year">{this.state.selectedYear}</div>
          <a className="btn btn-icon"onClick={this.nextYear}><IconArrowRight /></a>
        </div>

        <ul className="months">
          {months.map((month, i) => {
            return (
              <li key={i}>
                <a className={this.state.selectedMonth === moment().month(i).format("MMMM") ? "selected" : ""}
                   onClick={() => this.monthSelected(i)}>{month}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}

MonthPicker.displayName = 'MonthPicker'
MonthPicker.propTypes = {
  intl: React.PropTypes.object
}

export default MonthPicker
