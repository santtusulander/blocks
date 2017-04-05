import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { bindActionCreators } from 'redux'
import { FormattedMessage } from 'react-intl'
import SectionHeader from '../../../components/shared/layout/section-header'
import SectionContainer from '../../../components/shared/layout/section-container'
import LoadingSpinner from '../../../components/loading-spinner/loading-spinner'

import AnalysisCacheHitRate from '../../../components/analysis/cache-hit-rate.jsx'

import * as trafficActionCreators from '../../../redux/modules/traffic'

import { buildAnalyticsOpts, changedParamsFiltersQS } from '../../../util/helpers.js'

class AnalyticsTabCacheHitRate extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.fetchData(
      this.props.params,
      this.props.filters,
      this.props.location,
      this.props.activeHostConfiguredName
    )
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.filters !== nextProps.filters ||
        changedParamsFiltersQS(this.props, nextProps) ||
        this.props.activeHostConfiguredName !== nextProps.activeHostConfiguredName) {
      this.fetchData(
        nextProps.params,
        nextProps.filters,
        nextProps.location,
        nextProps.activeHostConfiguredName
      )
    }
  }

  fetchData(params, filters, location, hostConfiguredName) {
    const fetchOpts  = buildAnalyticsOpts(params, filters, location)

    const trafficParams = {
      account: params.account,
      startDate: fetchOpts.startDate,
      endDate: fetchOpts.endDate,
      service_type: fetchOpts.service_type,
      field_filters: 'timestamp,chit_ratio',
      granularity: 'day'
    }

    if (params.group) {
      trafficParams.group = params.group;
    }

    if (params.property) {
      trafficParams.property = hostConfiguredName || params.property;
    }

    this.props.trafficActions.fetchTraffic(trafficParams);
  }

  render() {
    const { traffic, fetching } = this.props

    if (!traffic.size) {
      return (
        <div>
          {!fetching ?
            <div>
              <SectionHeader sectionHeaderTitle={<FormattedMessage id="portal.analytics.cacheHitRateByDay.text" />} />
              <h4><FormattedMessage id="portal.common.no-data.text" /></h4>
            </div>
          :
            <div>
              <SectionContainer>
                <LoadingSpinner />
              </SectionContainer>
            </div>
          }
        </div>
      )
    }

    return (
      <div>
        <AnalysisCacheHitRate
          traffic={traffic}
          dateRange={this.props.filters.get('dateRangeLabel')}
          fetching={fetching}
          serviceTypes={this.props.filters.get('serviceTypes')}
        />
      </div>
    )
  }
}

AnalyticsTabCacheHitRate.displayName = "AnalyticsTabCacheHitRate"
AnalyticsTabCacheHitRate.propTypes = {
  activeHostConfiguredName: React.PropTypes.string,
  fetching: React.PropTypes.bool,
  filters: React.PropTypes.instanceOf(Immutable.Map),
  location: React.PropTypes.object,
  params: React.PropTypes.object,
  traffic: React.PropTypes.instanceOf(Immutable.List),
  trafficActions: React.PropTypes.object
}

AnalyticsTabCacheHitRate.defaultProps = {
  filters: Immutable.Map(),
  traffic: Immutable.List(),
  trafficByTime: Immutable.Map()
}

const mapStateToProps = (state) => ({
  activeHostConfiguredName: state.host.get('activeHostConfiguredName'),
  fetching: state.traffic.get('fetching'),
  filters: state.filters.get('filters'),
  traffic: state.traffic.get('traffic'),
  trafficByTime: state.traffic.getIn(['byTime', 'details'])
})

function mapDispatchToProps(dispatch) {
  return {
    trafficActions: bindActionCreators(trafficActionCreators, dispatch)
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AnalyticsTabCacheHitRate));
