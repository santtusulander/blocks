import React from 'react'
import Immutable from 'immutable'
import { Button, ButtonToolbar, Col, Dropdown, Input, Row } from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import { Link } from 'react-router'

import Select from '../../components/select'

export class Analyses extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeDateRange: 'month_to_date',
      activeServiceProvider: 'all',
      activePop: 'all',
      activeChartType: 'bar',
      datepickerOpen: false,
      navMenuOpen: false
    }

    this.handleStartDateChange = this.handleStartDateChange.bind(this)
    this.handleEndDateChange = this.handleEndDateChange.bind(this)
    this.handleOnFocus = this.handleOnFocus.bind(this)
    this.handleOnBlur = this.handleOnBlur.bind(this)
    this.handleTimespanChange = this.handleTimespanChange.bind(this)
    this.handleServiceProviderChange = this.handleServiceProviderChange.bind(this)
    this.handlePopChange = this.handlePopChange.bind(this)
    this.handleChartTypeChange = this.handleChartTypeChange.bind(this)
    this.toggleNavMenu = this.toggleNavMenu.bind(this)
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
  toggleNavMenu() {
    this.setState({navMenuOpen: !this.state.navMenuOpen})
  }
  render() {
    const type = this.props.type ? this.props.type.toUpperCase() : ''
    return (
      <div className="analyses">
        <div className="sidebar-header">
          <p className="text-sm">{type} TRAFFIC OVERVIEW</p>
          <Dropdown id="dropdown-content" open={this.state.navMenuOpen}
            onToggle={this.toggleNavMenu}>
            <Dropdown.Toggle bsStyle="link" className="header-toggle btn-block">
              <h3>{this.props.name}</h3>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {this.props.navOptions ? this.props.navOptions.map((nav, i) => {
                return (
                  <li key={i} active={nav.active}>
                    <Link
                      className={nav.active ? 'active' : ''}
                      to={nav.link}
                      activeClassName="active"
                      onClick={this.toggleNavMenu}>
                      {nav.name}
                    </Link>
                  </li>
                )
              }) : ''}
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
                ['custom_timerange', 'Custom Date Range']]}/>
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
        {this.props.activeTab === 'sp-report' ?
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
        {this.props.activeTab !== 'visitors' ?
          <div className="sidebar-section-header">
            {this.props.activeTab === 'sp-report' ?
              'FILTERS' :
              'SERVICE: MEDIA DELIVERY'
            }
          </div>
        : null}
        {this.props.activeTab === 'sp-report' ?
          <div>
            <div className="sidebar-content">
              <Input type="checkbox" label="On-Net"/>
              <Input type="checkbox" label="Off-Net"/>
            </div>
            <hr className="sidebar-hr" />
          </div>
        : null}
        {this.props.activeTab !== 'visitors' ?
          <div className="sidebar-content">
            <Input type="checkbox" label="HTTP"
              checked={this.props.serviceTypes.includes('http')}
              onChange={this.toggleServiceType('http')}/>
            <Input type="checkbox" label="HTTPS"
              checked={this.props.serviceTypes.includes('https')}
              onChange={this.toggleServiceType('https')}/>
          </div>
        : null}
        {this.props.activeTab === 'file-error' ?
          <div>
            <div className="sidebar-section-header">
              RESPONSE CODE
            </div>
            <div className="sidebar-content">
              <Input type="checkbox" label="All"/>
              <Input type="checkbox" label="401"/>
              <Input type="checkbox" label="402"/>
              <Input type="checkbox" label="403"/>
              <Input type="checkbox" label="404"/>
              <Input type="checkbox" label="405"/>
              <Input type="checkbox" label="411"/>
              <Input type="checkbox" label="412"/>
              <Input type="checkbox" label="413"/>
              <Input type="checkbox" label="500"/>
              <Input type="checkbox" label="501"/>
              <Input type="checkbox" label="502"/>
              <Input type="checkbox" label="503"/>
            </div>
            <div className="sidebar-section-header">
              PROPERTIES
            </div>
            <div className="sidebar-content">
              <div className="form-group">
                <Select className="btn-block"
                  value={'all'}
                  options={[
                    ['all', 'All']]}/>
              </div>
            </div>
          </div>
        : null}
      </div>
    );
  }
}

Analyses.displayName = 'Analyses'
Analyses.propTypes = {
  activate: React.PropTypes.func,
  activeIndex: React.PropTypes.number,
  activeTab: React.PropTypes.string,
  addVersion: React.PropTypes.func,
  changeDateRange: React.PropTypes.func,
  configurations: React.PropTypes.instanceOf(Immutable.List),
  endDate: React.PropTypes.instanceOf(moment),
  fetching: React.PropTypes.bool,
  name: React.PropTypes.string,
  navOptions: React.PropTypes.instanceOf(Immutable.List),
  propertyName: React.PropTypes.string,
  serviceTypes: React.PropTypes.instanceOf(Immutable.List),
  startDate: React.PropTypes.instanceOf(moment),
  toggleServiceType: React.PropTypes.func,
  type: React.PropTypes.string
}

module.exports = Analyses
