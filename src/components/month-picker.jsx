import React from 'react'
import moment from 'moment'

import IconArrowRight     from './icons/icon-arrow-right'
import IconArrowLeft     from './icons/icon-arrow-left'

export class MonthPicker extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedMonth: props.date ? moment().month(props.date.get('month')).format('MMMM') : null,
      selectedYear: props.date ? props.date.get('year') : moment().year()
    }

    this.changeYear = this.changeYear.bind(this)
    this.selectMonth = this.selectMonth.bind(this)
    this.setDates = this.setDates.bind(this)
  }

  changeYear(years) {
    const updatedYear = this.state.selectedYear + years
    this.setState({
      selectedYear: updatedYear
    })
    if (this.state.selectedMonth) {
      this.setDates(updatedYear, this.state.selectedMonth)
    }
  }

  selectMonth(month) {
    const currentMonth = moment().month(month).format('MMMM')
    this.setState({
      selectedMonth: currentMonth
    })

    this.setDates(this.state.selectedYear, currentMonth);
  }

  setDates(year, month) {
    const startDate = moment().year(year).month(month).utc().startOf('month')
    const endDate = moment().year(year).month(month).utc().endOf('month')

    this.props.onChange(startDate, endDate)
  }

  render() {
    const months = []
    let monthIndex = 0
    while(monthIndex < 12) {
      months.push(moment().month(monthIndex++).format('MMM'))
    }

    return (
      <div className="month-picker">
        <div className="year-selector">
          <a className="btn btn-icon btn-transparent" onClick={() => this.changeYear(-1)}><IconArrowLeft /></a>
          <div className="current-year">{this.state.selectedYear}</div>
          <a className="btn btn-icon btn-transparent"onClick={() => this.changeYear(1)}><IconArrowRight /></a>
        </div>

        <ul className="months">
          {months.map((month, i) => {
            const monthName = moment().month(i).format('MMMM')
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
  date: React.PropTypes.instanceOf(moment),
  onChange: React.PropTypes.func
}
MonthPicker.defaultProps = {
  date: moment().utc().startOf('month').format('X')
}

export default MonthPicker
