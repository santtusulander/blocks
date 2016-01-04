import React from 'react'

// React-Bootstrap
// ===============

import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  ButtonGroup,
  ButtonToolbar,
  Col,
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
          <h6>Heading H6</h6>

          <h3>Heading with label <Label>New</Label></h3>


          <hr />

          <p className="lead">Leading body text. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>


          <hr />

          <p>Body text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin accumsan in nisi at suscipit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Donec et sem posuere, pulvinar purus quis, varius augue. Praesent porttitor, mauris aliquet feugiat vestibulum, diam augue tempor turpis, id facilisis sapien massa ac eros. Vestibulum pretium cursus varius. Suspendisse sed enim vel orci fermentum consectetur. Cras metus risus, ultrices ut elit id, fringilla euismod quam. In pharetra tellus lectus. Aliquam erat volutpat. Morbi justo neque, pellentesque quis nunc a, varius euismod odio. Integer gravida quam sit amet ornare mattis. Proin molestie ex vitae ligula pellentesque, vitae placerat magna tincidunt. Aliquam sed purus id lectus volutpat suscipit quis a mauris. Fusce in est mattis, tristique mi id, auctor nibh. Proin venenatis id sapien id lobortis. Nullam cursus nisi mauris, eget interdum nisi porttitor nec.</p>


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

          <Tabs defaultActiveKey={1} bsStyle="pills" position="left" className="styleguide-row">

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


          <h1 className="page-header">Buttons</h1>

          <ButtonToolbar className="styleguide-row">
            <Button>Default button</Button>
            <Button bsStyle="success">Success button</Button>
            <Button bsStyle="info">Info button</Button>
            <Button bsStyle="warning">Warning button</Button>
            <Button bsStyle="danger">Danger button</Button>
            <Button bsStyle="link">Link button</Button>
          </ButtonToolbar>

          <ButtonToolbar className="styleguide-row">
            <Button disabled={true}>Default button</Button>
            <Button bsStyle="success" disabled={true}>Success button</Button>
            <Button bsStyle="info" disabled={true}>Info button</Button>
            <Button bsStyle="warning" disabled={true}>Warning button</Button>
            <Button bsStyle="danger" disabled={true}>Danger button</Button>
            <Button bsStyle="link" disabled={true}>Link button</Button>
          </ButtonToolbar>


          <hr />

          <p>
            <Button bsStyle="primary" bsSize="large">Large button</Button>
          </p>

          <p>
            <Button bsStyle="primary">Default button</Button>
          </p>

          <p>
            <Button bsStyle="primary" bsSize="small">Small button</Button>
          </p>

          <p>
            <Button bsStyle="primary" bsSize="xsmall">X-Small button</Button>
          </p>


          <hr />

          <ButtonGroup className="styleguide-row" bsSize="large">
            <Button>Left</Button>
            <Button>Middle</Button>
            <Button>Right</Button>
          </ButtonGroup>

          <ButtonGroup className="styleguide-row">
            <Button>Left</Button>
            <Button>Middle</Button>
            <Button>Right</Button>
          </ButtonGroup>

          <ButtonGroup className="styleguide-row" bsSize="small">
            <Button>Left</Button>
            <Button>Middle</Button>
            <Button>Right</Button>
          </ButtonGroup>

          <ButtonGroup className="styleguide-row" bsSize="xsmall">
            <Button>Left</Button>
            <Button>Middle</Button>
            <Button>Right</Button>
          </ButtonGroup>


          <h1 className="page-header">Dropdowns</h1>

          <ButtonToolbar>
            <DropdownButton id="dropdown1" bsStyle="primary" title="Dropdown">
              <MenuItem eventKey="1">Dropdown item</MenuItem>
              <MenuItem eventKey="2">Dropdown item</MenuItem>
              <MenuItem eventKey="3" active={true}>Active Dropdown item</MenuItem>
              <MenuItem divider={true} />
              <MenuItem eventKey="4">Separated Dropdown item</MenuItem>
            </DropdownButton>

            <SplitButton id="dropdown2" bsStyle="primary" title="Split Button">
              <MenuItem eventKey="1">Dropdown item</MenuItem>
              <MenuItem eventKey="2">Dropdown item</MenuItem>
              <MenuItem eventKey="3" active={true}>Active Dropdown item</MenuItem>
              <MenuItem divider={true} />
              <MenuItem eventKey="4">Separated Dropdown item</MenuItem>
            </SplitButton>

            <DropdownButton id="dropdown3" bsStyle="primary" title="Dropup" dropup={true}>
              <MenuItem eventKey="1">Dropup item</MenuItem>
              <MenuItem eventKey="2">Dropup item</MenuItem>
              <MenuItem eventKey="3" active={true}>Active Dropup item</MenuItem>
              <MenuItem divider={true} />
              <MenuItem eventKey="4">Separated Dropup item</MenuItem>
            </DropdownButton>
          </ButtonToolbar>


          <h1 className="page-header">Tables</h1>

          <Table striped={true} bordered={true} hover={true}>
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

              <Input type="text" label="Input with Addons" placeholder="Enter text" addonBefore="$" addonAfter=".00" />

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
                    <Col xs={2}>
                      <OverlayTrigger trigger="click" rootClose={true} overlay={
                        <Popover id="popover1" title="Info">
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        </Popover>
                      }>
                        <Button bsStyle="info">?</Button>
                      </OverlayTrigger>
                    </Col>
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

              <Input type="file" label="File Selector" />

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

          <div className="row">

            <div className="col-xs-6">

              <Input type="select" label="Select" placeholder="Select">
                <option value="other">Option 1</option>
                <option value="other">Option 2</option>
                <option value="other">Option 3</option>
                <option value="other">Option 4</option>
                <option value="other">Option 5</option>
              </Input>

            </div>

            <div className="col-xs-6">

              <Input type="select" label="Multiple Select" multiple={true}>
                <option value="other">Option 1</option>
                <option value="other">Option 2</option>
                <option value="other">Option 3</option>
                <option value="other">Option 4</option>
                <option value="other">Option 5</option>
              </Input>

            </div>

          </div>


          <h1 className="page-header">Pagination</h1>

          <Pagination items={10} maxButtons={5} activePage={5} prev={true} next={true} first={true} last={true} ellipsis={true} />

        </div>

      </div>
    );
  }
}

Styleguide.displayName = 'Styleguide'
Styleguide.propTypes = {}

module.exports = Styleguide
