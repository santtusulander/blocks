import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Button, ButtonToolbar, Col, Dropdown, MenuItem,
  Row, Table } from 'react-bootstrap';
import { Link } from 'react-router'
import moment from 'moment'

import * as hostActionCreators from '../redux/modules/host'
import * as purgeActionCreators from '../redux/modules/purge'

import PageContainer from '../components/layout/page-container'
import Content from '../components/layout/content'
import AnalysisByTime from '../components/analysis/by-time'
import IconChart from '../components/icons/icon-chart.jsx'
import IconConfiguration from '../components/icons/icon-configuration.jsx'
import PurgeModal from '../components/purge-modal'

const fakeRecentData = [
  {timestamp: new Date("2016-01-01"), bytes: 49405, requests: 943},
  {timestamp: new Date("2016-01-02"), bytes: 44766, requests: 546},
  {timestamp: new Date("2016-01-03"), bytes: 44675, requests: 435},
  {timestamp: new Date("2016-01-04"), bytes: 44336, requests: 345},
  {timestamp: new Date("2016-01-05"), bytes: 43456, requests: 567},
  {timestamp: new Date("2016-01-06"), bytes: 46756, requests: 244},
  {timestamp: new Date("2016-01-07"), bytes: 45466, requests: 455},
  {timestamp: new Date("2016-01-08"), bytes: 43456, requests: 233},
  {timestamp: new Date("2016-01-09"), bytes: 47454, requests: 544},
  {timestamp: new Date("2016-01-10"), bytes: 54766, requests: 546},
  {timestamp: new Date("2016-01-11"), bytes: 54675, requests: 435},
  {timestamp: new Date("2016-01-12"), bytes: 54336, requests: 456},
  {timestamp: new Date("2016-01-13"), bytes: 53456, requests: 567},
  {timestamp: new Date("2016-01-14"), bytes: 56756, requests: 244},
  {timestamp: new Date("2016-01-15"), bytes: 55466, requests: 455},
  {timestamp: new Date("2016-01-16"), bytes: 43456, requests: 456},
  {timestamp: new Date("2016-01-17"), bytes: 57454, requests: 544},
  {timestamp: new Date("2016-01-18"), bytes: 53456, requests: 233},
  {timestamp: new Date("2016-01-19"), bytes: 57454, requests: 544},
  {timestamp: new Date("2016-01-20"), bytes: 54766, requests: 546},
  {timestamp: new Date("2016-01-21"), bytes: 44675, requests: 435},
  {timestamp: new Date("2016-01-22"), bytes: 44336, requests: 456},
  {timestamp: new Date("2016-01-23"), bytes: 23456, requests: 567},
  {timestamp: new Date("2016-01-24"), bytes: 26756, requests: 244},
  {timestamp: new Date("2016-01-25"), bytes: 25466, requests: 455},
  {timestamp: new Date("2016-01-26"), bytes: 23456, requests: 456},
  {timestamp: new Date("2016-01-27"), bytes: 27454, requests: 544},
  {timestamp: new Date("2016-01-28"), bytes: 23456, requests: 456},
  {timestamp: new Date("2016-01-29"), bytes: 27454, requests: 544},
  {timestamp: new Date("2016-01-30"), bytes: 23456, requests: 233},
  {timestamp: new Date("2016-01-31"), bytes: 24675, requests: 435}
]

export class Property extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      byLocationWidth: 0,
      byTimeWidth: 0,
      purgeActive: false
    }

    this.togglePurge = this.togglePurge.bind(this)
    this.measureContainers = this.measureContainers.bind(this)
    this.savePurge = this.savePurge.bind(this)
  }
  componentWillMount() {
    this.props.hostActions.startFetching()
    this.props.hostActions.fetchHost(
      this.props.params.brand,
      this.props.params.account,
      this.props.params.group,
      this.props.location.query.name
    )
  }
  componentDidMount() {
    this.measureContainers()
    setTimeout(() => {this.measureContainers()}, 500)
    window.addEventListener('resize', this.measureContainers)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.measureContainers)
  }
  measureContainers() {
    if(this.refs.byTimeHolder) {
      this.setState({
        byTimeWidth: this.refs.byTimeHolder.clientWidth
      })
    }
  }
  togglePurge() {
    this.setState({
      purgeActive: !this.state.purgeActive
    })
    this.props.purgeActions.resetActivePurge()
  }
  savePurge() {
    this.props.purgeActions.createPurge(
      this.props.params.brand,
      this.props.params.account,
      this.props.params.group,
      this.props.location.query.name,
      this.props.activePurge.toJS()
    ).then(() => this.setState({purgeActive: false}))
  }
  render() {
    if(this.props.fetching || !this.props.activeHost || !this.props.activeHost.size) {
      return <div>Loading...</div>
    }
    const activeHost = this.props.activeHost
    const activeConfig = activeHost.get('services').get(0).get('configurations').get(0)
    return (
      <PageContainer>
        <Content>
          <div className="container-fluid">
            <Row className="property-header no-end-gutters">
              <ButtonToolbar className="pull-right">
                <Button bsStyle="primary" onClick={this.togglePurge}>Purge</Button>
              </ButtonToolbar>

              <p>PROPERTY SUMMARY</p>
              <Dropdown id="dropdown-content">
                <Dropdown.Toggle bsStyle="link" className="header-toggle">
                  <h1>{this.props.location.query.name}</h1>
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
                <h3>
                  {activeConfig.get('edge_configuration').get('origin_host_name')}
                </h3>
              </Col>
              <Col xs={3}>
                Published Hostname
                <h3>
                  {activeConfig.get('edge_configuration').get('published_name')}
                </h3>
              </Col>
              <Col xs={3}>
                Configuration Version
                <h3>{activeConfig.get('config_name')}</h3>
              </Col>
              <Col xs={3}>
                Published
                <h3>
                  {moment(
                    activeConfig.get('configuration_status').get('deployment_date'), 'X'
                  ).format('M/D/YYYY, h:mma')}
                </h3>
              </Col>
            </Row>

            <Row className="no-end-gutters property-content">
              <Col xs={6} className="property-analytics-summary">
                <h3 className="has-btn">
                  Traffic Summary
                  <span className="heading-suffix"> (last 30 days)</span>
                  <Button bsStyle="primary" className="btn-icon pull-right">
                    <Link to={`/content/analytics/property/${this.props.params.brand}/${this.props.params.account}/${this.props.params.group}/property?name=${this.props.location.query.name}`}>
                      <IconChart/>
                    </Link>
                  </Button>
                </h3>

                <div ref="byTimeHolder">
                  <AnalysisByTime axes={false} padding={40}
                    primaryData={fakeRecentData}
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
                    <Link to={`/content/configuration/${this.props.params.brand}/${this.props.params.account}/${this.props.params.group}/property?name=${this.props.location.query.name}`}>
                      <IconConfiguration />
                    </Link>
                  </Button>
                </h3>

                <Table className="unstyled no-padding auto-width">
                  <tbody>
                    <tr>
                      <td>Honor Origin Cache Control</td>
                      <td>
                        <b className="text-green">On</b>
                      </td>
                    </tr>
                    <tr>
                      <td>Ignore case from origin</td>
                      <td>
                        <b className="text-orange">Off</b>
                      </td>
                    </tr>
                    <tr>
                      <td>Enable e-Tag support</td>
                      <td>
                        <b className="text-green">On</b>
                      </td>
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
        {this.state.purgeActive ? <PurgeModal
          activePurge={this.props.activePurge}
          changePurge={this.props.purgeActions.updateActivePurge}
          hideAction={this.togglePurge}
          savePurge={this.savePurge}/> : ''}
      </PageContainer>
    )
  }
}

Property.displayName = 'Property'
Property.propTypes = {
  account: React.PropTypes.string,
  activeHost: React.PropTypes.instanceOf(Immutable.Map),
  activePurge: React.PropTypes.instanceOf(Immutable.Map),
  brand: React.PropTypes.string,
  delete: React.PropTypes.func,
  description: React.PropTypes.string,
  fetching: React.PropTypes.bool,
  group: React.PropTypes.string,
  hostActions: React.PropTypes.object,
  id: React.PropTypes.string,
  location: React.PropTypes.object,
  name: React.PropTypes.string,
  params: React.PropTypes.object,
  purgeActions: React.PropTypes.object
}

function mapStateToProps(state) {
  return {
    activeHost: state.host.get('activeHost'),
    activePurge: state.purge.get('activePurge'),
    fetching: state.host.get('fetching')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hostActions: bindActionCreators(hostActionCreators, dispatch),
    purgeActions: bindActionCreators(purgeActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Property);
