import React, { PropTypes } from 'react'
import { fromJS, Map, List } from 'immutable'
import { Nav, Navbar } from 'react-bootstrap'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as accountActionCreators from '../redux/modules/account'
import * as groupActionCreators from '../redux/modules/group'

import PageHeader from '../components/layout/page-header'
import PageContainer from '../components/layout/page-container'
import Content from '../components/layout/content'
import Select from '../components/select.jsx'
import SSLList from '../components/security/ssl-list'

class Security extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    if(this.props.accounts.isEmpty()) {
      this.props.fetchAccountData(null, this.props.accounts)
    }
  }

  render() {
    const {
      accounts,
      activeAccount,
      params: { subPage }
    } = this.props
    const fakeCertificates = fromJS([
      {id: 1, title: 'SSL 1', commonName: '*.ufd.net', group: 'group 1'},
      {id: 2, title: 'SSL 2', commonName: '*.unifieddelivery.net', group: 'group 3'},
      {id: 3, title: 'SSL 1', commonName: '*.ufd.net', group: 'group 1'},
      {id: 4, title: 'SSL 2', commonName: '*.unifieddelivery.net', group: 'group 3'},
      {id: 5, title: 'SSL 1', commonName: '*.ufd.net', group: 'group 1'},
      {id: 6, title: 'SSL 2', commonName: '*.unifieddelivery.net', group: 'group 3'}
    ])
    const sslListProps = {
      certificates: fakeCertificates,
      uploadCertificate: () => {},
      deleteCertificate: () => {},
      editCertificate: () => {},
      onCheck: () => {}
    }
    const accountOptions = accounts.map(account => [account.get('id'), account.get('name')])
    return (
      <PageContainer className="account-management">
         <div className="account-management-system-users">
          <PageHeader>
            <h1 className="security-header-text">Security</h1>
            <div className='dns-filter-wrapper'>
              Account
              <Select
                className="dns-dropdowns"
                value={activeAccount && activeAccount.get('name')}
                options={accountOptions.toJS()}/>
            </div>
          </PageHeader>
          <Nav bsStyle="tabs" className="system-nav"
            activeKey={subPage}>
            <Navbar.Brand>
              <li className="subpage-navigation-link">
                <Link to="/security/ssl-certificate" activeClassName="active">SSL CERTIFICATE</Link>
              </li>
            </Navbar.Brand>
            <Navbar.Brand>
              <li className="subpage-navigation-link">
                <Link to="/security/token-authentication" activeClassName="active">TOKEN AUTHENTICATION</Link>
              </li>
            </Navbar.Brand>
            <Navbar.Brand>
              <li className="subpage-navigation-link">
                <Link to="/security/content-targeting" activeClassName="active">CONTENT TARGETING</Link>
              </li>
            </Navbar.Brand>
          </Nav>
          <Content className="tab-bodies">
            {subPage === 'ssl-certificate' && <SSLList { ...sslListProps }/>}
            {subPage === 'token-authentication' && <h3>token-authentication</h3>}
            {subPage === 'content-targeting' && <h3>content-targeting</h3>}
          </Content>
        </div>
      </PageContainer>
    )
  }
}

Security.defaultProps = {
  activeAccount: Map({})
}
Security.propTypes = {
  accounts: PropTypes.instanceOf(List),
  activeAccount: PropTypes.instanceOf(Map)
}


function mapStateToProps(state) {
  return {
    accounts: state.account.get('allAccounts'),
    activeAccount: state.account.get('activeAccount'),
    groups: state.group.get('allGroups')
  };
}

function mapDispatchToProps(dispatch) {
  const accountActions = bindActionCreators(accountActionCreators, dispatch)
  const groupActions = bindActionCreators(groupActionCreators, dispatch)
  function fetchAccountData(account, accounts) {
    if(accounts && accounts.isEmpty()) {
      accountActions.fetchAccounts('udn')
    }
    if(account) {
      accountActions.fetchAccount('udn', account)
      groupActions.fetchGroups('udn', account)
    }
  }

  return {
    fetchAccountData: fetchAccountData
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Security)
