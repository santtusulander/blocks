import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'

import { FormattedMessage } from 'react-intl'
import { Map, List } from 'immutable'
import Tabs from '../../components/tabs'
import { Link } from 'react-router'

import { getSecurityUrlFromParams } from '../../util/routes'
import * as accountActionCreators from '../../redux/modules/account'

import PageContainer from '../../components/layout/page-container'
import SecurityPageHeader from '../../components/security/security-page-header'
import Content from '../../components/layout/content'

import { getUrl } from '../../util/routes.js'

export class Security extends React.Component {
  render() {
    const {
      accounts,
      activeAccount,
      fetchAccount,
      groups,
      params
    } = this.props

    const activeGroup = groups.find(obj => obj.get('id') === Number(params.group))

    const itemSelectorFunc = (linkType, val) => {
      this.props.router.push(getUrl('/security', linkType, val, this.props.params))
    }

    const securityBaseUrl = getSecurityUrlFromParams(params);

    if (!params.account) {
      return (
        <Content className="tab-bodies">
          <p className='text-center'>Please select an account<br/>
            from top left to see security</p>
        </Content>
      )
    }

    return (
      <Content>
        <SecurityPageHeader
          params={params}
          accounts={accounts}
          activeAccount={activeAccount && activeAccount.get('name')}
          activeGroup={activeGroup && activeGroup.get('name')}
          itemSelectorFunc={itemSelectorFunc}
          fetchAccount={fetchAccount}/>

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

          <PageContainer className="tab-bodies">
          {
            this.props.children && React.cloneElement(this.props.children, {
              ...this.props
            })
          }
          </PageContainer>
      </Content>
    )
  }
}

Security.propTypes = {
  accounts: PropTypes.instanceOf(List),
  activeAccount: PropTypes.instanceOf(Map),
  children: PropTypes.object,
  fetchAccount: PropTypes.func,
  groups: PropTypes.instanceOf(List),
  params: PropTypes.object,
  router: PropTypes.object
}

const mapDispatchToProps = (dispatch) => {
  const fetchAccount = bindActionCreators(accountActionCreators, dispatch).fetchAccount
  return {
    fetchAccount
  }
}

const mapStateToProps = (state) => {
  return {
    accounts: state.account.get('allAccounts'),
    activeAccount: state.account.get('activeAccount'),
    groups: state.group.get('allGroups')
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Security))
