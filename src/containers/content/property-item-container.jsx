import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { createSelectorCreator, defaultMemoize } from 'reselect'
import { is, Map } from 'immutable'

import ContentItemChart from '../../components/content/content-item-chart'
import ContentItemList from '../../components/content/content-item-list'

import { getById as getPropertyById } from '../../redux/modules/entities/properties/selectors'

import { isTrialHost, getConfiguredName } from '../../util/helpers'
import { getAnalyticsUrlFromParams, getContentUrl } from '../../util/routes.js'


// const getMetrics =  (itemId) => {
//   return this.props.metrics.find(metric => metric.get(this.props.type) === item.get('id'),
//     null, Immutable.Map({ totalTraffic: 0 }))
// }
// const = getDailyTraffic = (itemId) {
//   return this.props.dailyTraffic.find(traffic => traffic.get(this.props.type) === item.get('id'),
//     null, Immutable.fromJS({ detail: [] }))
// }

//TODO: replace this with redux selector once storage metrics redux is ready in UDNP-2932
const getStorageMetricsById = () => Map()

/**
 * Creator for a memoized selector. TODO: Move this into the storage metrics redux selectors-file when it's done in UDNP-2932
 */
const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  is
)

/**
 * Make an own metrics-selector for every instance of this component to cache selector results per instance
 * TODO: Move this into the storage metrics redux selectors-file when it's done in UDNP-2932
 * @return {[function]} a function that when called, returns a memoized selector
 */
const makeGetMetrics = () => createDeepEqualSelector(
  getStorageMetricsById,
  metrics => metrics
)

const PropertyItemContainer = props => {

  const { published_host_id  } = props.entity.toJS()
  const { params, entity, roles, user } = props

  //const { bytes, historical_bytes } = props.entityMetrics.toJS()

  // const itemProps = {
  //   id,
  //   name,
  //   ...this.getTagText(userIsCloudProvider, item.get('provider_type'), isTrialHost),
  //   brightMode: isTrialHost,
  //   linkTo: this.props.nextPageURLBuilder(id, item),
  //   disableLinkTo: activeAccount.getIn(['provider_type']) === ACCOUNT_TYPE_SERVICE_PROVIDER,
  //   configurationLink: this.props.configURLBuilder ? this.props.configURLBuilder(id) : null,
  //   onConfiguration: this.getTier() === 'brand' || this.getTier() === 'account' ? () => {
  //     this.editItem(id)
  //   } : null,
  //   analyticsLink: this.props.analyticsURLBuilder(id),
  //   dailyTraffic: content.get('dailyTraffic').get('detail').reverse(),
  //   description: 'Desc',
  //   delete: this.props.deleteItem,
  //   primaryData: contentMetrics.get('traffic'),
  //   secondaryData: contentMetrics.get('historical_traffic'),
  //   differenceData: contentMetrics.get('historical_variance'),
  //   cacheHitRate: contentMetrics.get('avg_cache_hit_rate'),
  //   timeToFirstByte: contentMetrics.get('avg_ttfb'),
  //   maxTransfer: contentMetrics.getIn(['transfer_rates','peak'], '0.0 Gbps'),
  //   minTransfer: contentMetrics.getIn(['transfer_rates', 'lowest'], '0.0 Gbps'),
  //   avgTransfer: contentMetrics.getIn(['transfer_rates', 'average'], '0.0 Gbps'),
  //   fetchingMetrics: this.props.fetchingMetrics,
  //   chartWidth: scaledWidth.toString(),
  //   barMaxHeight: (scaledWidth / 7).toString(),
  //   showSlices: this.props.showSlices,
  //   isAllowedToConfigure: this.props.isAllowedToConfigure
  // }

  const analyticsURLBuilder = (property) => {
    return getAnalyticsUrlFromParams(
      {...props.params, property},
      user.get('currentUser'),
      roles
    )
  }

  const scaledWidth = 450
  const isTrial = isTrialHost( props.entity )

  //
  //const name = getConfiguredName( props.entity )

  if (!props.viewingChart) {
    return(
      <ContentItemList
        id={published_host_id}
        name={published_host_id}
        tagText={isTrial ? 'portal.configuration.details.deploymentMode.trial' : undefined}
        brightMode={isTrial}

        linkTo={getContentUrl('propertySummary', published_host_id, params)}
        configurationLink={getContentUrl('propertyConfiguration', published_host_id, params)}
        analyticsLink={analyticsURLBuilder(published_host_id)}

        isAllowedToConfigure={true}

        chartWidth={scaledWidth}
        barMaxHeight={(scaledWidth / 7).toString()}
        showSlices={true}
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
        configurationLink={getContentUrl('propertyConfiguration', published_host_id, params)}
        analyticsLink={analyticsURLBuilder(published_host_id)}

        isAllowedToConfigure={true}

        chartWidth={scaledWidth}
        barMaxHeight={(scaledWidth / 7).toString()}
        showSlices={true}
      />
  )
}

PropertyItemContainer.displayName = 'PropertyItemContainer'

PropertyItemContainer.propTypes = {
  entity: PropTypes.object,
  entityMetrics: PropTypes.object
}

PropertyItemContainer.defaultProps = {
  entity: Map()
}


/**
 * Make an own mapStateToProps for every instance of this component.
 * See https://github.com/reactjs/reselect#sharing-selectors-with-props-across-multiple-components
 * @return {[function]} mapStateToProps
 */
const makeStateToProps = () => {

  //const getMetrics = makeGetMetrics()

  const stateToProps = (state, { propertyId }) => {

    return {
      entity: getPropertyById(state, propertyId),
      //entityMetrics: getMetrics()

      user: state.user,
      roles: state.roles
    }
  }

  return stateToProps
}

export default connect(makeStateToProps)(PropertyItemContainer)
