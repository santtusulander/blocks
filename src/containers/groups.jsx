import React from 'react'
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

const fakeRecentData = [
  {timestamp: new Date("2016-01-01T00:00:00"), bytes: 39405, requests: 943},
  {timestamp: new Date("2016-01-02T00:00:00"), bytes: 34766, requests: 546},
  {timestamp: new Date("2016-01-03T00:00:00"), bytes: 34675, requests: 435},
  {timestamp: new Date("2016-01-04T00:00:00"), bytes: 34336, requests: 345},
  {timestamp: new Date("2016-01-05T00:00:00"), bytes: 33456, requests: 567},
  {timestamp: new Date("2016-01-06T00:00:00"), bytes: 36756, requests: 244},
  {timestamp: new Date("2016-01-07T00:00:00"), bytes: 35466, requests: 455},
  {timestamp: new Date("2016-01-08T00:00:00"), bytes: 33456, requests: 233},
  {timestamp: new Date("2016-01-09T00:00:00"), bytes: 37454, requests: 544},
  {timestamp: new Date("2016-01-10T00:00:00"), bytes: 44766, requests: 546},
  {timestamp: new Date("2016-01-11T00:00:00"), bytes: 44675, requests: 435},
  {timestamp: new Date("2016-01-12T00:00:00"), bytes: 44336, requests: 456},
  {timestamp: new Date("2016-01-13T00:00:00"), bytes: 53456, requests: 567},
  {timestamp: new Date("2016-01-14T00:00:00"), bytes: 56756, requests: 244},
  {timestamp: new Date("2016-01-15T00:00:00"), bytes: 55466, requests: 455},
  {timestamp: new Date("2016-01-16T00:00:00"), bytes: 53456, requests: 456},
  {timestamp: new Date("2016-01-17T00:00:00"), bytes: 57454, requests: 544},
  {timestamp: new Date("2016-01-18T00:00:00"), bytes: 53456, requests: 233},
  {timestamp: new Date("2016-01-19T00:00:00"), bytes: 57454, requests: 544},
  {timestamp: new Date("2016-01-20T00:00:00"), bytes: 44766, requests: 546},
  {timestamp: new Date("2016-01-21T00:00:00"), bytes: 44675, requests: 435},
  {timestamp: new Date("2016-01-22T00:00:00"), bytes: 44336, requests: 456},
  {timestamp: new Date("2016-01-23T00:00:00"), bytes: 43456, requests: 567},
  {timestamp: new Date("2016-01-24T00:00:00"), bytes: 46756, requests: 244},
  {timestamp: new Date("2016-01-25T00:00:00"), bytes: 45466, requests: 455},
  {timestamp: new Date("2016-01-26T00:00:00"), bytes: 43456, requests: 456},
  {timestamp: new Date("2016-01-27T00:00:00"), bytes: 37454, requests: 544},
  {timestamp: new Date("2016-01-28T00:00:00"), bytes: 33456, requests: 456},
  {timestamp: new Date("2016-01-29T00:00:00"), bytes: 37454, requests: 544},
  {timestamp: new Date("2016-01-30T00:00:00"), bytes: 33456, requests: 233},
  {timestamp: new Date("2016-01-31T00:00:00"), bytes: 34675, requests: 435},
  {timestamp: new Date("2016-02-01T00:00:00"), bytes: 44766, requests: 546},
  {timestamp: new Date("2016-02-02T00:00:00"), bytes: 44766, requests: 546},
  {timestamp: new Date("2016-02-03T00:00:00"), bytes: 44675, requests: 435},
  {timestamp: new Date("2016-02-04T00:00:00"), bytes: 44336, requests: 345},
  {timestamp: new Date("2016-02-05T00:00:00"), bytes: 43456, requests: 567},
  {timestamp: new Date("2016-02-06T00:00:00"), bytes: 46756, requests: 244},
  {timestamp: new Date("2016-02-07T00:00:00"), bytes: 45466, requests: 455},
  {timestamp: new Date("2016-02-08T00:00:00"), bytes: 43456, requests: 233},
  {timestamp: new Date("2016-02-09T00:00:00"), bytes: 47454, requests: 544},
  {timestamp: new Date("2016-02-10T00:00:00"), bytes: 54766, requests: 546},
  {timestamp: new Date("2016-02-11T00:00:00"), bytes: 54675, requests: 435},
  {timestamp: new Date("2016-02-12T00:00:00"), bytes: 54336, requests: 456},
  {timestamp: new Date("2016-02-13T00:00:00"), bytes: 53456, requests: 567},
  {timestamp: new Date("2016-02-14T00:00:00"), bytes: 56756, requests: 244},
  {timestamp: new Date("2016-02-15T00:00:00"), bytes: 55466, requests: 455},
  {timestamp: new Date("2016-02-16T00:00:00"), bytes: 43456, requests: 456},
  {timestamp: new Date("2016-02-17T00:00:00"), bytes: 57454, requests: 544},
  {timestamp: new Date("2016-02-18T00:00:00"), bytes: 53456, requests: 233},
  {timestamp: new Date("2016-02-19T00:00:00"), bytes: 57454, requests: 544},
  {timestamp: new Date("2016-02-20T00:00:00"), bytes: 54766, requests: 546},
  {timestamp: new Date("2016-02-21T00:00:00"), bytes: 44675, requests: 435},
  {timestamp: new Date("2016-02-22T00:00:00"), bytes: 44336, requests: 456},
  {timestamp: new Date("2016-02-23T00:00:00"), bytes: 23456, requests: 567},
  {timestamp: new Date("2016-02-24T00:00:00"), bytes: 26756, requests: 244},
  {timestamp: new Date("2016-02-25T00:00:00"), bytes: 25466, requests: 455},
  {timestamp: new Date("2016-02-26T00:00:00"), bytes: 23456, requests: 456},
  {timestamp: new Date("2016-02-27T00:00:00"), bytes: 27454, requests: 544},
  {timestamp: new Date("2016-02-28T00:00:00"), bytes: 23456, requests: 456}
]

const fakeAverageData = [
  {timestamp: new Date("2016-01-01T00:00:00"), bytes: 49405, requests: 943},
  {timestamp: new Date("2016-01-02T00:00:00"), bytes: 44766, requests: 546},
  {timestamp: new Date("2016-01-03T00:00:00"), bytes: 44675, requests: 435},
  {timestamp: new Date("2016-01-04T00:00:00"), bytes: 44336, requests: 345},
  {timestamp: new Date("2016-01-05T00:00:00"), bytes: 43456, requests: 567},
  {timestamp: new Date("2016-01-06T00:00:00"), bytes: 46756, requests: 244},
  {timestamp: new Date("2016-01-07T00:00:00"), bytes: 45466, requests: 455},
  {timestamp: new Date("2016-01-08T00:00:00"), bytes: 43456, requests: 233},
  {timestamp: new Date("2016-01-09T00:00:00"), bytes: 47454, requests: 544},
  {timestamp: new Date("2016-01-10T00:00:00"), bytes: 54766, requests: 546},
  {timestamp: new Date("2016-01-11T00:00:00"), bytes: 54675, requests: 435},
  {timestamp: new Date("2016-01-12T00:00:00"), bytes: 54336, requests: 456},
  {timestamp: new Date("2016-01-13T00:00:00"), bytes: 53456, requests: 567},
  {timestamp: new Date("2016-01-14T00:00:00"), bytes: 56756, requests: 244},
  {timestamp: new Date("2016-01-15T00:00:00"), bytes: 55466, requests: 455},
  {timestamp: new Date("2016-01-16T00:00:00"), bytes: 43456, requests: 456},
  {timestamp: new Date("2016-01-17T00:00:00"), bytes: 57454, requests: 544},
  {timestamp: new Date("2016-01-18T00:00:00"), bytes: 53456, requests: 233},
  {timestamp: new Date("2016-01-19T00:00:00"), bytes: 57454, requests: 544},
  {timestamp: new Date("2016-01-20T00:00:00"), bytes: 54766, requests: 546},
  {timestamp: new Date("2016-01-21T00:00:00"), bytes: 44675, requests: 435},
  {timestamp: new Date("2016-01-22T00:00:00"), bytes: 44336, requests: 456},
  {timestamp: new Date("2016-01-23T00:00:00"), bytes: 23456, requests: 567},
  {timestamp: new Date("2016-01-24T00:00:00"), bytes: 26756, requests: 244},
  {timestamp: new Date("2016-01-25T00:00:00"), bytes: 25466, requests: 455},
  {timestamp: new Date("2016-01-26T00:00:00"), bytes: 23456, requests: 456},
  {timestamp: new Date("2016-01-27T00:00:00"), bytes: 27454, requests: 544},
  {timestamp: new Date("2016-01-28T00:00:00"), bytes: 23456, requests: 456},
  {timestamp: new Date("2016-01-29T00:00:00"), bytes: 27454, requests: 544},
  {timestamp: new Date("2016-01-30T00:00:00"), bytes: 23456, requests: 233},
  {timestamp: new Date("2016-01-31T00:00:00"), bytes: 24675, requests: 435},
  {timestamp: new Date("2016-02-01T00:00:00"), bytes: 34766, requests: 546},
  {timestamp: new Date("2016-02-02T00:00:00"), bytes: 34766, requests: 546},
  {timestamp: new Date("2016-02-03T00:00:00"), bytes: 34675, requests: 435},
  {timestamp: new Date("2016-02-04T00:00:00"), bytes: 34336, requests: 345},
  {timestamp: new Date("2016-02-05T00:00:00"), bytes: 33456, requests: 567},
  {timestamp: new Date("2016-02-06T00:00:00"), bytes: 36756, requests: 244},
  {timestamp: new Date("2016-02-07T00:00:00"), bytes: 35466, requests: 455},
  {timestamp: new Date("2016-02-08T00:00:00"), bytes: 33456, requests: 233},
  {timestamp: new Date("2016-02-09T00:00:00"), bytes: 37454, requests: 544},
  {timestamp: new Date("2016-02-10T00:00:00"), bytes: 44766, requests: 546},
  {timestamp: new Date("2016-02-11T00:00:00"), bytes: 44675, requests: 435},
  {timestamp: new Date("2016-02-12T00:00:00"), bytes: 44336, requests: 456},
  {timestamp: new Date("2016-02-13T00:00:00"), bytes: 53456, requests: 567},
  {timestamp: new Date("2016-02-14T00:00:00"), bytes: 56756, requests: 244},
  {timestamp: new Date("2016-02-15T00:00:00"), bytes: 55466, requests: 455},
  {timestamp: new Date("2016-02-16T00:00:00"), bytes: 53456, requests: 456},
  {timestamp: new Date("2016-02-17T00:00:00"), bytes: 57454, requests: 544},
  {timestamp: new Date("2016-02-18T00:00:00"), bytes: 53456, requests: 233},
  {timestamp: new Date("2016-02-19T00:00:00"), bytes: 57454, requests: 544},
  {timestamp: new Date("2016-02-20T00:00:00"), bytes: 44766, requests: 546},
  {timestamp: new Date("2016-02-21T00:00:00"), bytes: 44675, requests: 435},
  {timestamp: new Date("2016-02-22T00:00:00"), bytes: 44336, requests: 456},
  {timestamp: new Date("2016-02-23T00:00:00"), bytes: 43456, requests: 567},
  {timestamp: new Date("2016-02-24T00:00:00"), bytes: 46756, requests: 244},
  {timestamp: new Date("2016-02-25T00:00:00"), bytes: 45466, requests: 455},
  {timestamp: new Date("2016-02-26T00:00:00"), bytes: 43456, requests: 456},
  {timestamp: new Date("2016-02-27T00:00:00"), bytes: 37454, requests: 544},
  {timestamp: new Date("2016-02-28T00:00:00"), bytes: 33456, requests: 456}
]

const fakeDifferenceData = [0, 0, 1, -1, 0, 0, 1, -1, -1, -1]

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
    this.props.metricsActions.startFetching()
    this.props.metricsActions.fetchMetrics({
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
    return (
      <PageContainer className='groups-container content-subcontainer'>
        <Content>
          <PageHeader>
            <ButtonToolbar className="pull-right">
              <Button bsStyle="primary" className="btn-icon">
                <Link to={`/analytics/account/${this.props.params.brand}/${this.props.params.account}`}>
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

            {this.props.fetching ? <p>Loading...</p> : (
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
                      return (
                        <ContentItemChart key={i} id={group.get('id')}
                          linkTo={`/content/hosts/${this.props.params.brand}/${this.props.params.account}/${group.get('id')}`}
                          analyticsLink={`/analytics/group/${this.props.params.brand}/${this.props.params.account}/${group.get('id')}`}
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
                          chartWidth="560"
                          barMaxHeight="80" />
                      )
                    })}
                  </div> :
                  <div className="content-item-lists" key="lists">
                    {this.props.groups.map((group, i) => {
                      const metrics = this.props.metrics.get(i)
                      return (
                        <ContentItemList key={i} id={group.get('id')}
                          linkTo={`/content/hosts/${this.props.params.brand}/${this.props.params.account}/${group.get('id')}`}
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
    fetchingMetrics: state.metrics.get('fetching'),
    groups: state.group.get('allGroups'),
    metrics: state.metrics.get('metrics'),
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
