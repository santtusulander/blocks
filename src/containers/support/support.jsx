import React, { PropTypes } from 'react'
import { Nav } from 'react-bootstrap'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router'
import { Map } from 'immutable'

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
            Please select an account
            <br/>
            from top left to see support tickets
          </p>
        </div>
      )
    } else {
      return (
        <div className="support-tab-container">
          {children && React.cloneElement(children, {...this.props})}
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
          {/* TODO: enable the tab navigation when the tools and documentation sections have been designed */}
          {false && <Nav bsStyle="tabs" className="system-nav">
            <li className="navbar">
              <Link to={baseUrl + '/tickets'} activeClassName="active">TICKETS</Link>
            </li>
            <li className="navbar">
              <Link to={baseUrl + '/tools'} activeClassName="active">TOOLS</Link>
            </li>
            <li className="navbar">
              <Link to={baseUrl + '/documentation'} activeClassName="active">DOCUMENTATION</Link>
            </li>
          </Nav>}
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
  router: PropTypes.object,
  user: React.PropTypes.instanceOf(Map)
}

Support.defaultProps = {
  activeAccount: Map(),
  user: Map()
}

function mapStateToProps(state) {
  return {
    activeAccount: state.account.get('activeAccount'),
    user: state.user
  };
}

export default connect(mapStateToProps)(withRouter(Support))
