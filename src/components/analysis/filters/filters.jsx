import React from 'react'
import Immutable from 'immutable'
import { Dropdown } from 'react-bootstrap'
import moment from 'moment'
import { Link } from 'react-router'

import Select from '../../../components/select'
import TabTitles from '../../../constants/report-tab-titles'
// Filters
import ServiceProvider from './service-provider'
import ChartType from './chart-type'
import OnOffNet from './on-off-net'
import ServiceType from './service-type'
import ResponseCode from './response-code'
import Property from './property'
import Video from './video'
import DateRange from './date-range'

const handleReportTitleChange = (tab, type) => {
  if(TabTitles.hasOwnProperty(tab)) {
    return `${type} ${TabTitles[tab]}`
  } else {
    return `${type} ${tab}`
  }
}

const serviceProviderOpts = [
  ['all', 'All'],
  ['option', 'Option']
]

const popOpts = [
  ['all', 'All'],
  ['option', 'Option']
]

export class Filters extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeServiceProvider: 'all',
      activePop: 'all',
      navMenuOpen: false
    }

    this.handleServiceProviderChange   = this.handleServiceProviderChange.bind(this)
    this.handlePopChange               = this.handlePopChange.bind(this)
    this.handleOnOffNetChartTypeChange = this.handleOnOffNetChartTypeChange.bind(this)
    this.toggleNavMenu                 = this.toggleNavMenu.bind(this)
    this.handleExport                  = this.handleExport.bind(this);
  }

  handleServiceProviderChange(value) {
    this.setState({ activeServiceProvider: value })
  }

  handlePopChange(value) {
    this.setState({ activePop: value })
  }

  handleOnOffNetChartTypeChange(type) {
    this.props.changeOnOffNetChartType(type)
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
      <div className="filters">
        <div className="sidebar-header">
          <h5>{handleReportTitleChange(this.props.activeTab, type)}</h5>
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
        {this.props.activeTab !== 'playback-demo' &&
          <DateRange
            changeDateRange={this.props.changeDateRange}
            endDate={this.props.endDate}
            startDate={this.props.startDate}/>}
        {this.props.activeTab === 'service-providers' &&
          <div>
            <ServiceProvider
              value={this.state.activeServiceProvider}
              changeServiceProvider={this.handleServiceProviderChange}
              options={serviceProviderOpts}/>
            <Pop
              value={this.state.activePop}
              changePop={this.handlePopChange}
              options={popOpts}/>
          </div>}
        {this.props.activeTab === 'on-off-net-report' &&
          <ChartType
            value={this.props.onOffNetChartType}
            changeType={this.handleOnOffNetChartTypeChange}/>}
        {this.props.activeTab === 'on-off-net-report' ||
         this.props.activeTab === 'service-providers' ?
           <OnOffNet/>
          : null}
        {this.props.activeTab !== 'visitors' &&
        this.props.activeTab !== 'playback-demo' &&
        this.props.activeTab !== 'storage-usage' &&
        this.props.activeTab !== 'on-off-net-report' ?
          <ServiceType
            serviceTypes={this.props.serviceTypes}
            toggleServiceType={this.props.toggleServiceType}/>
          : null}
        {this.props.activeTab === 'file-error' &&
          <div>
            <ResponseCode
              statusCodes={this.props.statusCodes}
              toggleStatusCode={this.props.toggleStatusCode}/>
            <Property/>
          </div>}
        {this.props.activeTab === 'playback-demo' &&
          <Video
            changeVideo={this.props.changeVideo}
            value={this.props.activeVideo}/>}
      </div>
    );
  }
}

Filters.displayName = 'Filters'
Filters.propTypes   = {
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

module.exports = Filters
