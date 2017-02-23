import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'
import { FormattedMessage } from 'react-intl'
import PROVIDER_TYPES from '../../../constants/provider-types.js'

import AnalysisOnOffNetReport from '../../../components/analysis/on-off-net-report.jsx'

import * as trafficActionCreators from '../../../redux/modules/traffic'
import { buildAnalyticsOpts, changedParamsFiltersQS } from '../../../util/helpers.js'
import { userHasRole } from '../../../util/helpers'


class AnalyticsTabOnOffNet extends React.Component {
  componentDidMount() {
    this.fetchData(
      this.props.params,
      this.props.filters,
      this.props.location,
      this.props.activeHostConfiguredName
    )
  }

  componentWillReceiveProps(nextProps){
    if(changedParamsFiltersQS(this.props, nextProps) ||
      this.props.activeHostConfiguredName !== nextProps.activeHostConfiguredName) {
      this.fetchData(
        nextProps.params,
        nextProps.filters,
        nextProps.location,
        nextProps.activeHostConfiguredName
      )
    }
  }

  fetchData(params, filters, location, hostConfiguredName){
    if(params.property && hostConfiguredName) {
      params = Object.assign({}, params, {
        property: hostConfiguredName
      })
    }
    const fetchOpts = buildAnalyticsOpts(params, filters, location)

    const onOffOpts = Object.assign({}, fetchOpts)
    onOffOpts.granularity = 'day'

    const onOffTodayOpts = Object.assign({}, onOffOpts)
    onOffTodayOpts.startDate = moment().utc().startOf('day').format('X'),
    onOffTodayOpts.endDate = moment().utc().format('X')

    this.props.trafficActions.fetchOnOffNet(onOffOpts)
    this.props.trafficActions.fetchOnOffNetToday(onOffTodayOpts)
  }

  render(){
    const { activeAccount, currentUser } = this.props

    // Check for Cloud Providers / UDN Admins
    if (userHasRole(currentUser, PROVIDER_TYPES.CLOUD_PROVIDER) &&
        (!activeAccount || activeAccount.get('provider_type') !== PROVIDER_TYPES.SERVICE_PROVIDER)) {
      return (
        <div className="text-center">
          <FormattedMessage id="portal.analytics.selectServiceProviderAccount.text" values={{ br: <br/> }}/>
        </div>
      )
    }

    return (
      <AnalysisOnOffNetReport
        dateRangeLabel={this.props.filters.get('dateRangeLabel')}
        fetching={this.props.fetching}
        onOffNetChartType={this.props.onOffNetChartType}
        onOffStats={this.props.onOffStats}
        onOffStatsToday={this.props.onOffStatsToday}
        onOffFilter={this.props.filters.get('onOffNet')}
        dateRange={this.props.filters.get('dateRange')}
      />
    )
  }
}

AnalyticsTabOnOffNet.displayName = "AnalyticsTabOnOffNet"
AnalyticsTabOnOffNet.propTypes = {
  activeAccount: React.PropTypes.instanceOf(Immutable.Map),
  activeHostConfiguredName: React.PropTypes.string,
  currentUser: React.PropTypes.instanceOf(Immutable.Map),
  fetching: React.PropTypes.bool,
  filters: React.PropTypes.instanceOf(Immutable.Map),
  location: React.PropTypes.object,
  onOffNetChartType: React.PropTypes.string,
  onOffStats: React.PropTypes.instanceOf(Immutable.Map),
  onOffStatsToday: React.PropTypes.instanceOf(Immutable.Map),
  params: React.PropTypes.object,
  trafficActions: React.PropTypes.object
}

AnalyticsTabOnOffNet.defaultProps = {
  filters: Immutable.Map(),
  onOffStats: Immutable.Map(),
  onOffStatsToday: Immutable.Map()
}

function mapStateToProps(state) {
  return {
    activeAccount: state.account.get('activeAccount'),
    activeHostConfiguredName: state.host.get('activeHostConfiguredName'),
    currentUser: state.user.get('currentUser'),
    fetching: state.traffic.get('fetching'),
    filters: state.filters.get('filters'),
    onOffNetChartType: state.ui.get('analysisOnOffNetChartType'),
    onOffStats: state.traffic.get('onOffNet'),
    onOffStatsToday: state.traffic.get('onOffNetToday')
  }
}

function mapDispatchToProps(dispatch) {
  return {
    trafficActions: bindActionCreators(trafficActionCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticsTabOnOffNet);
