import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import { FormattedMessage } from 'react-intl'
import { Map, List } from 'immutable'
import Tabs from '../../components/tabs'
import { Link } from 'react-router'

import { getSecurityUrlFromParams } from '../../util/routes'

import accountActions from '../../redux/modules/entities/accounts/actions'
import groupActions from '../../redux/modules/entities/groups/actions'

import {getById as getAccountById, getByBrand} from '../../redux/modules/entities/accounts/selectors'
import {getById as getGroupById } from '../../redux/modules/entities/groups/selectors'

import PageContainer from '../../components/shared/layout/page-container'
import SecurityPageHeader from '../../components/security/security-page-header'
import Content from '../../components/shared/layout/content'

import { getUrl } from '../../util/routes.js'

export class Security extends Component {
  componentWillMount() {
    const {brand, account, group} = this.props.params

    if (account) {
      this.props.fetchAccount({brand, id: account})
    } else {
      this.props.fetchAccounts({brand})
    }

    if (group) {
      this.props.fetchGroup({brand, account, id: group})
    } else {
      this.props.fetchGroups({brand, account})
    }
  }

  render() {
    const {
      accounts,
      activeAccount,
      fetchAccount,
      activeGroup,
      params
    } = this.props

    const itemSelectorFunc = (linkType, val, params) => {
      this.props.router.push(getUrl('/security', linkType, val, params))
    }

    const securityBaseUrl = getSecurityUrlFromParams(params);

    return (
      <Content>
        <SecurityPageHeader
          params={params}
          accounts={accounts}
          activeAccount={activeAccount && activeAccount.get('name')}
          activeGroup={activeGroup && activeGroup.get('name')}
          itemSelectorFunc={itemSelectorFunc}
          fetchAccount={fetchAccount}/>

        {!params.account
          ?
            <p className='text-center'>
              <FormattedMessage id="portal.security.selectAccount.text" />
            </p>
          :
            <div>
              <Tabs activeKey={this.props.children.props.route.path}>
                <li className="navbar">
                  <Link to={`${securityBaseUrl}/ssl-certificate`} activeClassName="active"><FormattedMessage id="portal.security.sslCertificate.text"/></Link>
                </li>
                <li className="navbar">
                  <Link to={`${securityBaseUrl}/token-authentication`} activeClassName="active"><FormattedMessage id="portal.security.tokenAuth.text"/></Link>
                </li>
                { /* HIDE FOR 1.1.1
                  <li className="navbar">
                  <Link to={`${securityBaseUrl}/content-targeting`} activeClassName="active"><FormattedMessage id="portal.security.contentTargeting.text"/></Link>
                </li> */}
              </Tabs>

              {/* Security Page TABS */}
              <PageContainer className="tab-bodies">
              {
                this.props.children && React.cloneElement(this.props.children, {
                  ...this.props
                })
              }
              </PageContainer>
            </div>
        }
      </Content>
    )
  }
}

Security.displayName = 'Security'

Security.propTypes = {
  accounts: PropTypes.instanceOf(List),
  activeAccount: PropTypes.instanceOf(Map),
  activeGroup: PropTypes.instanceOf(Map),
  children: PropTypes.object,
  fetchAccount: PropTypes.func,
  fetchAccounts: PropTypes.func,
  fetchGroup: PropTypes.func,
  fetchGroups: PropTypes.func,
  params: PropTypes.object,
  router: PropTypes.object
}

Security.defaultProps = {
  activeAccount: Map(),
  activeGroup: Map()
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAccount: (params) => dispatch(accountActions.fetchOne(params)),
    fetchAccounts: (params) => dispatch(accountActions.fetchAll(params)),
    fetchGroup: (params) => dispatch(groupActions.fetchOne(params)),
    fetchGroups: (params) => dispatch(groupActions.fetchAll(params))
  }
}

const mapStateToProps = (state, ownProps) => {
  const {brand, account, group} = ownProps.params

  return {
    accounts: getByBrand(state, brand),
    activeAccount: getAccountById(state, account),
    activeGroup: getGroupById(state, group)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Security))
