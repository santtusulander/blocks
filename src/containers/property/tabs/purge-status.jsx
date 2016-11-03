import React from 'react'
import Immutable from 'immutable'
import { fromJS } from 'immutable'
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
PurgeStatus.propTypes = {}
PurgeStatus.defaultProps = {
  activeAccount: Immutable.Map(),
  activeGroup: Immutable.Map(),
  activeHost: Immutable.Map(),
  activePurge: Immutable.Map(),
  dailyTraffic: Immutable.List(),
  hourlyTraffic: Immutable.fromJS({
    now: [],
    history: []
  }),
  properties: Immutable.List(),
  visitorsByCountry: Immutable.Map()
}

function mapStateToProps(state) {
  return {
    activeAccount: state.account.get('activeAccount'),
    activeGroup: state.group.get('activeGroup'),
    activeHost: state.host.get('activeHost'),
    activeHostConfiguredName: state.host.get('activeHostConfiguredName'),
    activePurge: state.purge.get('activePurge'),
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
