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
      selectedYear: ''
    }

    this.previousYear = this.previousYear.bind(this)
    this.nextYear = this.nextYear.bind(this)
  }

  componentWillMount() {
    this.setState({
      selectedMonth: moment().format('MMMM'),
      selectedYear: moment().year()
    })
  }

  previousYear() {
    this.setState({
      selectedYear: this.state.selectedYear - 1
    })
  }

  nextYear() {
    this.setState({
      selectedYear: this.state.selectedYear + 1
    })
  }

  render() {
    return (
      <div className="month-picker">
        <div className="year-selector">
          <a className="btn btn-icon" onClick={this.previousYear}><IconArrowLeft /></a>
          <div className="current-year">{this.state.selectedYear}</div>
          <a className="btn btn-icon"onClick={this.nextYear}><IconArrowRight /></a>
        </div>
      </div>
    )
  }
}

MonthPicker.displayName = 'MonthPicker'
MonthPicker.propTypes = {
  intl: React.PropTypes.object
}

export default MonthPicker
