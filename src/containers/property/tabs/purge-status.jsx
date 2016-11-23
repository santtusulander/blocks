import React from 'react'
import { Map, List } from 'immutable'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { bindActionCreators } from 'redux'

import * as accountActionCreators from '../../../redux/modules/account'
import * as groupActionCreators from '../../../redux/modules/group'
import * as hostActionCreators from '../../../redux/modules/host'
import * as purgeActionCreators from '../../../redux/modules/purge'
import * as uiActionCreators from '../../../redux/modules/ui'

import PageContainer from '../../../components/layout/page-container'
import PurgeHistoryReport from '../../../components/content/property/purge-status'

class PurgeStatus extends React.Component {

  constructor(props) {
    super(props)

    this.state = {}

    this.fetchData = this.fetchData.bind(this)
  }

  componentWillMount() {
    this.fetchData(this.props.params)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params !== this.props.params) {
      this.fetchData(nextProps.params)
    }
  }

  fetchData(params) {
    const { purgeActions } = this.props
    const { brand, account, group, property } = params
    purgeActions.startFetching()
    purgeActions.fetchPurgeObjects(brand, account, group, { published_host_id: property })
  }

  render() {

    const { fetching, purgeObjects } = this.props

    return (
      <PageContainer className="property-container">
        <PurgeHistoryReport
          fetching={fetching}
          historyData={purgeObjects}
        />
      </PageContainer>
    )
  }
}

PurgeStatus.displayName = 'PurgeStatus'

PurgeStatus.defaultProps = {
  activeAccount: Map(),
  activeGroup: Map(),
  activeHost: Map(),
  activePurge: Map(),
  allPurges: List(),
  fetching: false,
  params: {},
  properties: List(),
  purgeObjects: List()
}

PurgeStatus.propTypes = {
  activeAccount: React.PropTypes.instanceOf(Map),
  activeGroup: React.PropTypes.instanceOf(Map),
  activeHost: React.PropTypes.instanceOf(Map),
  activePurge: React.PropTypes.instanceOf(Map),
  allPurges: React.PropTypes.instanceOf(List),
  fetching: React.PropTypes.bool,
  params: React.PropTypes.object,
  properties: React.PropTypes.instanceOf(List),
  purgeActions: React.PropTypes.object,
  purgeObjects: React.PropTypes.instanceOf(List)
}

function mapStateToProps(state) {
  return {
    activeAccount: state.account.get('activeAccount'),
    activeGroup: state.group.get('activeGroup'),
    activeHost: state.host.get('activeHost'),
    activeHostConfiguredName: state.host.get('activeHostConfiguredName'),
    activePurge: state.purge.get('activePurge'),
    allPurges: state.purge.get('allPurges'),
    fetching: state.purge.get('fetching'),
    properties: state.host.get('allHosts'),
    purgeObjects: state.purge.get('purgeObjects')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    accountActions: bindActionCreators(accountActionCreators, dispatch),
    groupActions: bindActionCreators(groupActionCreators, dispatch),
    hostActions: bindActionCreators(hostActionCreators, dispatch),
    purgeActions: bindActionCreators(purgeActionCreators, dispatch),
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PurgeStatus));
