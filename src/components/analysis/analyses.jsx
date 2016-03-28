import React from 'react'
import Immutable from 'immutable'
import { Button, ButtonToolbar, Col, Dropdown, Input,
  MenuItem, Row } from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import moment from 'moment'

import Select from '../../components/select'

export class Analyses extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeDateRange: 'month_to_date',
      activeServiceProvider: 'all',
      activePop: 'all',
      activeChartType: 'bar',
      datepickerOpen: false
    }

    this.handleStartDateChange = this.handleStartDateChange.bind(this)
    this.handleEndDateChange = this.handleEndDateChange.bind(this)
    this.handleOnFocus = this.handleOnFocus.bind(this)
    this.handleOnBlur = this.handleOnBlur.bind(this)
    this.handleTimespanChange = this.handleTimespanChange.bind(this)
    this.handleServiceProviderChange = this.handleServiceProviderChange.bind(this)
    this.handlePopChange = this.handlePopChange.bind(this)
    this.handleChartTypeChange = this.handleChartTypeChange.bind(this)
    this.toggleServiceType = this.toggleServiceType.bind(this)
  }
  handleStartDateChange(date) {
    let endDate = this.props.endDate
    if(date > this.props.endDate) {
      endDate = date
    }
    this.props.changeDateRange(date, endDate)
    this.refs.endDateHolder.getElementsByTagName('input')[0].focus()
    this.refs.endDateHolder.getElementsByTagName('input')[0].click()
  }
  handleEndDateChange(date) {
    let startDate = this.props.startDate
    if(date < this.props.startDate) {
      startDate = date
    }
    this.props.changeDateRange(startDate, date)
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
    let startDate = this.props.startDate
    if(value === 'month_to_date') {
      startDate = moment().startOf('month')
    }
    else if(value === 'week_to_date') {
      startDate = moment().startOf('week')
    }
    else if(value === 'today') {
      startDate = moment().startOf('day')
    }
    this.props.changeDateRange(startDate, moment())
    this.setState({
      activeDateRange: value
    })
  }
  handleServiceProviderChange(value) {
    this.setState({
      activeServiceProvider: value
    })
  }
  handlePopChange(value) {
    this.setState({
      activePop: value
    })
  }
  handleChartTypeChange(value) {
    this.setState({
      activeChartType: value
    })
  }
  toggleServiceType(type) {
    return () => {
      this.props.toggleServiceType(type)
    }
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
          DATE RANGE
        </div>
        <div className="sidebar-content">
          <div className="form-group">
            <Select className="btn-block"
              onSelect={this.handleTimespanChange}
              value={this.state.activeDateRange}
              options={[
                ['month_to_date', 'Month to Date'],
                ['week_to_date', 'Week to Date'],
                ['today', 'Today'],
                ['custom_timerange', 'Custom Time Range']]}/>
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
                    selected={this.props.startDate}
                    startDate={this.props.startDate}
                    endDate={this.props.endDate}
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
                    selected={this.props.endDate}
                    startDate={this.props.startDate}
                    endDate={this.props.endDate}
                    onChange={this.handleEndDateChange}
                    onFocus={this.handleOnFocus}
                    onBlur={this.handleOnBlur} />
                </div>
              </Col>
            </Row>
            : null
          }
        </div>
        {this.props.isSPReport ?
          <div>
            <div className="sidebar-section-header">
              SERVICE PROVIDER
            </div>
            <div className="sidebar-content">
              <div className="form-group">
                <Select className="btn-block"
                  onSelect={this.handleServiceProviderChange}
                  value={this.state.activeServiceProvider}
                  options={[
                    ['all', 'All'],
                    ['option', 'Option']]}/>
              </div>
            </div>
            <div className="sidebar-section-header">
              POP
            </div>
            <div className="sidebar-content">
              <div className="form-group">
                <Select className="btn-block"
                  onSelect={this.handlePopChange}
                  value={this.state.activePop}
                  options={[
                    ['all', 'All'],
                    ['option', 'Option']]}/>
              </div>
            </div>
            <div className="sidebar-section-header">
              CHART TYPE
            </div>
            <div className="sidebar-content">
              <div className="form-group">
                <Select className="btn-block"
                  onSelect={this.handleChartTypeChange}
                  value={this.state.activeChartType}
                  options={[
                    ['bar', 'Bar Chart'],
                    ['line', 'Line Chart']]}/>
              </div>
            </div>
          </div>
        : null}
        <div className="sidebar-section-header">
          {this.props.isSPReport ?
            'FILTERS' :
            'SERVICE: MEDIA DELIVERY'
          }
        </div>
        {this.props.isSPReport ?
          <div>
            <div className="sidebar-content">
              <Input type="checkbox" label="On-Net"/>
              <Input type="checkbox" label="Off-Net"/>
            </div>
            <hr className="sidebar-hr" />
          </div>
        : null}
        <div className="sidebar-content">
          <Input type="checkbox" label="HTTP"
            checked={this.props.serviceTypes.includes('http')}
            onChange={this.toggleServiceType('http')}/>
          <Input type="checkbox" label="HTTPS"
            checked={this.props.serviceTypes.includes('https')}
            onChange={this.toggleServiceType('https')}/>
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
  changeDateRange: React.PropTypes.func,
  configurations: React.PropTypes.instanceOf(Immutable.List),
  endDate: React.PropTypes.instanceOf(moment),
  fetching: React.PropTypes.bool,
  isSPReport: React.PropTypes.bool,
  propertyName: React.PropTypes.string,
  serviceTypes: React.PropTypes.instanceOf(Immutable.List),
  startDate: React.PropTypes.instanceOf(moment),
  toggleServiceType: React.PropTypes.func
}

module.exports = Analyses
