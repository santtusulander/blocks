import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Modal, Button, ButtonGroup, BreadcrumbItem, Breadcrumb } from 'react-bootstrap';

import * as accountActionCreators from '../redux/modules/account'
import EditAccount from '../components/edit-account'
import ContentItemList from '../components/content-item-list'
import ContentItemChart from '../components/content-item-chart'

export class Accounts extends React.Component {
  constructor(props) {
    super(props);

    this.changeActiveAccountValue = this.changeActiveAccountValue.bind(this)
    this.saveActiveAccountChanges = this.saveActiveAccountChanges.bind(this)
    this.toggleActiveAccount = this.toggleActiveAccount.bind(this)
    this.createNewAccount = this.createNewAccount.bind(this)
    this.changeActiveView = this.changeActiveView.bind(this)
    this.state = {
      activeView: 'chart'
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
  render() {
    const activeAccount = this.props.activeAccount
    return (
      <div className="container-fluid">
        <header className="content-header clearfix">
          <h1>Accounts</h1>
          <Breadcrumb>
            <BreadcrumbItem>Content</BreadcrumbItem>
          </Breadcrumb>

          <div className="pull-right">
            <Button onClick={this.createNewAccount}>Add New</Button>

            <ButtonGroup>
              <Button onClick={this.changeActiveView('chart')}
                active={this.state.activeView === 'chart'}>Chart</Button>
              <Button onClick={this.changeActiveView('list')}
                active={this.state.activeView === 'list'}>List</Button>
            </ButtonGroup>
          </div>
        </header>

        {this.state.activeView === 'chart' ?
          (this.props.fetching ?
            <p>Loading...</p> :
            this.props.accounts.map((accountChart, i) =>
              <ContentItemChart key={i} id={accountChart}
                name="Name" description="Desc"
                toggleActive={this.toggleActiveAccount(accountChart)}
                delete={this.deleteAccount}/>
            )
          ) : this.state.activeView === 'list' &&
            (this.props.fetching ?
            <p>Loading...</p> :
            this.props.accounts.map((account, i) =>
              <ContentItemList key={i} id={account}
                name="Name" description="Desc"
                toggleActive={this.toggleActiveAccount(account)}
                delete={this.deleteAccount}/>
            )
          )
        }

        {activeAccount ?
          <Modal show={true}
            onHide={this.toggleActiveAccount(activeAccount.get('account_id'))}>
            <Modal.Header closeButton={true}>
              <Modal.Title>Edit Account</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <EditAccount account={activeAccount}
                changeValue={this.changeActiveAccountValue}
                saveChanges={this.saveActiveAccountChanges}/>
            </Modal.Body>
          </Modal> : null
        }
      </div>
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
