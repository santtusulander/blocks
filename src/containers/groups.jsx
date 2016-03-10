import React from 'react'
import d3 from 'd3'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Button, ButtonToolbar } from 'react-bootstrap';
import { Link } from 'react-router'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import moment from 'moment'

import * as groupActionCreators from '../redux/modules/group'
import * as accountActionCreators from '../redux/modules/account'
import * as metricsActionCreators from '../redux/modules/metrics'
import * as uiActionCreators from '../redux/modules/ui'
// Not in 0.5 import EditGroup from '../components/edit-group'
import PageContainer from '../components/layout/page-container'
import Content from '../components/layout/content'
import PageHeader from '../components/layout/page-header'
import ContentItemList from '../components/content-item-list'
import ContentItemChart from '../components/content-item-chart'
import Select from '../components/select'
import IconChart from '../components/icons/icon-chart.jsx'
import IconItemList from '../components/icons/icon-item-list.jsx'
import IconItemChart from '../components/icons/icon-item-chart.jsx'

export class Groups extends React.Component {
  constructor(props) {
    super(props);

    // this.changeActiveGroupValue = this.changeActiveGroupValue.bind(this)
    // this.saveActiveGroupChanges = this.saveActiveGroupChanges.bind(this)
    // this.toggleActiveGroup = this.toggleActiveGroup.bind(this)
    // this.createNewGroup = this.createNewGroup.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.state = {
      activeFilter: 'traffic_high_to_low'
    }
  }
  componentWillMount() {
    this.props.groupActions.changeActiveGroup(null)
    this.props.groupActions.startFetching()
    this.props.groupActions.fetchGroups(
      this.props.params.brand,
      this.props.params.account
    )
    this.props.accountActions.fetchAccount(
      this.props.params.brand,
      this.props.params.account
    )
    this.props.metricsActions.startGroupFetching()
    this.props.metricsActions.fetchGroupMetrics({
      account: this.props.params.account,
      group: this.props.params.group,
      startDate: moment().subtract(30, 'days').format('X'),
      endDate: moment().format('X')
    })
  }
  // toggleActiveGroup(id) {
  //   return () => {
  //     if(this.props.activeGroup && this.props.activeGroup.get('group_id') === id){
  //       this.props.groupActions.changeActiveGroup(null)
  //     }
  //     else {
  //       this.props.groupActions.fetchGroup(
  //         this.props.params.brand,
  //         this.props.params.account,
  //         id
  //       )
  //     }
  //   }
  // }
  // changeActiveGroupValue(valPath, value) {
  //   this.props.groupActions.changeActiveGroup(
  //     this.props.activeGroup.setIn(valPath, value)
  //   )
  // }
  // saveActiveGroupChanges() {
  //   this.props.groupActions.updateGroup(
  //     this.props.params.brand,
  //     this.props.params.account,
  //     this.props.activeGroup.toJS()
  //   )
  // }
  // createNewGroup(name) {
  //   this.props.groupActions.createGroup(
  //     this.props.params.brand,
  //     this.props.params.account,
  //     name
  //   )
  // }
  deleteGroup(id) {
    this.props.groupActions.deleteGroup(
      this.props.params.brand,
      this.props.params.account,
      id
    )
  }
  handleSelectChange() {
    return value => {
      this.setState({
        activeFilter: value
      })
    }
  }
  render() {
    let trafficMin = 0
    let trafficMax = 0
    if(!this.props.fetchingMetrics) {
      const trafficTotals = this.props.groups.map((group, i) => {
        return this.props.metrics.get(i).get('totalTraffic')
      })
      trafficMin = Math.min(...trafficTotals)
      trafficMax = Math.max(...trafficTotals)
    }
    // If trafficMin === trafficMax, there's only one property or all properties
    // have identical metrics. In that case the amoebas will all get the minimum
    // size. Let's make trafficMin less than trafficMax and all amoebas will
    // render with maximum size instead
    trafficMin = trafficMin == trafficMax ? trafficMin * 0.9 : trafficMin
    const trafficScale = d3.scale.linear()
      .domain([trafficMin, trafficMax])
      .range([460, 560]);
    return (
      <PageContainer className='groups-container content-subcontainer'>
        <Content>
          <PageHeader>
            <ButtonToolbar className="pull-right">
              <Button bsStyle="primary" className="btn-icon">
                <Link to={`/content/analytics/account/${this.props.params.brand}/${this.props.params.account}`}>
                  <IconChart/>
                </Link>
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

            <p>ACCOUNT CONTENT SUMMARY</p>
            <h1>
              {this.props.activeAccount ?
                this.props.activeAccount.get('name')
                : 'Loading...'}
            </h1>
          </PageHeader>

          <div className="container-fluid body-content">
            <ol role="navigation" aria-label="breadcrumbs" className="breadcrumb">
              <li className="active">
                {this.props.activeAccount ?
                  this.props.activeAccount.get('name')
                  : 'Loading...'}
              </li>
            </ol>

            {this.props.fetching || this.props.fetchingMetrics ?
              <p className="fetching-info">Loading...</p> : (
              this.props.groups.size === 0 ?
                <p className="fetching-info text-center">
                  {this.props.activeAccount ?
                    this.props.activeAccount.get('name') +
                    ' does not contain any groups'
                    : 'Loading...'}
                <br/>
                You can create new groups by clicking the Add New (+) button
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
                    {this.props.groups.map((group, i) => {
                      const metrics = this.props.metrics.get(i)
                      const scaledWidth = trafficScale(metrics.get('totalTraffic'))
                      return (
                        <ContentItemChart key={i} id={group.get('id')}
                          linkTo={`/content/hosts/${this.props.params.brand}/${this.props.params.account}/${group.get('id')}`}
                          analyticsLink={`/content/analytics/group/${this.props.params.brand}/${this.props.params.account}/${group.get('id')}`}
                          name={group.get('name')} description="Desc"
                          delete={this.deleteGroup}
                          primaryData={metrics.get('traffic').toJS()}
                          secondaryData={metrics.get('historical_traffic').toJS()}
                          differenceData={metrics.get('historical_variance').toJS()}
                          cacheHitRate={metrics.get('avg_cache_hit_rate')}
                          maxTransfer={metrics.get('transfer_rates').get('peak')}
                          minTransfer={metrics.get('transfer_rates').get('lowest')}
                          avgTransfer={metrics.get('transfer_rates').get('average')}
                          fetchingMetrics={this.props.fetchingMetrics}
                          barWidth="1"
                          chartWidth={scaledWidth.toString()}
                          barMaxHeight={(scaledWidth / 7).toString()} />
                      )
                    })}
                  </div> :
                  <div className="content-item-lists" key="lists">
                    {this.props.groups.map((group, i) => {
                      const metrics = this.props.metrics.get(i)
                      return (
                        <ContentItemList key={i} id={group.get('id')}
                          linkTo={`/content/hosts/${this.props.params.brand}/${this.props.params.account}/${group.get('id')}`}
                          analyticsLink={`/content/analytics/group/${this.props.params.brand}/${this.props.params.account}/${group.get('id')}`}
                          name={group.get('name')} description="Desc"
                          delete={this.deleteGroup}
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

            {/* Not in 0.5
            activeGroup ?
              <Modal show={true} dialogClassName="configuration-sidebar"
                onHide={this.toggleActiveGroup(this.props.activeGroup.get('group_id'))}>
                <Modal.Header>
                  <h1>Edit Group</h1>
                  <p>Lorem ipsum dolor</p>
                </Modal.Header>
                <Modal.Body>
                  <EditGroup group={this.props.activeGroup}
                    changeValue={this.changeActiveGroupValue}
                    saveChanges={this.saveActiveGroupChanges}
                    cancelChanges={this.toggleActiveGroup(this.props.activeGroup.get('group_id'))}/>
                </Modal.Body>
              </Modal> : null
            */}
          </div>
        </Content>
      </PageContainer>
    );
  }
}

Groups.displayName = 'Groups'
Groups.propTypes = {
  accountActions: React.PropTypes.object,
  activeAccount: React.PropTypes.instanceOf(Immutable.Map),
  activeGroup: React.PropTypes.instanceOf(Immutable.Map),
  fetching: React.PropTypes.bool,
  fetchingMetrics: React.PropTypes.bool,
  groupActions: React.PropTypes.object,
  groups: React.PropTypes.instanceOf(Immutable.List),
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
    fetching: state.group.get('fetching'),
    fetchingMetrics: state.metrics.get('fetchingGroupMetrics'),
    groups: state.group.get('allGroups'),
    metrics: state.metrics.get('groupMetrics'),
    viewingChart: state.ui.get('viewingChart')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    accountActions: bindActionCreators(accountActionCreators, dispatch),
    groupActions: bindActionCreators(groupActionCreators, dispatch),
    metricsActions: bindActionCreators(metricsActionCreators, dispatch),
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Groups);
