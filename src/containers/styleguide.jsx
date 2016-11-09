import React from 'react'
import {connect} from 'react-redux'
import Immutable from 'immutable'
import Typeahead from 'react-bootstrap-typeahead'
import numeral from 'numeral'

// React-Bootstrap
// ===============

import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  ButtonToolbar,
  Col,
  Dropdown,
  Image,
  Input,
  Label,
  MenuItem,
  OverlayTrigger,
  Pagination,
  Popover,
  Row,
  Table,
  Tab,
  Tabs
} from 'react-bootstrap';

import SelectWrapper from '../components/select-wrapper'
import FilterChecklistDropdown from '../components/filter-checklist-dropdown/filter-checklist-dropdown.jsx'
import AccountSelector from '../components/global-account-selector/selector-component'
import StackedByTimeSummary from '../components/stacked-by-time-summary'
import MiniChart from '../components/mini-chart'
import DashboardPanel from '../components/dashboard/dashboard-panel'
import DashboardPanels from '../components/dashboard/dashboard-panels'

import IconAccount       from '../components/icons/icon-account'
import IconAdd           from '../components/icons/icon-add'
import IconAlerts        from '../components/icons/icon-alerts'
import IconAnalytics     from '../components/icons/icon-analytics'
import IconArrowDown     from '../components/icons/icon-arrow-down'
import IconArrowLgDown   from '../components/icons/icon-arrow-lg-down'
import IconArrowLeft     from '../components/icons/icon-arrow-left'
import IconArrowLgUp     from '../components/icons/icon-arrow-lg-up'
import IconArrowUp       from '../components/icons/icon-arrow-up'
import IconChart         from '../components/icons/icon-chart'
import IconClose         from '../components/icons/icon-close'
import IconComments      from '../components/icons/icon-comments'
import IconConfiguration from '../components/icons/icon-configuration'
import IconContent       from '../components/icons/icon-content'
import IconDelete        from '../components/icons/icon-delete'
import IconEdit          from '../components/icons/icon-edit'
import IconEmail         from '../components/icons/icon-email'
import IconEricsson      from '../components/icons/icon-ericsson'
import IconExport        from '../components/icons/icon-export'
import IconEye           from '../components/icons/icon-eye'
import IconHeaderCaret   from '../components/icons/icon-header-caret'
import IconIncident      from '../components/icons/icon-incident'
import IconInfo          from '../components/icons/icon-info'
import IconIntegration   from '../components/icons/icon-integration'
import IconItemChart     from '../components/icons/icon-item-chart'
import IconItemList      from '../components/icons/icon-item-list'
import IconPassword      from '../components/icons/icon-password'
import IconProblem       from '../components/icons/icon-problem'
import IconQuestion      from '../components/icons/icon-question'
import IconQuestionMark  from '../components/icons/icon-question-mark'
import IconSecurity      from '../components/icons/icon-security'
import IconSelectCaret   from '../components/icons/icon-select-caret'
import IconServices      from '../components/icons/icon-services'
import IconSupport       from '../components/icons/icon-support'
import IconTask          from '../components/icons/icon-task'
import IconTrash         from '../components/icons/icon-trash'

import { formatBytes, separateUnit } from '../util/helpers'

const filterCheckboxOptions = Immutable.fromJS([
  { value: 'link1', label: 'Property 1', checked: true },
  { value: 'link2', label: 'Property 2', checked: true },
  { value: 'link3', label: 'Property 3', checked: false },
  { value: 'link4', label: 'Property 4', checked: false },
  { value: 'link5', label: 'Property 5', checked: true },
  { value: 'link6', label: 'Property 6', checked: false },
  { value: 'link7', label: 'Property 7', checked: false },
  { value: 'link8', label: 'Property 8', checked: false },
  { value: 'link9', label: 'Property 9', checked: false }
]);

import MapPoc from '../components/map/poc'

class Styleguide extends React.Component {
  render() {
    const spDashboardData = {
      "traffic": {
        "bytes": 446265804980374,
        "bytes_net_on": 352569123057670,
        "bytes_net_off": 93696681922704,
        "detail": [
          {
            "timestamp": new Date('Thu May 26 2016 12:17:01 GMT-0700 (PDT)'),
            "bytes": 92020173697866,
            "bytes_net_on": 71856580682504,
            "bytes_net_off": 20163593015362
          },
          {
            "timestamp": new Date('Thu May 26 2016 13:17:01 GMT-0700 (PDT)'),
            "bytes": 99672709053865,
            "bytes_net_on": 76848354018252,
            "bytes_net_off": 22824355035613
          },
          {
            "timestamp": new Date('Thu May 26 2016 14:17:01 GMT-0700 (PDT)'),
            "bytes": 94821186769899,
            "bytes_net_on": 72941835769369,
            "bytes_net_off": 21879351000530
          },
          {
            "timestamp": new Date('Thu May 26 2016 15:17:01 GMT-0700 (PDT)'),
            "bytes": 117441291619312,
            "bytes_net_on": 90477417340581,
            "bytes_net_off": 26963874278731
          },
          {
            "timestamp": new Date('Thu May 26 2016 16:17:01 GMT-0700 (PDT)'),
            "bytes": 81546375702611,
            "bytes_net_on": 62160286504951,
            "bytes_net_off": 19386089197660
          },
          {
            "timestamp": new Date('Thu May 26 2016 17:17:01 GMT-0700 (PDT)'),
            "bytes": 117341539984300,
            "bytes_net_on": 90364165873239,
            "bytes_net_off": 26977374111061
          },
          {
            "timestamp": new Date('Thu May 26 2016 18:17:01 GMT-0700 (PDT)'),
            "bytes": 94064934029131,
            "bytes_net_on": 72989086766237,
            "bytes_net_off": 21075847262894
          },
          {
            "timestamp": new Date('Thu May 26 2016 19:17:01 GMT-0700 (PDT)'),
            "bytes": 93196929110225,
            "bytes_net_on": 72133332220394,
            "bytes_net_off": 21063596889831
          }
        ]
      }
    }

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

    let totalDatasetValueOutput = separateUnit(formatBytes(spDashboardData.traffic.bytes))
    let totalDatasetValue = totalDatasetValueOutput.value
    let totalDatasetUnit = totalDatasetValueOutput.unit

    let datasetAValue = numeral((spDashboardData.traffic.bytes_net_on / spDashboardData.traffic.bytes) * 100).format('0,0')
    let datasetBValue = numeral((spDashboardData.traffic.bytes_net_off / spDashboardData.traffic.bytes) * 100).format('0,0')

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


          <h1 className="page-header">Tabs</h1>

          <Tabs defaultActiveKey={1} className="styleguide-row">

            <Tab eventKey={1} title="Tab 1">
              <h4>Tab 1</h4>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </Tab>

            <Tab eventKey={2} title="Tab 2">
              <h4>Tab 2</h4>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </Tab>

            <Tab eventKey={3} title="Tab 3">
              <h4>Tab 3</h4>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </Tab>

          </Tabs>


          <hr />


          <h1 className="page-header">Buttons</h1>
          <ButtonToolbar className="styleguide-row">
            <Button bsStyle="primary">Primary</Button>
            <Button className="btn-secondary">Secondary</Button>
            <Button bsStyle="danger">Destructive</Button>
            <Button bsStyle="success">Confirmation</Button>
            <Button bsStyle="link">Link button</Button>
            <Button bsStyle="success" className="btn-icon"><IconAdd/></Button>
            <Button bsStyle="primary" className="btn-icon btn-round"><IconQuestionMark/></Button>
          </ButtonToolbar>

          <ButtonToolbar className="styleguide-row">
            <Button bsStyle="primary" disabled={true}>Primary</Button>
            <Button className="btn-secondary" disabled={true}>Secondary</Button>
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
              <FilterChecklistDropdown options={filterCheckboxOptions}/>
            </div>
          </div>

          <div className="row">
            <div className="col-xs-6">
              <AccountSelector items={[[1, 'Item 1'], [2, 'Item 2'], [3, 'Dropdown Item 3']]} drillable={true}>
                <div className="btn btn-link dropdown-toggle header-toggle">
                  <h1>Select Account</h1>
                  <span className="caret"/>
                </div>
              </AccountSelector>
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
              <Input type="text" label="Default Input" placeholder="Enter text" />
              <Input type="email" label="Email Input" placeholder="Enter email" />
              <Input type="password" label="Password Input" />
              <Input type="text" label="Input with Addons" placeholder="Enter text" addonBefore="$" />
              <Input type="textarea" label="Text Area" placeholder="Enter text" />
            </div>

            <div className="col-xs-6">
              <Input type="text" label="Has Success" bsStyle="success" help="Helper text" hasFeedback={false} />
              <Input type="text" label="Has Error" bsStyle="error" help="Helper text" hasFeedback={false} />
            </div>
          </div>

          <hr />

          <div className="row">

            <div className="col-xs-6">

              <form className="form-horizontal">

                <Input label="Inline Input" labelClassName="col-xs-3 text-right" wrapperClassName="col-xs-9">
                  <Row>
                    <Col xs={10}>
                      <input type="text" className="form-control" />
                    </Col>
                      <OverlayTrigger trigger="click" rootClose={true} overlay={
                        <Popover id="popover1" title="Info">
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        </Popover>
                      }>
                        <Button bsStyle="link" className="col-xs-2">?</Button>
                      </OverlayTrigger>
                  </Row>
                </Input>

                <Input type="textarea" label="Inline Text Area" labelClassName="col-xs-3 text-right" wrapperClassName="col-xs-9" />

                <Input type="checkbox" label="Inline Checkbox" wrapperClassName="col-xs-offset-3 col-xs-9" />

              </form>

            </div>

          </div>


          <hr />

          <div className="row">

            <div className="col-xs-6">

              <label>Checkboxes</label>

              <Input type="checkbox" label="Checkbox 1" />

              <Input type="checkbox" label="Checkbox 2" />

              <Input type="checkbox" label="Checkbox 3" />

              <Input type="checkbox" disabled={true} label="Checkbox disabled" />

            </div>

            <div className="col-xs-6">

              <label>Radios</label>

              <Input type="radio" label="Radio 1" name="radioGroup1" />

              <Input type="radio" label="Radio 2" name="radioGroup1" />

              <Input type="radio" label="Radio 3" name="radioGroup1" />

              <Input type="radio" disabled={true} label="Radio disabled" name="radioGroup1" />

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

          <h1 className="page-header">Token input</h1>

          <Row>
            <Col xs={6}>
              <label>Predefined list</label>
              <Typeahead
                multiple={true}
                onChange={() => null}
                options={[
                  {id: 'BY', label: 'Belarus'},
                  {id: 'CA', label: 'Canada'},
                  {id: 'FI', label: 'Finland'},
                  {id: 'DE', label: 'Germany'},
                  {id: 'SE', label: 'Sweden'},
                  {id: 'UA', label: 'Ukraine'},
                  {id: 'US', label: 'United States'}
                ]}/>
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
                data={[
                  {bytes: 15000, timestamp: new Date('Thu May 26 2016 11:17:01 GMT-0700 (PDT)')},
                  {bytes: 150000, timestamp: new Date('Thu May 26 2016 12:17:01 GMT-0700 (PDT)')},
                  {bytes: 125000, timestamp: new Date('Thu May 26 2016 13:17:01 GMT-0700 (PDT)')},
                  {bytes: 140000, timestamp: new Date('Thu May 26 2016 14:17:01 GMT-0700 (PDT)')},
                  {bytes: 190000, timestamp: new Date('Thu May 26 2016 15:17:01 GMT-0700 (PDT)')},
                  {bytes: 180000, timestamp: new Date('Thu May 26 2016 16:17:01 GMT-0700 (PDT)')},
                  {bytes: 125000, timestamp: new Date('Thu May 26 2016 17:17:01 GMT-0700 (PDT)')}
                ]}
                kpiValue={80}
                kpiUnit="Gbps"
                label="Avg Bandwidth" />
            </Col>
            <Col xs={3}>
              <label>With only KPI</label>
              <hr />
              <MiniChart
                dataKey="bytes"
                data={[
                  {bytes: 15000, timestamp: new Date('Thu May 26 2016 11:17:01 GMT-0700 (PDT)')},
                  {bytes: 150000, timestamp: new Date('Thu May 26 2016 12:17:01 GMT-0700 (PDT)')},
                  {bytes: 125000, timestamp: new Date('Thu May 26 2016 13:17:01 GMT-0700 (PDT)')},
                  {bytes: 140000, timestamp: new Date('Thu May 26 2016 14:17:01 GMT-0700 (PDT)')},
                  {bytes: 190000, timestamp: new Date('Thu May 26 2016 15:17:01 GMT-0700 (PDT)')},
                  {bytes: 180000, timestamp: new Date('Thu May 26 2016 16:17:01 GMT-0700 (PDT)')},
                  {bytes: 125000, timestamp: new Date('Thu May 26 2016 17:17:01 GMT-0700 (PDT)')}
                ]}
                kpiValue="47.56"
                kpiUnit="%" />
            </Col>
            <Col xs={3}>
              <label>Right aligned KPI</label>
              <hr />
              <MiniChart
                dataKey="bytes"
                data={[
                  {bytes: 15000, timestamp: new Date('Thu May 26 2016 11:17:01 GMT-0700 (PDT)')},
                  {bytes: 150000, timestamp: new Date('Thu May 26 2016 12:17:01 GMT-0700 (PDT)')},
                  {bytes: 125000, timestamp: new Date('Thu May 26 2016 13:17:01 GMT-0700 (PDT)')},
                  {bytes: 140000, timestamp: new Date('Thu May 26 2016 14:17:01 GMT-0700 (PDT)')},
                  {bytes: 190000, timestamp: new Date('Thu May 26 2016 15:17:01 GMT-0700 (PDT)')},
                  {bytes: 180000, timestamp: new Date('Thu May 26 2016 16:17:01 GMT-0700 (PDT)')},
                  {bytes: 125000, timestamp: new Date('Thu May 26 2016 17:17:01 GMT-0700 (PDT)')}
                ]}
                kpiValue={80}
                kpiUnit="Gbps"
                kpiRight={true} />
            </Col>
            <Col xs={3}>
              <label>Without label and KPI</label>
              <hr />
              <MiniChart
                dataKey="bytes"
                data={[
                  {bytes: 15000, timestamp: new Date('Thu May 26 2016 11:17:01 GMT-0700 (PDT)')},
                  {bytes: 150000, timestamp: new Date('Thu May 26 2016 12:17:01 GMT-0700 (PDT)')},
                  {bytes: 125000, timestamp: new Date('Thu May 26 2016 13:17:01 GMT-0700 (PDT)')},
                  {bytes: 140000, timestamp: new Date('Thu May 26 2016 14:17:01 GMT-0700 (PDT)')},
                  {bytes: 190000, timestamp: new Date('Thu May 26 2016 15:17:01 GMT-0700 (PDT)')},
                  {bytes: 180000, timestamp: new Date('Thu May 26 2016 16:17:01 GMT-0700 (PDT)')},
                  {bytes: 125000, timestamp: new Date('Thu May 26 2016 17:17:01 GMT-0700 (PDT)')}
                ]} />
            </Col>
          </Row>

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
          <Pagination items={10} maxButtons={5} activePage={5} prev={true} next={true} first={true} last={true} ellipsis={true} />

          <h1 className="page-header">MapBox</h1>

          <MapPoc theme={this.props.theme}/>

          <h1 className="page-header">Icons</h1>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconAccount />
            <br />
            IconAccount
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconAdd />
            <br />
            IconAdd
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconAlerts />
            <br />
            IconAlerts
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconAnalytics />
            <br />
            IconAnalytics
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconArrowDown />
            <br />
            IconArrowDown
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconArrowLeft />
            <br />
            IconArrowLeft
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconArrowUp />
            <br />
            IconArrowUp
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconArrowLgDown />
            <br />
            IconArrowLgDown
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconArrowLgUp />
            <br />
            IconArrowLgUp
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconChart />
            <br />
            IconChart
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconClose />
            <br />
            IconClose
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconComments count="13" />
            <br />
            IconComments
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconConfiguration />
            <br />
            IconConfiguration
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconContent />
            <br />
            IconContent
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconDelete />
            <br />
            IconDelete
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconEdit />
            <br />
            IconEdit
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconEmail />
            <br />
            IconEmail
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconEricsson />
            <br />
            IconEricsson
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconExport />
            <br />
            IconExport
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconEye />
            <br />
            IconEye
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconHeaderCaret />
            <br />
            IconHeaderCaret
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconIncident />
            <br />
            IconIncident
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconInfo />
            <br />
            IconInfo
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconIntegration />
            <br />
            IconIntegration
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconItemChart />
            <br />
            IconItemChart
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconItemList />
            <br />
            IconItemList
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconPassword />
            <br />
            IconPassword
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconProblem />
            <br />
            IconProblem
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconQuestion />
            <br />
            IconQuestion
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconQuestionMark />
            <br />
            IconQuestionMark
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconSecurity />
            <br />
            IconSecurity
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconSelectCaret />
            <br />
            IconSelectCaret
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconServices />
            <br />
            IconServices
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconSupport />
            <br />
            IconSupport
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconTask />
            <br />
            IconTask
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconTrash />
            <br />
            IconTrash
          </span>

        </div>

      </div>
    );
  }
}

Styleguide.displayName = 'Styleguide'
Styleguide.propTypes = {
  theme: React.PropTypes.string
}

const mapStateToProps = (state) => {
  return {
    theme: state.ui.get('theme')
  }
}

export default connect(mapStateToProps)(Styleguide)
