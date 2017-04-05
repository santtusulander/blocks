import React from 'react'
import moment from 'moment'
import classnames from 'classnames'

import IconArrowRight     from './shared/icons/icon-arrow-right'
import IconArrowLeft     from './shared/icons/icon-arrow-left'

export class MonthPicker extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedMonth: props.date ? moment().month(props.date.get('month')).format('MMMM') : null,
      selectedYear: props.date ? props.date.get('year') : moment().year(),
      shownYear: props.date ? props.date.get('year') : moment().year()
    }

    this.changeYear = this.changeYear.bind(this)
    this.selectMonth = this.selectMonth.bind(this)
    this.setDates = this.setDates.bind(this)
  }

  changeYear(years) {
    const updatedYear = this.state.shownYear + years
    this.setState({
      shownYear: updatedYear
    })
  }

  selectMonth(month) {
    const currentMonth = moment().month(month).format('MMMM')
    this.setState({
      selectedMonth: currentMonth,
      selectedYear: this.state.shownYear
    })

    this.setDates(this.state.shownYear, currentMonth);
  }

  setDates(year, month) {
    const startDate = moment().year(year).month(month).utc().startOf('month')
    const currentMonth = moment().format('MMMM')
    const endOfDateRange = month === currentMonth ? 'day' : 'month'
    const endDate = moment().year(year).month(month).utc().endOf(endOfDateRange)

    this.props.onChange(startDate, endDate)
  }

  render() {
    const { selectedMonth, selectedYear, shownYear } = this.state
    const months = []
    let monthIndex = 0
    while (monthIndex < 12) {
      months.push(moment().month(monthIndex++).format('MMM'))
    }

    return (
      <div className="month-picker">
        <div className="year-selector">
          <a className="btn btn-icon btn-transparent" onClick={() => this.changeYear(-1)}>
            <IconArrowLeft />
            </a>
          <div className="current-year">{shownYear}</div>
          <a className="btn btn-icon btn-transparent"onClick={() => this.changeYear(1)}>
            <IconArrowRight />
          </a>
        </div>

        <ul className="months">
          {months.map((month, i) => {
            const monthName = moment().month(i).format('MMMM')
            return (
              <li key={i}>
                <a className={classnames(
                    {'selected': (selectedMonth === monthName && shownYear === selectedYear)},
                    {'current-month': (shownYear === moment().year() && i === moment().month())}
                  )}
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
