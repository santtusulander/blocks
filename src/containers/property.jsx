import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Button, ButtonToolbar, Col, Dropdown, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router'
import moment from 'moment'
import numeral from 'numeral'

import * as hostActionCreators from '../redux/modules/host'
import * as purgeActionCreators from '../redux/modules/purge'
import * as trafficActionCreators from '../redux/modules/traffic'
import * as uiActionCreators from '../redux/modules/ui'
import * as visitorsActionCreators from '../redux/modules/visitors'

import PageContainer from '../components/layout/page-container'
import Content from '../components/layout/content'
import AnalysisByTime from '../components/analysis/by-time'
import IconChart from '../components/icons/icon-chart.jsx'
import IconConfiguration from '../components/icons/icon-configuration.jsx'
import PurgeModal from '../components/purge-modal'

export class Property extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      byLocationWidth: 0,
      byTimeWidth: 0,
      purgeActive: false,
      propertyMenuOpen: false
    }

    this.togglePurge = this.togglePurge.bind(this)
    this.measureContainers = this.measureContainers.bind(this)
    this.savePurge = this.savePurge.bind(this)
    this.showNotification = this.showNotification.bind(this)
    this.togglePropertyMenu = this.togglePropertyMenu.bind(this)
    this.notificationTimeout = null
  }
  componentWillMount() {
    this.props.visitorsActions.visitorsReset()
    this.fetchData(this.props.location.query.name)
  }
  componentDidMount() {
    this.measureContainers()
    setTimeout(() => {this.measureContainers()}, 500)
    window.addEventListener('resize', this.measureContainers)
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.location.query.name !== this.props.location.query.name) {
      this.fetchData(nextProps.location.query.name)
    }
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.measureContainers)
  }
  fetchData(property) {
    this.props.hostActions.startFetching()
    this.props.hostActions.fetchHost(
      this.props.params.brand,
      this.props.params.account,
      this.props.params.group,
      property
    )
    this.props.trafficActions.startFetching()
    Promise.all([
      this.props.trafficActions.fetchByTime({
        account: this.props.params.account,
        group: this.props.params.group,
        property: property,
        startDate: moment.utc().endOf('hour').add(1,'second').subtract(28, 'days').format('X'),
        endDate: moment.utc().endOf('hour').format('X')
      })
    ]).then(this.props.trafficActions.finishFetching)
    Promise.all([
      this.props.visitorsActions.fetchByCountry({
        account: this.props.params.account,
        group: this.props.params.group,
        property: property,
        startDate: moment.utc().endOf('day').add(1,'second').subtract(28, 'days').format('X'),
        endDate: moment.utc().endOf('day').format('X'),
        granularity: 'day',
        aggregate_granularity: 'day',
        max_countries: 3
      })
    ]).then(this.props.visitorsActions.finishFetching)
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
    let targetUrl = this.props.activeHost.get('services').get(0)
      .get('configurations').get(0).get('edge_configuration')
      .get('published_name')
    if(this.props.activeHost.get('services').get(0)
      .get('deployment_mode') === 'trial') {
      targetUrl = this.props.activeHost.get('services').get(0)
        .get('configurations').get(0).get('edge_configuration')
        .get('trial_name')
    }
    this.props.purgeActions.createPurge(
      this.props.params.brand,
      this.props.params.account,
      this.props.params.group,
      targetUrl,
      this.props.activePurge.toJS()
    ).then((action) => {
      if(action.payload instanceof Error) {
        this.setState({purgeActive: false})
        this.showNotification('Purge request failed: ' +
          action.payload.message)
      }
      else {
        this.setState({purgeActive: false})
        this.showNotification('Purge request succesfully submitted')
      }
    })
  }
  showNotification(message) {
    clearTimeout(this.notificationTimeout)
    this.props.uiActions.changeNotification(message)
    this.notificationTimeout = setTimeout(
      this.props.uiActions.changeNotification, 10000)
  }
  togglePropertyMenu() {
    this.setState({propertyMenuOpen: !this.state.propertyMenuOpen})
  }
  render() {
    if(this.props.fetching || !this.props.activeHost || !this.props.activeHost.size) {
      return <div>Loading...</div>
    }
    const activeHost = this.props.activeHost
    const activeConfig = activeHost.get('services').get(0).get('configurations').get(0)
    const metrics = this.props.metrics.find(
      metric => metric.get('property') === this.props.location.query.name)
      || Immutable.Map()
    const metrics_traffic = metrics.has('traffic') ? metrics.get('traffic').toJS() : []
    const avg_transfer_rate = metrics.has('transfer_rates') ?
      metrics.get('transfer_rates').get('average').split(' ') : [0, null]
    const avg_cache_hit_rate = metrics.has('avg_cache_hit_rate') ? metrics.get('avg_cache_hit_rate') : 0
    const uniq_vis = this.props.visitorsByCountry.get('total')
    const isTrial = activeHost.get('services').get(0).get('deployment_mode') === 'trial'
    const policyPath = Immutable.List([
      'default_policy', 'policy_rules'])
    let controlIndex = activeConfig.getIn(policyPath)
      .findIndex(policy => {
        if(policy.has('set')) {
          return policy.get('set').has('cache_control')
        }
      })
    let nameIndex = activeConfig.getIn(policyPath)
      .findIndex(policy => {
        if(policy.has('set')) {
          return policy.get('set').has('cache_name')
        }
      })
    const policyPaths = {
      honor_origin_cache_policies: policyPath.push(controlIndex,'set','cache_control','honor_origin'),
      honor_etags: policyPath.push(controlIndex,'set','cache_control','check_etag'),
      max_age: policyPath.push(controlIndex,'set','cache_control','max_age'),
      ignore_case: policyPath.push(nameIndex,'set','cache_name','ignore_case')
    }
    return (
      <PageContainer>
        <Content>
          <div className="container-fluid">
            <Row className="property-header no-end-gutters">
              <ButtonToolbar className="pull-right">
                <Button bsStyle="primary" onClick={this.togglePurge}>Purge</Button>
              </ButtonToolbar>

              <p>PROPERTY SUMMARY</p>
              <Dropdown id="dropdown-content"
                open={this.state.propertyMenuOpen}
                onToggle={this.togglePropertyMenu}>
                <Dropdown.Toggle bsStyle="link" className="header-toggle">
                  <h1>{this.props.location.query.name}</h1>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {this.props.properties.map(
                    (property, i) =>
                      property !== this.props.location.query.name ?
                      <li key={i}>
                        <Link to={`/content/property/${this.props.params.brand}/${this.props.params.account}/${this.props.params.group}/property?name=${property}`}
                          onClick={this.togglePropertyMenu}>
                          {property}
                        </Link>
                      </li> : null
                  ).toJS()}
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
              <Col xs={2}>
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
              <Col xs={1}>
                Trial
                <h3>{isTrial ? 'TRUE' : 'FALSE'}</h3>
              </Col>
            </Row>

            <Row className="no-end-gutters property-content">
              <Col xs={6} className="property-analytics-summary">
                <h3 className="has-btn">
                  Traffic Summary
                  <span className="heading-suffix"> (last 28 days)</span>
                  <Link className="btn btn-primary btn-icon pull-right"
                    to={`/content/analytics/property/${this.props.params.brand}/${this.props.params.account}/${this.props.params.group}/property?name=${this.props.location.query.name}`}>
                    <IconChart/>
                  </Link>
                </h3>

                <div className="extra-margin-top" ref="byTimeHolder">
                  <AnalysisByTime axes={true} padding={30}
                    primaryData={metrics_traffic.reverse()}
                    dataKey='bytes'
                    width={this.state.byTimeWidth}
                    height={this.state.byTimeWidth / 2.5}
                    xAxisTickFrequency={this.state.byTimeWidth > 920 ? 1
                      : this.state.byTimeWidth > 600 ? 2 : 3}
                    yAxisFormat="0 b"/>
                </div>

                <Row className="extra-margin-top no-gutters">
                  <Col xs={7}>
                    <Row>
                      <Col xs={6}>
                        Unique visitors
                        {this.props.fetching || this.props.visitorsFetching ?
                          <p>Loading...</p> :
                          <h2>{numeral(uniq_vis).format('0,0')}</h2>
                        }
                      </Col>
                      <Col xs={6}>
                        Bandwidth
                        <h2>
                          {avg_transfer_rate[0]}
                          <span className="heading-suffix"> {avg_transfer_rate[1]}</span>
                        </h2>
                      </Col>
                    </Row>
                    <Row className="extra-margin-top">
                      <Col xs={6}>
                        Cache Hit Rate
                        <h2>{avg_cache_hit_rate}
                          <span className="heading-suffix"> %</span>
                        </h2>
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={5}>
                    Top 3 Countries by Visitors
                    {this.props.fetching || this.props.visitorsFetching ?
                      <p>Loading...</p> :
                      this.props.visitorsByCountry.get('countries').size ?
                        this.props.visitorsByCountry.get('countries').map((country, i) => {
                        return (
                          <h2 key={i}>
                            {numeral(country.get('percent_total')).format('0.00')}
                            <span className="heading-suffix"> %</span>
                            <span className="heading-suffix"> {country.get('name').toUpperCase()}</span>
                          </h2>
                        )
                      }) : <h2>0 %</h2>
                    }
                  </Col>
                </Row>
              </Col>

              <div className="content-separator"></div>

              <Col xs={6} className="property-configuration-summary">
                <h3 className="has-btn">
                  Edge Configuration
                  <Link className="btn btn-primary btn-icon pull-right"
                    to={`/content/configuration/${this.props.params.brand}/${this.props.params.account}/${this.props.params.group}/property?name=${this.props.location.query.name}`}>
                    <IconConfiguration />
                  </Link>
                </h3>

                <Table className="unstyled no-padding auto-width">
                  <tbody>
                    <tr>
                      <td>Honor Origin Cache Control</td>
                      <td>
                        {activeConfig.getIn(policyPaths.ignore_case) ?
                          <b className="text-green">On</b> :
                          <b className="text-orange">Off</b>
                        }
                      </td>
                    </tr>
                    <tr>
                      <td>Ignore case from origin</td>
                      <td>
                        {activeConfig.getIn(policyPaths.honor_etags) === "strong" ?
                          <b className="text-green">On</b> :
                          <b className="text-orange">Off</b>
                        }
                      </td>
                    </tr>
                    <tr>
                      <td>Enable e-Tag support</td>
                      <td>
                        {activeConfig.getIn(policyPaths.honor_origin_cache_policies) ?
                          <b className="text-green">On</b> :
                          <b className="text-orange">Off</b>
                        }
                      </td>
                    </tr>
                  </tbody>
                </Table>

                <h3 className="extra-margin-top">Cache Rules</h3>

                <Table striped={true}>
                  <thead>
                    <tr>
                      <th>RULE TYPE</th>
                      <th>TTL VALUE</th>
                      <th>RULE</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Error Response</td>
                      <td>10 sec</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>Redirect</td>
                      <td>no-store</td>
                      <td>-</td>
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
          savePurge={this.savePurge}
          showNotification={this.showNotification}/> : ''}
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
  fetchingMetrics: React.PropTypes.bool,
  group: React.PropTypes.string,
  hostActions: React.PropTypes.object,
  id: React.PropTypes.string,
  location: React.PropTypes.object,
  metrics: React.PropTypes.instanceOf(Immutable.List),
  name: React.PropTypes.string,
  params: React.PropTypes.object,
  properties: React.PropTypes.instanceOf(Immutable.List),
  purgeActions: React.PropTypes.object,
  trafficActions: React.PropTypes.object,
  trafficByTime: React.PropTypes.instanceOf(Immutable.List),
  trafficFetching: React.PropTypes.bool,
  uiActions: React.PropTypes.object,
  visitorsActions: React.PropTypes.object,
  visitorsByCountry: React.PropTypes.instanceOf(Immutable.Map),
  visitorsFetching: React.PropTypes.bool
}

function mapStateToProps(state) {
  return {
    activeHost: state.host.get('activeHost'),
    activePurge: state.purge.get('activePurge'),
    fetching: state.host.get('fetching'),
    fetchingMetrics: state.metrics.get('fetchingHostMetrics'),
    metrics: state.metrics.get('hostMetrics'),
    properties: state.host.get('allHosts'),
    trafficByTime: state.traffic.get('byTime'),
    trafficFetching: state.traffic.get('fetching'),
    visitorsByCountry: state.visitors.get('byCountry'),
    visitorsFetching: state.traffic.get('fetching')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hostActions: bindActionCreators(hostActionCreators, dispatch),
    purgeActions: bindActionCreators(purgeActionCreators, dispatch),
    trafficActions: bindActionCreators(trafficActionCreators, dispatch),
    uiActions: bindActionCreators(uiActionCreators, dispatch),
    visitorsActions: bindActionCreators(visitorsActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Property);
