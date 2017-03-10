import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { createSelectorCreator, defaultMemoize } from 'reselect'
import { is, Map } from 'immutable'

import { getById as getPropertyById } from '../../redux/modules/entities/properties/selectors'

import ContentItemChart from '../../components/content/content-item-chart'

const mockMetrics = {
  bytes: {
    ending: 108000497044939,
    peak: 71963080986145,
    low: 36037416058794,
    average: 54000248522470,
    percent_change: 50.00
  },
  historical_bytes: {
    ending: 108000497044939,
    peak: 71963080986145,
    low: 36037416058794,
    average: 54000248522470,
    percent_change: 50.00
  }
}

//TODO: replace this with redux selector once storage metrics redux is ready in UDNP-2932
const getStorageMetricsById = () => Map(mockMetrics)

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

  const { published_host_id,  } = props.entity.toJS()
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

  return (
      <ContentItemChart
        name={published_host_id}
      />
  )
}

PropertyItemContainer.displayName = 'PropertyItemContainer'

PropertyItemContainer.propTypes = {
  entity: PropTypes.object,
  entityMetrics: PropTypes.object
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
      entityMetrics: state.metrics
    }
  }

  return stateToProps
}

export default connect(makeStateToProps)(PropertyItemContainer)
