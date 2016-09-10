import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as accountActionCreators from '../redux/modules/account'

import PageContainer from '../components/layout/page-container'
import Content from '../components/layout/content'
import ServicesPageHeader from '../components/services/services-page-header'

export class Services extends React.Component {
  constructor(props) {
    super (props);
  }

  render() {

    const { accounts, fetchAccount, activeAccount } = this.props;

    return (
      <Content>
        <ServicesPageHeader
          params={this.props.params}
          accounts={accounts}
          activeAccount={activeAccount.get ('name')}
          fetchAccount={fetchAccount}/>
        {/*Not in 0.8.1*/}
        {/*{this.renderContent(certificateFormProps, sslListProps)}*/}
        <p className='text-center'>Coming soon!</p>
      </Content>
    )
  }
}

Services.displayName = 'Services'

Services.propTypes = {
  accounts: PropTypes.instanceOf (List),
  activeAccount: PropTypes.instanceOf (Map),
  fetchAccount: PropTypes.func,
  params: PropTypes.object
}

function mapStateToProps(state, ownProps) {
  return {
    accounts: state.account.get ('allAccounts'),
    activeAccount: state.account.get ('activeAccount') || Map ({}),
    groups: state.group.get ('allGroups')
  };
}

function mapDispatchToProps(dispatch) {
  const fetchAccount = bindActionCreators (accountActionCreators, dispatch).fetchAccount

  return {
    fetchAccount
  };
}

export default connect (mapStateToProps, mapDispatchToProps) (Services)
