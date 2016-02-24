import React from 'react'
import Immutable from 'immutable'
import { Button, ButtonToolbar, Col, Dropdown, Input,
  MenuItem, Row } from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import { connect } from 'react-redux'

import Select from '../../components/select'

export class Analyses extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeFilter: 'month_to_date',
      datepickerOpen: false,
      startDate: moment().startOf('month'),
      endDate: moment()
    }

    this.handleStartDateChange = this.handleStartDateChange.bind(this)
    this.handleEndDateChange = this.handleEndDateChange.bind(this)
    this.handleOnFocus = this.handleOnFocus.bind(this)
    this.handleOnBlur = this.handleOnBlur.bind(this)
    this.handleTimespanChange = this.handleTimespanChange.bind(this)
  }
  handleStartDateChange(date) {
    this.setState({
      startDate: date
    })
    if(date > this.state.endDate) {
      this.setState({
        endDate: date
      })
    }
    this.refs.endDateHolder.getElementsByTagName('input')[0].focus()
    this.refs.endDateHolder.getElementsByTagName('input')[0].click()
  }
  handleEndDateChange(date) {
    this.setState({
      endDate: date
    })
    if(date < this.state.startDate) {
      this.setState({
        endDate: date
      })
    }
    if(this.state.datepickerOpen) {
      this.setState({
        datepickerOpen: false
      })
    }
    setTimeout(() => {
      this.refs.endDateHolder.getElementsByTagName('input')[0].blur()
    }, 200)
  }
  handleOnFocus() {
    this.setState({
      datepickerOpen: true
    })
  }
  handleOnBlur() {
    if(this.state.datepickerOpen) {
      this.setState({
        datepickerOpen: false
      })
    }
  }
  handleTimespanChange(value) {
    let startDate = this.state.startDate
    if(value === 'month_to_date') {
      startDate = moment().startOf('month')
    }
    else if(value === 'week_to_date') {
      startDate = moment().startOf('week')
    }
    else if(value === 'today') {
      startDate = moment().startOf('day')
    }
    this.setState({
      activeFilter: value,
      endDate: moment(),
      startDate: startDate
    })
  }
  render() {
    return (
      <div className="analyses">
        <div className="sidebar-header">
          <p className="text-sm">ACCOUNT TRAFFIC OVERVIEW</p>
          <Dropdown id="dropdown-content">
            <Dropdown.Toggle bsStyle="link" className="header-toggle btn-block">
              <h3>Disney Interactive</h3>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <MenuItem eventKey="1">propertyname2.com</MenuItem>
              <MenuItem eventKey="2">propertyname3.com</MenuItem>
              <MenuItem eventKey="3">propertyname4.com</MenuItem>
              <MenuItem eventKey="4">propertyname5.com</MenuItem>
            </Dropdown.Menu>
          </Dropdown>
          <div className="sidebar-actions">
            <ButtonToolbar>
              <Button bsStyle="primary">
                Export
              </Button>
            </ButtonToolbar>
          </div>
        </div>
        <div className="sidebar-section-header">
          TIMESPAN
        </div>
        <div className="sidebar-content">
          <div className="form-group">
            <Select className="btn-block"
              onSelect={this.handleTimespanChange}
              value={this.state.activeFilter}
              options={[
                ['month_to_date', 'Month to Date'],
                ['week_to_date', 'Week to Date'],
                ['today', 'Today'],
                ['custom_timerange', 'Custom Time Range']]}/>
          </div>
          {this.state.activeFilter === 'custom_timerange' ?
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
                    onBlur={this.handleOnBlur} />
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
                    onBlur={this.handleOnBlur} />
                </div>
              </Col>
            </Row>
            : ''
          }
        </div>
        <div className="sidebar-section-header">
          SERVICE: MEDIA DELIVERY
        </div>
        <div className="sidebar-content">
          <Input type="checkbox" label="HTTP" />
          <Input type="checkbox" label="HTTPS" />
        </div>
      </div>
    );
  }
}

Analyses.displayName = 'Analyses'
Analyses.propTypes = {
  activate: React.PropTypes.func,
  activeIndex: React.PropTypes.number,
  addVersion: React.PropTypes.func,
  configurations: React.PropTypes.instanceOf(Immutable.List),
  fetching: React.PropTypes.bool,
  propertyName: React.PropTypes.string,
  theme: React.PropTypes.string
}

function mapStateToProps(state) {
  return {
    theme: state.ui.get('theme')
  };
}

export default connect(mapStateToProps)(Analyses);
