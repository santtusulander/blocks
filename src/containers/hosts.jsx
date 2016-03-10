import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Modal, Button, ButtonToolbar } from 'react-bootstrap';
import { Link } from 'react-router'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import moment from 'moment'

import * as accountActionCreators from '../redux/modules/account'
import * as groupActionCreators from '../redux/modules/group'
import * as hostActionCreators from '../redux/modules/host'
import * as metricsActionCreators from '../redux/modules/metrics'
import * as uiActionCreators from '../redux/modules/ui'
import AddHost from '../components/add-host'
import PageContainer from '../components/layout/page-container'
import Content from '../components/layout/content'
import PageHeader from '../components/layout/page-header'
import ContentItemList from '../components/content-item-list'
import ContentItemChart from '../components/content-item-chart'
import Select from '../components/select'
import IconAdd from '../components/icons/icon-add.jsx'
import IconChart from '../components/icons/icon-chart.jsx'
import IconItemList from '../components/icons/icon-item-list.jsx'
import IconItemChart from '../components/icons/icon-item-chart.jsx'

export class Hosts extends React.Component {
  constructor(props) {
    super(props);

    this.createNewHost = this.createNewHost.bind(this)
    this.deleteHost = this.deleteHost.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.toggleAddHost = this.toggleAddHost.bind(this)
    this.state = {
      activeFilter: 'traffic_high_to_low',
      addHost: false
    }
  }
  componentWillMount() {
    this.props.hostActions.startFetching()
    this.props.hostActions.fetchHosts(
      this.props.params.brand,
      this.props.params.account,
      this.props.params.group
    )
    this.props.accountActions.fetchAccount(
      this.props.params.brand,
      this.props.params.account
    )
    this.props.groupActions.fetchGroup(
      this.props.params.brand,
      this.props.params.account,
      this.props.params.group
    )
    this.props.metricsActions.startFetching()
    this.props.metricsActions.fetchMetrics({
      account: this.props.params.account,
      group: this.props.params.group,
      startDate: moment().subtract(30, 'days').format('X'),
      endDate: moment().format('X')
    })
  }
  createNewHost(id) {
    this.props.hostActions.createHost(
      this.props.params.brand,
      this.props.params.account,
      this.props.params.group,
      id
    )
    this.toggleAddHost()
  }
  deleteHost(id) {
    this.props.hostActions.deleteHost(
      this.props.params.brand,
      this.props.params.account,
      this.props.params.group,
      id
    )
  }
  toggleAddHost() {
    this.setState({
      addHost: !this.state.addHost
    })
  }
  handleSelectChange() {
    return value => {
      this.setState({
        activeFilter: value
      })
    }
  }
  render() {
    return (
      <PageContainer className='hosts-container content-subcontainer'>
        <Content>
          <PageHeader>
            <ButtonToolbar className="pull-right">
              <Button bsStyle="primary" className="btn-icon">
                <Link to={`/content/analytics/group/${this.props.params.brand}/${this.props.params.account}/${this.props.params.group}`}>
                  <IconChart />
                </Link>
              </Button>

              <Button bsStyle="primary" className="btn-icon btn-add-new"
                onClick={this.toggleAddHost}>
                <IconAdd />
              </Button>

              <Select
                onSelect={this.handleSelectChange()}
                value={this.state.activeFilter}
                options={[
                  ['traffic_high_to_low', 'Traffic High to Low'],
                  ['traffic_low_to_high', 'Traffic Low to High']]}/>

              <Button bsStyle="primary" className={'btn-icon btn-round toggle-view' +
                (this.props.viewingChart ? ' hidden' : '')}
                onClick={this.props.uiActions.toggleChartView}>
                <IconItemChart/>
              </Button>
              <Button bsStyle="primary" className={'btn-icon toggle-view' +
                (!this.props.viewingChart ? ' hidden' : '')}
                onClick={this.props.uiActions.toggleChartView}>
                <IconItemList/>
              </Button>
            </ButtonToolbar>

            <p>GROUP CONTENT SUMMARY</p>
            <h1>
              {this.props.activeGroup ?
                this.props.activeGroup.get('name')
                : 'Loading...'}
            </h1>
          </PageHeader>

          <div className="container-fluid body-content">
            <ol role="navigation" aria-label="breadcrumbs" className="breadcrumb">
              <li>
                <Link to={`/content/groups/udn/${this.props.params.account}`}>
                  {this.props.activeAccount ?
                    this.props.activeAccount.get('name')
                    : 'Loading...'}
                </Link>
              </li>
                <li className="active">
                {this.props.activeGroup ?
                  this.props.activeGroup.get('name')
                  : 'Loading...'}
              </li>
            </ol>

            {this.props.fetching ? <p className="fetching-info">Loading...</p> : (
              this.props.hosts.size === 0 ?
                <p className="fetching-info text-center">
                  {this.props.activeGroup ?
                    this.props.activeGroup.get('name') +
                    ' does not contain any properties'
                    : 'Loading...'}
                <br/>
                You can create new properties by clicking the Add New (+) button
                </p>
              :
              <ReactCSSTransitionGroup
                component="div"
                className="content-transition"
                transitionName="content-transition"
                transitionEnterTimeout={400}
                transitionLeaveTimeout={250}>
                {this.props.viewingChart ?
                  <div className="content-item-grid">
                    {this.props.hosts.map((host, i) => {
                      const metrics = this.props.metrics.get(i)
                      return (
                        <ContentItemChart key={i} id={host}
                          linkTo={`/content/property/${this.props.params.brand}/${this.props.params.account}/${this.props.params.group}/property?name=${encodeURIComponent(host).replace(/\./g, "%2e")}`}
                          configurationLink={`/content/configuration/${this.props.params.brand}/${this.props.params.account}/${this.props.params.group}/property?name=${encodeURIComponent(host).replace(/\./g, "%2e")}`}
                          analyticsLink={`/content/analytics/property/${this.props.params.brand}/${this.props.params.account}/${this.props.params.group}/property?name=${encodeURIComponent(host).replace(/\./g, "%2e")}`}
                          name={host} description="Desc"
                          delete={this.deleteHost}
                          primaryData={metrics.get('traffic').toJS()}
                          secondaryData={metrics.get('historical_traffic').toJS()}
                          differenceData={metrics.get('historical_variance').toJS()}
                          cacheHitRate={metrics.get('avg_cache_hit_rate')}
                          maxTransfer={metrics.get('transfer_rates').get('peak')}
                          minTransfer={metrics.get('transfer_rates').get('lowest')}
                          avgTransfer={metrics.get('transfer_rates').get('average')}
                          fetchingMetrics={this.props.fetchingMetrics}
                          barWidth="1"
                          chartWidth="450"
                          barMaxHeight="70" />
                      )
                    })}
                  </div> :
                  <div className="content-item-lists" key="lists">
                    {this.props.hosts.map((host, i) => {
                      const metrics = this.props.metrics.get(i)
                      return (
                        <ContentItemList key={i} id={host}
                          linkTo={`/content/property/${this.props.params.brand}/${this.props.params.account}/${this.props.params.group}/property?name=${encodeURIComponent(host).replace(/\./g, "%2e")}`}
                          configurationLink={`/content/configuration/${this.props.params.brand}/${this.props.params.account}/${this.props.params.group}/property?name=${encodeURIComponent(host).replace(/\./g, "%2e")}`}
                          analyticsLink={`/content/analytics/property/${this.props.params.brand}/${this.props.params.account}/${this.props.params.group}/property?name=${encodeURIComponent(host).replace(/\./g, "%2e")}`}
                          name={host} description="Desc"
                          primaryData={metrics.get('traffic').toJS()}
                          secondaryData={metrics.get('historical_traffic').toJS()}
                          cacheHitRate={metrics.get('avg_cache_hit_rate')}
                          maxTransfer={metrics.get('transfer_rates').get('peak')}
                          minTransfer={metrics.get('transfer_rates').get('lowest')}
                          avgTransfer={metrics.get('transfer_rates').get('average')}
                          fetchingMetrics={this.props.fetchingMetrics}/>
                      )
                    })}
                  </div>
                }
              </ReactCSSTransitionGroup>
            )}

            {this.state.addHost ?
              <Modal show={true} dialogClassName="configuration-sidebar"
                onHide={this.toggleAddHost}>
                <Modal.Header>
                  <h1>Add Property</h1>
                  <p>Lorem ipsum dolor</p>
                </Modal.Header>
                <Modal.Body>
                  <AddHost createHost={this.createNewHost}
                    cancelChanges={this.toggleAddHost}/>
                </Modal.Body>
              </Modal> : null
            }
          </div>
        </Content>
      </PageContainer>
    );
  }
}

Hosts.displayName = 'Hosts'
Hosts.propTypes = {
  accountActions: React.PropTypes.object,
  activeAccount: React.PropTypes.instanceOf(Immutable.Map),
  activeGroup: React.PropTypes.instanceOf(Immutable.Map),
  fetching: React.PropTypes.bool,
  fetchingMetrics: React.PropTypes.bool,
  groupActions: React.PropTypes.object,
  hostActions: React.PropTypes.object,
  hosts: React.PropTypes.instanceOf(Immutable.List),
  metrics: React.PropTypes.instanceOf(Immutable.List),
  metricsActions: React.PropTypes.object,
  params: React.PropTypes.object,
  uiActions: React.PropTypes.object,
  viewingChart: React.PropTypes.bool
}

function mapStateToProps(state) {
  return {
    activeAccount: state.account.get('activeAccount'),
    activeGroup: state.group.get('activeGroup'),
    fetching: state.host.get('fetching'),
    fetchingMetrics: state.metrics.get('fetching'),
    hosts: state.host.get('allHosts'),
    metrics: state.metrics.get('metrics'),
    viewingChart: state.ui.get('viewingChart')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    accountActions: bindActionCreators(accountActionCreators, dispatch),
    groupActions: bindActionCreators(groupActionCreators, dispatch),
    hostActions: bindActionCreators(hostActionCreators, dispatch),
    metricsActions: bindActionCreators(metricsActionCreators, dispatch),
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Hosts);
