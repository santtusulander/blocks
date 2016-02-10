import React from 'react'

import { Button, ButtonToolbar, Col, Dropdown, MenuItem,
  Row, Table } from 'react-bootstrap';
import { Link } from 'react-router'

import PageContainer from '../components/layout/page-container'
import Content from '../components/layout/content'
import AnalysisByTime from '../components/analysis/by-time'
import IconChart from '../components/icons/icon-chart.jsx'
import IconConfiguration from '../components/icons/icon-configuration.jsx'
import IconHeaderCaret from '../components/icons/icon-header-caret.jsx'

const fakeRecentData = [
  {timestamp: 1451606400, bytes: 39405, requests: 943},
  {timestamp: 1451606500, bytes: 54766, requests: 546},
  {timestamp: 1451606600, bytes: 54675, requests: 435},
  {timestamp: 1451606700, bytes: 44336, requests: 345},
  {timestamp: 1451606800, bytes: 43456, requests: 567},
  {timestamp: 1451606900, bytes: 56756, requests: 244},
  {timestamp: 1451607000, bytes: 55466, requests: 455},
  {timestamp: 1451607100, bytes: 43456, requests: 233},
  {timestamp: 1451607200, bytes: 57454, requests: 544},
  {timestamp: 1451607300, bytes: 54766, requests: 546},
  {timestamp: 1451607400, bytes: 54675, requests: 435},
  {timestamp: 1451607500, bytes: 34336, requests: 456},
  {timestamp: 1451607600, bytes: 33456, requests: 567},
  {timestamp: 1451607700, bytes: 46756, requests: 244},
  {timestamp: 1451607800, bytes: 45466, requests: 455},
  {timestamp: 1451607900, bytes: 33456, requests: 456},
  {timestamp: 1451608000, bytes: 57454, requests: 544},
  {timestamp: 1451608100, bytes: 43456, requests: 233},
  {timestamp: 1451608200, bytes: 47454, requests: 544},
  {timestamp: 1451608300, bytes: 34766, requests: 546},
  {timestamp: 1451608400, bytes: 34675, requests: 435},
  {timestamp: 1451608500, bytes: 34336, requests: 456},
  {timestamp: 1451608600, bytes: 33456, requests: 567},
  {timestamp: 1451608700, bytes: 46756, requests: 244},
  {timestamp: 1451608800, bytes: 45466, requests: 455},
  {timestamp: 1451608900, bytes: 33456, requests: 456},
  {timestamp: 1451609000, bytes: 57454, requests: 544}
]

class Property extends React.Component {
  constructor(props) {
    super(props);

    this.deleteHost = this.deleteHost.bind(this)

    this.state = {
      byLocationWidth: 0,
      byTimeWidth: 0
    }

    this.measureContainers = this.measureContainers.bind(this)
  }
  componentDidMount() {
    this.measureContainers()
    window.addEventListener('resize', this.measureContainers)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.measureContainers)
  }
  measureContainers() {
    this.setState({
      byTimeWidth: this.refs.byTimeHolder.clientWidth
    })
  }
  deleteHost(e) {
    e.stopPropagation()
    e.preventDefault()
    this.props.delete(this.props.id)
  }
  render() {
    return (
      <PageContainer>
        <Content>
          <div className="container-fluid">
            <Row className="property-header no-end-gutters">
              <ButtonToolbar className="pull-right">
                <Button bsStyle="primary">Purge</Button>
              </ButtonToolbar>

              <p>PROPERTY SUMMARY</p>
              <Dropdown id="dropdown-content">
                <Dropdown.Toggle bsStyle="link" className="header-toggle"
                  noCaret={true}>
                  <h1>propertyname.com</h1>
                  <IconHeaderCaret />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <MenuItem eventKey="1">propertyname2.com</MenuItem>
                  <MenuItem eventKey="2">propertyname3.com</MenuItem>
                  <MenuItem eventKey="3">propertyname4.com</MenuItem>
                  <MenuItem eventKey="4">propertyname5.com</MenuItem>
                </Dropdown.Menu>
              </Dropdown>
            </Row>

            <Row className="property-info-row no-end-gutters">
              <Col xs={3}>
                Origin Hostname
                <h3>origin.propertyname.com</h3>
              </Col>
              <Col xs={3}>
                Published Hostname
                <h3>propertyname.com</h3>
              </Col>
              <Col xs={3}>
                Configuration Version
                <h3>Prod_version 1</h3>
              </Col>
              <Col xs={3}>
                Published
                <h3>11/11/2016, 12:10pm</h3>
              </Col>
            </Row>

            <Row className="no-end-gutters property-content">
              <Col xs={6} className="property-analytics-summary">
                <h3 className="has-btn">
                  Traffic Summary
                  <span className="heading-suffix"> (last 30 days)</span>
                  <Button bsStyle="primary" className="btn-icon pull-right">
                    <Link to={`/analysis/`}>
                      <IconChart/>
                    </Link>
                  </Button>
                </h3>

                <div ref="byTimeHolder">
                  <AnalysisByTime axes={false} padding={40}
                    data={fakeRecentData}
                    dataKey='bytes'
                    width={this.state.byTimeWidth}
                    height={this.state.byTimeWidth / 2} />
                </div>

                <Row>
                  <Col xs={4}>
                    <h1>456,789</h1>
                    Unique visitors
                  </Col>
                  <Col xs={4}>
                    <h1>8<span className="heading-suffix"> Gbps</span></h1>
                    Bandwidth
                  </Col>
                  <Col xs={4}>
                    <h1>97<span className="heading-suffix"> %</span></h1>
                    Cache Hit Rate
                  </Col>
                </Row>

                <Row>
                  <Col xs={12}>
                    <h1>
                      <span className="right-separator">40
                        <span className="heading-suffix"> %</span> APAC
                      </span>
                      <span className="right-separator">22
                        <span className="heading-suffix"> %</span> US
                      </span>
                      15<span className="heading-suffix"> %</span> EU</h1>
                    Top 3 Regions by Visitors
                  </Col>
                </Row>
              </Col>

              <div className="content-separator"></div>

              <Col xs={6} className="property-configuration-summary">
                <h3 className="has-btn">
                  Edge Configuration
                  <Button bsStyle="primary" className="btn-icon pull-right">
                    <Link to={`/configuration/${this.props.brand}/${this.props.account}/${this.props.group}/${this.props.id}`}>
                      <IconConfiguration />
                    </Link>
                  </Button>
                </h3>

                <Table className="unstyled no-padding auto-width">
                  <tbody>
                    <tr>
                      <td>Honor Origin Cache Control</td>
                      <td><b className="text-green">On</b></td>
                    </tr>
                    <tr>
                      <td>Ignore case from origin</td>
                      <td><b className="text-orange">Off</b></td>
                    </tr>
                    <tr>
                      <td>Enable e-Tag support</td>
                      <td><b className="text-green">On</b></td>
                    </tr>
                  </tbody>
                </Table>

                <h3 className="extra-margin-top">Cache Rules</h3>

                <Table striped={true}>
                  <thead>
                    <tr>
                      <th>TYPE</th>
                      <th>PRIORITY</th>
                      <th>TTL VALUE</th>
                      <th>RULE</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Default</td>
                      <td>0</td>
                      <td>no-store</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>Error Response</td>
                      <td>1</td>
                      <td>10 sec</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>United Kingdom</td>
                      <td>0</td>
                      <td>no-store</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>Redirect</td>
                      <td>2</td>
                      <td>1 day</td>
                      <td>gif</td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>
          </div>
        </Content>
      </PageContainer>
    )
  }
}

Property.displayName = 'Property'
Property.propTypes = {
  account: React.PropTypes.string,
  brand: React.PropTypes.string,
  delete: React.PropTypes.func,
  description: React.PropTypes.string,
  group: React.PropTypes.string,
  id: React.PropTypes.string,
  name: React.PropTypes.string
}

module.exports = Property
