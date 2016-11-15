import React from 'react'
import moment from 'moment'
// import { injectIntl, FormattedMessage } from 'react-intl'
// import DatePicker from 'react-datepicker'

export class MonthPicker extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedMonth: '',
      selectedYear: ''
    }
  }

  componentWillMount() {
    this.setState({
      selectedMonth: moment().format('MMMM'),
      selectedYear: moment().year()
    })
  }

  render() {
    return (
      <div className="month-picker">

      </div>
    )
  }
}

MonthPicker.displayName = 'MonthPicker'
MonthPicker.propTypes = {
  intl: React.PropTypes.object
}

export default MonthPicker
