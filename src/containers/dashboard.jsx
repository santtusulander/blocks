import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import PageContainer from '../components/layout/page-container'
import Content from '../components/layout/content'
import PageHeader from '../components/layout/page-header'
import SelectWrapper from '../components/select-wrapper'

import * as dashboardActionCreators from '../redux/modules/dashboard'

export class Dashboard extends React.Component {
  constructor(props) {
    super(props)

    this.fetchData = this.fetchData.bind(this)
  }

  componentDidMount() {
    this.fetchData()
  }

  componentWillReceiveProps() {
    this.fetchData()
  }

  fetchData() {
    this.props.dashboardActions.fetchDashboard()
  }

  render() {
    return (
      <Content>
        <PageHeader pageSubTitle="Dashboard">
          <h1>{this.props.activeAccount ? this.props.activeAccount.get('name') : 'Account'}</h1>
        </PageHeader>
        <PageHeader secondaryPageHeader={true}>
          <div className="action">
            <h5>Date Range</h5>
            <SelectWrapper options={[[1, 'Last 24 Hours']]} value={1}/>
          </div>
        </PageHeader>
        <PageContainer>
          {/* TODO: Add content as part of UDNP-1708 */}
          Coming soon!
        </PageContainer>
      </Content>
    )
  }
}

Dashboard.displayName = 'Dashboard'
Dashboard.propTypes = {
  activeAccount: React.PropTypes.instanceOf(Immutable.Map),
  dashboardActions: React.PropTypes.object
}

Dashboard.defaultProps = {
  activeAccount: Immutable.Map()
}

function mapStateToProps(state) {
  return {
    activeAccount: state.account.get('activeAccount')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dashboardActions: bindActionCreators(dashboardActionCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
