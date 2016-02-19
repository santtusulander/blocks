import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Modal, Button, ButtonToolbar } from 'react-bootstrap';
import { Link } from 'react-router'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import * as accountActionCreators from '../redux/modules/account'
import * as uiActionCreators from '../redux/modules/ui'
import EditAccount from '../components/edit-account'
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
  {timestamp: new Date("2016-01-31"), bytes: 24675, requests: 435},
  {timestamp: new Date("2016-02-01"), bytes: 34766, requests: 546},
  {timestamp: new Date("2016-02-02"), bytes: 34766, requests: 546},
  {timestamp: new Date("2016-02-03"), bytes: 34675, requests: 435},
  {timestamp: new Date("2016-02-04"), bytes: 34336, requests: 345},
  {timestamp: new Date("2016-02-05"), bytes: 33456, requests: 567},
  {timestamp: new Date("2016-02-06"), bytes: 36756, requests: 244},
  {timestamp: new Date("2016-02-07"), bytes: 35466, requests: 455},
  {timestamp: new Date("2016-02-08"), bytes: 33456, requests: 233},
  {timestamp: new Date("2016-02-09"), bytes: 37454, requests: 544},
  {timestamp: new Date("2016-02-10"), bytes: 44766, requests: 546},
  {timestamp: new Date("2016-02-11"), bytes: 44675, requests: 435},
  {timestamp: new Date("2016-02-12"), bytes: 44336, requests: 456},
  {timestamp: new Date("2016-02-13"), bytes: 53456, requests: 567},
  {timestamp: new Date("2016-02-14"), bytes: 56756, requests: 244},
  {timestamp: new Date("2016-02-15"), bytes: 55466, requests: 455},
  {timestamp: new Date("2016-02-16"), bytes: 53456, requests: 456},
  {timestamp: new Date("2016-02-17"), bytes: 57454, requests: 544},
  {timestamp: new Date("2016-02-18"), bytes: 53456, requests: 233},
  {timestamp: new Date("2016-02-19"), bytes: 57454, requests: 544},
  {timestamp: new Date("2016-02-20"), bytes: 44766, requests: 546},
  {timestamp: new Date("2016-02-21"), bytes: 44675, requests: 435},
  {timestamp: new Date("2016-02-22"), bytes: 44336, requests: 456},
  {timestamp: new Date("2016-02-23"), bytes: 43456, requests: 567},
  {timestamp: new Date("2016-02-24"), bytes: 46756, requests: 244},
  {timestamp: new Date("2016-02-25"), bytes: 45466, requests: 455},
  {timestamp: new Date("2016-02-26"), bytes: 43456, requests: 456},
  {timestamp: new Date("2016-02-27"), bytes: 37454, requests: 544},
  {timestamp: new Date("2016-02-28"), bytes: 33456, requests: 456}
]

const fakeAverageData = [
  {timestamp: new Date("2016-01-01"), bytes: 39405, requests: 943},
  {timestamp: new Date("2016-01-02"), bytes: 34766, requests: 546},
  {timestamp: new Date("2016-01-03"), bytes: 34675, requests: 435},
  {timestamp: new Date("2016-01-04"), bytes: 34336, requests: 345},
  {timestamp: new Date("2016-01-05"), bytes: 33456, requests: 567},
  {timestamp: new Date("2016-01-06"), bytes: 36756, requests: 244},
  {timestamp: new Date("2016-01-07"), bytes: 35466, requests: 455},
  {timestamp: new Date("2016-01-08"), bytes: 33456, requests: 233},
  {timestamp: new Date("2016-01-09"), bytes: 37454, requests: 544},
  {timestamp: new Date("2016-01-10"), bytes: 44766, requests: 546},
  {timestamp: new Date("2016-01-11"), bytes: 44675, requests: 435},
  {timestamp: new Date("2016-01-12"), bytes: 44336, requests: 456},
  {timestamp: new Date("2016-01-13"), bytes: 53456, requests: 567},
  {timestamp: new Date("2016-01-14"), bytes: 56756, requests: 244},
  {timestamp: new Date("2016-01-15"), bytes: 55466, requests: 455},
  {timestamp: new Date("2016-01-16"), bytes: 53456, requests: 456},
  {timestamp: new Date("2016-01-17"), bytes: 57454, requests: 544},
  {timestamp: new Date("2016-01-18"), bytes: 53456, requests: 233},
  {timestamp: new Date("2016-01-19"), bytes: 57454, requests: 544},
  {timestamp: new Date("2016-01-20"), bytes: 44766, requests: 546},
  {timestamp: new Date("2016-01-21"), bytes: 44675, requests: 435},
  {timestamp: new Date("2016-01-22"), bytes: 44336, requests: 456},
  {timestamp: new Date("2016-01-23"), bytes: 43456, requests: 567},
  {timestamp: new Date("2016-01-24"), bytes: 46756, requests: 244},
  {timestamp: new Date("2016-01-25"), bytes: 45466, requests: 455},
  {timestamp: new Date("2016-01-26"), bytes: 43456, requests: 456},
  {timestamp: new Date("2016-01-27"), bytes: 37454, requests: 544},
  {timestamp: new Date("2016-01-28"), bytes: 33456, requests: 456},
  {timestamp: new Date("2016-01-29"), bytes: 37454, requests: 544},
  {timestamp: new Date("2016-01-30"), bytes: 33456, requests: 233},
  {timestamp: new Date("2016-01-31"), bytes: 34675, requests: 435},
  {timestamp: new Date("2016-02-01"), bytes: 44766, requests: 546},
  {timestamp: new Date("2016-02-02"), bytes: 44766, requests: 546},
  {timestamp: new Date("2016-02-03"), bytes: 44675, requests: 435},
  {timestamp: new Date("2016-02-04"), bytes: 44336, requests: 345},
  {timestamp: new Date("2016-02-05"), bytes: 43456, requests: 567},
  {timestamp: new Date("2016-02-06"), bytes: 46756, requests: 244},
  {timestamp: new Date("2016-02-07"), bytes: 45466, requests: 455},
  {timestamp: new Date("2016-02-08"), bytes: 43456, requests: 233},
  {timestamp: new Date("2016-02-09"), bytes: 47454, requests: 544},
  {timestamp: new Date("2016-02-10"), bytes: 54766, requests: 546},
  {timestamp: new Date("2016-02-11"), bytes: 54675, requests: 435},
  {timestamp: new Date("2016-02-12"), bytes: 54336, requests: 456},
  {timestamp: new Date("2016-02-13"), bytes: 53456, requests: 567},
  {timestamp: new Date("2016-02-14"), bytes: 56756, requests: 244},
  {timestamp: new Date("2016-02-15"), bytes: 55466, requests: 455},
  {timestamp: new Date("2016-02-16"), bytes: 43456, requests: 456},
  {timestamp: new Date("2016-02-17"), bytes: 57454, requests: 544},
  {timestamp: new Date("2016-02-18"), bytes: 53456, requests: 233},
  {timestamp: new Date("2016-02-19"), bytes: 57454, requests: 544},
  {timestamp: new Date("2016-02-20"), bytes: 54766, requests: 546},
  {timestamp: new Date("2016-02-21"), bytes: 44675, requests: 435},
  {timestamp: new Date("2016-02-22"), bytes: 44336, requests: 456},
  {timestamp: new Date("2016-02-23"), bytes: 23456, requests: 567},
  {timestamp: new Date("2016-02-24"), bytes: 26756, requests: 244},
  {timestamp: new Date("2016-02-25"), bytes: 25466, requests: 455},
  {timestamp: new Date("2016-02-26"), bytes: 23456, requests: 456},
  {timestamp: new Date("2016-02-27"), bytes: 27454, requests: 544},
  {timestamp: new Date("2016-02-28"), bytes: 23456, requests: 456}
]

export class Accounts extends React.Component {
  constructor(props) {
    super(props);

    this.changeActiveAccountValue = this.changeActiveAccountValue.bind(this)
    this.saveActiveAccountChanges = this.saveActiveAccountChanges.bind(this)
    this.toggleActiveAccount = this.toggleActiveAccount.bind(this)
    this.createNewAccount = this.createNewAccount.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.state = {
      activeFilter: 'traffic_high_to_low'
    }
  }
  componentWillMount() {
    this.props.accountActions.startFetching()
    this.props.accountActions.fetchAccounts(this.props.params.brand)
  }
  toggleActiveAccount(id) {
    return () => {
      if(this.props.activeAccount && this.props.activeAccount.get('account_id') === id){
        this.props.accountActions.changeActiveAccount(null)
      }
      else {
        this.props.accountActions.fetchAccount(this.props.params.brand, id)
      }
    }
  }
  changeActiveAccountValue(valPath, value) {
    this.props.accountActions.changeActiveAccount(
      this.props.activeAccount.setIn(valPath, value)
    )
  }
  saveActiveAccountChanges() {
    this.props.accountActions.updateAccount(this.props.params.brand, this.props.activeAccount.toJS())
  }
  createNewAccount() {
    this.props.accountActions.createAccount(this.props.params.brand)
  }
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
    const activeAccount = this.props.activeAccount
    return (
      <PageContainer className='accounts-container content-subcontainer'>
        <Content>
          <PageHeader>
            <ButtonToolbar className="pull-right">
              <Button bsStyle="success" className="btn-icon">
                <Link to={`/analysis/`}>
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

            <p>BRAND CONTENT SUMMARY</p>
            <h1>Accounts</h1>
          </PageHeader>

          <div className="container-fluid body-content">
            {this.props.fetching ? <p>Loading...</p> : (
              <ReactCSSTransitionGroup
                component="div"
                className="content-transition"
                transitionName="content-transition"
                transitionEnterTimeout={400}
                transitionLeaveTimeout={500}>
                {this.props.viewingChart ?
                  <div className="content-item-grid" key="grid">
                    {this.props.accounts.map((account, i) =>
                      <ContentItemChart key={i} id={account.get('id')}
                        linkTo={`/content/groups/${this.props.params.brand}/${account.get('id')}`}
                        name={account.get('name')} description="Desc"
                        delete={this.deleteAccount}
                        primaryData={fakeRecentData}
                        secondaryData={fakeAverageData}
                        barWidth="1"
                        chartWidth="560"
                        barMaxHeight="80" />
                    )}
                  </div> :
                  <div className="content-item-lists" key="lists">
                    {this.props.accounts.map((account, i) =>
                      <ContentItemList key={i} id={account.get('id')}
                        linkTo={`/content/groups/${this.props.params.brand}/${account.get('id')}`}
                        name={account.get('name')} description="Desc"
                        toggleActive={this.toggleActiveAccount(account)}
                        delete={this.deleteAccount}
                        primaryData={fakeRecentData}
                        secondaryData={fakeAverageData}/>
                    )}
                  </div>
                }
              </ReactCSSTransitionGroup>
            )}

            {activeAccount ?
              <Modal show={true} dialogClassName="configuration-sidebar"
                backdrop={false}
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
            }
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
  params: React.PropTypes.object,
  uiActions: React.PropTypes.object,
  viewingChart: React.PropTypes.bool
}

function mapStateToProps(state) {
  return {
    activeAccount: state.account.get('activeAccount'),
    accounts: state.account.get('allAccounts'),
    fetching: state.account.get('fetching'),
    viewingChart: state.ui.get('viewingChart')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    accountActions: bindActionCreators(accountActionCreators, dispatch),
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Accounts);
