import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Table, Modal, Button, ButtonGroup } from 'react-bootstrap';

import * as accountActionCreators from '../redux/modules/account'
import EditAccount from '../components/edit-account'
import AccountTable from '../components/account-table'
import AccountChart from '../components/account-chart'

export class Accounts extends React.Component {
  constructor(props) {
    super(props);

    this.changeActiveAccountValue = this.changeActiveAccountValue.bind(this)
    this.saveActiveAccountChanges = this.saveActiveAccountChanges.bind(this)
    this.toggleActiveAccount = this.toggleActiveAccount.bind(this)
    this.createNewAccount = this.createNewAccount.bind(this)
    this.changeActiveView = this.changeActiveView.bind(this)
    this.state = {
      activeView: 'Table'
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
  changeActiveView(e) {
    this.setState({
      activeView: e.target.innerText
    })
  }
  render() {
    const activeAccount = this.props.activeAccount
    let content = this.state.activeView === 'Table' ?
    (<Table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Description</th>
          <th>&nbsp;</th>
        </tr>
      </thead>
      <tbody>
        {this.props.fetching ?
          <tr><td colSpan="4">Loading...</td></tr> :
          this.props.accounts.map((account, i) =>
            <AccountTable key={i} id={account}
              name="Name" description="Desc"
              toggleActive={this.toggleActiveAccount(account)}
              delete={this.deleteAccount}/>
          )
        }
      </tbody>
    </Table>) : this.state.activeView === 'Grid' &&
    (this.props.fetching ?
      <p>Loading...</p> :
      this.props.accounts.map((accountChart, i) =>
        <AccountChart key={i} id={accountChart}
          name="Name" description="Desc"
          toggleActive={this.toggleActiveAccount(accountChart)}
          delete={this.deleteAccount}/>
      )
    )
    return (
      <div className="container-fluid">
        <header className="content-header">
          <ButtonGroup>
            <Button onClick={this.changeActiveView} active={this.state.activeView === 'Table'}>Table</Button>
            <Button onClick={this.changeActiveView} active={this.state.activeView === 'Grid'}>Grid</Button>
          </ButtonGroup>

          <h1 className="page-header">Accounts</h1>
          <Button onClick={this.createNewAccount}>Add New</Button>
        </header>

        {content}

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
