import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Modal, Button, ButtonToolbar } from 'react-bootstrap';
import { Link } from 'react-router'

import * as accountActionCreators from '../redux/modules/account'
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
  {bytes: 25287}, {bytes: 75693}, {bytes: 56217}, {bytes: 37567}, {bytes: 68967},
  {bytes: 59482}, {bytes: 39528}, {bytes: 44277}, {bytes: 23870}, {bytes: 38097},
  {bytes: 34104}, {bytes: 34667}, {bytes: 45348}, {bytes: 75675}, {bytes: 31596},
  {bytes: 72447}, {bytes: 40786}, {bytes: 48403}, {bytes: 37584}, {bytes: 20450},
  {bytes: 29754}, {bytes: 25254}, {bytes: 76117}, {bytes: 62423}, {bytes: 21843},
  {bytes: 36684}, {bytes: 63311}, {bytes: 62746}, {bytes: 25277}, {bytes: 77866},
  {bytes: 63733}, {bytes: 63783}, {bytes: 67777}, {bytes: 27648}, {bytes: 52272},
  {bytes: 55867}, {bytes: 25465}, {bytes: 39901}, {bytes: 76743}, {bytes: 33717},
  {bytes: 39363}, {bytes: 49430}, {bytes: 44985}, {bytes: 22980}, {bytes: 57023},
  {bytes: 29188}, {bytes: 77510}, {bytes: 47095}, {bytes: 22737}, {bytes: 46752},
  {bytes: 74066}, {bytes: 69258}, {bytes: 22229}, {bytes: 71488}, {bytes: 78918}
]

const fakeAverageData = [
  {bytes: 34667}, {bytes: 45348}, {bytes: 75675}, {bytes: 31596}, {bytes: 72447},
  {bytes: 40786}, {bytes: 48403}, {bytes: 52272}, {bytes: 55867}, {bytes: 25465},
  {bytes: 39901}, {bytes: 77866}, {bytes: 59482}, {bytes: 39528}, {bytes: 44277},
  {bytes: 37584}, {bytes: 20450}, {bytes: 22980}, {bytes: 57023}, {bytes: 29188},
  {bytes: 67777}, {bytes: 27648}, {bytes: 76743}, {bytes: 33717}, {bytes: 39363},
  {bytes: 78918}, {bytes: 66433}, {bytes: 77510}, {bytes: 47095}, {bytes: 22737},
  {bytes: 29754}, {bytes: 25254}, {bytes: 76117}, {bytes: 46752}, {bytes: 74066},
  {bytes: 69258}, {bytes: 22229}, {bytes: 62423}, {bytes: 21843}, {bytes: 36684},
  {bytes: 63311}, {bytes: 62746}, {bytes: 25277}, {bytes: 23870}, {bytes: 38097},
  {bytes: 63733}, {bytes: 63783}, {bytes: 25287}, {bytes: 49430}, {bytes: 44985},
  {bytes: 71488}, {bytes: 75693}, {bytes: 56217}, {bytes: 37567},{bytes: 68967}
]

export class Accounts extends React.Component {
  constructor(props) {
    super(props);

    this.changeActiveAccountValue = this.changeActiveAccountValue.bind(this)
    this.saveActiveAccountChanges = this.saveActiveAccountChanges.bind(this)
    this.toggleActiveAccount = this.toggleActiveAccount.bind(this)
    this.createNewAccount = this.createNewAccount.bind(this)
    this.changeActiveView = this.changeActiveView.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.state = {
      activeView: 'chart',
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
  changeActiveView(type) {
    return () => {
      this.setState({
        activeView: type
      })
    }
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
      <PageContainer>
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
                (this.state.activeView === 'chart' ? ' hidden' : '')}
                onClick={this.changeActiveView('chart')}>
                <IconItemChart/>
              </Button>
              <Button bsStyle="primary" className={'btn-icon toggle-view' +
                (this.state.activeView === 'list' ? ' hidden' : '')}
                onClick={this.changeActiveView('list')}>
                <IconItemList/>
              </Button>
            </ButtonToolbar>

            <p>BRAND CONTENT SUMMARY</p>
            <h1>Accounts</h1>
          </PageHeader>

          <div className="container-fluid">

            {this.state.activeView === 'chart' ?
              (this.props.fetching ?
                <p>Loading...</p> :
                <div className="content-item-grid">
                  {this.props.accounts.map((account, i) =>
                    <ContentItemChart key={i} id={account}
                      linkTo={`/content/groups/${this.props.params.brand}/${account}`}
                      name="Name" description="Desc"
                      delete={this.deleteAccount}
                      primaryData={fakeRecentData}
                      secondaryData={fakeAverageData}
                      barWidth="1"
                      chartWidth="560"
                      barMaxHeight="80" />
                  )}
                </div>
              ) : this.state.activeView === 'list' &&
                (this.props.fetching ?
                <p>Loading...</p> :
                this.props.accounts.map((account, i) =>
                  <ContentItemList key={i} id={account}
                    linkTo={`/content/groups/${this.props.params.brand}/${account}`}
                    name="Name" description="Desc"
                    toggleActive={this.toggleActiveAccount(account)}
                    delete={this.deleteAccount}
                    primaryData={fakeRecentData}
                    secondaryData={fakeAverageData}/>
                )
              )
            }

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
  params: React.PropTypes.object
}

function mapStateToProps(state) {
  return {
    activeAccount: state.account.get('activeAccount'),
    accounts: state.account.get('allAccounts'),
    fetching: state.account.get('fetching')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    accountActions: bindActionCreators(accountActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Accounts);
