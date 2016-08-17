import React from 'react'

// React-Bootstrap
// ===============

import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  ButtonToolbar,
  Col,
  Dropdown,
  DropdownButton,
  Input,
  Label,
  MenuItem,
  OverlayTrigger,
  Pagination,
  Popover,
  Row,
  SplitButton,
  Table,
  Tab,
  Tabs
} from 'react-bootstrap';

import IconAccount       from '../components/icons/icon-account'
import IconAdd           from '../components/icons/icon-add'
import IconAlerts        from '../components/icons/icon-alerts'
import IconAnalytics     from '../components/icons/icon-analytics'
import IconArrowDown     from '../components/icons/icon-arrow-down'
import IconArrowRight    from '../components/icons/icon-arrow-left'
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
import IconSecurity      from '../components/icons/icon-security'
import IconSelectCaret   from '../components/icons/icon-select-caret'
import IconServices      from '../components/icons/icon-services'
import IconSupport       from '../components/icons/icon-support'
import IconTask          from '../components/icons/icon-task'
import IconTrash         from '../components/icons/icon-trash'


class Styleguide extends React.Component {
  render() {
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
            <Button bsStyle="secondary">Secondary</Button>
            <Button bsStyle="danger">Destructive</Button>
            <Button bsStyle="success">Confirmation</Button>
            <Button bsStyle="link">Link button</Button>
            <Button bsStyle="primary" className="btn-icon">?</Button>
            <Button bsStyle="primary" className="btn-icon btn-round">+</Button>
          </ButtonToolbar>

          <ButtonToolbar className="styleguide-row">
            <Button bsStyle="primary" disabled={true}>Primary</Button>
            <Button bsStyle="secondary" disabled={true}>Secondary</Button>
            <Button bsStyle="danger" disabled={true}>Destructive</Button>
            <Button bsStyle="success" disabled={true}>Confirmation</Button>
            <Button bsStyle="link" disabled={true}>Link button</Button>
            <Button bsStyle="primary" className="btn-icon" disabled={true}>?</Button>
            <Button bsStyle="primary" className="btn-icon btn-round" disabled={true}>+</Button>
          </ButtonToolbar>


          <h1 className="page-header">Dropdowns</h1>

          <ButtonToolbar>
            <DropdownButton bsStyle="primary" id="dropdown1" title="Dropdown menu">
              <MenuItem eventKey="1"><span>Dropdown item</span></MenuItem>
              <MenuItem eventKey="2"><span>Dropdown item</span></MenuItem>
              <MenuItem eventKey="3" active={true}><span>Active Dropdown item</span></MenuItem>
              <MenuItem eventKey="4"><span>Dropdown item</span></MenuItem>
            </DropdownButton>

            <SplitButton bsStyle="primary" id="dropdown2" title="Split Button with Dropdown">
              <MenuItem eventKey="1"><span>Dropdown item</span></MenuItem>
              <MenuItem eventKey="2"><span>Dropdown item</span></MenuItem>
              <MenuItem eventKey="3" active={true}><span>Active Dropdown item</span></MenuItem>
              <MenuItem eventKey="4"><span>Dropdown item</span></MenuItem>
            </SplitButton>

            <DropdownButton bsStyle="primary" id="dropdown3" title="Dropup menu" dropup={true}>
              <MenuItem eventKey="1"><span>Dropdown item</span></MenuItem>
              <MenuItem eventKey="2"><span>Dropdown item</span></MenuItem>
              <MenuItem eventKey="3" active={true}><span>Active Dropdown item</span></MenuItem>
              <MenuItem eventKey="4"><span>Dropdown item</span></MenuItem>
            </DropdownButton>
          </ButtonToolbar>


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

              <Input type="text" label="Has Error" bsStyle="error" help="Helper text" hasFeedback={true} />

              <Input type="text" label="Has Warning" bsStyle="warning" help="Helper text" hasFeedback={true} />

              <Input type="text" label="Has Success" bsStyle="success" help="Helper text" hasFeedback={true} />

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
                        <Button bsStyle="link" className="col-xs-2 btn-icon">?</Button>
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

            </div>

            <div className="col-xs-6">

              <label>Radios</label>

              <Input type="radio" label="Radio 1" name="radioGroup1" />

              <Input type="radio" label="Radio 2" name="radioGroup1" />

              <Input type="radio" label="Radio 3" name="radioGroup1" />

            </div>

          </div>


          <hr />

          <label>Select</label>

          <div>

            <Dropdown id="dropdown-select" className="dropdown-select">
              <Dropdown.Toggle>
                View <b>Production</b>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <MenuItem eventKey="1" active={true}>Production</MenuItem>
                <MenuItem eventKey="2">Staging</MenuItem>
                <MenuItem eventKey="3">In Process</MenuItem>
                <MenuItem eventKey="4">History</MenuItem>
              </Dropdown.Menu>
            </Dropdown>

          </div>


          <h1 className="page-header">Pagination</h1>

          <Pagination items={10} maxButtons={5} activePage={5} prev={true} next={true} first={true} last={true} ellipsis={true} />


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
            <IconArrowRight />
            <br />
            IconArrowRight
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconArrowUp />
            <br />
            IconArrowUp
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
Styleguide.propTypes = {}

module.exports = Styleguide
