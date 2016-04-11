import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Nav, NavItem } from 'react-bootstrap'
import moment from 'moment'

import * as accountActionCreators from '../redux/modules/account'
import * as trafficActionCreators from '../redux/modules/traffic'
import * as uiActionCreators from '../redux/modules/ui'
import * as visitorsActionCreators from '../redux/modules/visitors'

import PageContainer from '../components/layout/page-container'
import Sidebar from '../components/layout/sidebar'
import Content from '../components/layout/content'
import Analyses from '../components/analysis/analyses'
import AnalysisTraffic from '../components/analysis/traffic'
import AnalysisVisitors from '../components/analysis/visitors'
import AnalysisSPReport from '../components/analysis/sp-report'
import AnalysisFileError from '../components/analysis/file-error'
import { filterAccountsByUserName } from '../util/helpers'

export class AccountAnalytics extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: 'traffic',
      endDate: moment().utc(),
      startDate: moment().utc().startOf('month')
    }

    this.changeTab = this.changeTab.bind(this)
    this.changeDateRange = this.changeDateRange.bind(this)
  }
  componentWillMount() {
    this.fetchData()
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.params.account !== this.props.params.account) {
      this.fetchData(nextProps.params.account)
    }
  }
  fetchData(account) {
    if(!account) {
      account = this.props.params.account
    }
    const fetchOpts = {
      account: account,
      group: this.props.params.group,
      startDate: this.state.startDate.format('X'),
      endDate: this.state.endDate.format('X')
    }
    const onOffOpts = Object.assign({}, fetchOpts)
    onOffOpts.granularity = 'day'
    this.props.trafficActions.startFetching()
    this.props.visitorsActions.startFetching()
    this.props.accountActions.fetchAccount(
      this.props.params.brand,
      account
    )
    Promise.all([
      this.props.trafficActions.fetchByTime(fetchOpts),
      this.props.trafficActions.fetchByCountry(fetchOpts),
      this.props.trafficActions.fetchTotalEgress(fetchOpts),
      this.props.trafficActions.fetchOnOffNet(onOffOpts)
    ]).then(this.props.trafficActions.finishFetching)
    Promise.all([
      this.props.visitorsActions.fetchByTime(fetchOpts),
      this.props.visitorsActions.fetchByCountry(fetchOpts),
      this.props.visitorsActions.fetchByBrowser(fetchOpts),
      this.props.visitorsActions.fetchByOS(fetchOpts)
    ]).then(this.props.visitorsActions.finishFetching)
  }
  changeTab(newTab) {
    this.setState({activeTab: newTab})
  }
  changeDateRange(startDate, endDate) {
    this.setState({endDate: endDate, startDate: startDate}, this.fetchData)
  }
  render() {
    const filteredAccounts = filterAccountsByUserName(
      this.props.accounts,
      this.props.username
    )
    const availableAccounts = filteredAccounts.map(account => {
      return {
        active: account.get('id') === this.props.params.account,
        link: `/content/analytics/account/${this.props.params.brand}/${account.get('id')}`,
        name: account.get('name')
      }
    })
    return (
      <PageContainer hasSidebar={true} className="configuration-container">
        <Sidebar>
          <Analyses
            endDate={this.state.endDate}
            startDate={this.state.startDate}
            changeDateRange={this.changeDateRange}
            serviceTypes={this.props.serviceTypes}
            toggleServiceType={this.props.uiActions.toggleAnalysisServiceType}
            activeTab={this.state.activeTab}
            type="account"
            name={this.props.activeAccount ? this.props.activeAccount.get('name') : ''}
            navOptions={availableAccounts}/>
        </Sidebar>

        <Content>
          <Nav bsStyle="tabs" activeKey={this.state.activeTab} onSelect={this.changeTab}>
            <NavItem eventKey="traffic">Traffic</NavItem>
            <NavItem eventKey="visitors">Visitors</NavItem>
            <NavItem eventKey="sp-report">SP On/Off Net</NavItem>
            <NavItem eventKey="file-error">File Error</NavItem>
          </Nav>

          <div className="container-fluid analysis-container">
            {this.state.activeTab === 'traffic' ?
              <AnalysisTraffic fetching={this.props.trafficFetching}
                byTime={this.props.trafficByTime}
                byCountry={this.props.trafficByCountry}
                serviceTypes={this.props.serviceTypes}
                totalEgress={this.props.totalEgress}/>
              : ''}
            {this.state.activeTab === 'visitors' ?
              <AnalysisVisitors fetching={this.props.visitorsFetching}
                byTime={this.props.visitorsByTime}
                byCountry={this.props.visitorsByCountry.get('countries')}
                byBrowser={this.props.visitorsByBrowser.get('browsers')}
                byOS={this.props.visitorsByOS.get('os')}/>
              : ''}
            {this.state.activeTab === 'sp-report' ?
              <AnalysisSPReport fetching={false}
                serviceProviderStats={this.props.onOffNet}/>
              : ''}
            {this.state.activeTab === 'file-error' ?
              <AnalysisFileError fetching={false}/>
              : ''}
          </div>
        </Content>
      </PageContainer>
    );
  }
}

AccountAnalytics.displayName = 'AccountAnalytics'
AccountAnalytics.propTypes = {
  accountActions: React.PropTypes.object,
  accounts: React.PropTypes.instanceOf(Immutable.List),
  activeAccount: React.PropTypes.instanceOf(Immutable.Map),
  onOffNet: React.PropTypes.instanceOf(Immutable.Map),
  params: React.PropTypes.object,
  serviceTypes: React.PropTypes.instanceOf(Immutable.List),
  totalEgress: React.PropTypes.number,
  trafficActions: React.PropTypes.object,
  trafficByCountry: React.PropTypes.instanceOf(Immutable.List),
  trafficByTime: React.PropTypes.instanceOf(Immutable.List),
  trafficFetching: React.PropTypes.bool,
  uiActions: React.PropTypes.object,
  username: React.PropTypes.string,
  visitorsActions: React.PropTypes.object,
  visitorsByBrowser: React.PropTypes.instanceOf(Immutable.Map),
  visitorsByCountry: React.PropTypes.instanceOf(Immutable.Map),
  visitorsByOS: React.PropTypes.instanceOf(Immutable.Map),
  visitorsByTime: React.PropTypes.instanceOf(Immutable.List),
  visitorsFetching: React.PropTypes.bool
}

function mapStateToProps(state) {
  return {
    accounts: state.account.get('allAccounts'),
    activeAccount: state.account.get('activeAccount'),
    totalEgress: state.traffic.get('totalEgress'),
    serviceTypes: state.ui.get('analysisServiceTypes'),
    onOffNet: state.traffic.get('onOffNet'),
    trafficByCountry: state.traffic.get('byCountry'),
    trafficByTime: state.traffic.get('byTime'),
    trafficFetching: state.traffic.get('fetching'),
    username: state.user.get('username'),
    visitorsByBrowser: state.visitors.get('byBrowser'),
    visitorsByCountry: state.visitors.get('byCountry'),
    visitorsByOS: state.visitors.get('byOS'),
    visitorsByTime: state.visitors.get('byTime'),
    visitorsFetching: state.visitors.get('fetching')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    accountActions: bindActionCreators(accountActionCreators, dispatch),
    trafficActions: bindActionCreators(trafficActionCreators, dispatch),
    uiActions: bindActionCreators(uiActionCreators, dispatch),
    visitorsActions: bindActionCreators(visitorsActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountAnalytics);
