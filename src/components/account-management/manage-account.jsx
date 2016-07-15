import React from 'react'
import { Nav, Dropdown } from 'react-bootstrap'
import Immutable from 'immutable'
import { withRouter, Link } from 'react-router'

import { getRoute } from '../../routes.jsx'
import PageHeader from '../layout/page-header'
import Account from './account/account'
import Groups from './account/groups'
import Users from './account/users'
import UDNButton from '../button.js'
import IconAdd from '../icons/icon-add.jsx'
import IconTrash from '../icons/icon-trash.jsx'
import Content from '../layout/content'

import AccountSelector from '../global-account-selector/global-account-selector.jsx'

import { getUrl, getAccountManagementUrlFromParams, getTabName } from '../../util/helpers.js'
import { ACCOUNT_TYPES } from '../../constants/account-management-options'
import { ADD_ACCOUNT, DELETE_ACCOUNT } from '../../constants/account-management-modals.js'

class AccountManagementManageAccount extends React.Component {
  constructor(props) {
    super(props)
    this.renderTabs = this.renderTabs.bind(this)
  }
  renderTabs(detailsTabProps, groupsTabProps, usersTabProps) {
    const params = this.props.params;
    const subPage = getTabName(this.props.location.pathname)
    const baseUrl = getAccountManagementUrlFromParams(params);
    if (!params.account) {
      return null
    }

    return (
      <div>
        <Nav bsStyle="tabs" className="system-nav">
          <li className="navbar">
            <Link to={baseUrl + '/details'} activeClassName="active">ACCOUNT</Link>
          </li>
          <li className="navbar">
            <Link to={baseUrl + '/groups'} activeClassName="active">GROUPS</Link>
          </li>
          <li className="navbar">
            <Link to={baseUrl + '/users'} activeClassName="active">USERS</Link>
          </li>
        </Nav>
        <Content className="tab-bodies">
          {subPage === 'details' && <Account { ...detailsTabProps }/>}
          {subPage === 'groups' && <Groups { ...groupsTabProps }/>}
          {subPage === 'users' && <Users { ...usersTabProps }/>}
       </Content>
      </div>
    )
  }
  render() {
    const { account, isAdmin, toggleModal, router, route, params, addGroup, editGroup, deleteGroup, groups } = this.props
    const subPage = getTabName(this.props.location.pathname)
    const baseUrl = getAccountManagementUrlFromParams(params);
    const accountType = ACCOUNT_TYPES.find(type => account.get('provider_type') === type.value)
    const usersTabProps = { account, isAdmin }
    const groupsTabProps = { addGroup, deleteGroup, editGroup, groups }
    const detailsTabProps = {
      toggleModal,
      params,
      route,
      account,
      isAdmin,
      initialValues: {
        accountName: account.get('name'),
        brand: 'udn',
        services: account.get('services'),
        accountType: accountType && accountType.value
      },
      onSave: this.props.editAccount
    }
    return (
      <div className="account-management-manage-account">
        <PageHeader>
          <AccountSelector
            params={{ brand: 'udn' }}
            restrictedTo="brand"
            topBarTexts={{ brand: 'UDN Admin' }}
            topBarAction={() => router.push(`${baseUrl}/${subPage}`)}
            onSelect={(...params) => router.push(`${getUrl(getRoute('accountManagement'), ...params)}/${subPage}`)}>
            <Dropdown.Toggle bsStyle="link" className="header-toggle">
              <h1>{account.get('name') || 'No active account'}</h1>
            </Dropdown.Toggle>
        </AccountSelector>
        <div className="account-management-manage-account__actions">
          <UDNButton bsStyle="success"
                     pageHeaderBtn={true}
                     icon={true}
                     addNew={true}
                     onClick={() => toggleModal(ADD_ACCOUNT)}>
            <IconAdd/>
          </UDNButton>
          <UDNButton bsStyle="secondary"
                     pageHeaderBtn={true}
                     icon={true}
                     addNew={true}
                     onClick={() => toggleModal(DELETE_ACCOUNT)}>
            <IconTrash/>
          </UDNButton>
        </div>
        </PageHeader>
        {this.renderTabs(detailsTabProps, groupsTabProps, usersTabProps)}
      </div>
    );
  }
}

AccountManagementManageAccount.displayName = 'AccountManagementManageAccount'
AccountManagementManageAccount.propTypes = {
  account: React.PropTypes.instanceOf(Immutable.Map),
  addGroup: React.PropTypes.func,
  deleteAccount: React.PropTypes.func,
  deleteGroup: React.PropTypes.func,
  editAccount: React.PropTypes.func,
  editGroup: React.PropTypes.func,
  groups: React.PropTypes.instanceOf(Immutable.List),
  isAdmin: React.PropTypes.bool,
  toggleModal: React.PropTypes.func
}
AccountManagementManageAccount.defaultProps = {
  account: Immutable.Map({}),
  groups: Immutable.List([])
}

export default withRouter(AccountManagementManageAccount)
