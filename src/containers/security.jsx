import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { Nav, Navbar } from 'react-bootstrap'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as accountActionCreators from '../redux/modules/account'
import * as securityActionCreators from '../redux/modules/security'

import PageHeader from '../components/layout/page-header'
import PageContainer from '../components/layout/page-container'
import Content from '../components/layout/content'
import Select from '../components/select.jsx'
import SSLList from '../components/security/ssl-list'

class Security extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    this.props.fetchListData(this.props.params.subPage)
    this.props.fetchAccountData(this.props.accounts)
  }
  render() {
    const {
      accounts,
      activeAccount,
      fetchAccount,
      sslCertificates,
      params: { subPage }
    } = this.props
    const sslListProps = {
      certificates: sslCertificates && sslCertificates.get('items'),
      uploadCertificate: () => {},
      deleteCertificate: () => {},
      editCertificate: () => {},
      onCheck: () => {}
    }
    const changeActiveAccount = brand => id => fetchAccount(brand, id)
    const accountOptions = accounts.map(account => [account.get('id'), account.get('name')])
    return (
      <PageContainer className="account-management">
         <div className="account-management-system-users">
          <PageHeader>
            <h1 className="security-header-text">Security</h1>
            <div className='dns-filter-wrapper'>
              Account
              <Select
                onSelect={changeActiveAccount('udn')}
                className="dns-dropdowns"
                value={activeAccount.get('id')}
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
  activeAccount: Map({ id: 1, name: 'Account1' })
}
Security.propTypes = {
  accounts: PropTypes.instanceOf(List),
  activeAccount: PropTypes.instanceOf(Map),
  fetchAccount: PropTypes.func,
  fetchAccountData: PropTypes.func,
  fetchListData: PropTypes.func,
  params: PropTypes.object,
  sslCertificates: PropTypes.instanceOf(Map)
}


function mapStateToProps(state) {
  const activeAccount = state.account.get('activeAccount')
  const accountId = activeAccount ? activeAccount.get('id') : 1
  const sslCertificates = state.security.get('sslCertificates').find(item => item.get('account') === accountId)
  return {
    accounts: state.account.get('allAccounts'),
    activeAccount,
    sslCertificates
  };
}

function mapDispatchToProps(dispatch) {
  const accountActions = bindActionCreators(accountActionCreators, dispatch)
  const securityActions = bindActionCreators(securityActionCreators, dispatch)
  function fetchListData(activeTab) {
    switch(activeTab) {
      case 'ssl-certificate':
        securityActions.fetchSSLCertificates()
        break
      // case 'token-authentication':  securityActions.fetchTokenAuthentication(account)
      // case 'content-targeting': securityActions.fetchTokenAuthentication(account)
      default: break
    }
  }
  function fetchAccountData(accounts) {
    if(accounts && accounts.isEmpty()) {
      accountActions.fetchAccounts('udn')
    }
  }

  return {
    fetchListData: fetchListData,
    fetchAccountData: fetchAccountData,
    fetchAccount: accountActions.fetchAccount
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Security)
