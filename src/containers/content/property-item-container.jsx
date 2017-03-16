import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Map, List } from 'immutable'
import d3 from 'd3'
import ContentItemChart from '../../components/content/content-item-chart'
import ContentItemList from '../../components/content/content-item-list'

import {
  getById as getPropertyById,
  getPropertyMetricsById,
  getPropertyDailyTrafficById,
  getTotalTraffics
} from '../../redux/modules/entities/properties/selectors'

import { isTrialHost } from '../../util/helpers'
import { getAnalyticsUrlFromParams, getContentUrl } from '../../util/routes.js'


/*const getPropertyMetricsById = (state, propertyId) => {

  const entity = getPropertyById(state, propertyId)
  const configuredName = getConfiguredName(entity)

  return state.metrics.get('hostMetrics').find( metric => metric.get('property') === configuredName )
}*/



const PropertyItemContainer = props => {

  const { published_host_id } = props.entity ? props.entity.toJS() : {}
  const { entityMetrics, dailyTraffic, totalTraffics, params, roles, user } = props

  const analyticsURLBuilder = (property) => {
    return getAnalyticsUrlFromParams(
      {...props.params, property},
      user.get('currentUser'),
      roles
    )
  }

  const isTrial = isTrialHost( props.entity )

  //Scale starbursts based on totalTraffic
  let trafficMin = Math.min(...totalTraffics)
  let trafficMax = Math.max(...totalTraffics)

  trafficMin = trafficMin == trafficMax ? trafficMin * 0.9 : trafficMin

  const rangeMin = 400
  const rangeMax = 500

  const trafficScale = d3.scale.linear()
    .domain([trafficMin, trafficMax])
    .range([rangeMin, rangeMax]);

  const totalTraffic = entityMetrics.get('totalTraffic')

  //set to smallest size if no totalTraffic in metricsData
  const scaledWidth = totalTraffic ? trafficScale( totalTraffic ) : rangeMin

  if (!props.viewingChart) {
    return(
      <ContentItemList
        id={published_host_id}
        name={published_host_id}
        tagText={isTrial ? 'portal.configuration.details.deploymentMode.trial' : undefined}
        brightMode={isTrial}

        linkTo={getContentUrl('propertySummary', published_host_id, params)}
        analyticsLink={analyticsURLBuilder(published_host_id)}
        configurationLink={getContentUrl('propertyConfiguration', published_host_id, params)}
        isAllowedToConfigure={true}

        primaryData={entityMetrics.get('traffic')}
        secondaryData={entityMetrics.get('historical_traffic')}
        differenceData={entityMetrics.get('historical_variance')}
        cacheHitRate={entityMetrics.get('avg_cache_hit_rate')}
        timeToFirstByte={entityMetrics.get('avg_ttfb')}
        maxTransfer={entityMetrics.getIn(['transfer_rates','peak'], '0.0 Gbps')}
        minTransfer={entityMetrics.getIn(['transfer_rates', 'lowest'], '0.0 Gbps')}
        avgTransfer={entityMetrics.getIn(['transfer_rates', 'average'], '0.0 Gbps')}

        dailyTraffic={dailyTraffic.get('detail') && dailyTraffic.get('detail').reverse()}
        showSlices={true}

        chartWidth={scaledWidth}
        barMaxHeight={(scaledWidth / 7).toString()}
      />
    )
  }

  return (
      <ContentItemChart
        id={published_host_id}
        name={published_host_id}
        tagText={isTrial ? 'portal.configuration.details.deploymentMode.trial' : undefined}
        brightMode={isTrial}

        linkTo={getContentUrl('propertySummary', published_host_id, params)}
        analyticsLink={analyticsURLBuilder(published_host_id)}
        configurationLink={getContentUrl('propertyConfiguration', published_host_id, params)}
        isAllowedToConfigure={true}

        primaryData={entityMetrics.get('traffic')}
        secondaryData={entityMetrics.get('historical_traffic')}
        differenceData={entityMetrics.get('historical_variance')}
        cacheHitRate={entityMetrics.get('avg_cache_hit_rate')}
        timeToFirstByte={entityMetrics.get('avg_ttfb')}
        maxTransfer={entityMetrics.getIn(['transfer_rates','peak'], '0.0 Gbps')}
        minTransfer={entityMetrics.getIn(['transfer_rates', 'lowest'], '0.0 Gbps')}
        avgTransfer={entityMetrics.getIn(['transfer_rates', 'average'], '0.0 Gbps')}

        dailyTraffic={dailyTraffic.get('detail') && dailyTraffic.get('detail').reverse()}
        showSlices={true}

        chartWidth={scaledWidth.toString()}
        barMaxHeight={(scaledWidth / 7).toString()}
      />
  )
}

PropertyItemContainer.displayName = 'PropertyItemContainer'

PropertyItemContainer.propTypes = {
  dailyTraffic: PropTypes.instanceOf(Map),
  entity: PropTypes.object,
  entityMetrics: PropTypes.object,
  params: PropTypes.object,
  roles: PropTypes.instanceOf(Map),
  totalTraffics: PropTypes.instanceOf(List),
  user: PropTypes.instanceOf(Map),
  viewingChart: PropTypes.bool
}

PropertyItemContainer.defaultProps = {
  dailyTraffic: Map(),
  entityMetrics: Map(),
  totalTraffics: List()
}


/**
 * Make an own mapStateToProps for every instance of this component.
 * See https://github.com/reactjs/reselect#sharing-selectors-with-props-across-multiple-components
 * @return {[function]} mapStateToProps
 */
const makeMapStateToProps = () => {

  const mapStateToProps = (state, { propertyId }) => {

    return {
      entity: getPropertyById(state, propertyId),
      entityMetrics: getPropertyMetricsById(state, propertyId),
      dailyTraffic: getPropertyDailyTrafficById(state, propertyId),
      totalTraffics: getTotalTraffics(state),
      user: state.user,
      roles: state.roles
    }
  }

  return mapStateToProps
}

export default connect(makeMapStateToProps)(PropertyItemContainer)
