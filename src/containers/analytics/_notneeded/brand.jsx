import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import { Link } from 'react-router'
import * as accountActionCreators from '../../redux/modules/account'

class AnalyticsBrand extends React.Component {
  constructor(props){
    super(props)
  }

  componentDidMount(){
    console.log("Brand: componentDidMount()");
    console.log("TODO: fetchAccounts");

    this.props.accountActions.fetchAccounts(this.props.params.brand);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.params.brand !== this.props.params.brand) {
      this.props.accountActions.fetchAccounts(nextProps.params.brand);
    }
  }


  render() {
    return (
      <div>
        <h3>ACCOUNTS (should be dropdown)</h3>
      {
        this.props.accounts.map( account => {
          return (
            <p>
            <Link to={`/v2-analytics/${this.props.params.brand}/${account.get('id')}`}>
              {account.get('name')}
            </Link>
            </p>
          )
        })
      }


        { this.props.children || <p>Brands don't have analytics at the moment, choose account.</p>}


      </div>
    )
  }
}
function mapStateToProps(state) {
  return {
    accounts: state.account.get('allAccounts'),
    activeAccount: state.account.get('activeAccount')
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    accountActions: bindActionCreators(accountActionCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticsBrand);
