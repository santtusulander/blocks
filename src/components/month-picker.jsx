import React from 'react'
import moment from 'moment'

import IconArrowRight     from './icons/icon-arrow-right'
import IconArrowLeft     from './icons/icon-arrow-left'

export class MonthPicker extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedMonth: moment().format('MMMM'),
      selectedYear: moment().year(),
      startDate: moment().utc().startOf('month').format('X'),
      endDate: moment().utc().endOf('month').format('X')
    }

    this.previousYear = this.previousYear.bind(this)
    this.nextYear = this.nextYear.bind(this)
    this.selectMonth = this.selectMonth.bind(this)
    this.setDates = this.setDates.bind(this)
  }

  previousYear() {
    const previousYear = this.state.selectedYear - 1
    this.setState({
      selectedYear: previousYear
    })
    this.setDates(previousYear, this.state.selectedMonth);
  }

  nextYear() {
    const nextYear = this.state.selectedYear + 1
    this.setState({
      selectedYear: nextYear
    })

    this.setDates(nextYear, this.state.selectedMonth);
  }

  selectMonth(month) {
    const currentMonth = moment().month(month).format("MMMM")
    this.setState({
      selectedMonth: currentMonth
    })

    this.setDates(this.state.selectedYear, currentMonth);
  }

  setDates(year, month) {
    this.setState({
      startDate: moment().year(year).month(month).utc().startOf('month').format('X'),
      endDate: moment().year(year).month(month).utc().endOf('month').format('X')
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
            const monthName = moment().month(i).format("MMMM")
            return (
              <li key={i}>
                <a className={this.state.selectedMonth === monthName ? "selected" : ""}
                   onClick={() => this.selectMonth(monthName)}>
                   {month}
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
