import React, { Component } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import numeral from 'numeral'

import AnalysisStorage from '../../../components/analysis/storage'

import { fetchMetrics } from '../../../redux/modules/entities/storage-metrics/actions'
import { getByAccountId, getByGroupId, getByStorageId, getDataForChart } from '../../../redux/modules/entities/storage-metrics/selectors'

import storageActions from '../../../redux/modules/entities/CIS-ingest-points/actions'
import groupActions from '../../../redux/modules/entities/groups/actions'

import { formatBytes, buildAnalyticsOpts } from '../../../util/helpers'

class AnalyticsTabStorage extends Component {
  constructor(props) {
    super(props)

    this.formatTotals = this.formatTotals.bind(this)
  }

  componentWillMount() {
    const { params, filters, location } = this.props
    const fetchOpts = buildAnalyticsOpts(params, filters, location)

    this.props.fetchGroups(params).then((response) => {
      if (response) {
        const groupIds = Object.keys(response.entities.groups) || []

        return Promise.all([
          ...groupIds.map(id => this.props.fetchCISIngestPoints({ ...params, group: id })),
          this.props.fetchStorageMetrics({start: fetchOpts.startDate, end: fetchOpts.endDate, ...fetchOpts})
        ])
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    const { params, filters, location } = this.props

    const fetchOpts = buildAnalyticsOpts(params, filters, location)
    const nextFetchOpts = buildAnalyticsOpts(nextProps.params, nextProps.filters, nextProps.location)

    if(JSON.stringify(nextFetchOpts) !== JSON.stringify(fetchOpts)) {
      nextProps.fetchStorageMetrics({start: nextFetchOpts.startDate, end: nextFetchOpts.endDate, ...nextFetchOpts})
    }
  }

  formatTotals(value) {
    if(this.props.filters.get('storageType') === 'bytes') {
      return formatBytes(value)
    } else if(this.props.filters.get('storageType') === 'files_count') {
      return numeral(value).format('0,0 a')
    }
  }

  render() {
    const {filters, peakStorage, avgStorage, lowStorage, dataForChart, params} = this.props
    const storageType = filters.get('storageType')

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
  dataForChart: React.PropTypes.instanceOf(Immutable.List),
  fetchCISIngestPoints: React.PropTypes.func,
  fetchGroups: React.PropTypes.func,
  fetchStorageMetrics: React.PropTypes.func,
  filters: React.PropTypes.instanceOf(Immutable.Map),
  location: React.PropTypes.object,
  lowStorage: React.PropTypes.number,
  params: React.PropTypes.object,
  peakStorage: React.PropTypes.number
}

AnalyticsTabStorage.defaultProps = {
  filters: Immutable.Map(),
  groupHasStorageService: false
}

const mapStateToProps = (state, { params: { account, group, storage } }) => {
  const activeGroup = state.group.get('activeGroup')
  const groupHasStorageService = hasService(activeGroup, STORAGE_SERVICE_ID)
  const comparison = state.filters.getIn(['filters', 'includeComparison'])
  const storageType = state.filters.getIn(['filters', 'storageType'])
  let getStorageByParent

  if(storage) {
    getStorageByParent = getByStorageId(state, storage, comparison)
  } else if(group) {
    getStorageByParent = getByGroupId(state, group, comparison)
  } else {
    getStorageByParent = getByAccountId(state, account, comparison)
  }

  return {
    peakStorage: getStorageByParent && getStorageByParent.getIn(['totals', storageType, 'peak']),
    avgStorage: getStorageByParent && getStorageByParent.getIn(['totals', storageType, 'low']),
    lowStorage: getStorageByParent && getStorageByParent.getIn(['totals', storageType, 'average']),
    dataForChart: getDataForChart(state, { account, group, storage }, storageType, comparison),
    groupHasStorageService
  }
}

const  mapDispatchToProps = (dispatch) => {
  return {
    fetchStorageMetrics: (params) => dispatch(fetchMetrics(params)),
    fetchGroups: requestParams => dispatch(groupActions.fetchAll(requestParams)),
    fetchCISIngestPoints: requestParams => dispatch(storageActions.fetchAll(requestParams))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticsTabStorage);
