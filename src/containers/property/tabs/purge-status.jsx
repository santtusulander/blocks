import React from 'react'
import { Map, List, fromJS } from 'immutable'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import * as accountActionCreators from '../../../redux/modules/account'
import * as groupActionCreators from '../../../redux/modules/group'
import * as hostActionCreators from '../../../redux/modules/host'
import * as purgeActionCreators from '../../../redux/modules/purge'
import * as uiActionCreators from '../../../redux/modules/ui'

import PageContainer from '../../../components/layout/page-container'
import PurgeHistoryReport from '../../../components/content/property/purge-status'

const fakeHistoryData = fromJS([
  {
    status: 'in progress',
    start_time: moment().unix(),
    end_time: moment().add(7, 'days').unix(),
    initiated_by: 'Some User',
    description: 'Some User'
  },
  {
    status: 'in progress',
    start_time: moment().unix(),
    end_time: moment().add(7, 'days').unix(),
    initiated_by: 'Some User',
    description: 'Some User'
  },
  {
    status: 'in progress',
    start_time: moment().unix(),
    end_time: moment().add(7, 'days').unix(),
    initiated_by: 'Some User',
    description: 'Some User'
  },
  {
    status: 'in progress',
    start_time: moment().unix(),
    end_time: moment().add(7, 'days').unix(),
    initiated_by: 'Some User',
    description: 'Some User'
  },
  {
    status: 'in progress',
    start_time: moment().unix(),
    end_time: moment().add(7, 'days').unix(),
    initiated_by: 'Some User',
    description: 'Some User'
  },
  {
    status: 'in progress',
    start_time: moment().unix(),
    end_time: moment().add(7, 'days').unix(),
    initiated_by: 'Some User',
    description: 'Some User'
  }
]);


class PurgeStatus extends React.Component {

  constructor(props) {
    super(props)

    this.state = {}

    this.fetchData = this.fetchData.bind(this)
  }

  componentWillMount() {
    //this.fetchData(this.props.params)
  }

  fetchData(params) {
    const { purgeActions } = this.props
    const { brand, account, group, property } = params

    purgeActions.fetchAllPurges(brand, account, group, property)
  }

  render() {
    return (
      <PageContainer className="property-container">
        <PurgeHistoryReport
          historyData={fakeHistoryData}
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
  params: {},
  properties: List()
}

PurgeStatus.propTypes = {
  activeAccount: React.PropTypes.instanceOf(Map),
  activeGroup: React.PropTypes.instanceOf(Map),
  activeHost: React.PropTypes.instanceOf(Map),
  activePurge: React.PropTypes.instanceOf(Map),
  allPurges: React.PropTypes.instanceOf(List),
  params: React.PropTypes.object,
  properties: React.PropTypes.instanceOf(List),
  purgeActions: React.PropTypes.object
}

function mapStateToProps(state) {
  return {
    activeAccount: state.account.get('activeAccount'),
    activeGroup: state.group.get('activeGroup'),
    activeHost: state.host.get('activeHost'),
    activeHostConfiguredName: state.host.get('activeHostConfiguredName'),
    activePurge: state.purge.get('activePurge'),
    allPurges: state.purge.get('allPurges'),
    fetching: state.host.get('fetching'),
    properties: state.host.get('allHosts')
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
