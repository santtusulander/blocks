import React, { PropTypes } from 'react'
import { Nav } from 'react-bootstrap'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router'
import { Map } from 'immutable'
import { FormattedMessage } from 'react-intl'

import { getSupportUrlFromParams } from '../../util/helpers'
import PageContainer from '../../components/layout/page-container'
import Content from '../../components/layout/content'
import SupportPageHeader from '../../components/support/support-page-header'

import './support.scss'

class Support extends React.Component {

  renderTabContent(children) {
    const { params } = this.props;

    if (!params.account) {
      return (
        <div className="support-tab-container">
          <p className="text-center">
            <FormattedMessage id="portal.user.list.accountNotSelected.text" values={{br: <br/>}}/>
          </p>
        </div>
      )
    } else {
      return (
        <div className="support-tab-container">
          {children && React.cloneElement(children, { ...this.props })}
        </div>
      )
    }
  }

  render() {
    const {
      children,
      params
    } = this.props;
    const baseUrl = getSupportUrlFromParams(params);

    return (
      <PageContainer>
        <div className="account-support">
          <SupportPageHeader {...this.props} />
          <Nav bsStyle="tabs">
            <li className="navbar">
              <Link to={baseUrl + '/tickets'} activeClassName="active">
                <FormattedMessage id="portal.support.tabs.TICKETS.text"/>
              </Link>
            </li>
            <li className="navbar">
              <Link to={baseUrl + '/tools'} activeClassName="active">
                <FormattedMessage id="portal.support.tabs.TOOLS.text"/>
              </Link>
            </li>
            <li className="navbar">
              <Link to={baseUrl + '/documentation'} activeClassName="active">
                <FormattedMessage id="portal.support.tabs.DOCUMENTATION.text"/>
              </Link>
            </li>
          </Nav>
        </div>
        <Content>
          {this.renderTabContent(children)}
        </Content>
      </PageContainer>
    )
  }
}

Support.displayName = 'Support'
Support.propTypes = {
  activeAccount: React.PropTypes.instanceOf(Map),
  children: PropTypes.node,
  params: PropTypes.object,
  router: PropTypes.object
}

Support.defaultProps = {
  activeAccount: Map()
}

function mapStateToProps(state) {
  return {
    activeAccount: state.account.get('activeAccount')
  };
}

export default connect(mapStateToProps)(withRouter(Support))
