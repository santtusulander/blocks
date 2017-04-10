import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router'
import { Map } from 'immutable'
import { FormattedMessage } from 'react-intl'

import { getById as getAccountById } from '../../redux/modules/entities/accounts/selectors'

import { getSupportUrlFromParams } from '../../util/routes'
import PageContainer from '../../components/shared/layout/page-container'
import Content from '../../components/shared/layout/content'
import SupportPageHeader from '../../components/support/support-page-header'
import Tabs from '../../components/shared/page-elements/tabs'

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
    const routes = this.props.routes
    const activeKey = routes[routes.length - 1].path

    return (
      <div>
        <SupportPageHeader {...this.props} />
        <Tabs activeKey={activeKey}>
          <li data-eventKey="tickets">
            <Link to={baseUrl + '/tickets'} activeClassName="active">
              <FormattedMessage id="portal.support.tabs.TICKETS.text"/>
            </Link>
          </li>
          {/*Hide for 1.0 release
          <li eventKey="tools">
            <Link to={baseUrl + '/tools'} activeClassName="active">
              <FormattedMessage id="portal.support.tabs.TOOLS.text"/>
            </Link>
          </li>*/}
          <li data-eventKey="documentation">
            <Link to={baseUrl + '/documentation'} activeClassName="active">
              <FormattedMessage id="portal.support.tabs.DOCUMENTATION.text"/>
            </Link>
          </li>
        </Tabs>
        <Content>
          {this.renderTabContent(children)}
        </Content>
      </div>
    )
  }
}

Support.displayName = 'Support'
Support.propTypes = {
  // activeAccount: React.PropTypes.instanceOf(Map),
  children: PropTypes.node,
  // currentUser: React.PropTypes.instanceOf(Map),
  params: PropTypes.object,
  // router: PropTypes.object,
  routes: PropTypes.array
}

Support.defaultProps = {
  activeAccount: Map(),
  currentUser: Map()
}

function mapStateToProps(state, ownProps) {
  return {
    activeAccount: getAccountById(state, ownProps.params.account),
    currentUser: state.user.get('currentUser')
  };
}

export default connect(mapStateToProps)(withRouter(Support))
