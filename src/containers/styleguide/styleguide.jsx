import React from 'react'
import {connect} from 'react-redux'
import Immutable from 'immutable'
import numeral from 'numeral'
import moment from 'moment'

// React-Bootstrap
// ===============

import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  ButtonToolbar,
  Col,
  ControlLabel,
  Dropdown,
  FormControl,
  FormGroup,
  HelpBlock,
  Image,
  InputGroup,
  Label,
  MenuItem,
  NavItem,
  OverlayTrigger,
  Pagination,
  Popover,
  Row,
  Table
} from 'react-bootstrap';

import StyleguideIcons from './styleguide-icons'
import StyleguideCharts from './styleguide-charts'

import SelectWrapper from '../../components/shared/form-elements/select-wrapper'
import FilterChecklistDropdown from '../../components/shared/form-elements/filter-checklist-dropdown.jsx'
import SelectorComponent from '../../components/global-account-selector/selector-component'
import Tabs from '../../components/shared/page-elements/tabs'
import MonthPicker from '../../components/shared/form-elements/month-picker'
import StackedByTimeSummary from '../../components/charts/stacked-by-time-summary'
import MiniChart from '../../components/charts/mini-chart'
import NumberInput from '../../components/shared/form-elements/number-input'
import SidePanel from '../../components/shared/side-panel'
import DashboardPanel from '../../components/dashboard/dashboard-panel'
import DashboardPanels from '../../components/dashboard/dashboard-panels'
import CustomDatePicker from '../../components/shared/form-elements/custom-date-picker'
import DateRangeSelect from '../../components/shared/form-elements/date-range-select'
import MultiOptionSelector from '../../components/shared/form-elements/multi-option-selector'
import Checkbox from '../../components/shared/form-elements/checkbox'
import Radio from '../../components/shared/form-elements/radio'
import NetworkItem from '../../components/network/network-item'
import CsvUploadArea from '../../components/network/csv-upload'
import TimePicker from '../../components/shared/form-elements/time-picker'
import Typeahead from '../../components/shared/form-elements/typeahead'
import StorageKPI from '../../components/storage/storage-kpi'
import StorageItemChart from '../../components/content/storage/storage-item-chart'
import SortableMultiSelector from '../../components/shared/form-elements/sortable-multi-selector'
import FileUploadStatus from '../../components/storage/file-upload-status-container.jsx'
import PolicyWeight from '../../components/configuration/policy-weight'
import Mapbox from '../../components/map/mapbox'

import IconAdd from '../../components/shared/icons/icon-add'
import IconCaretDown from '../../components/shared/icons/icon-caret-down'
import IconQuestionMark from '../../components/shared/icons/icon-question-mark'

import { formatBytes, separateUnit } from '../../util/helpers'

import DateRanges from '../../constants/date-ranges'
import country_list from '../../constants/country-list'

import { cityData, filterCheckboxOptions, spDashboardData,
         countryData, multiOptionSelectorOptions, typeaheadOptions,
         miniChartKPIData } from '../__mocks__/styleguide-data.js'

import * as countriesGeoJSON from '../../assets/topo/custom.geo.json';

class Styleguide extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      activeTab: 1,
      showSidePanel: false,
      customDatePickerEndDate: moment().endOf('day'),
      customDatePickerStartDate: moment().startOf('day'),
      datePickerEndDate: moment().utc().endOf('day'),
      datePickerLimit: false,
      datePickerStartDate: moment().utc().startOf('month'),
      filterCheckboxValue: Immutable.fromJS([
        'link1',
        'link2',
        'link3',
        'link4',
        'link5',
        'link6',
        'link7',
        'link8',
        'link9'
      ]),
      multiOptionValues: Immutable.List([ {id: 1, options: [1, 2]} ]),
      numberInputValue: 100,
      sortableMultiSelectorItems: Immutable.List([1, 2]),
      timePickerTime: moment().utc()
    }
  }

  render() {

    const datasetA = spDashboardData.traffic.detail.map(datapoint => {
      return {
        bytes: datapoint.bytes_net_on || 0,
        timestamp: datapoint.timestamp
      }
    })

    const datasetB = spDashboardData.traffic.detail.map(datapoint => {
      return {
        bytes: datapoint.bytes_net_off || 0,
        timestamp: datapoint.timestamp
      }
    })

    const totalDatasetValueOutput = separateUnit(formatBytes(spDashboardData.traffic.bytes))
    const totalDatasetValue = totalDatasetValueOutput.value
    const totalDatasetUnit = totalDatasetValueOutput.unit

    const datasetAValue = numeral((spDashboardData.traffic.bytes_net_on / spDashboardData.traffic.bytes) * 100).format('0,0')
    const datasetBValue = numeral((spDashboardData.traffic.bytes_net_off / spDashboardData.traffic.bytes) * 100).format('0,0')

    return (
      <div className="styleguide-page">

        <div className="container">

          <h1 className="page-header">Ericsson UDN Styleguide</h1>

          <h1 className="page-header">Typography</h1>

          <h1>Heading H1</h1>
          <h2>Heading H2</h2>
          <h3>Heading H3</h3>
          <h4>Heading H4</h4>
          <h5>Heading H5</h5>

          <h3>Heading with label <Label>New</Label></h3>

          <hr />

          <p className="lead">Leading body text. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>

          <hr />

          <p>Body text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin accumsan in nisi at suscipit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Donec et sem posuere, pulvinar purus quis, varius augue. Praesent porttitor, mauris aliquet feugiat vestibulum, diam augue tempor turpis, id facilisis sapien massa ac eros. Vestibulum pretium cursus varius. Suspendisse sed enim vel orci fermentum consectetur. Cras metus risus, ultrices ut elit id, fringilla euismod quam. In pharetra tellus lectus. Aliquam erat volutpat. Morbi justo neque, pellentesque quis nunc a, varius euismod odio. Integer gravida quam sit amet ornare mattis. Proin molestie ex vitae ligula pellentesque, vitae placerat magna tincidunt. Aliquam sed purus id lectus volutpat suscipit quis a mauris. Fusce in est mattis, tristique mi id, auctor nibh. Proin venenatis id sapien id lobortis. Nullam cursus nisi mauris, eget interdum nisi porttitor nec.</p>

          <p className="text-sm">Small body text.</p>

          <h1 className="page-header">Breadcrumbs</h1>

          <Breadcrumb>
            <BreadcrumbItem href="#">
              Home
            </BreadcrumbItem>
            <BreadcrumbItem href="#">
              Configuration
            </BreadcrumbItem>
            <BreadcrumbItem active={true}>
              Account
            </BreadcrumbItem>
          </Breadcrumb>


          <h1 className="page-header">Charts</h1>
          <StyleguideCharts />

          <h1 className="page-header">Tabs</h1>

          <Tabs
            activeKey={this.state.activeTab}
            className="styleguide-row"
            onSelect={key => this.setState({ activeTab: key })}>
            <NavItem eventKey={1}>Tab Name 1</NavItem>
            <NavItem eventKey={2}>Long Tab Name 2</NavItem>
            <NavItem eventKey={3}>Longer Tab Name 3</NavItem>
            <NavItem eventKey={4}>Even Longer Tab Name 4</NavItem>
            <NavItem eventKey={5}>Can&apos;t believe how Long Tab Name 5</NavItem>
            <NavItem eventKey={6}>Normal Tab Name 6</NavItem>
          </Tabs>

          {this.state.activeTab === 1 &&
            <div>Tab 1 content</div>
          }
          {this.state.activeTab === 2 &&
            <div>Tab 2 content</div>
          }
          {this.state.activeTab === 3 &&
            <div>Tab 3 content</div>
          }
          {this.state.activeTab === 4 &&
            <div>Tab 4 content</div>
          }
          {this.state.activeTab === 5 &&
            <div>Tab 5 content</div>
          }
          {this.state.activeTab === 6 &&
            <div>Tab 6 content</div>
          }


          <hr />


          <h1 className="page-header">Buttons</h1>
          <ButtonToolbar className="styleguide-row">
            <Button bsStyle="primary">Primary</Button>
            <Button className="btn-secondary">Secondary</Button>
            <Button className="btn-tertiary">Tertiary</Button>
            <Button bsStyle="danger">Destructive</Button>
            <Button bsStyle="success">Confirmation</Button>
            <Button bsStyle="link">Link button</Button>
            <Button bsStyle="success" className="btn-icon"><IconAdd/></Button>
            <Button bsStyle="primary" className="btn-icon btn-round"><IconQuestionMark/></Button>
          </ButtonToolbar>

          <ButtonToolbar className="styleguide-row">
            <Button bsStyle="primary" disabled={true}>Primary</Button>
            <Button className="btn-secondary" disabled={true}>Secondary</Button>
            <Button className="btn-tertiary" disabled={true}>Tertiary</Button>
            <Button bsStyle="danger" disabled={true}>Destructive</Button>
            <Button bsStyle="success" disabled={true}>Confirmation</Button>
            <Button bsStyle="link" disabled={true}>Link button</Button>
            <Button bsStyle="success" className="btn-icon" disabled={true}><IconAdd/></Button>
            <Button bsStyle="primary" className="btn-icon btn-round" disabled={true}><IconQuestionMark/></Button>
          </ButtonToolbar>


          <h1 className="page-header">Dropdowns</h1>
          <div className="row">
            <div className="col-xs-3">
              <SelectWrapper options={[[1, 'Item 1'], [2, 'Item 2'], [3, 'Dropdown Item 3']]} value={1}/>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className="col-xs-6">
              <FilterChecklistDropdown
                options={filterCheckboxOptions}
                value={this.state.filterCheckboxValue}
                onChange={(newVals) => this.setState({filterCheckboxValue: newVals})} />
            </div>
          </div>

          <div className="row">
            <div className="col-xs-6">
              <SelectorComponent items={[[1, 'Item 1'], [2, 'Item 2'], [3, 'Dropdown Item 3']]} drillable={true}>
                <div className="btn btn-link dropdown-toggle header-toggle">
                  <h1>Select Account</h1>
                  <IconCaretDown />
                </div>
              </SelectorComponent>
            </div>
          </div>

          <h1 className="page-header">Tables</h1>
          <Table striped={true}>
            <thead>
              <tr>
                <th>Rule Priority</th>
                <th>Rule Type</th>
                <th>Rule</th>
                <th>TTL Value</th>
                <th>Match Condition</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>extension</td>
                <td>gif</td>
                <td>1 day</td>
                <td>positive</td>
              </tr>
              <tr>
                <td>2</td>
                <td>directory</td>
                <td>/wp-content</td>
                <td>no-store</td>
                <td>positive</td>
              </tr>
              <tr>
                <td>3</td>
                <td>MIME-type</td>
                <td>video/mpeg</td>
                <td>15 min</td>
                <td>positive</td>
              </tr>
              <tr>
                <td>4</td>
                <td>extension</td>
                <td>txt</td>
                <td>1 hour</td>
                <td>negative</td>
              </tr>
              <tr>
                <td>5</td>
                <td>directory</td>
                <td>/wp-admin</td>
                <td>no-store</td>
                <td>positive</td>
              </tr>
              <tr>
                <td>6</td>
                <td>MIME-type</td>
                <td>text/html</td>
                <td>1 week</td>
                <td>negative</td>
              </tr>
            </tbody>
          </Table>

          <h1 className="page-header">Forms</h1>

          <div className="row">
            <div className="col-xs-6">
              <FormGroup>
                <ControlLabel>Default Input</ControlLabel>
                <FormControl type="text" placeholder="Enter text" />
              </FormGroup>

              <FormGroup>
                <ControlLabel>Email Input</ControlLabel>
                <FormControl type="email" placeholder="Enter email" />
              </FormGroup>

              <FormGroup>
                <ControlLabel>Password Input</ControlLabel>
                <FormControl type="password" placeholder="Enter password" />
              </FormGroup>

              <FormGroup>
                <ControlLabel>Input with Addons</ControlLabel>
                <InputGroup>
                  <InputGroup.Addon>{"$"}</InputGroup.Addon>
                  <FormControl type="text" placeholder="Enter text" />
                </InputGroup>
              </FormGroup>

              <FormGroup>
                <ControlLabel>Text Area</ControlLabel>
                <FormControl componentClass="textArea" placeholder="Enter text" />
              </FormGroup>
            </div>

            <div className="col-xs-6">
              <FormGroup validationState="success">
                <ControlLabel>Has Success</ControlLabel>
                <FormControl type="text" />
                <HelpBlock>Helper text</HelpBlock>
              </FormGroup>

              <FormGroup validationState="error">
                <ControlLabel>Has Error</ControlLabel>
                <FormControl type="text" />
                <HelpBlock>Helper text</HelpBlock>
              </FormGroup>
            </div>
          </div>

          <hr />

          <div className="row">

            <div className="col-xs-6">

              <form className="form-horizontal">

                <FormGroup>
                  <Col componentClass={ControlLabel} xs={3}>
                    Inline Input
                  </Col>
                  <Col xs={9}>
                    <InputGroup>
                      <FormControl />
                      <InputGroup.Addon>
                        <OverlayTrigger trigger="click" rootClose={true} overlay={
                          <Popover id="popover1" title="Info">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                          </Popover>
                        }>
                        <Button bsStyle="link" className="col-xs-2"><IconQuestionMark /></Button>
                        </OverlayTrigger>
                      </InputGroup.Addon>
                    </InputGroup>
                  </Col>
                </FormGroup>

                <FormGroup>
                  <Col componentClass={ControlLabel} xs={3}>
                    Inline Text Area
                  </Col>
                  <Col xs={9}>
                    <FormControl componentClass="textarea" />
                  </Col>
                </FormGroup>

                <FormGroup>
                  <Checkbox inline={true}>Inline Checkbox</Checkbox>
                </FormGroup>

              </form>

            </div>

          </div>


          <hr />

          <Row>

            <Col xs={6}>

              <ControlLabel>Number Input</ControlLabel>
              <p>Example min = 0, max = 200</p>

              <FormGroup>
                <NumberInput
                  max={200}
                  min={0}
                  onChange={val => this.setState({
                    numberInputValue: val === parseInt(val, 10) || !val ?
                      val :
                      val.target.value
                  })}
                  value={this.state.numberInputValue} />
              </FormGroup>

            </Col>

          </Row>


          <hr />

          <div className="row">

            <div className="col-xs-6">

              <FormGroup>
                <ControlLabel>Checkboxes</ControlLabel>
                <Checkbox value={1}>Checkbox 1</Checkbox>
                <Checkbox value={2}>Checkbox 2</Checkbox>
                <Checkbox value={3}>Checkbox 3</Checkbox>
                <Checkbox value={4} disabled={true}>Checkbox Disabled</Checkbox>
              </FormGroup>

            </div>

            <div className="col-xs-6">

              <FormGroup controlId="Radio">
                <ControlLabel>Radios</ControlLabel>
                <Radio value={1}>Radio 1</Radio>
                <Radio value={2}>Radio 2</Radio>
                <Radio value={3}>Radio 3</Radio>
                <Radio value={4} disabled={true}>Radio Disabled</Radio>
              </FormGroup>

            </div>

          </div>


          <hr />

          <label>Select</label>
          <div>
            <Dropdown id="dropdown-select" className="dropdown-select">
              <Dropdown.Toggle>
                View Production
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <MenuItem eventKey="1" active={true}>Production</MenuItem>
                <MenuItem eventKey="2">Staging</MenuItem>
                <MenuItem eventKey="3">In Process</MenuItem>
                <MenuItem eventKey="4">History</MenuItem>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <h1 className="page-header">Multi Option Selector</h1>

          <MultiOptionSelector
            options={multiOptionSelectorOptions}
            field={{
              onChange: val => this.setState({ multiOptionValues: Immutable.List(val) }),
              value: this.state.multiOptionValues
            }}
            />

          <h1 className="page-header">Token input</h1>

          <Row>
            <Col xs={6}>
              <label>Predefined list</label>
              <Typeahead
                multiple={true}
                onChange={() => null}
                options={typeaheadOptions}
              />
            </Col>

            <Col xs={6}>
              <label>Allows custom token creation</label>
              <Typeahead
                emptyLabel="Add tokens by typing"
                newSelectionPrefix="Add token: "
                allowNew={true}
                multiple={true}
                onChange={() => null}
                options={[]}/>
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <label>Contry picker</label>
              <Typeahead
                placeholder={"Entry contry name, or 2 letter code ISO code"}
                multiple={true}
                onChange={() => null}
                options={country_list}/>
            </Col>
          </Row>
          <h1 className="page-header">Month Picker</h1>
          <Row>
            <Col xs={6}>
              <MonthPicker
                date={null}
                onChange={() => null} />
            </Col>
          </Row>

          <h1 className="page-header">Stacked By Time Summary</h1>
          <Row>
            <Col xs={6}>
              <StackedByTimeSummary
                dataKey="bytes"
                totalDatasetValue={totalDatasetValue}
                totalDatasetUnit={totalDatasetUnit}
                datasetAArray={datasetA}
                datasetALabel="On-Net"
                datasetAUnit="%"
                datasetAValue={datasetAValue}
                datasetBArray={datasetB}
                datasetBLabel="Off-Net"
                datasetBUnit="%"
                datasetBValue={datasetBValue}
              />
            </Col>
          </Row>

          <h1 className="page-header">Mini Chart</h1>
          <Row>
            <Col xs={3}>
              <label>With label and KPI</label>
              <hr />
              <MiniChart
                dataKey="bytes"
                data={miniChartKPIData}
                kpiValue={80}
                kpiUnit="Gbps"
                label="Avg Bandwidth" />
            </Col>
            <Col xs={3}>
              <label>With only KPI</label>
              <hr />
              <MiniChart
                dataKey="bytes"
                data={miniChartKPIData}
                kpiValue="47.56"
                kpiUnit="%" />
            </Col>
            <Col xs={3}>
              <label>Right aligned KPI</label>
              <hr />
              <MiniChart
                dataKey="bytes"
                data={miniChartKPIData}
                kpiValue={80}
                kpiUnit="Gbps"
                kpiRight={true} />
            </Col>
            <Col xs={3}>
              <label>Without label and KPI</label>
              <hr />
              <MiniChart
                dataKey="bytes"
                data={miniChartKPIData} />
            </Col>
          </Row>

          <h1 className="page-header">Date Picker</h1>

          <Row>
            <Col xs={4}>
              <DateRangeSelect
                endDate={this.state.datePickerEndDate}
                startDate={this.state.datePickerStartDate}
                limitRange={this.state.datePickerLimit}
                changeDateRange={(start, end) => this.setState({ datePickerEndDate: end, datePickerStartDate: start })}
                availableRanges={[
                  DateRanges.MONTH_TO_DATE,
                  DateRanges.LAST_MONTH,
                  DateRanges.THIS_WEEK,
                  DateRanges.LAST_WEEK
                ]} />
            </Col>
            <Col xs={4}>
              <Checkbox
                checked={this.state.datePickerLimit}
                onClick={
                  () => {
                    const { datePickerEndDate, datePickerStartDate, datePickerLimit } = this.state
                    if (!datePickerLimit && datePickerEndDate.diff(datePickerStartDate, 'months') >= 4) {
                      this.setState({
                        datePickerEndDate: this.state.datePickerStartDate.clone().add(4, 'months').subtract(1, 'day')
                      })
                    }
                    this.setState({ datePickerLimit: !datePickerLimit })
                  }
                }>Limit range to 4 months</Checkbox>
            </Col>
            <Col xs={4}>
              <p>{`startDate: ${this.state.datePickerStartDate} (${this.state.datePickerStartDate.format('MM/DD/YYYY HH:mm')})`}</p>
              <p>{`endDate: ${this.state.datePickerEndDate} (${this.state.datePickerEndDate.format('MM/DD/YYYY HH:mm')})`}</p>
            </Col>
          </Row>

          <h1 className="page-header">Custom Date Picker</h1>

          <Row>
            <Col xs={4}>
              <CustomDatePicker
                startDate={this.state.customDatePickerStartDate}
                changeDateRange={(startDate, endDate) => this.setState({ customDatePickerEndDate: endDate, customDatePickerStartDate: startDate })} />
            </Col>
            <Col xs={4}>
              <p>{`startDate: ${this.state.customDatePickerStartDate} (${this.state.customDatePickerStartDate.format('MM/DD/YYYY HH:mm')})`}</p>
            </Col>
            <Col xs={4}>
              <p>{`endDate: ${this.state.customDatePickerEndDate} (${this.state.customDatePickerEndDate.format('MM/DD/YYYY HH:mm')})`}</p>
            </Col>
          </Row>

          <h1 className="page-header">Time Picker</h1>

          <Row>
            <Col xs={4}>
              <TimePicker
                time={this.state.timePickerTime}
                onChange={(time) => this.setState({ timePickerTime: time })} />
            </Col>
            <Col xs={8}>
              <p>{`time: ${this.state.timePickerTime} (${this.state.timePickerTime.format('HH:mm')})`}</p>
            </Col>
          </Row>

          <h1 className="page-header">Side Panel</h1>
          <Button bsStyle="primary" onClick={() => this.setState({showSidePanel: true})}>Trigger Side Panel</Button>
          {this.state.showSidePanel &&
            <SidePanel
            show={this.state.showSidePanel}
            title="Side Panel"
            subTitle="Styleguide Example"
            cancelButton={true}
            submitButton={true}
            submitText="Close"
            cancel={() => this.setState({showSidePanel: false})}
            submit={() => this.setState({showSidePanel: false})}>
            <form onSubmit={() => this.setState({showSidePanel: false})}>
              <FormGroup>
                <ControlLabel>Name</ControlLabel>
                <FormControl/>
              </FormGroup>

              <hr/>

              <FormGroup>
                <ControlLabel>Type</ControlLabel>
                <FormControl/>
              </FormGroup>
            </form>
          </SidePanel>}

          <h1 className="page-header">Dashboard Panel</h1>

          <DashboardPanels>
            <DashboardPanel title="Traffic">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum et mi imperdiet, condimentum nibh a, tincidunt ipsum. Fusce vitae metus iaculis, iaculis nunc vel, laoreet nisi. Aliquam quis tortor vitae odio porttitor suscipit. Donec vel nisl quis lacus consequat semper. Morbi cursus vestibulum urna. Praesent eleifend feugiat enim, eget accumsan mauris aliquet et. Vivamus tincidunt magna est, id commodo felis tempor vitae. In odio nisl, mollis interdum lacus et, varius scelerisque odio. Curabitur vitae libero eu metus mattis vulputate. Quisque commodo congue fringilla.</p>
            </DashboardPanel>
            <DashboardPanel title="No padding" noPadding={true}>
              <Image responsive={true} src="https://upload.wikimedia.org/wikipedia/en/archive/a/a4/20060531003742!United_States_(World_Map).png" />
            </DashboardPanel>
          </DashboardPanels>

          <h1 className="page-header">Pagination</h1>
          <Pagination
            items={10}
            maxButtons={5}
            activePage={5}
            prev={true}
            next={true}
            first={true}
            last={true}
            ellipsis={true}
          />

          <h1 className="page-header">CsvUpload</h1>
          <CsvUploadArea
            contentValidation={() => {
              return true
            }}
            onDropCompleted={(validFiles, rejectedFiles) => {
              // eslint-disable-next-line no-console
              console.error(rejectedFiles)
            }}
            acceptFileTypes={["text/csv"]}
            uploadModalOnClick={true}/>

          <h1 className="page-header">MapBox</h1>

          <Mapbox
            geoData={countriesGeoJSON}
            cityData={cityData}
            countryData={countryData}
            theme={this.props.theme}
            height={600}
            />

          <h1 className="page-header">Network</h1>

          <NetworkItem
            title="Network 1"
            content="Lorem ipsum dolor sit amet"
            status="enabled"
            onSelect={() => null}
            onEdit={() => null} />

          <h1 className="page-header">Storage</h1>

          <div style={{height: '600px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around'}}>
            <StorageItemChart
              analyticsLink='#'
              configurationLink='#'
              name="Storage 01"
              locations={["Hong Kong"]}
              currentUsage={0}
              estimate={100e12}
              peak={0}
              lastMonthUsage={0}
              lastMonthEstimate={0}
              lastMonthPeak={0} />

            <StorageItemChart
              analyticsLink='#'
              configurationLink='#'
              name="Storage 02"
              locations={["Hong Kong"]}
              currentUsage={80.2e12}
              estimate={250e12}
              peak={160e12}
              lastMonthUsage={100e12}
              lastMonthEstimate={210e12}
              lastMonthPeak={160e12} />

            <StorageItemChart
              analyticsLink='#'
              configurationLink='#'
              name="Storage very very very long name"
              locations={["Hong Kong", "Finland"]}
              currentUsage={270e12}
              estimate={300e12}
              peak={380e12}
              lastMonthUsage={240e12}
              lastMonthEstimate={250e12}
              lastMonthPeak={260e12} />

            <StorageItemChart
              analyticsLink='#'
              configurationLink='#'
              name="Storage 04"
              locations={["Hong Kong", "Finland", "United States"]}
              currentUsage={520e12}
              estimate={500e12}
              peak={600e12}
              lastMonthUsage={470e12}
              lastMonthEstimate={450e12}
              lastMonthPeak={480e12} />

            <StorageItemChart
              analyticsLink='#'
              configurationLink='#'
              name="Storage 05"
              locations={["Hong Kong", "Finland"]}
              currentUsage={270e12}
              estimate={300e12}
              peak={380e12}
              lastMonthUsage={240e12}
              lastMonthEstimate={250e12}
              lastMonthPeak={260e12}
              diameter={300} />

          </div>

          <h1 className="page-header">File Upload Status</h1>

          <FileUploadStatus
            inlineStyle={{position: 'static'}}
            uploads={[
              {
                name: 'too long name for item being uploaded',
                type: 'directory',
                progress: 75
              },
              {
                name: 'filename.mov',
                type: 'file',
                progress: 33
              }
            ]}
          />

          <h1 className="page-header">Storage KPI</h1>

          <StorageKPI
            chartData={[
              {bytes: 45000, timestamp: new Date('Thu May 26 2016 11:17:01 GMT-0700 (PDT)')},
              {bytes: 65000, timestamp: new Date('Thu May 26 2016 12:17:01 GMT-0700 (PDT)')},
              {bytes: 45000, timestamp: new Date('Thu May 26 2016 13:17:01 GMT-0700 (PDT)')},
              {bytes: 105000, timestamp: new Date('Thu May 26 2016 14:17:01 GMT-0700 (PDT)')},
              {bytes: 115000, timestamp: new Date('Thu May 26 2016 15:17:01 GMT-0700 (PDT)')},
              {bytes: 190000, timestamp: new Date('Thu May 26 2016 16:17:01 GMT-0700 (PDT)')},
              {bytes: 125000, timestamp: new Date('Thu May 26 2016 17:17:01 GMT-0700 (PDT)')},
              {bytes: 155000, timestamp: new Date('Thu May 26 2016 18:17:01 GMT-0700 (PDT)')}
            ]}
            chartDataKey='bytes'
            currentValue={112}
            gainPercentage={0.2}
            locations={['San Jose', 'Frankfurt']}
            peakValue={120}
            referenceValue={100}
            valuesUnit='tb'
          />

          <h1 className="page-header">Sortable Multi Selector</h1>

          <SortableMultiSelector
            label={'Items'}
            options={[
              {
                label: 'Item 1',
                value: 1
              },
              {
                label: 'Item 2',
                value: 2
              },
              {
                label: 'Item 3',
                value: 3
              }
            ]}
            onChange={val => this.setState({ sortableMultiSelectorItems: Immutable.List(val) })}
            value={this.state.sortableMultiSelectorItems}
          />

          <h1 className="page-header">Slider</h1>
            <PolicyWeight secondaryProvider="CDN" onChange={() => {
              // no-op
            }} />

          <h1 className="page-header">Icons</h1>
          <StyleguideIcons />

        </div>
      </div>
    );
  }
}

Styleguide.displayName = 'Styleguide'
Styleguide.propTypes = {
  theme: React.PropTypes.string
}

/* istanbul ignore next */
const mapStateToProps = (state) => {
  return {
    theme: state.ui.get('theme')
  }
}

export default connect(mapStateToProps)(Styleguide)
