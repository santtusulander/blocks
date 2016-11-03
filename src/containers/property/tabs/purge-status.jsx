import React from 'react'
import Immutable from 'immutable'
import { Col, Row } from 'react-bootstrap';
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { bindActionCreators } from 'redux'
import numeral from 'numeral'
import moment from 'moment'

import * as accountActionCreators from '../../../redux/modules/account'
import * as groupActionCreators from '../../../redux/modules/group'
import * as hostActionCreators from '../../../redux/modules/host'
import * as metricsActionCreators from '../../../redux/modules/metrics'
import * as purgeActionCreators from '../../../redux/modules/purge'
import * as trafficActionCreators from '../../../redux/modules/traffic'
import * as uiActionCreators from '../../../redux/modules/ui'
import * as visitorsActionCreators from '../../../redux/modules/visitors'

import PageContainer from '../../../components/layout/page-container'
import AnalysisByTime from '../../../components/analysis/by-time'
import DateRangeSelect from '../../../components/date-range-select'
import Tooltip from '../../../components/tooltip'

import { formatBitsPerSecond } from '../../../util/helpers'

import DateRanges from '../../../constants/date-ranges'
import { paleblue } from "../../../constants/colors";

class PurgeStatus extends React.Component {

  constructor(props){
    super(props)

    this.state = {}

  }
  componentWillMount() {}

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  componentWillUnmount() {}

  render() {
    return (
      <PageContainer className="property-container">
        <h1>Purgestatus</h1>
      </PageContainer>
    )
  }
}

PurgeStatus.displayName = 'PurgeStatus'
PurgeStatus.propTypes = {
  account: React.PropTypes.string,
  accountActions: React.PropTypes.object,
  activeAccount: React.PropTypes.instanceOf(Immutable.Map),
  activeGroup: React.PropTypes.instanceOf(Immutable.Map),
  activeHost: React.PropTypes.instanceOf(Immutable.Map),
  activeHostConfiguredName: React.PropTypes.string,
  activePurge: React.PropTypes.instanceOf(Immutable.Map),
  brand: React.PropTypes.string,
  dailyTraffic: React.PropTypes.instanceOf(Immutable.List),
  description: React.PropTypes.string,
  fetching: React.PropTypes.bool,
  fetchingMetrics: React.PropTypes.bool,
  group: React.PropTypes.string,
  groupActions: React.PropTypes.object,
  hostActions: React.PropTypes.object,
  hourlyTraffic: React.PropTypes.instanceOf(Immutable.Map),
  id: React.PropTypes.string,
  location: React.PropTypes.object,
  metricsActions: React.PropTypes.object,
  name: React.PropTypes.string,
  params: React.PropTypes.object,
  properties: React.PropTypes.instanceOf(Immutable.List),
  purgeActions: React.PropTypes.object,
  router: React.PropTypes.object,
  trafficActions: React.PropTypes.object,
  trafficFetching: React.PropTypes.bool,
  uiActions: React.PropTypes.object,
  visitorsActions: React.PropTypes.object,
  visitorsByCountry: React.PropTypes.instanceOf(Immutable.Map),
  visitorsFetching: React.PropTypes.bool
}
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
    dailyTraffic: state.metrics.get('hostDailyTraffic'),
    fetching: state.host.get('fetching'),
    fetchingMetrics: state.metrics.get('fetchingHostMetrics'),
    hourlyTraffic: state.metrics.get('hostHourlyTraffic'),
    properties: state.host.get('allHosts'),
    trafficFetching: state.traffic.get('fetching'),
    visitorsByCountry: state.visitors.get('byCountry'),
    visitorsFetching: state.traffic.get('fetching')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    accountActions: bindActionCreators(accountActionCreators, dispatch),
    groupActions: bindActionCreators(groupActionCreators, dispatch),
    hostActions: bindActionCreators(hostActionCreators, dispatch),
    metricsActions: bindActionCreators(metricsActionCreators, dispatch),
    purgeActions: bindActionCreators(purgeActionCreators, dispatch),
    trafficActions: bindActionCreators(trafficActionCreators, dispatch),
    uiActions: bindActionCreators(uiActionCreators, dispatch),
    visitorsActions: bindActionCreators(visitorsActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PurgeStatus));
