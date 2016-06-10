import React from 'react'
import Immutable from 'immutable'
import { Col, Dropdown, Input, Row } from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import { Link } from 'react-router'

import Select from '../../components/select'
import DateRanges from '../../constants/date-ranges'
import TabTitles from '../../constants/report-tab-titles'
import STATUS_CODES from '../../constants/status-codes'

const handleReportTitleChange = (tab, type) => {
  if(TabTitles.hasOwnProperty(tab)) {
    return `${type} ${TabTitles[tab]}`
  } else {
    return `${type} ${tab}`
  }
}

export class Analyses extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeDateRange: 'month_to_date',
      activeServiceProvider: 'all',
      activePop: 'all',
      datepickerOpen: false,
      endDate: null,
      navMenuOpen: false,
      startDate: null
    }

    this.handleStartDateChange         = this.handleStartDateChange.bind(this)
    this.handleEndDateChange           = this.handleEndDateChange.bind(this)
    this.handleOnFocus                 = this.handleOnFocus.bind(this)
    this.handleOnBlur                  = this.handleOnBlur.bind(this)
    this.handleTimespanChange          = this.handleTimespanChange.bind(this)
    this.handleServiceProviderChange   = this.handleServiceProviderChange.bind(this)
    this.handlePopChange               = this.handlePopChange.bind(this)
    this.handleOnOffNetChartTypeChange = this.handleOnOffNetChartTypeChange.bind(this)
    this.toggleNavMenu                 = this.toggleNavMenu.bind(this)
    this.toggleServiceType             = this.toggleServiceType.bind(this)
    this.handleExport                  = this.handleExport.bind(this);
  }

  componentWillMount() {
    this.setState({
      endDate: this.props.endDate,
      startDate: this.props.startDate
    })
  }

  handleStartDateChange(startDate) {
    this.setState({ startDate: startDate.utc().startOf('day') })
    this.refs.endDateHolder.getElementsByTagName('input')[0].focus()
    this.refs.endDateHolder.getElementsByTagName('input')[0].click()
  }

  handleEndDateChange(endDate) {
    this.setState({ endDate: endDate.utc().endOf('day') })
    if(this.state.datepickerOpen) {
      this.setState({
        datepickerOpen: false
      })
    }
    setTimeout(() => {
      this.handleOnBlur()
    }, 200)
  }

  handleOnFocus() {
    this.setState({
      datepickerOpen: true
    })
  }

  handleOnBlur() {
    if(this.props.startDate !== this.state.startDate ||
      this.props.endDate !== this.state.endDate) {
      this.props.changeDateRange(this.state.startDate, this.state.endDate)
    }
    if(this.state.datepickerOpen) {
      this.setState({
        datepickerOpen: false
      })
    }
  }

  handleTimespanChange(value) {
    let startDate = this.props.startDate
    let endDate   = moment().utc().endOf('day')
    if(value === 'month_to_date') {
      startDate = moment().utc().startOf('month')
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
    this.props.changeDateRange(startDate, endDate)
    this.setState({
      activeDateRange: value,
      endDate: endDate,
      startDate: startDate
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

  handleOnOffNetChartTypeChange(type) {
    this.props.changeOnOffNetChartType(type)
  }

  toggleServiceType(type) {
    return () => {
      this.props.toggleServiceType(type)
    }
  }

  toggleNavMenu() {
    this.setState({ navMenuOpen: !this.state.navMenuOpen })
  }

  handleExport(exportType) {
    this.props.showExportPanel(exportType);
  }

  render() {
    const type = this.props.type ? this.props.type.toUpperCase() : ''
    return (
      <div className="analyses">

        <div className="sidebar-header">
          <p className="text-sm">{handleReportTitleChange(this.props.activeTab, type)}</p>
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

          {this.props.activeTab !== 'playback-demo' ?
            <div className="sidebar-actions">
              <div className="form-group">
                <Select className="btn-block"
                        onSelect={this.handleExport}
                        value=""
                        options={[
                          ['', 'Export report'],
                          ['export_pdf', 'Download PDF'],
                          ['export_csv', 'Download CSV'],
                          ['export_email', 'Send Email']

                        ]}/>
              </div>
            </div>
            : null}
        </div>
        {this.props.activeTab !== 'playback-demo' ?
          <div>
            <div className="sidebar-section-header">
              DATE RANGE
            </div>
            <div className="sidebar-content">
              <div className="form-group">
                <Select className="btn-block"
                        onSelect={this.handleTimespanChange}
                        value={this.state.activeDateRange}
                        options={[
                    ['month_to_date', DateRanges.MONTH_TO_DATE],
                    ['last_month', DateRanges.LAST_MONTH],
                    ['today', DateRanges.TODAY],
                    ['yesterday', DateRanges.YESTERDAY],
                    ['custom_timerange', DateRanges.CUSTOM_TIMERANGE]]}/>
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
                        selected={this.state.startDate}
                        startDate={this.state.startDate}
                        endDate={this.state.endDate}
                        onChange={this.handleStartDateChange}
                        onFocus={this.handleOnFocus}
                        onBlur={this.handleOnBlur}/>
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
                        onBlur={this.handleOnBlur}/>
                    </div>
                  </Col>
                </Row>
                : null
              }
            </div>
          </div>
          : null
        }
        {this.props.activeTab === 'on-off-net-report' ?
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
                        onSelect={this.handleOnOffNetChartTypeChange}
                        value={this.props.onOffNetChartType}
                        options={[
                    ['bar', 'Bar Chart'],
                    ['line', 'Line Chart']]}/>
              </div>
            </div>
          </div>
          : null}
        {this.props.activeTab !== 'visitors' &&
        this.props.activeTab !== 'playback-demo' &&
        this.props.activeTab !== 'storage-usage' ?
          <div className="sidebar-section-header">
            {this.props.activeTab === 'on-off-net-report' ?
              'FILTERS' :
              'SERVICE: MEDIA DELIVERY'
            }
          </div>
          : null}
        {this.props.activeTab === 'on-off-net-report' ?
          <div>
            <div className="sidebar-content">
              <Input type="checkbox" label="On-Net"/>
              <Input type="checkbox" label="Off-Net"/>
            </div>
            <hr className="sidebar-hr"/>
          </div>
          : null}
        {this.props.activeTab !== 'visitors' &&
        this.props.activeTab !== 'playback-demo' &&
        this.props.activeTab !== 'storage-usage' ?
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
              <Input type="checkbox"
                label="All"
                checked={this.props.statusCodes.size === STATUS_CODES.length}
                onChange={() => this.props.toggleStatusCode(STATUS_CODES)}/>
              {STATUS_CODES.map((code, index) =>
                <Input type="checkbox" key={index} label={code}
                  checked={this.props.statusCodes.includes(code)}
                  onChange={() => this.props.toggleStatusCode(code)}
                  />
              )}
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
        {this.props.activeTab === 'playback-demo' ?
          <div>
            <div className="sidebar-section-header">
              VIDEO URL
            </div>
            <div className="sidebar-content">
              <Select className="btn-block"
                      onSelect={this.props.changeVideo}
                      value={this.props.activeVideo}
                      options={[
                  ['/elephant/169ar/elephant_master.m3u8', 'Elephants Dream'],
                  ['/sintel/169ar/sintel_master.m3u8', 'Sintel'],
                  ['/bbb/169ar/bbb_master.m3u8', 'Big Buck Bunny']]}/>
            </div>
          </div>
          : null
        }
      </div>
    );
  }
}

Analyses.displayName = 'Analyses'
Analyses.propTypes   = {
  activate: React.PropTypes.func,
  activeIndex: React.PropTypes.number,
  activeTab: React.PropTypes.string,
  activeVideo: React.PropTypes.string,
  addVersion: React.PropTypes.func,
  changeDateRange: React.PropTypes.func,
  changeOnOffNetChartType: React.PropTypes.func,
  changeVideo: React.PropTypes.func,
  configurations: React.PropTypes.instanceOf(Immutable.List),
  endDate: React.PropTypes.instanceOf(moment),
  fetching: React.PropTypes.bool,
  name: React.PropTypes.string,
  navOptions: React.PropTypes.instanceOf(Immutable.List),
  onOffNetChartType: React.PropTypes.string,
  propertyName: React.PropTypes.string,
  serviceTypes: React.PropTypes.instanceOf(Immutable.List),
  showExportPanel: React.PropTypes.func,
  startDate: React.PropTypes.instanceOf(moment),
  statusCodes: React.PropTypes.instanceOf(Immutable.List),
  toggleServiceType: React.PropTypes.func,
  toggleStatusCode: React.PropTypes.func,
  type: React.PropTypes.string
}

module.exports = Analyses
