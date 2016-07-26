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
  render() {
    const {
      params
    } = this.props;
    const baseUrl = getSupportUrlFromParams(params);

    return (
      <PageContainer>
        <div className="account-support">
          <SupportPageHeader {...this.props} />
          {params.account && <Nav bsStyle="tabs" className="system-nav">
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
          <div className="container-fluid">
            {this.props.children && React.cloneElement(this.props.children, {})}
          </div>
        </Content>
      </PageContainer>
    )
  }
}

Support.displayName = 'Support'
Support.defaultProps = {
  user: Map()
}

Support.propTypes = {
  activeAccount: React.PropTypes.instanceOf(Map),
  children: PropTypes.node,
  params: PropTypes.object,
  router: PropTypes.object,
  user: React.PropTypes.instanceOf(Map)
}

function mapStateToProps(state) {
  return {
    activeAccount: state.account.get('activeAccount') || Map({}),
    user: state.user
  };
}

export default connect(mapStateToProps)(withRouter(Support))
