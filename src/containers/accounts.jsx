import React from 'react'
import d3 from 'd3'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Button, ButtonToolbar } from 'react-bootstrap';
// Not in 0.5 import { Link } from 'react-router'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import moment from 'moment'

import * as accountActionCreators from '../redux/modules/account'
import * as metricsActionCreators from '../redux/modules/metrics'
import * as uiActionCreators from '../redux/modules/ui'
// Not in 0.5 import EditAccount from '../components/edit-account'
import PageContainer from '../components/layout/page-container'
import Content from '../components/layout/content'
import PageHeader from '../components/layout/page-header'
import ContentItemList from '../components/content-item-list'
import ContentItemChart from '../components/content-item-chart'
import Select from '../components/select'
// Not in 0.5 import IconChart from '../components/icons/icon-chart.jsx'
import IconItemList from '../components/icons/icon-item-list.jsx'
import IconItemChart from '../components/icons/icon-item-chart.jsx'
import { filterAccountsByUserName } from '../util/helpers'

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
    this.props.metricsActions.startAccountFetching()
    this.props.metricsActions.fetchAccountMetrics({
      startDate: moment.utc().endOf('hour').add(1,'second').subtract(28, 'days').format('X'),
      endDate: moment.utc().endOf('hour').format('X')
    })
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
    const filteredAccounts = filterAccountsByUserName(
      this.props.accounts,
      this.props.username
    )
    if(!this.props.fetchingMetrics) {
      const trafficTotals = filteredAccounts.map((account, i) => {
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
              {/*<Button bsStyle="primary" className="btn-icon">
                <Link to={`/analysis/`}>
                  <IconChart/>
                </Link>
              </Button>*/}

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
              filteredAccounts.size === 0 ?
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
                    {filteredAccounts.map((account, i) => {
                      const metrics = this.props.metrics.find(metric => metric.get('account') === account.get('id')) || Immutable.Map()
                      const scaledWidth = trafficScale(metrics.get('totalTraffic') || 0)
                      return (
                        <ContentItemChart key={i} id={account.get('id').toString()}
                          linkTo={`/content/groups/${this.props.params.brand}/${account.get('id')}`}
                          analyticsLink={`/content/analytics/account/${this.props.params.brand}/${account.get('id')}`}
                          name={account.get('name')} description="Desc"
                          delete={this.deleteAccount}
                          primaryData={metrics.has('traffic') ? metrics.get('traffic').toJS() : []}
                          secondaryData={metrics.has('historical_traffic') ? metrics.get('historical_traffic').toJS() : []}
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
                    }).sort(
                      (item1, item2) => {
                        let sortType = item2.props.chartWidth - item1.props.chartWidth
                        if (this.state.activeFilter === 'traffic_low_to_high') {
                          sortType = item1.props.chartWidth - item2.props.chartWidth
                        }
                        return sortType
                      }
                    )}
                  </div> :
                  <div className="content-item-lists" key="lists">
                    {filteredAccounts.map((account, i) => {
                      const metrics = this.props.metrics.find(metric => metric.get('account') === account.get('id')) || Immutable.Map()
                      const scaledWidth = trafficScale(metrics.get('totalTraffic') || 0)
                      return (
                        <ContentItemList key={i} id={account.get('id').toString()}
                          linkTo={`/content/groups/${this.props.params.brand}/${account.get('id')}`}
                          analyticsLink={`/content/analytics/account/${this.props.params.brand}/${account.get('id')}`}
                          name={account.get('name')} description="Desc"
                          delete={this.deleteAccount}
                          primaryData={metrics.has('traffic') ? metrics.get('traffic').toJS() : []}
                          secondaryData={metrics.has('historical_traffic') ? metrics.get('historical_traffic').toJS() : []}
                          cacheHitRate={metrics.get('avg_cache_hit_rate')}
                          timeToFirstByte={metrics.get('avg_ttfb')}
                          maxTransfer={metrics.has('transfer_rates') ? metrics.get('transfer_rates').get('peak') : '0.0 Gbps'}
                          minTransfer={metrics.has('transfer_rates') ? metrics.get('transfer_rates').get('lowest') : '0.0 Gbps'}
                          avgTransfer={metrics.has('transfer_rates') ? metrics.get('transfer_rates').get('average') : '0.0 Gbps'}
                          chartWidth={scaledWidth.toString()}
                          fetchingMetrics={this.props.fetchingMetrics}/>
                      )
                    }).sort(
                      (item1, item2) => {
                        let sortType = item2.props.chartWidth - item1.props.chartWidth
                        if (this.state.activeFilter === 'traffic_low_to_high') {
                          sortType = item1.props.chartWidth - item2.props.chartWidth
                        }
                        return sortType
                      }
                    )}
                  </div>
                }
              </ReactCSSTransitionGroup>
            )}


            {/* Not in 0.5
            activeAccount ?
              <Modal show={true} dialogClassName="configuration-sidebar"
                onHide={this.toggleActiveAccount(activeAccount.get('account_id'))}>
                <Modal.Header>
                  <h1>Edit Account</h1>
                  <p>Lorem ipsum dolor</p>
                </Modal.Header>
                <Modal.Body>
                  <EditAccount account={activeAccount}
                    changeValue={this.changeActiveAccountValue}
                    saveChanges={this.saveActiveAccountChanges}
                    cancelChanges={this.toggleActiveAccount(activeAccount.get('account_id'))}/>
                </Modal.Body>
              </Modal> : null
            */}
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
  username: React.PropTypes.string,
  viewingChart: React.PropTypes.bool
}

function mapStateToProps(state) {
  return {
    activeAccount: state.account.get('activeAccount'),
    accounts: state.account.get('allAccounts'),
    fetching: state.account.get('fetching'),
    fetchingMetrics: state.metrics.get('fetchingAccountMetrics'),
    metrics: state.metrics.get('accountMetrics'),
    viewingChart: state.ui.get('viewingChart'),
    username: state.user.get('username')
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
