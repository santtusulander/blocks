import React, { Component } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import numeral from 'numeral'

import AnalysisStorage from '../../../components/analysis/storage'

import { fetchMetrics } from '../../../redux/modules/entities/storage-metrics/actions'
import { getByAccountId, getByGroupId, getByStorageId } from '../../../redux/modules/entities/storage-metrics/selectors'

import { formatBytes, buildAnalyticsOpts, hasService } from '../../../util/helpers'
import { STORAGE_SERVICE_ID } from '../../../constants/service-permissions'

class AnalyticsTabStorage extends Component {
  componentWillMount() {
    const { params, filters, location } = this.props
    const fetchOpts = buildAnalyticsOpts(params, filters, location)

    this.props.fetchStorageMetrics({start: fetchOpts.startDate, end: fetchOpts.endDate, ...fetchOpts})
  }

  componentWillReceiveProps(nextProps) {
    const { params, filters, location } = this.props

    const fetchOpts = buildAnalyticsOpts(params, filters, location)
    const nextFetchOpts = buildAnalyticsOpts(nextProps.params, nextProps.filters, nextProps.location)

    if(JSON.stringify(nextFetchOpts) !== JSON.stringify(fetchOpts)) {
      nextProps.fetchStorageMetrics({start: fetchOpts.startDate, end: fetchOpts.endDate, ...fetchOpts})
    }
  }

  formatTotals(value) {
    if(this.props.filters.get('storageType') === 'bytes') {
      return formatBytes(value)
    } else if(this.props.filters.get('storageType') === 'file_count') {
      return numeral(value).format('0,0 a')
    }
  }

  render() {
    const {filters, getTotals, groupHasStorageService} = this.props

    const storageType = filters.get('storageType')
    const peakStorage = getTotals(storageType).peak
    const avgStorage  = getTotals(storageType).average
    const lowStorage  = getTotals(storageType).low

    return (
      <div>
        {groupHasStorageService &&
          <AnalysisStorage
            avgStorage={this.formatTotals(avgStorage)}
            fetching={false}
            lowStorage={this.formatTotals(lowStorage)}
            peakStorage={this.formatTotals(peakStorage)}
            storageType={this.props.filters.get('storageType')}
          />
        }
      </div>
    )
  }
}

AnalyticsTabStorage.displayName = "AnalyticsTabStorage"
AnalyticsTabStorage.propTypes = {
  fetchStorageMetrics: React.PropTypes.func,
  filters: React.PropTypes.instanceOf(Immutable.Map),
  getTotals: React.PropTypes.func,
  groupHasStorageService: React.PropTypes.bool,
  location: React.PropTypes.object,
  params: React.PropTypes.object
}

AnalyticsTabStorage.defaultProps = {
  filters: Immutable.Map(),
  groupHasStorageService: false
}

const mapStateToProps = (state, { params: { account, group, ingest_point } }) => {
  const storageByParent = ingest_point
    ? getByStorageId((state, ingest_point))
    : group
      ? getByGroupId(state, group)
      : getByAccountId(state, account)

  const getTotals =  (storageType) => storageByParent.reduce(
    (totals, storage) => {
      return {
        peak: totals.peak + storage.getIn(['totals', storageType, 'peak']),
        low: totals.low + storage.getIn(['totals', storageType, 'low']),
        average: totals.average + storage.getIn(['totals', storageType, 'low'])
      }
    },
    {
      peak: 0,
      low: 0,
      average: 0
    }
  )

  const activeGroup = state.group.get('activeGroup')
  const groupHasStorageService = hasService(activeGroup, STORAGE_SERVICE_ID)
  return {
    getTotals: getTotals,
    groupHasStorageService
  }
}

const  mapDispatchToProps = (dispatch) => {
  return {
    fetchStorageMetrics: (params) => dispatch(fetchMetrics(params))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticsTabStorage);
