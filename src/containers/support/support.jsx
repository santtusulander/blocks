import React, { PropTypes } from 'react'
import { Nav } from 'react-bootstrap'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router'
import { Map } from 'immutable'
import { FormattedMessage } from 'react-intl'

import { getSupportUrlFromParams } from '../../util/routes'
import PageContainer from '../../components/layout/page-container'
import Content from '../../components/layout/content'
import SupportPageHeader from '../../components/support/support-page-header'

class Support extends React.Component {

  renderTabContent(children) {

    // Disabled for the 1.0 release - you should not have to select an account
    // just to see a link to ZenDesk or the documentation PDFs
    //
    // const { params } = this.props;
    //
    // if (!params.account) {
    //   return (
    //     <PageContainer>
    //       <p className="text-center">
    //         <FormattedMessage id="portal.user.list.accountNotSelected.text" values={{br: <br/>}}/>
    //       </p>
    //     </PageContainer>
    //   )
    // } else {
    //   return (
    //     <PageContainer>
    //       {children && React.cloneElement(children, { ...this.props })}
    //     </PageContainer>
    //   )
    // }

    return (
      <PageContainer>
        {children && React.cloneElement(children, { ...this.props })}
      </PageContainer>
    )
  }

  render() {
    const {
      children,
      params
    } = this.props;
    const baseUrl = getSupportUrlFromParams(params);

    return (
      <div>
        <SupportPageHeader {...this.props} />
        <Nav bsStyle="tabs">
          <li className="navbar">
            <Link to={baseUrl + '/tickets'} activeClassName="active">
              <FormattedMessage id="portal.support.tabs.TICKETS.text"/>
            </Link>
          </li>
          {/*Hide for 1.0 release
          <li className="navbar">
            <Link to={baseUrl + '/tools'} activeClassName="active">
              <FormattedMessage id="portal.support.tabs.TOOLS.text"/>
            </Link>
          </li>*/}
          <li className="navbar">
            <Link to={baseUrl + '/documentation'} activeClassName="active">
              <FormattedMessage id="portal.support.tabs.DOCUMENTATION.text"/>
            </Link>
          </li>
        </Nav>
        <Content>
          {this.renderTabContent(children)}
        </Content>
      </div>
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
