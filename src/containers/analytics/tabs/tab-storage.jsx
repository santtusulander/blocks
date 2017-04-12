import React, { Component } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import numeral from 'numeral'
import { FormattedMessage } from 'react-intl'

import AnalysisStorage from '../../../components/analysis/storage'

import { fetchMetrics } from '../../../redux/modules/entities/storage-metrics/actions'
import { getByAccountId, getByGroupId, getByStorageId, getDataForStorageAnalysisChart } from '../../../redux/modules/entities/storage-metrics/selectors'
import { getByAccount as getGroupsByAccount } from '../../../redux/modules/entities/groups/selectors'

import storageActions from '../../../redux/modules/entities/CIS-ingest-points/actions'
import groupActions from '../../../redux/modules/entities/groups/actions'

import { accountIsContentProviderType, buildAnalyticsOpts, formatBytes } from '../../../util/helpers'

class AnalyticsTabStorage extends Component {
  constructor(props) {
    super(props)

    this.formatTotals = this.formatTotals.bind(this)
  }

  componentWillMount() {
    const { params, filters, location, fetchStorageMetrics } = this.props
    const fetchOpts = buildAnalyticsOpts(params, filters, location)

    fetchStorageMetrics({include_history: true, list_children: false, ...fetchOpts})

    if (params.storage) {
      this.props.fetchOneCISIngestPoint({brand: params.brand, account: params.account, group: params.group, id: params.storage})
    } else if (params.group) {
      this.props.fetchAllCISIngestPoints(params)
    } else {
      if (this.props.groups && !this.props.groups.isEmpty()) {
        this.props.groups.forEach((group) => {
          const groupId = group.get('id')
          this.props.fetchAllCISIngestPoints({brand: this.props.params.brand, account: this.props.params.account, group: groupId})
        })
      } else {
        this.props.fetchAllGroups(params)
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { params, filters, location, groups} = this.props

    const fetchOpts = buildAnalyticsOpts(params, filters, location)
    const nextFetchOpts = buildAnalyticsOpts(nextProps.params, nextProps.filters, nextProps.location)

    if (nextProps.params.account !== params.account) {
      nextProps.fetchAllGroups(nextProps.params)
    }

    if (!nextProps.params.group && !Immutable.is(groups, nextProps.groups)) {
      nextProps.groups.forEach((group) => {
        const groupId = group.get('id')
        nextProps.fetchAllCISIngestPoints({brand: nextProps.params.brand, account: nextProps.params.account, group: groupId})
      })
    }

    if (JSON.stringify(nextFetchOpts) !== JSON.stringify(fetchOpts)) {
      nextProps.fetchStorageMetrics({include_history: true, list_children: false, ...nextFetchOpts})
    }
  }

  formatTotals(value) {
    if (this.props.filters.get('storageType') === 'bytes') {
      return formatBytes(value)
    } else if (this.props.filters.get('storageType') === 'files_count') {
      return numeral(value).format('0,0 a')
    }
  }

  render() {
    const { contentProviderAccount, filters, peakStorage, avgStorage, lowStorage, dataForChart, params} = this.props
    const storageType = filters.get('storageType')

    if (!contentProviderAccount) {
      return (
        <div className="text-center">
          <FormattedMessage id="portal.analytics.selectContentProviderAccount.text" />
        </div>
      )
    }

    return (
      <div>
        <AnalysisStorage
          avgStorage={this.formatTotals(avgStorage)}
          fetching={false}
          params={params}
          lowStorage={this.formatTotals(lowStorage)}
          peakStorage={this.formatTotals(peakStorage)}
          storageType={storageType}
          chartData={dataForChart}
          dateRangeLabel={filters.get('dateRangeLabel')}
          valueFormatter={this.formatTotals}
          includeComparison={filters.get('includeComparison')}
        />
      </div>
    )
  }
}

AnalyticsTabStorage.displayName = "AnalyticsTabStorage"
AnalyticsTabStorage.propTypes = {
  avgStorage: React.PropTypes.number,
  contentProviderAccount: React.PropTypes.bool,
  dataForChart: React.PropTypes.instanceOf(Immutable.List),
  fetchAllCISIngestPoints: React.PropTypes.func,
  fetchAllGroups: React.PropTypes.func,
  fetchOneCISIngestPoint: React.PropTypes.func,
  fetchStorageMetrics: React.PropTypes.func,
  filters: React.PropTypes.instanceOf(Immutable.Map),
  groups: React.PropTypes.instanceOf(Immutable.List),
  location: React.PropTypes.object,
  lowStorage: React.PropTypes.number,
  params: React.PropTypes.object,
  peakStorage: React.PropTypes.number
}

AnalyticsTabStorage.defaultProps = {
  filters: Immutable.Map(),
  groupHasStorageService: false
}

/* istanbul ignore next */
const mapStateToProps = (state, { params: { account, group, storage } }) => {
  const storageType = state.filters.getIn(['filters', 'storageType'])
  const activeAccount = state.account.get('activeAccount')

  let getStorageByParent

  if (storage) {
    getStorageByParent = getByStorageId(state, storage)
  } else if (group) {
    getStorageByParent = getByGroupId(state, group)
  } else {
    getStorageByParent = getByAccountId(state, account)
  }

  return {
    peakStorage: getStorageByParent && getStorageByParent.getIn(['totals', storageType, 'peak']),
    avgStorage: getStorageByParent && getStorageByParent.getIn(['totals', storageType, 'average']),
    lowStorage: getStorageByParent && getStorageByParent.getIn(['totals', storageType, 'low']),
    dataForChart: getDataForStorageAnalysisChart(state, { account, group, storage }, storageType),
    groups: getGroupsByAccount(state, account),
    contentProviderAccount: accountIsContentProviderType(activeAccount)
  }
}

const  mapDispatchToProps = (dispatch) => {
  return {
    fetchStorageMetrics: (params) => dispatch(fetchMetrics(params)),
    fetchAllGroups: requestParams => dispatch(groupActions.fetchAll(requestParams)),
    fetchAllCISIngestPoints: requestParams => dispatch(storageActions.fetchAll(requestParams)),
    fetchOneCISIngestPoint: requestParams => dispatch(storageActions.fetchOne(requestParams))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticsTabStorage);
