import React, { PropTypes, Component } from 'react'
import { Map } from 'immutable'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'

import SectionContainer from '../shared/layout/section-container'
import MiniChart from '../charts/mini-chart'
import ComparisonBars from './comparison-bars'
import TruncatedTitle from '../shared/page-elements/truncated-title'

import clusterActions from '../../redux/modules/entities/CIS-clusters/actions'
import { getById as getClusterById } from '../../redux/modules/entities/CIS-clusters/selectors'

import workflowActions from '../../redux/modules/entities/CIS-workflow-profiles/actions'
import { getById as getWorkflowProfileById } from '../../redux/modules/entities/CIS-workflow-profiles/selectors'

import { fetchMetrics } from '../../redux/modules/entities/storage-metrics/actions'
import { getByStorageId as getMetricsByStorageId } from '../../redux/modules/entities/storage-metrics/selectors'

import { formatBytesToUnit, formatBytes, separateUnit } from '../../util/helpers'
import { endOfThisDay, startOfThisMonth } from '../../constants/date-ranges'

const FORMAT = '0,0.0'

/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
const KPIFormattedMessage = ({id, type}) => (
  <FormattedMessage id={id}>
    {(formattedTitle) => (
      <span className={`storage-kpi-item-${type}`}>{formattedTitle}</span>
    )}
  </FormattedMessage>
)

KPIFormattedMessage.propTypes = {
  id: PropTypes.string,
  type: PropTypes.oneOf(['title', 'note'])
}

class StorageKPI extends Component {

  componentWillMount() {
    this.props.fetchData(this.props.params)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.storage !== this.props.params.storage) {
      this.props.fetchData(nextProps.params)
    }
  }

  render() {
    const {
      chartData = [],
      chartDataKey,
      currentValue = 0,
      gainPercentage = 0,
      workflowProfile = Map(),
      locations = [],
      peakValue = 0,
      referenceValue,
      valuesUnit = '' } = this.props

    return (
      <SectionContainer>
        <div className='storage-kpi-item'>
          <KPIFormattedMessage id='portal.storage.kpi.current.title' type='title' />
          <div className='storage-kpi-item-content'>
            <div className='storage-kpi-number'>
              <TruncatedTitle className='value' content={currentValue.toString()} />
              <span className='suffix'>
                {`/ ${referenceValue} ${valuesUnit.toUpperCase()}`}
              </span>
            </div>
            <div className='storage-kpi-comparison-bars'>
              <ComparisonBars
                referenceValue={referenceValue}
                currentValue={currentValue} />
            </div>
          </div>
        </div>
        <div className='storage-kpi-item'>
          <KPIFormattedMessage id='portal.storage.kpi.peak.title' type='title' />
          <div className='storage-kpi-item-content'>
            <div className='storage-kpi-number'>
              <TruncatedTitle className='value' content={peakValue.toString()} />
              <span className='suffix'>{valuesUnit.toUpperCase()}</span>
            </div>
          </div>
          <KPIFormattedMessage id='portal.storage.kpi.note.thisMonth' type='note' />
        </div>
        <div className='storage-kpi-item'>
          <KPIFormattedMessage id='portal.storage.kpi.gain.title' type='title' />
          <div className='storage-kpi-item-content'>
            <div className='storage-kpi-number'>
              <span className='value'>
                {`${(gainPercentage > 0) ? '+' : ''}${gainPercentage.toFixed(1)}%`}
              </span>
            </div>
            <div className='storage-kpi-chart'>
              <MiniChart
                dataKey={chartDataKey}
                data={chartData}
                />
            </div>
          </div>
          <KPIFormattedMessage id='portal.storage.kpi.note.thisMonth' type='note' />
        </div>
        <div className='storage-kpi-item'>
          <KPIFormattedMessage id='portal.storage.kpi.location.title' type='title' />
          <div className='storage-kpi-item-content'>
            <div className='storage-kpi-text'>{locations.join(', ')}</div>
          </div>
        </div>
        <div className='storage-kpi-item'>
          <KPIFormattedMessage id='portal.storage.kpi.workflowProfile.title' type='title' />
          <div className='storage-kpi-item-content'>
            <div className='storage-kpi-text'>
              {workflowProfile.get('label') || <FormattedMessage id="portal.storage.kpi.workflowProfile.value.fallback" />}
            </div>
          </div>
        </div>
      </SectionContainer>
    )
  }
}

StorageKPI.displayName = "StorageKPI"
StorageKPI.propTypes = {
  chartData: PropTypes.array,
  chartDataKey: PropTypes.string,
  currentValue: PropTypes.number,
  fetchData: PropTypes.func,
  gainPercentage: PropTypes.number,
  locations: PropTypes.array,
  params: PropTypes.object,
  peakValue: PropTypes.number,
  referenceValue: PropTypes.number,
  valuesUnit: PropTypes.string,
  workflowProfile: PropTypes.instanceOf(Map)
}

const prepareStorageMetrics = (state, storage, storageMetrics, storageType) => {
  if (!storage) {
    return {}
  }

  const { value: estimated, unit } = separateUnit(formatBytes(storage.get('estimated_usage')))
  const ending = storageMetrics ? storageMetrics.getIn(['totals', storageType, 'ending']) : 0
  const currentValue = formatBytesToUnit(ending, unit, FORMAT)
  const peakValue = storageMetrics ? formatBytesToUnit(storageMetrics.getIn(['totals', storageType, 'peak']), unit, FORMAT) : 0
  const gainPercentage = storageMetrics ? storageMetrics.getIn(['totals', storageType, 'percent_change']) : 0

  const locations = storage.get('clusters').map((cluster) => {
    const clusterData = getClusterById(state, cluster)

    return clusterData ? clusterData.get('description').split(',')[0] : ''
  }).toJS()

  const lineChartData = storageMetrics ? storageMetrics.get('detail').toJS().map(data => ({bytes: 0, ...data})) : []

  return {
    chartData: lineChartData,
    chartDataKey: 'bytes',
    currentValue,
    referenceValue: parseFloat(estimated),
    peakValue,
    valuesUnit: unit,
    gainPercentage,
    locations
  }
}

/* istanbul ignore next */
const mapStateToProps = (state, ownProps) => {
  let workflowProfile = undefined

  const storageMetrics = getMetricsByStorageId(state, ownProps.params.storage)

  if (ownProps.storage) {
    workflowProfile = getWorkflowProfileById(state, ownProps.storage.get('workflow'))
  }

  const filters = state.filters.get('filters')

  return {
    workflowProfile,
    ...prepareStorageMetrics(state, ownProps.storage, storageMetrics, filters.get('storageType'))
  }
}

/* istanbul ignore next */
const mapDispatchToProps = (dispatch) => {

  const fetchData = (params) => {
    const { brand, account, group, storage } = params

    const metricsOpts = {
      brand: brand,
      account: account,
      group: group,
      ingest_point: storage,
      list_children: false,
      startDate: startOfThisMonth().format('X'),
      endDate: endOfThisDay().format('X')
    }

    return Promise.all([
      dispatch(fetchMetrics({ include_history: true, ...metricsOpts })),
      dispatch(clusterActions.fetchAll(params)),
      dispatch(workflowActions.fetchAll({}))
    ])
  }

  return { fetchData }
}

export default connect(mapStateToProps, mapDispatchToProps)(StorageKPI)
