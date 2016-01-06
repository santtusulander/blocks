import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Table, Modal, Button } from 'react-bootstrap';

import * as accountActionCreators from '../redux/modules/account'
import EditAccount from '../components/edit-account'

const Account = account =>
  <tr onClick={account.toggleActive}>
    <td>{account.id}</td>
    <td>{account.name}</td>
    <td>{account.description}</td>
  </tr>
Account.displayName = "Account"

export class Accounts extends React.Component {
  constructor(props) {
    super(props);

    this.changeActiveAccountValue = this.changeActiveAccountValue.bind(this)
    this.saveActiveAccountChanges = this.saveActiveAccountChanges.bind(this)
    this.toggleActiveAccount = this.toggleActiveAccount.bind(this)
    this.createNewAccount = this.createNewAccount.bind(this)
  }
  componentWillMount() {
    this.props.accountActions.startFetching()
    this.props.accountActions.fetchAccounts('udn')
  }
  toggleActiveAccount(id) {
    return () => {
      if(this.props.activeAccount && this.props.activeAccount.get('account_id') === id){
        this.props.accountActions.changeActiveAccount(null)
      }
      else {
        this.props.accountActions.fetchAccount('udn', id)
      }
    }
  }
  changeActiveAccountValue(valPath, value) {
    this.props.accountActions.changeActiveAccount(
      this.props.activeAccount.setIn(valPath, value)
    )
  }
  saveActiveAccountChanges() {
    this.props.accountActions.updateAccount('udn', this.props.activeAccount.toJS())
  }
  createNewAccount() {
    this.props.accountActions.createAccount('udn')
  }
  render() {
    const activeAccount = this.props.activeAccount
    return (
      <div className="container">
        <h1 className="page-header">Accounts</h1>
        <Button onClick={this.createNewAccount}>Add New</Button>
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {this.props.fetching ?
              <tr><td colSpan="3">Loading...</td></tr> :
              this.props.accounts.map((account, i) =>
                <Account key={i} id={account}
                  name="Name" description="Desc"
                  toggleActive={this.toggleActiveAccount(account)}/>
              )}
          </tbody>
        </Table>
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
  fetching: React.PropTypes.bool
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
