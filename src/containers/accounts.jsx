import React from 'react'
import d3 from 'd3'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Button, ButtonToolbar } from 'react-bootstrap';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import moment from 'moment'

import * as accountActionCreators from '../redux/modules/account'
import * as metricsActionCreators from '../redux/modules/metrics'
import * as uiActionCreators from '../redux/modules/ui'
// not in 0.5 import EditAccount from '../components/edit-account'
import PageContainer from '../components/layout/page-container'
import Content from '../components/layout/content'
import PageHeader from '../components/layout/page-header'
import ContentItemList from '../components/content-item-list'
import ContentItemChart from '../components/content-item-chart'
import Select from '../components/select'
import IconItemList from '../components/icons/icon-item-list.jsx'
import IconItemChart from '../components/icons/icon-item-chart.jsx'

const fakeRecentData = [
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

const fakeAverageData = [
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

export class Accounts extends React.Component {
  constructor(props) {
    super(props);

    // this.changeActiveAccountValue = this.changeActiveAccountValue.bind(this)
    // this.saveActiveAccountChanges = this.saveActiveAccountChanges.bind(this)
    // this.toggleActiveAccount = this.toggleActiveAccount.bind(this)
    // this.createNewAccount = this.createNewAccount.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.state = {
      activeFilter: 'traffic_high_to_low'
    }
  }
  componentWillMount() {
    this.props.accountActions.startFetching()
    this.props.accountActions.fetchAccounts(this.props.params.brand)
    // TODO: Need support for this in the analytics api
    // this.props.metricsActions.startAccountFetching()
    // this.props.metricsActions.fetchAccountMetrics({
    //   startDate: moment.utc().endOf('hour').add(1,'second').subtract(28, 'days').format('X'),
    //   endDate: moment.utc().endOf('hour').format('X')
    // })
  }
  // toggleActiveAccount(id) {
  //   return () => {
  //     if(this.props.activeAccount && this.props.activeAccount.get('account_id') === id){
  //       this.props.accountActions.changeActiveAccount(null)
  //     }
  //     else {
  //       this.props.accountActions.fetchAccount(this.props.params.brand, id)
  //     }
  //   }
  // }
  // changeActiveAccountValue(valPath, value) {
  //   this.props.accountActions.changeActiveAccount(
  //     this.props.activeAccount.setIn(valPath, value)
  //   )
  // }
  // saveActiveAccountChanges() {
  //   this.props.accountActions.updateAccount(this.props.params.brand, this.props.activeAccount.toJS())
  // }
  // createNewAccount() {
  //   this.props.accountActions.createAccount(this.props.params.brand)
  // }
  deleteAccount(id) {
    this.props.accountActions.deleteAccount(this.props.params.brand, id)
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
      const trafficTotals = this.props.accounts.map((account, i) => {
        return this.props.metrics.has(i) ?
          this.props.metrics.get(i).get('totalTraffic') : 0
      })
      trafficMin = Math.min(...trafficTotals)
      trafficMax = Math.max(...trafficTotals)
    }
    // If trafficMin === trafficMax, there's only one property or all accounts
    // have identical metrics. In that case the amoebas will all get the minimum
    // size. Let's make trafficMin less than trafficMax and all amoebas will
    // render with maximum size instead
    trafficMin = trafficMin == trafficMax ? trafficMin * 0.9 : trafficMin
    const trafficScale = d3.scale.linear()
      .domain([trafficMin, trafficMax])
      .range([460, 560]);
    return (
      <PageContainer className='accounts-container content-subcontainer'>
        <Content>
          <PageHeader>
            <ButtonToolbar className="pull-right">

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

            <p>BRAND CONTENT SUMMARY</p>
            <h1>Accounts</h1>
          </PageHeader>

          <div className="container-fluid body-content">
            {this.props.fetching || this.props.fetchingMetrics ?
              <p className="fetching-info">Loading...</p> : (
              this.props.accounts.size === 0 ?
                <p className="fetching-info text-center">
                  No accounts found.
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
                    {this.props.accounts.map((account, i) => {
                      const metrics = this.props.metrics.find(metric => metric.get('account') === account.get('id')) || Immutable.Map()
                      const scaledWidth = trafficScale(metrics.get('totalTraffic') || 0)
                      return (
                        <ContentItemChart key={i} id={account.get('id').toString()}
                          linkTo={`/content/groups/${this.props.params.brand}/${account.get('id')}`}
                          analyticsLink={`/content/analytics/account/${this.props.params.brand}/${account.get('id')}`}
                          name={account.get('name')} description="Desc"
                          delete={this.deleteAccount}
                          primaryData={fakeRecentData/*metrics.has('traffic') ? metrics.get('traffic').toJS() : []*/}
                          secondaryData={fakeAverageData/*metrics.has('historical_traffic') ? metrics.get('historical_traffic').toJS() : []*/}
                          differenceData={metrics.has('historical_variance') ? metrics.get('historical_variance').toJS() : []}
                          cacheHitRate={metrics.get('avg_cache_hit_rate')}
                          timeToFirstByte={metrics.get('avg_ttfb')}
                          maxTransfer={metrics.has('transfer_rates') ? metrics.get('transfer_rates').get('peak') : '0.0 Gbps'}
                          minTransfer={metrics.has('transfer_rates') ? metrics.get('transfer_rates').get('lowest') : '0.0 Gbps'}
                          avgTransfer={metrics.has('transfer_rates') ? metrics.get('transfer_rates').get('average') : '0.0 Gbps'}
                          fetchingMetrics={this.props.fetchingMetrics}
                          barWidth="1"
                          chartWidth={scaledWidth.toString()}
                          barMaxHeight={(scaledWidth / 7).toString()} />
                      )
                    })}
                  </div> :
                  <div className="content-item-lists" key="lists">
                    {this.props.accounts.map((account, i) => {
                      const metrics = this.props.metrics.find(metric => metric.get('account') === account.get('id')) || Immutable.Map()
                      return (
                        <ContentItemList key={i} id={account.get('id').toString()}
                          linkTo={`/content/groups/${this.props.params.brand}/${account.get('id')}`}
                          analyticsLink={`/content/analytics/account/${this.props.params.brand}/${account.get('id')}`}
                          name={account.get('name')} description="Desc"
                          delete={this.deleteAccount}
                          primaryData={fakeRecentData/*metrics.has('traffic') ? metrics.get('traffic').toJS().reverse() : []*/}
                          secondaryData={fakeAverageData/*metrics.has('historical_traffic') ? metrics.get('historical_traffic').toJS().reverse() : []*/}
                          cacheHitRate={metrics.get('avg_cache_hit_rate')}
                          timeToFirstByte={metrics.get('avg_ttfb')}
                          maxTransfer={metrics.has('transfer_rates') ? metrics.get('transfer_rates').get('peak') : '0.0 Gbps'}
                          minTransfer={metrics.has('transfer_rates') ? metrics.get('transfer_rates').get('lowest') : '0.0 Gbps'}
                          avgTransfer={metrics.has('transfer_rates') ? metrics.get('transfer_rates').get('average') : '0.0 Gbps'}
                          fetchingMetrics={this.props.fetchingMetrics}/>
                      )
                    })}
                  </div>
                }
              </ReactCSSTransitionGroup>
            )}
          </div>
        </Content>
      </PageContainer>
    );
  }
}

Accounts.displayName = 'Accounts'
Accounts.propTypes = {
  accountActions: React.PropTypes.object,
  accounts: React.PropTypes.instanceOf(Immutable.List),
  activeAccount: React.PropTypes.instanceOf(Immutable.Map),
  fetching: React.PropTypes.bool,
  fetchingMetrics: React.PropTypes.bool,
  metrics: React.PropTypes.instanceOf(Immutable.List),
  metricsActions: React.PropTypes.object,
  params: React.PropTypes.object,
  uiActions: React.PropTypes.object,
  viewingChart: React.PropTypes.bool
}

function mapStateToProps(state) {
  return {
    activeAccount: state.account.get('activeAccount'),
    accounts: state.account.get('allAccounts'),
    fetching: state.account.get('fetching'),
    fetchingMetrics: state.metrics.get('fetchingGroupMetrics'),
    metrics: state.metrics.get('groupMetrics'),
    viewingChart: state.ui.get('viewingChart')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    accountActions: bindActionCreators(accountActionCreators, dispatch),
    metricsActions: bindActionCreators(metricsActionCreators, dispatch),
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Accounts);
